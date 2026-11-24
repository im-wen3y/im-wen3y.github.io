# SeriesBox

시리즈에 속한 글의 본문 위에 놓는, 접고 펼 수 있는 시리즈 박스입니다. 시리즈 글에만 렌더합니다.

- 위치: 글 상세(BLOG-02)에서 제목 · 메타 줄 아래, 본문 시작 전. 폭은 본문과 같은 `layout-article`.
- 구성: 라벨 “시리즈” → 시리즈 이름(시리즈 상세 `/series/[id]` 링크) → 펼치면 글 목록 → 아래 줄 왼쪽 “목록 보기 / 숨기기” 토글, 오른쪽 위치 “N/M”과 이전 · 다음 편 버튼.
- 기본 상태: 글마다 접힌 상태로 시작합니다. 펼침 여부는 저장하지 않습니다 (I-21 결정).
- 토글: `<button aria-expanded aria-controls="목록 id">`, 아이콘 `expand_more` ↔ `expand_less`. 목록은 HTML에 항상 넣고 `hidden`으로 접습니다. 스크립트가 없으면 펼친 상태로 보입니다.
- 목록: `seriesOrder` 순서로 번호 · 제목 전체. 현재 글은 링크가 아닌 `<span aria-current="page">`로 `accent-primary` 700. draft 글은 빼고 번호를 다시 셉니다.
- 이전 · 다음 편: 원형 36 (Mobile 44) `<a href>` · `chevron_left` / `chevron_right` · `aria-label` “이전 글 / 다음 글”. 없는 쪽은 `aria-disabled="true"`로 `control-disabled` 아이콘과 `border-default` 테두리.
- 사용하는 쪽이 넘겨 줄 것: 시리즈 id · 이름 (시리즈 파일), 공개된 시리즈 글 목록(제목 · slug · seriesOrder), 현재 글 slug.
- 시리즈 글이 1편뿐일 때 보일지는 I-24 (지금은 “1/1”로 표시하는 안).
