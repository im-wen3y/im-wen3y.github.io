---
layout: default
title: "CI에서 lockfile을 그대로 쓰게 하기 — pnpm --frozen-lockfile"
date: 2026-09-21 22:00:00 +0900
---

## 무엇을 몰랐나

CI에서 lockfile을 고정해 설치하는 pnpm 옵션 이름이 `--frozen-lockfile`이라는 걸 몰랐다.

## 개념 정리

```sh
pnpm install --frozen-lockfile
```

- lockfile을 새로 만들거나 고치지 않는다.
- `package.json`과 lockfile이 맞지 않으면 설치를 **실패**시킨다.
- 그래서 CI에는 개발자가 확인한 의존성 트리가 그대로 설치된다.
- pnpm은 CI 환경을 감지하면 이 옵션을 기본으로 켠다. 명시해 두면 의도가 드러난다.

## 다시 볼 기준

- CI가 설치하는 의존성이 로컬에서 확인한 것과 같다고 보장되는가?
- lockfile이 바뀌어야 하는 변경을 CI가 조용히 통과시키지 않는가?

---

참고: [pnpm install — --frozen-lockfile](https://pnpm.io/cli/install#--frozen-lockfile)
