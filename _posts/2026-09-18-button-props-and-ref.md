---
layout: default
title: "button 속성을 그대로 받으려면 — HTMLAttributes와 ComponentProps 구분하기"
date: 2026-09-18 12:00:00 +0900
---

## 왜 이 글을 쓰게 되었나

공통 `Button` 컴포넌트의 Props 타입을 정하는 문제를 풀었다. 기본 `<button>`이 받는 `type`, `disabled`, `aria-label` 같은 속성을 컴포넌트에서도 그대로 받고 싶다는 상황이었다.

처음에는 `HTMLAttributes<HTMLButtonElement>`면 충분하다고 생각했다. 제네릭에 `HTMLButtonElement`를 넣었으니 그 요소의 속성을 가져올 것 같았다.

## 무엇을 보고 있었나

**Button.tsx**
{: .filename}

```ts
interface ButtonProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary';
}
```

```tsx
<Button variant="primary" type="submit">
  저장
</Button>
```

## 처음 든 생각

> `HTMLAttributes`에 `HTMLButtonElement`를 T로 받으니 HTMLButtonElement의 속성을 가져다가 쓸 수 있을 것 같다.

여기서 `props`와 타입의 차이도 헷갈렸다. `props`는 컴포넌트가 실제로 전달받는 객체이고, `ButtonProps`는 그 객체가 따라야 하는 TypeScript 타입이다.

## 왜 그렇게 동작했나

`HTMLAttributes<T>`의 `T`를 넣는다고 해서 해당 HTML 요소의 전용 속성 전체가 추가되는 것은 아니다. 버튼 전용 속성까지 가져오려면 React가 별도로 제공하는 타입을 사용해야 한다.

```ts
React.ButtonHTMLAttributes<HTMLButtonElement>
```

또는 HTML 요소의 Props를 추출하는 유틸리티를 사용할 수 있다.

```ts
type ButtonProps =
  React.ComponentPropsWithoutRef<'button'> & {
    variant: 'primary' | 'secondary';
  };
```

여기서 `'button'`은 직접 만든 `Button` 컴포넌트가 아니라 React가 알고 있는 기본 JSX 요소인 `<button>`을 의미한다. 그래서 `type`, `disabled`, `onClick`, `name`, `value`, `aria-label` 같은 기본 속성을 함께 가져온다.

## 내가 선택한 방식과 이유

이 컴포넌트가 `forwardRef`를 사용하지 않는다면 `ComponentPropsWithoutRef<'button'>`를 선택한다.

```tsx
function Button({ variant, ...props }: ButtonProps) {
  return <button data-variant={variant} {...props} />;
}
```

처음에는 `ref`도 굳이 제외할 필요가 없다고 생각했다. 하지만 `ref`를 타입으로 받는 것과 실제 DOM 버튼에 연결하는 것은 다른 문제였다.

`forwardRef` 없이 `ref`를 허용하면 호출하는 쪽에서는 연결될 것처럼 보이지만, 컴포넌트가 그 ref를 `<button>`에 전달한다는 보장이 없다. 타입이 실제 동작보다 많은 것을 약속하게 된다.

반대로 `forwardRef`로 ref를 실제 버튼에 연결한다면 ref를 포함하는 타입을 선택해야 한다.

```tsx
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => <button {...props} ref={ref} />,
);
```

## 확인해본 것

이번 문답에서는 타입을 직접 컴파일하지 않았다. 따라서 프로젝트의 React 타입 버전이나 `tsconfig`에 따른 세부 차이까지 실행으로 확인한 것은 아니다. 다만 판단 기준은 `ref`를 실제 DOM 요소에 전달하는지 여부로 정리했다.

## 배운 점

- `props`는 실제 전달값이고, `ButtonProps`는 그 값의 타입이다.
- `HTMLAttributes<HTMLButtonElement>`의 제네릭 인자가 버튼 전용 Props 전체를 자동으로 추가하지는 않는다.
- `ComponentPropsWithoutRef<'button'>`는 기본 `<button>`의 Props를 추출하는 방법이다.
- `ref` 타입을 허용할 때는 컴포넌트가 실제로 ref를 전달하는지도 함께 봐야 한다.

## AI를 어떻게 썼나

- **직접 정한 것**: 처음 타입 선택과 `props` 개념에 대한 질문
- **AI에 맡긴 것**: `HTMLAttributes`, `ComponentPropsWithoutRef`, `forwardRef`의 역할을 단계적으로 비교하는 질문
- **AI와 정한 것**: 타입이 약속하는 동작과 컴포넌트가 실제로 수행하는 동작을 맞춰야 한다는 기준

---

참고: [HTML 요소의 Props 추출 (React TypeScript Cheatsheet)](https://react-typescript-cheatsheet.netlify.app/docs/react-types/componentprops/) · [forwardRef (React)](https://react.dev/reference/react/forwardRef)
