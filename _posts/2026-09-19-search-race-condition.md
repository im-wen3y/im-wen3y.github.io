---
layout: default
title: "검색어가 바뀌었는데 오래된 결과가 보인다 — fetch와 Effect cleanup"
date: 2026-09-19 12:00:00 +0900
---

## 왜 이 글을 쓰게 되었나

검색어가 바뀔 때마다 다시 검색하는 코드를 리뷰했다. 처음에는 `useEffect`의 의존성 배열만 고치면 문제가 끝난다고 생각했는데, 사용자가 검색어를 빠르게 바꾸면 응답이 도착하는 순서가 뒤집힐 수 있다는 점에서 다시 막혔다.

## 무엇을 보고 있었나

요구사항은 검색어가 바뀔 때마다 해당 검색어로 결과를 갱신하는 것이었다.

**SearchResults.tsx**
{: .filename}

```tsx
function SearchResults({ query }) {
  const [results, setResults] = useState([]);

  useEffect(() => {
    fetch(`/api/search?q=${query}`)
      .then((response) => response.json())
      .then((data) => setResults(data));
  }, [query]);

  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>{result.name}</li>
      ))}
    </ul>
  );
}
```

## 처음 든 생각

`query`가 `react`에서 `typescript`로 바뀌면 Effect가 한 번 더 실행되므로, 최종적으로는 `typescript` 결과가 `setResults`에 담길 것이라고 생각했다.

그러다 `fetch`를 잘못 이해하고 있는 것 같다는 생각이 들었다. `await`를 사용하면 요청이 동기적으로 실행되어 순서가 보장되는지도 궁금했다.

## 왜 그렇게 동작했나

`[query]`를 넣으면 검색어가 바뀔 때마다 새 요청이 시작되는 것은 맞다. 하지만 각 요청의 응답이 도착하는 순서는 보장되지 않는다.

```text
1. react 요청 시작
2. typescript 요청 시작
3. typescript 응답 도착 → typescript 결과 저장
4. react 응답 도착 → react 결과 저장
```

각 `.then()`은 응답이 도착하는 순간 실행된다. 따라서 현재 검색어가 `typescript`여도 늦게 도착한 `react` 응답이 마지막에 `setResults`를 호출해 화면을 덮어쓸 수 있다.

`await`도 이 순서를 자동으로 해결하지 않는다.

```tsx
useEffect(() => {
  async function search() {
    const response = await fetch(`/api/search?q=${query}`);
    const data = await response.json();
    setResults(data);
  }

  search();
}, [query]);
```

`await`는 각각의 `search` 함수 안에서 응답을 기다리게 할 뿐이다. `query`가 바뀌면 이전 `search`가 기다리는 동안 새 Effect와 새 `search`도 시작된다. 네트워크 요청 자체가 동기식으로 바뀌는 것은 아니다.

## 내가 선택한 방식과 이유

오래된 응답을 무시할 수 있도록 Effect마다 `ignore` 변수를 만들고 cleanup에서 값을 바꾼다.

```tsx
useEffect(() => {
  let ignore = false;

  fetch(`/api/search?q=${query}`)
    .then((response) => response.json())
    .then((data) => {
      if (!ignore) {
        setResults(data);
      }
    });

  return () => {
    ignore = true;
  };
}, [query]);
```

`query`가 바뀌면 React는 새 Effect를 실행하기 전에 이전 Effect의 cleanup을 호출한다. 그러면 이전 요청의 `ignore`만 `true`가 되고, 그 요청의 응답이 나중에 도착해도 결과를 저장하지 않는다.

## 클로저가 헷갈렸던 지점

처음에는 `react` 요청과 `typescript` 요청이 같은 `ignore`를 공유한다고 생각했다. 하지만 Effect가 실행될 때마다 `ignore`가 새로 만들어진다.

```text
react Effect
  ignore = false

typescript Effect
  ignore = false
```

각 Effect의 callback과 cleanup, 그리고 응답 callback은 자신이 만들어질 때의 `ignore`를 기억한다. 이것이 클로저다.

예를 들어 다음 코드에서 두 객체의 `active`는 서로 다르다.

```js
function makeLogger(name) {
  let active = true;

  return {
    check() {
      return `${name}: ${active}`;
    },
    stop() {
      active = false;
    },
  };
}

const first = makeLogger('react');
const second = makeLogger('typescript');

first.stop();
```

`first.stop()`은 첫 번째 호출이 만든 `active`만 바꾸고, 두 번째 호출의 `active`에는 영향을 주지 않는다. Effect cleanup도 같은 방식으로 이전 Effect의 변수만 변경한다.

## 확인해본 것

이번 문답에서는 브라우저나 실제 API를 실행하지 않았다. 두 요청의 응답 순서가 뒤집힐 수 있다는 비동기 실행 흐름과, cleanup·클로저의 관계를 코드 순서로 따라가며 확인했다.

요청 자체를 취소하는 `AbortController` 방식은 다음 학습 주제로 남겼다. 이번 글에서는 응답을 무시하는 `ignore` 방식까지만 다룬다.

## 배운 점

- `useEffect`의 의존성 배열은 Effect를 다시 실행할 조건을 정한다.
- `fetch` 요청을 여러 번 시작하면 응답 순서는 요청 순서와 다를 수 있다.
- `await`는 async 함수의 다음 코드를 기다리게 하지만, 다른 Effect 실행이나 네트워크 요청의 순서를 보장하지 않는다.
- Effect마다 별도의 `ignore`가 만들어지고, cleanup은 이전 Effect의 변수만 바꾼다.
- 오래된 응답을 무시하려면 현재 요청인지 확인한 뒤 `setResults`를 호출해야 한다.

## AI를 어떻게 썼나

- **직접 정한 것**: 의존성 배열에 `query`를 넣어야 한다는 판단과 응답 순서에 대한 첫 예측
- **AI에 맡긴 것**: `fetch`, `await`, cleanup, 클로저를 하나씩 분리해 질문하는 진행
- **AI와 정한 것**: Effect별 `ignore`가 서로 다른 클로저에 속한다는 이해

---

참고: [Synchronizing with Effects (React)](https://react.dev/learn/synchronizing-with-effects) · [useEffect (React)](https://react.dev/reference/react/useEffect) · [Using the Fetch API (MDN)](https://developer.mozilla.org/ko/docs/Web/API/Fetch_API/Using_Fetch)
