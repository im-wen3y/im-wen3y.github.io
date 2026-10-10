---
layout: default
title: "Suspense는 에러를 받지 않는다 — Next.js loading.tsx와 error.tsx"
date: 2026-09-21 18:00:00 +0900
---

## 무엇을 몰랐나

`useSuspenseQuery`가 던진 에러를 `Suspense`가 받는다고 생각했다. `Suspense`는 로딩만 맡고, 에러는 Error Boundary가 맡는다는 구분이 없었다.

## 개념 정리

`useSuspenseQuery`는 두 가지를 던진다.

| 던지는 것 | 받는 곳 | Next.js 파일 |
|---|---|---|
| 아직 끝나지 않은 Promise | `Suspense` | `loading.tsx` |
| 에러 | Error Boundary | `error.tsx` |

- `loading.tsx`는 Next.js가 그 구간을 `<Suspense>`로 감싸 주는 파일이다.
- `error.tsx`는 그 구간을 Error Boundary로 감싸 주는 파일이다. 에러를 받으려면 Client Component여야 한다(`'use client'`).

## 다시 볼 기준

- 지금 처리하려는 것이 **기다림**인가, **실패**인가?
- 그 경계가 어느 범위까지 화면을 대체하는가?

---

참고: [Next.js — loading.js](https://nextjs.org/docs/app/api-reference/file-conventions/loading) · [Next.js — error.js](https://nextjs.org/docs/app/api-reference/file-conventions/error)
