---
layout: default
title: "isLoading 하나로는 로딩 상태를 다 나눌 수 없다"
date: 2026-09-21 20:00:00 +0900
---

## 무엇을 몰랐나

로딩 상태를 `isLoading` 하나로 판단했다. 보여줄 데이터가 아예 없는 상태와, 기존 데이터를 보여주면서 다시 요청하는 상태를 나누지 못했다.

## 개념 정리

| 상황 | 플래그 | 보여줄 UI 예시 |
|---|---|---|
| 아직 보여줄 데이터가 없다 | `isPending` | 스켈레톤 |
| 데이터를 보여주면서 다시 요청 중이다 | `isFetching` | 목록 유지 + 작은 로딩 표시 |
| 이전 조건의 데이터를 임시로 보여주는 중이다 | `isPlaceholderData` | 흐리게 표시, 다음 페이지 버튼 비활성화 |
| 요청이 실패했다 | `isError` | 에러 메시지 |

- `isPending`은 "캐시에 데이터가 없다"는 **상태(status)** 이야기다.
- `isFetching`은 "지금 요청이 날아가고 있다"는 **진행(fetchStatus)** 이야기다.
- `isLoading`은 `isPending && isFetching`이다. 처음 요청 중일 때만 참이 된다.

## 다시 볼 기준

- 지금 화면에 이미 보여줄 데이터가 있는가?
- 그 데이터는 현재 조건의 것인가, 이전 조건의 것인가?

---

참고: [TanStack Query Queries](https://tanstack.com/query/latest/docs/framework/react/guides/queries) · [TanStack Query Placeholder Query Data](https://tanstack.com/query/latest/docs/framework/react/guides/placeholder-query-data)
