---
layout: default
title: "null도 막아주는데 왜 never일까 — 사용할 수 없는 Props 표현하기"
date: 2026-09-15 12:10:00 +0900
---

## 왜 이 글을 쓰게 되었나

공통 `Button`의 `variant`에 따라 사용할 수 있는 Props 조합을 제한하는 문제를 풀었다. `text` 버튼에 아이콘을 전달하면 컴파일 오류가 나도록 빈칸을 채우는 문제였다.

나는 `null`을 골랐고, 정답은 `never`였다. 둘 다 `<X />`를 막을 수 있는데 왜 `never`여야 하는지가 처음에는 보이지 않았다.

## 무엇을 보고 있었나

요구사항은 버튼의 종류마다 허용되는 Props가 달라야 한다는 것이었다.

**Button.tsx**
{: .filename}

```ts
type ButtonProps =
  | {
      variant: 'text';
      label: string;
      icon?: never;
    }
  | {
      variant: 'icon';
      icon: ReactNode;
      label?: never;
    };
```

```tsx
<Button variant="text" label="닫기" icon={<X />} />
```

`variant: 'text'`가 판별자 역할을 하므로 TypeScript는 첫 번째 유니온 분기로 좁힌다. 이 분기에서 `icon`은 `never`이므로 `<X />`를 전달할 수 없다.

## 처음 든 생각

처음에는 `icon?: null`도 답이 될 수 있다고 생각했다.

> `variant: 'text'` 쪽으로 타입이 추론될 텐데, `icon`이 `undefined`나 `null`만 가질 수 있어서 `ReactNode`인 `<X />`를 가질 수 없다.

주어진 `<X />` 예시가 타입 오류가 되는지만 보면 이 판단도 동작한다. `null` 타입에는 JSX 요소를 넣을 수 없기 때문이다.

## 왜 그렇게 동작했나

차이는 무엇을 허용하지 않는지가 아니라, 타입이 어떤 설계 의도를 표현하는지에 있었다.

```ts
icon?: null;
```

이 타입은 `icon`을 생략할 수 있을 뿐 아니라 `icon={null}`을 전달하는 것도 허용한다. 즉, "아이콘 값으로 `null`을 받을 수 있다"는 의미가 남는다.

```ts
icon?: never;
```

`never`는 이 분기에서 `icon`이 가질 수 있는 값이 없음을 나타낸다. 내가 이해한 말로 바꾸면 다음과 같았다.

> 해당 variant에서는 `icon`이라는 속성을 받고 싶지 않아서, 이 값은 없음을 표현하려고 `never`로 설정한 거구나.

`?`는 호출할 때 속성을 생략할 수 있게 하고, `never`는 속성에 실제 값을 전달하지 못하게 한다.

## 내가 선택한 방식과 이유

요구사항이 "`text` 버튼에서는 `icon` 속성을 전달하지 않는다"라면 `icon?: never`를 선택한다. 단순히 현재의 JSX 요소 하나를 막는 데서 끝나지 않고, 유효하지 않은 Props 조합을 타입으로 설명할 수 있기 때문이다.

반대 분기도 같은 방식이다.

```ts
type ButtonProps =
  | {
      variant: 'text';
      label: string;
      icon?: never;
    }
  | {
      variant: 'icon';
      icon: ReactNode;
      label?: never;
    };
```

```tsx
<Button variant="icon" icon={<X />} label="닫기" />
```

`variant: 'icon'`이면 두 번째 분기로 좁혀지고, 이 분기의 `label`은 `never`다. 따라서 문자열을 전달한 위 조합은 타입 오류가 된다.

## 확인해본 것

`null`과 `never`를 다음 호출로 비교했다.

```tsx
<Button variant="text" label="닫기" icon={null} />
```

- `icon?: null`은 이 호출을 허용한다.
- `icon?: never`는 `null`을 허용하지 않는다.

optional 속성에 명시적인 `undefined`를 허용할지는 `exactOptionalPropertyTypes` 설정의 영향도 받는다. 이번 문답에서는 코드를 직접 컴파일하지 않았으므로, 프로젝트의 실제 `tsconfig`에 따른 결과까지 실행 검증한 것은 아니다.

## 배운 점

- 판별 유니온의 `variant`는 현재 Props가 어느 분기에 해당하는지 좁히는 기준이 된다.
- `null`은 하나의 허용 값이고, `never`는 가능한 값이 없다는 뜻이다.
- 주어진 코드가 오류가 되는지만 볼 것이 아니라, 요구사항의 금지 조건을 타입이 정확히 표현하는지도 봐야 한다.
- `never`를 사용하면 잘못된 Props 조합을 컴포넌트 내부가 아니라 사용하는 시점에 막을 수 있다.

## AI를 어떻게 썼나

- **직접 정한 것**: `variant`가 유니온 분기를 좁히는 과정과 잘못된 Props를 찾은 판단
- **AI에 맡긴 것**: `null`과 `never`의 차이를 확인하는 조건 변경 질문
- **AI와 정한 것**: 시험의 예시를 막는 동작과 타입이 표현하는 설계 의도를 구분한 것

---

참고: [Discriminated unions와 never (TypeScript)](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) · [exactOptionalPropertyTypes (TypeScript)](https://www.typescriptlang.org/tsconfig/exactOptionalPropertyTypes.html)
