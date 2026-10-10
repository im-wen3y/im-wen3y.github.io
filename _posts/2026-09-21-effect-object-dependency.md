---
layout: default
title: "내용이 같은데 Effect가 다시 도는 이유"
date: 2026-09-21 14:00:00 +0900
---

## 무엇을 몰랐나

Effect 의존성에 객체를 넣으면 React가 객체의 내용을 비교한다고 생각했다. 실제로는 참조를 비교한다는 점, 그래서 원시 필드로 풀어 넣어야 한다는 점을 몰랐다.

## 개념 정리

React는 의존성을 `Object.is`로 비교한다. 객체는 내용이 같아도 렌더링마다 새로 만들어지면 다른 값이 된다.

```tsx
function ProductList({ category, page }: Props) {
  const filter = { category, page } // 렌더링마다 새 객체

  useEffect(() => {
    fetchProducts(filter).then(setItems)
  }, [filter]) // 매 렌더링마다 다시 실행된다
}
```

요청을 실제로 결정하는 값이 `category`와 `page`라면, 그 원시 값을 의존성에 둔다. 객체는 Effect 안에서 만든다.

```tsx
useEffect(() => {
  fetchProducts({ category, page }).then(setItems)
}, [category, page])
```

- 원인은 **JavaScript**의 참조 비교다. React는 그 비교 방식을 그대로 쓴다.
- `useMemo`로 객체 참조를 고정할 수도 있다. 하지만 원시 값을 의존성에 두면 메모이제이션이 필요 없다.

## 다시 볼 기준

- 이 Effect를 다시 실행해야 하는 진짜 이유가 되는 값은 무엇인가?
- 의존성 배열에 렌더링 중 새로 만든 객체나 함수가 들어 있는가?

---

참고: [Effect에서 의존성 제거하기](https://ko.react.dev/learn/removing-effect-dependencies)
