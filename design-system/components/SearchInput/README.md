# SearchInput

글 목록(BLOG-01)과 검색(SEARCH-01)의 검색창입니다.

- 높이 56 (Mobile 48) · 좌우 `space-6` · `radius-md` · `bg-canvas` · 1px `border-default` · 아이콘 `search` 21 · 입력 16/400.
- `<label>` 안에 숨긴 텍스트 “글 검색”과 `<input type="search">`. placeholder “글 검색하기...”.
- focus: 테두리 `accent-primary` + 바깥 3px `bg-accent-subtle` 띠 [제안].
- `border-default`는 3:1에 못 미치는 장식선 값이라 입력 경계가 약합니다 (토큰 메모 참고).
- 검색창 입력 시 SEARCH-01로 갈지 목록 안에서 보여 줄지는 I-02.
