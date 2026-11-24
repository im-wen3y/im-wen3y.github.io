# Pagination

글 목록 위 툴바와 아래 페이지 번호입니다. 경로는 `/blog/page/[n]` [제안].

- 툴바: “글 N개” 16 · 정렬 “최신순” 15/500 + `arrow_downward`. 정렬은 최신순 하나라 표시만, 드롭다운 없음.
- 페이지 번호 40×40 (Mobile 44) · `radius-sm` · `text-secondary` 500. 현재 페이지는 `accent-primary` 채움 · `text-on-accent` · `aria-current="page"`.
- “이전 / 다음”은 TextLink. 첫 페이지에서 이전, 마지막 페이지에서 다음을 숨깁니다.
