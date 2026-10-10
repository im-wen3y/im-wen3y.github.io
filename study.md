---
layout: default
title: "앞으로 공부할 목록"
permalink: /study/
---

## 왜 이 목록을 만들었나

공부할 범위를 한 곳에 모아 두려고 만들었다. 아직 공부를 끝낸 항목은 없다. 순서대로 하나씩 채워 갈 예정이다.

## 공부할 내용

- Next.js
- React
- React Router
- React Compiler
- React Hook Form
- TanStack Query
- Hono
- Jotai
- TypeScript
- JavaScript
  - 메모리
    - 스택과 힙 (원시값과 참조값이 저장되는 방식)
    - 가비지 컬렉션
    - 메모리 누수
    - 클로저와 참조
  - 이벤트 루프
    - 콜 스택
    - 태스크 큐 (매크로태스크: `setTimeout`, 이벤트 콜백)
    - 마이크로태스크 큐 (`Promise.then`, `queueMicrotask`)
    - 실행 순서 (콜 스택 → 마이크로태스크 → 렌더링 → 태스크)
    - `async`/`await`가 실행 순서에 미치는 영향
    - 브라우저와 Node.js 비교
      - Node.js 이벤트 루프 단계 (timers → poll → check 등)
      - `process.nextTick`과 마이크로태스크의 순서
      - `setImmediate`와 `setTimeout(fn, 0)`의 차이
      - 렌더링 단계 유무
- HTML/CSS

---

참고: [MDN 메모리 관리](https://developer.mozilla.org/ko/docs/Web/JavaScript/Guide/Memory_management) · [MDN 자바스크립트 실행 모델](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Execution_model) · [Node.js 이벤트 루프, 타이머, process.nextTick()](https://nodejs.org/learn/asynchronous-work/event-loop-timers-and-nexttick)
