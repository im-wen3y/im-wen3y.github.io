---
layout: default
title: "ESLint 규칙을 추가했는데 CI가 막아줄까 — 설정과 실행을 나눠 보기"
date: 2026-09-15 12:00:00 +0900
---

## 왜 이 글을 쓰게 되었나

루퍼스 과정 종합 시험에서 Claude Code가 `any`를 반복해서 작성하지 않게 하려면 어떤 파일에 규칙을 남겨야 하는지 묻는 문제가 나왔다.

처음에는 `CLAUDE.md` 또는 `eslint.config.mjs`라고 답했다. AI에게 규칙을 알려주는 것과 실제 코드에서 규칙을 강제하는 것을 같은 문제로 보고 있었다.

## 무엇을 보고 있었나

요구사항을 둘로 나눠 다시 살펴봤다.

- Claude Code가 `any`를 작성하지 않도록 안내한다.
- 사람이 직접 작성한 코드라도 `any`가 포함되면 CI에서 실패해야 한다.

**CLAUDE.md**
{: .filename}

```md
# 프로젝트 규칙

- TypeScript에서 `any`를 사용하지 않는다.
```

이 파일은 Claude Code가 저장소에서 따라야 할 규칙을 전달한다. 하지만 여기에 적었다고 해서 사람이 작성한 코드까지 자동으로 검사하지는 않는다.

## 처음 든 생각

CI에서 `pnpm build`를 실행하고 ESLint 규칙을 `error`로 설정했다면, `any`가 있을 때 빌드도 실패할 것 같았다.

> 항상 build 명령어를 하면 `pnpm lint && next build`처럼 적혀 있어서 build만 하면 된다고 생각했나 봐.

내가 익숙했던 프로젝트의 `build` 스크립트와 `build`라는 명령 자체의 역할을 구분하지 않은 것이었다.

## 왜 그렇게 동작했나

`eslint.config.mjs`는 무엇을 위반으로 판단할지 정한다.

**eslint.config.mjs**
{: .filename}

```js
export default [
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
];
```

이 설정의 뜻은 "ESLint가 실행되어 명시적인 `any`를 발견하면 오류로 처리한다"이다. 설정 파일을 작성하는 것만으로 ESLint가 실행되는 것은 아니다.

각 파일과 명령의 역할은 다음처럼 달랐다.

| 위치 | 역할 |
|---|---|
| `CLAUDE.md` | AI에게 저장소 규칙을 안내한다 |
| `eslint.config.mjs` | 무엇을 규칙 위반으로 볼지 정의한다 |
| 에디터 설정 | 저장할 때 Prettier나 ESLint를 실행한다 |
| `package.json` | `lint`, `build` 명령이 실제로 무엇을 실행할지 정한다 |
| GitHub Actions | CI에서 어떤 명령을 실행할지 정한다 |

Prettier가 저장할 때마다 실행되는 것도 Prettier 설정 파일이 스스로 동작해서가 아니었다. VS Code의 `formatOnSave` 같은 에디터 설정이 저장 시점에 Prettier를 호출한 결과였다.

## 내가 선택한 방식과 이유

AI의 작성 방향을 안내하는 규칙과 CI에서 강제할 규칙을 따로 두기로 했다.

**package.json**
{: .filename}

```json
{
  "scripts": {
    "lint": "eslint .",
    "build": "pnpm lint && next build"
  }
}
```

이 경우 GitHub Actions에서 `pnpm build`를 실행하면 먼저 `pnpm lint`가 실행된다. `any`가 ESLint 오류로 검출되면 lint가 실패하고, `&&` 뒤의 `next build`는 실행되지 않는다.

중요한 것은 명령 이름만 보고 판단하지 않는 것이다. 다른 저장소의 `build`가 `next build`만 실행한다면 ESLint 검사는 일어나지 않을 수 있다. 리뷰할 때는 `package.json`의 실제 스크립트와 GitHub Actions에서 호출하는 명령을 함께 봐야 한다.

## 확인해본 것

규칙의 심각도를 `warn`으로 바꾸면 일반적으로 경고를 출력한 뒤 다음 명령까지 진행한다.

```js
'@typescript-eslint/no-explicit-any': 'warn'
```

하지만 lint 명령에 `--max-warnings=0`을 붙이면 경고 하나도 허용하지 않으므로 lint가 실패한다.

```json
{
  "scripts": {
    "lint": "eslint . --max-warnings=0"
  }
}
```

이 내용은 대화에서 실행 순서를 예측하며 확인했고, 별도의 예제 프로젝트에서 실제 명령을 실행하지는 않았다.

## 배운 점

- 규칙을 정의하는 것과 그 규칙을 실행하는 것은 별개다.
- `build`라는 이름만으로 lint 포함 여부를 판단할 수 없다. `package.json`의 스크립트를 확인해야 한다.
- 내 에디터에서 자동으로 포맷되거나 검사된다는 사실은 CI에서도 같은 검사가 실행된다는 근거가 아니다.
- AI 안내에는 `CLAUDE.md`, 코드 검출에는 ESLint, 병합 차단에는 CI처럼 각 단계의 역할이 다르다.

## AI를 어떻게 썼나

- **직접 정한 것**: `any`를 강제하려면 ESLint 규칙이 필요하다는 판단, `build` 스크립트의 실행 순서 예측
- **AI에 맡긴 것**: 시험 오답을 작은 PR 상황으로 바꾸고 질문을 한 단계씩 제시하는 진행
- **AI와 정한 것**: 설정 파일, 에디터, 패키지 스크립트, CI의 역할 구분

---

참고: [no-explicit-any (typescript-eslint)](https://typescript-eslint.io/rules/no-explicit-any/) · [ESLint 규칙 설정](https://eslint.org/docs/latest/use/configure/rules)
