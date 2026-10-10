---
layout: default
title: "Controlled일 때 내부 state를 건드리면 안 되는 이유"
date: 2026-09-21 15:00:00 +0900
---

## 무엇을 몰랐나

Controlled 모드일 때도 내부 state를 같이 바꿔도 된다고 생각했다. 그렇게 하면 상태의 원본이 두 개가 된다는 점을 놓쳤다.

## 개념 정리

한 컴포넌트가 두 방식을 모두 지원하려면 "지금 누가 상태의 원본인가"를 먼저 정한다.

| 모드 | 원본 | 내부 state |
|---|---|---|
| Controlled (`open` prop 있음) | 부모 | 바꾸지 않는다 |
| Uncontrolled (`open` prop 없음) | 컴포넌트 내부 | 바꾼다 |

```tsx
function Toggle({ open: openProp, defaultOpen = false, onOpenChange }: Props) {
  const [inner, setInner] = useState(defaultOpen)
  const isControlled = openProp !== undefined
  const open = isControlled ? openProp : inner

  const setOpen = (next: boolean) => {
    if (!isControlled) setInner(next) // 원본이 내부일 때만
    onOpenChange?.(next)              // 두 모드 모두 부모에게 알린다
  }
}
```

- 내부 state 갱신은 Uncontrolled일 때만 한다.
- `onOpenChange`는 두 모드 모두 "바꾸고 싶다"는 의도를 부모에게 알리는 통로라 조건문 밖에 둔다.

## 다시 볼 기준

- 같은 값을 부모와 자식이 동시에 들고 있지 않은가?
- 변경 알림 콜백이 한쪽 모드에서만 호출되지 않는가?

---

참고: [제어 컴포넌트와 비제어 컴포넌트](https://ko.react.dev/learn/sharing-state-between-components#controlled-and-uncontrolled-components)
