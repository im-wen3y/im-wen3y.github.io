---
layout: default
title: "체크박스를 눌렀는데 화면이 안 바뀐다 — 값은 바뀌었는데도"
date: 2026-09-06 12:00:00 +0900
---

## 왜 이 글을 쓰게 되었나

할 일 목록에 완료 체크를 다는 PR을 리뷰했다.
문제가 있는 코드라는 건 금방 보였는데, 막상 "왜 안 되는지"를 설명하려니 문장이 자꾸 뭉개졌다.
값이 안 바뀌는 건지, 화면이 안 바뀌는 건지부터 내가 구분을 못 하고 있었다.

## 무엇을 보고 있었나

요구사항: **체크박스를 누르면 그 항목의 완료 상태만 바뀌어 화면에 반영된다. 나머지는 그대로.**

**TodoList.jsx**
{: .filename}

```jsx
function handleToggle(id) {
  todos.forEach((todo) => {
    if (todo.id === id) {
      todo.done = !todo.done;
    }
  });
  setTodos(todos);
}
```

## 처음 든 생각

`forEach`로 직접 바꾸는 부분과 `setTodos(todos)`가 걸렸다. 그래서 이렇게 적었다.

> setState의 initialValue로 등록되어 있어서 forEach를 통해 todo.done을 직접 업데이트하더라도
> setTodos(todos)의 todos는 값이 변경되지 않을 것 같음

결론(수정 요청)은 맞았는데, 이유가 틀렸다.

## 왜 그렇게 동작했나

질문을 두 개로 쪼개니까 정리됐다.

**1. 값은 바뀌는가? (JavaScript)** — 바뀐다.

**콘솔에서 확인**
{: .filename}

```js
const todos = [{ id: 2, done: false }];
todos.forEach((todo) => { todo.done = true; });
todos[0].done;  // true
```

배열이 담고 있는 건 객체가 아니라 **객체를 가리키는 참조**라서, 콜백 안의 `todo`를 바꾸면 배열 안 그 객체가 바뀐다.

**2. 그럼 왜 화면이 그대로인가? (React)** — 리렌더링을 건너뛴다.

`setTodos(todos)`는 **방금 그 배열을 그대로** 넘긴다. React는 이전 state와 새 state를 `Object.is`로 비교하는데, 같은 배열이니 `true`. "바뀐 게 없다"고 판단하고 렌더링을 건너뛴다.

그래서 이 코드는 **데이터는 이미 바뀌었는데 화면만 옛날인** 상태를 만든다. 아무것도 안 일어난 것보다 고약하다.

여기서 헷갈리기 쉬운 게 하나 더 있었다. 두 비교는 층위가 다르다.

| | 무엇을 비교 | 어떻게 |
|---|---|---|
| state 업데이트 | 이전 state ↔ 새 state | `Object.is` — 참조가 같은지만. 내용은 한 겹도 안 봄 |
| `React.memo` | 이전 props ↔ 새 props | 얕은 비교 — props의 1단계 key를 각각 `Object.is`로 |

둘 다 "얕은 비교"로 뭉뚱그려 부르다가 원인을 잘못 짚을 뻔했다.

## 내가 선택한 방식과 이유

처음엔 `setTodos([...todos])`면 되겠다고 생각했다. 새 배열이니 `Object.is`가 다르다고 볼 테고, 실제로 화면도 고쳐진다.

그런데 `[...todos]`는 **얕은 복사**다. 배열 껍데기만 새것이고 안에는 원래 그 객체 3개가 그대로 들어간다. `forEach`로 변형한 흔적은 남아 있는 것이다.

두 번째로 `filter`를 써봤는데 이건 더 엉망이었다.

**TodoList.jsx — 실패한 시도**
{: .filename}

```js
// 실패한 시도
const filteredTodo = todos.filter(todo => todo.id === id);
filteredTodo[0].done = !todo.done;          // todo는 여기 없는 변수
setTodos(prev => [...prev, filteredTodo]);  // 항목이 4개가 됨
```

`filter`는 골라내기고, 내가 필요한 건 **같은 길이의 새 배열 만들기**였다. 그래서 `map`으로 갔다.

**TodoList.jsx — 최종**
{: .filename}

```js
function handleToggle(id) {
  setTodos(todos.map((todo) => {
    if (todo.id === id) {
      return { ...todo, done: !todo.done };
    }
    return todo;
  }));
}
```

`map` 콜백이 `return`한 값이 새 배열의 그 자리에 들어간다. 그러니 바뀐 항목 자리에는 **`done`만 뒤집힌 새 객체**를, 나머지 자리에는 원래 객체를 그대로 돌려주면 된다.

## 확인해본 것

안 바뀐 항목까지 `{ ...todo }`로 전부 복사하면 더 안전한가? 아니었다.

- 안전성 이득 없음 — 복사는 변형을 피하려고 하는 것이지 의식이 아니다
- 손해는 있음 — 참조가 전부 달라져서 `React.memo`로 감싼 항목이 3개 다 리렌더링된다

**바뀐 것만 새로, 나머지는 그대로.** 이게 기준이었다.

## 배운 점

- "값이 안 바뀐다"와 "화면이 안 바뀐다"는 다른 문장이다. 리뷰 코멘트에서 이 둘이 섞이면 작성자가 엉뚱한 곳을 고친다.
- 리뷰어가 제안하는 수정안도 리뷰 대상이다. `filter` 제안은 내가 실행 순서를 안 따라가고 던진 거였다.
- 불변성을 "무조건 다 복사"로 외우면 오히려 손해가 난다. 왜 복사하는지가 기준이어야 한다.

## AI를 어떻게 썼나

- **직접 정한 것**: 결함 위치 지목, 승인/수정 요청 판단, 최종 수정 코드
- **AI에 맡긴 것**: 리뷰할 PR 코드 작성, 답을 미리 알려주지 않는 진행
- **AI와 정한 것**: 틀린 예측의 원인 추적(값 vs 렌더링), `Object.is`와 얕은 비교의 층위 구분

---

참고: [state 안의 배열 업데이트하기](https://ko.react.dev/learn/updating-arrays-in-state) · [state 안의 객체 업데이트하기](https://ko.react.dev/learn/updating-objects-in-state) · [Object.is (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Object/is) · [memo (React)](https://ko.react.dev/reference/react/memo)
