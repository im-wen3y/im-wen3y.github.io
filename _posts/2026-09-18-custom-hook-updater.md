---
layout: default
title: "빠르게 눌러서 놓친 걸까 — Custom Hook에서 updater function 사용하기"
date: 2026-09-18 12:10:00 +0900
---

## 왜 이 글을 쓰게 되었나

Custom Hook으로 토글 상태를 관리하는 코드를 살펴봤다. 버튼을 빠르게 여러 번 누르면 상태 변경이 누락될 것 같았는데, 실제로 중요한 조건은 클릭 속도가 아니라 한 이벤트 안에서 상태 업데이트를 몇 번 요청하는지였다.

## 무엇을 보고 있었나

**useToggle.ts**
{: .filename}

```tsx
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);

  function toggle() {
    setValue(!value);
  }

  return { value, toggle };
}
```

```tsx
function Panel() {
  const { value, toggle } = useToggle();

  return (
    <>
      <button onClick={toggle}>토글</button>
      {value && <p>열림</p>}
    </>
  );
}
```

## 처음 든 생각

처음에는 빠르게 여러 번 클릭하면 `toggle`이 최신 값을 못 보고 상태 변경을 놓칠 것 같았다.

그런데 한 번 클릭할 때 `onClick`은 `toggle`을 한 번 호출한다. 클릭 이벤트가 끝난 뒤 다시 렌더링되면 다음 이벤트의 `toggle`은 새 렌더링의 `value`를 참조한다. 단순히 빠르게 클릭한다는 이유만으로 문제가 생긴다고 단정할 수는 없었다.

## 왜 그렇게 동작했나

문제가 드러나는 조건을 한 이벤트 안에서 두 번 호출하는 상황으로 바꿔봤다.

```tsx
function handleDoubleToggle() {
  toggle();
  toggle();
}
```

현재 값이 `false`라면 두 호출은 모두 같은 렌더링의 `value`를 읽는다.

```js
toggle(); // setValue(true)
toggle(); // 다시 setValue(true)
```

두 번째 호출이 첫 번째 업데이트 결과인 `true`를 읽는 것이 아니다. 두 호출 모두 `false`를 기준으로 `true`를 요청하므로, 최종 결과는 한 번만 반전된 `true`가 된다.

## 내가 선택한 방식과 이유

이전 state를 바탕으로 여러 업데이트를 누적해야 하므로 updater function을 사용한다.

```tsx
function toggle() {
  setValue((prev) => !prev);
}
```

이제 `prev`는 바깥 렌더링의 `value`가 아니라, React가 큐를 처리할 때 직전까지 계산된 값을 받는다.

현재 값이 `false`일 때 세 번 호출하면 다음과 같이 이어진다.

```text
false → true → false → true
```

값을 직접 계산해 전달하는 방식과 updater function의 차이는 함수 모양의 취향이 아니라, 앞선 업데이트 결과를 다음 업데이트가 이어받아야 하는지에 달려 있었다.

## 확인해본 것

이번 문답에서는 브라우저나 실행 환경에서 클릭을 직접 재현하지 않았다. 렌더링 스냅샷과 업데이트 큐의 동작을 기준으로 예측했다.

또한 “빠르게 클릭하면 항상 실패한다”는 표현은 정확하지 않다. 이벤트가 분리되어 각 클릭 뒤에 렌더링이 진행되는 일반적인 경우와, 한 이벤트 핸들러 안에서 `toggle()`을 여러 번 호출하는 경우를 구분해야 한다.

## 배운 점

- 상태 변경 문제를 볼 때 클릭 속도와 한 이벤트 안의 호출 횟수를 구분해야 한다.
- `setValue(!value)`는 현재 렌더링의 `value`를 사용한다.
- 여러 업데이트가 앞선 결과를 이어받아야 하면 `setValue((prev) => ...)` 형태를 사용한다.
- Custom Hook의 함수도 컴포넌트 렌더링에서 만들어진 값을 클로저로 참조한다.

## AI를 어떻게 썼나

- **직접 정한 것**: 빠른 클릭과 같은 이벤트 안의 여러 호출을 구분한 것
- **AI에 맡긴 것**: `toggle`의 호출 횟수와 렌더링 시점을 한 단계씩 확인하는 질문
- **AI와 정한 것**: updater function이 필요한 조건과 세 번의 토글 결과

---

참고: [State as a Snapshot (React)](https://react.dev/learn/state-as-a-snapshot) · [Queueing a Series of State Updates (React)](https://react.dev/learn/queueing-a-series-of-state-updates)
