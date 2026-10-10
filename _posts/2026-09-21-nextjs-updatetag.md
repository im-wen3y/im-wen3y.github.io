---
layout: default
title: "저장하고 바로 새 데이터를 보여주고 싶을 때 쓰는 updateTag"
date: 2026-09-21 21:00:00 +0900
---

## 무엇을 몰랐나

Next.js Cache Components에서 태그로 묶인 캐시를 **즉시** 만료시키는 API가 `updateTag`라는 걸 몰랐다. 일반적인 "캐시" 개념으로만 답했다.

## 개념 정리

| API | 쓰는 곳 | 동작 |
|---|---|---|
| `updateTag(tag)` | Server Action에서만 | 태그의 캐시를 즉시 만료시킨다. 다음 요청은 오래된 데이터를 보여주지 않고 새 데이터를 기다린다 |
| `revalidateTag(tag)` | Server Action, Route Handler 등 | 태그의 캐시를 갱신 대상으로 표시한다 |

`updateTag`는 "내가 쓴 걸 내가 바로 읽는(read-your-own-writes)" 상황을 위한 API다. 상품을 저장한 관리자가 저장 직후 목록에서 바로 바뀐 값을 봐야 할 때 쓴다.

```ts
'use server'

export async function saveProduct(form: FormData) {
  await db.product.update(/* ... */)
  updateTag('product-catalog')
}
```

## 다시 볼 기준

- 갱신한 사람이 **바로** 새 데이터를 봐야 하는가, 잠시 이전 데이터가 보여도 되는가?
- 호출하는 위치가 Server Action인가?

---

참고: [Next.js updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag) · [Next.js revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag)
