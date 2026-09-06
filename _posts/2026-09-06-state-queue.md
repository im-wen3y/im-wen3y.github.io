---
layout: default
title: 값 전달과 갱신 함수는 큐에서 다르게 처리된다
date: 2026-09-06
---

> 초안. 본인 말투로 다시 쓸 것.

`setQuantity(quantity + 1)`을 두 번 호출하면 왜 1만 늘어날까?

```js
const [quantity, setQuantity] = useState(1);

function handleClick() {
  setQuantity(quantity + 1);
  setQuantity(quantity + 1);
}
```

## 두 값은 시점이 다르다

| | 언제 정해지는가 | 값의 출처 |
|---|---|---|
| `quantity` | 클릭 당시 | 이번 렌더링에 고정된 스냅샷 |
| `q` (갱신 함수 인자) | 렌더링 직전, 큐를 처리할 때 | 큐에서 직전 항목까지 처리한 결과 |

값 전달은 호출하는 순간 이미 숫자로 계산이 끝나서, 큐를 처리할 때 **앞의 결과를 덮어쓴다.**
갱신 함수는 함수 그대로 큐에 쌓였다가, 처리 시점에 직전 결과를 받아 **이어서 계산한다.**

## 섞으면 순서가 결과를 바꾼다

```js
// n === 0
setNumber(n => n + 1);   // 0 → 1
setNumber(n + 1);        // "1로 교체" → 앞의 일이 사라짐
setNumber(n => n + 1);   // 1 → 2
```

결과는 3이 아니라 **2**.

## 남길 것

- 같은 핸들러에서 두 형태를 섞으면 읽는 사람이 큐를 손으로 추적해야 한다. 리뷰에서 지적할 만한 지점.
- 이전 값에 기대는 갱신이면 갱신 함수를 쓴다.

참고: [스냅샷으로서의 State](https://ko.react.dev/learn/state-as-a-snapshot) · [State 업데이트 큐](https://ko.react.dev/learn/queueing-a-series-of-state-updates)
