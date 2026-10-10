---
layout: default
title: "cancelQueries는 캐시를 지우는 함수가 아니었다"
date: 2026-09-21 16:00:00 +0900
---

## 무엇을 몰랐나

낙관적 업데이트에서 캐시를 먼저 고치는 곳이 `onSuccess`라고 생각했다. 또 `cancelQueries`를 캐시를 지우는 함수로 알고 있었다. 실제로는 진행 중인 요청을 멈추는 함수다.

## 개념 정리

낙관적 업데이트는 단계마다 역할이 정해져 있다.

| 단계 | 하는 일 |
|---|---|
| `onMutate` | 요청을 보내기 **전**에 실행된다 |
| ↳ `cancelQueries` | 진행 중인 refetch를 취소한다 |
| ↳ snapshot 저장 | 롤백할 때 쓸 이전 캐시를 보관한다 |
| ↳ `setQueryData` | 캐시를 먼저 고쳐 화면에 바로 반영한다 |
| `onError` | 실패하면 snapshot으로 되돌린다 |
| `onSettled` | 성공·실패와 관계없이 서버와 다시 맞춘다 (`invalidateQueries`) |

`cancelQueries`가 필요한 이유는 경쟁 상태 때문이다. 캐시를 먼저 고쳐 놨는데 그 전에 출발한 refetch가 늦게 도착하면, 옛 데이터가 고친 캐시를 덮어쓴다.

```ts
onMutate: async (next) => {
  await queryClient.cancelQueries({ queryKey: ['todos'] })
  const prev = queryClient.getQueryData(['todos'])
  queryClient.setQueryData(['todos'], (old) => [...old, next])
  return { prev }
},
onError: (_err, _next, context) => {
  queryClient.setQueryData(['todos'], context?.prev)
},
onSettled: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
```

## 다시 볼 기준

- 캐시를 고치는 시점이 응답 전(`onMutate`)인가, 응답 후(`onSuccess`)인가?
- 먼저 고친 캐시를 늦게 도착한 요청이 덮어쓸 수 있는가?

---

참고: [TanStack Query Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
