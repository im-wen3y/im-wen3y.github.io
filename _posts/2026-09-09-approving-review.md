---
layout: default
title: "지적할 게 없는 PR은 어떻게 리뷰할까"
date: 2026-09-09
---

## 왜 이 글을 쓰게 되었나

리뷰 연습 세 번째 PR을 받았다. 앞의 두 번은 둘 다 결함이 있었고, 나는 매번 원인을 찾아 수정 요청을 했다.
그런데 이번 코드는 아무리 봐도 걸리는 데가 없었다.

그래서 "눈에 거슬리는 부분은 없어 승인할게"라고 적었다. 이 한 줄이 왜 부족한 리뷰인지가 이번에 배운 것이다.

## 무엇을 보고 있었나

요구사항은 세 개였다.

- 검색어를 입력하면 이름에 그 검색어가 포함된 제품만 보인다
- 입력창을 비우면 전체 목록이 다시 보인다
- 전달받은 원본 목록은 바뀌지 않는다

**ProductList.jsx**
{: .filename}

```jsx
export default function ProductList({ products }) {
  const [query, setQuery] = useState('');

  const visible = products.filter((product) => product.name.includes(query));

  return (
    <div>
      <input value={query} onChange={(e) => setQuery(e.target.value)} />
      <ul>
        {visible.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

## 처음 든 생각

결함이 없어 보였고, 실제로 없었다. 판단은 맞았는데 코멘트가 문제였다.

> 눈에 거슬리는 부분은 없어 승인할게

이건 **인상**이지 확인이 아니다. 나중에 이 PR에서 문제가 터졌을 때, 리뷰어가 무엇을 보고 무엇을 안 봤는지가 아무것도 남지 않는다.

승인 코멘트도 요구사항 하나씩에 대응해야 한다는 걸 이번에 알았다.

- `filter`는 새 배열을 반환하니 원본 `products`는 그대로다 → 세 번째 요구사항 충족
- 검색어가 빈 문자열이면 `includes('')`는 항상 `true`라 전체가 보인다 → 두 번째 요구사항 충족

## 왜 그렇게 동작했나

문제는 첫 번째 요구사항이었다. "이름에 검색어가 포함된"이 대소문자를 구분한다는 뜻인지는 어디에도 안 적혀 있었다.

**콘솔에서 확인**
{: .filename}

```js
'MacBook Air'.includes('macbook');  // false
'MacBook Air'.includes('MacBook');  // true
```

`String.prototype.includes`는 대소문자를 구분한다. 그러니 소문자로 `macbook`을 치면 목록이 빈다.

여기서 멈칫했다. 이게 버그인가?

## 내가 선택한 방식과 이유

버그라고 단정할 수 없다고 봤다. 개발자가 정할 문제가 아니라 **기획 정책**이기 때문이다.

- 대소문자를 무시하는 검색이 맞다면 → 필수 수정
- 정확히 일치해야 한다면 → 지금 코드가 맞음

요구사항 문서에 답이 없으니, 리뷰어가 할 수 있는 건 **질문**이다. 그래서 최종 코멘트를 이렇게 남겼다.

> 정해진 요구사항에 따라 코드 작성이 잘 된 것 같습니다.
> 하지만 검색 시에 대소문자 구분 또는 공백 허용 등 관련한 사항은 기획팀과의 정책 확인이 필요해 보입니다.

리뷰 코멘트를 세 갈래로 나눠 생각하니 정리가 됐다.

| 분류 | 무엇인가 | 코멘트에 필요한 것 |
|---|---|---|
| 필수 수정 | 명시된 요구사항을 어긴다 | 재현 조건과 영향 |
| 제안 | 지금 동작은 맞지만 유지보수가 어렵다 | 비용과 이점 |
| 질문 | 요구사항만으로 판단할 수 없다 | 무엇을 확인해야 하는지 |

## 확인해본 것

같은 코드를 두고 요구사항만 바꿔봤다. **"검색은 대소문자를 구분하지 않는다"**가 처음부터 적혀 있었다면?

그럼 이건 질문이 아니라 **필수 수정**이다. 코드는 한 글자도 안 바뀌었는데 분류가 달라진다.
결함을 정의하는 건 코드가 아니라 **요구사항과 동작의 차이**였다.

## 배운 점

- 승인에도 근거가 필요하다. "문제 없어 보인다"가 아니라 "요구사항 3개를 이렇게 확인했다"여야 한다.
- 지적 개수가 리뷰의 품질이 아니다. 결함이 없는 PR을 억지로 지적하면 작성자의 시간만 쓴다.
- 질문으로 남길 때도 재현 조건을 적어야 한다. "대소문자 확인 필요"보다 "`macbook`으로 검색하면 목록이 빕니다"가 기획자를 덜 고생시킨다.

## AI를 어떻게 썼나

- **직접 정한 것**: 승인 판단, 대소문자 이슈를 정책 질문으로 분류한 것, 최종 코멘트
- **AI에 맡긴 것**: 리뷰할 PR 코드 작성 (결함 유무를 미리 알려주지 않음)
- **AI와 정한 것**: 승인 코멘트에 무엇을 남겨야 하는지, 필수 수정 / 제안 / 질문의 경계

---

참고: [String.prototype.includes (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/String/includes) · [Array.prototype.filter (MDN)](https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Array/filter) · [렌더링 중 계산하기 — 불필요한 Effect 피하기](https://ko.react.dev/learn/you-might-not-need-an-effect)
