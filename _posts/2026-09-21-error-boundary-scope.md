---
layout: default
title: "axios 에러는 왜 Error Boundary에 안 잡힐까"
date: 2026-09-21 17:00:00 +0900
---

## 무엇을 몰랐나

두 가지를 몰랐다.

- Error Boundary가 fallback으로 바꾸는 일을 맡는 메서드가 `getDerivedStateFromError`라는 것
- 네트워크 에러처럼 비동기로 생긴 에러는 Error Boundary가 자동으로 잡지 않는다는 것

## 개념 정리

### 두 메서드의 역할

| 메서드 | 역할 |
|---|---|
| `static getDerivedStateFromError(error)` | 렌더링 에러를 받아 fallback을 보여줄 state를 반환한다 |
| `componentDidCatch(error, info)` | 로깅 같은 부수효과를 처리한다 |

### 잡는 에러, 못 잡는 에러

| 잡는다 | 잡지 않는다 |
|---|---|
| 렌더링 중 에러 (예: `undefined.map()`의 `TypeError`) | 이벤트 핸들러 안의 에러 |
| 생명주기 메서드 안의 에러 | `setTimeout`, Promise 같은 비동기 에러 |
| | Error Boundary 자기 자신의 에러 |

TanStack Query의 요청 에러는 원래 `error` 값으로만 돌아온다. `throwOnError`를 켜거나 `useSuspenseQuery`를 써야 렌더링 중에 에러가 던져지고, 그때 Error Boundary가 받을 수 있다.

## 다시 볼 기준

- 이 에러는 **렌더링 중**에 던져지는가, 렌더링 밖에서 생기는가?
- 비동기 에러를 Error Boundary로 보내는 설정이 있는가?

---

참고: [Error Boundary로 렌더링 에러 잡기](https://ko.react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary) · [TanStack Query useQuery throwOnError](https://tanstack.com/query/latest/docs/framework/react/reference/useQuery)
