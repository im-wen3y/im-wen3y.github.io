# im-wen3y.dev 디자인 시스템

이 폴더는 claude.ai의 "im-wen3y.dev 디자인 시스템"에서 내보낸 파일입니다. 값을 바꿀 때는 `tokens.json`을 먼저 고치고 `tokens.css`를 같은 값으로 맞춥니다.

## 파일

- `tokens.json` — 토큰 원본 (색: 라이트 · 다크, 글자 스타일, 간격, 모서리, 그림자, 레이아웃)
- `tokens.css` — 위 토큰을 CSS 변수로 옮긴 파일. `:root`/`[data-theme="light"]`와 `[data-theme="dark"]` 블록, 글자 스타일 클래스(`.body`, `.caption` 등)
- `components/bundle.css` — 컴포넌트 스타일 (`w-` 접두사 클래스). 값은 모두 토큰 변수 참조
- `components/<이름>/README.md` — 컴포넌트 규격과 사용 규칙
- `components/<이름>/preview.html` — 브라우저로 열어 보는 정적 미리보기 (Google Fonts 필요). `<html data-theme="dark">`로 바꾸면 다크 확인

컴포넌트는 React 번들이 아니라 HTML 구조 + CSS 클래스로 정의했습니다. Astro 컴포넌트로 옮길 때 각 README의 구조 · 크기 · 토큰을 따릅니다.

---

프론트엔드 개발 블로그 im-wen3y.dev의 디자인 시스템입니다. 색은 화면 기획서 v0.1 팔레트(라이트 · 다크)를 따르고, 크기 · 간격 · 모서리는 예전 시안 실측값에서 시작했습니다. 기획서와 시안에 없어 새로 정한 값은 토큰 메모와 컴포넌트 설명에 [제안]으로 표시했습니다.

## 문구

- 화면 문구는 모두 한국어로 씁니다: “글”, “소개”, “검색”, “최근 글”, “전체 보기”, “목록 보기”, “글 24개”. 영어로는 기술 이름(Next.js, React, TanStack Query)과 외부 서비스 이름(GitHub, Velog)만 씁니다.
- 설명 문장은 “~합니다” 체로 짧게 씁니다: “프론트엔드 개발 과정에서 고민하고, 시도하고, 배운 것들을 기록합니다.”
- 버튼과 링크는 동사로 끝냅니다: “글 둘러보기”, “링크 복사”, “목차 보기”.
- 이모지는 쓰지 않습니다. 느낌표도 쓰지 않습니다.
- 날짜는 `YYYY.MM.DD`, 메타 항목 사이는 “ · ”(가운뎃점, 앞뒤 공백)으로 씁니다: “2026.10.15 · Next.js”. 읽기 시간은 표시하지 않습니다 (I-09).

## 색

- 페이지는 `bg-canvas` 위에 `text-primary`로 씁니다. 설명 · 요약 · 메타 · 비활성 메뉴는 `text-secondary`입니다.
- 포인트 색은 `accent-primary` 하나입니다. Primary 버튼, Text link, 글 상세 태그 표기, 목차 활성 항목, 현재 페이지 번호에만 씁니다. hover · pressed는 `accent-hover`입니다.
- `accent-primary`로 채운 면 위 글자는 흰색을 직접 쓰지 말고 `text-on-accent`를 씁니다. Dark에서는 포인트 색이 밝아져 글자가 어두운 색으로 바뀝니다.
- 칩과 태그는 `bg-accent-subtle` 위에 `text-accent-strong`으로 씁니다.
- 면 구분은 1px `border-default` 선과 `bg-surface` 배경으로만 합니다. 그림자는 맨 위로 버튼의 `shadow-float` 하나뿐입니다.
- 코드 블록은 두 모드 모두 `bg-code` 위 `code-text`, 키워드는 `code-keyword`, 주석은 `code-comment`입니다.
- 모든 글자 색은 각자의 메모에 적은 배경 위에서 Light · Dark 모두 4.5:1 이상입니다. 단, `border-default`는 장식선 값이라 입력창 경계로는 3:1에 못 미칩니다. 기획서 값을 그대로 두었으므로 입력창은 focus 표시로 보완합니다.
- 키보드 focus는 `focus-ring` 2px 실선, offset 3px입니다 [제안].

## 테마

- 첫 방문은 시스템 설정(`prefers-color-scheme`)을 따르고, 테마 전환 버튼으로 바꾸면 localStorage에 저장합니다 [제안].
- 테마는 `<html data-theme="light|dark">`로 바꿉니다. 모든 색 토큰이 두 값을 가지므로 컴포넌트에는 색을 직접 쓰지 않습니다.
- 페이지가 그려지기 전 `<head>`의 인라인 스크립트로 테마를 적용해 깜빡임을 막습니다 [제안].

## 글꼴

- 본문과 UI는 IBM Plex Sans KR(`font-sans`), 코드는 IBM Plex Mono(`font-mono`)입니다.
- Bungee(`font-logo`)는 로고 “im-wen3y.dev”에만 씁니다. 제목이나 영어 문구에는 쓰지 않습니다. `font-synthesis: none`으로 가짜 굵기를 막습니다.
- 세 글꼴 모두 Google Fonts에서 불러옵니다. 글꼴 파일은 이 시스템에 들어 있지 않습니다.
- 크기는 Desktop 값이 토큰이고 Mobile 값은 각 스타일 메모에 있습니다: 글 본문 `body` 18/1.8 (Mobile 16~17), 글 제목 `heading-1` 44 (Mobile 32), 본문 소제목 `heading-3` 28 (Mobile 22).

## 간격 · 모서리 · 레이아웃

- 간격은 4px 단위 `space-1` ~ `space-24`입니다.
- 모서리는 버튼 `radius-sm` 6, 입력 · 코드 블록 · 카드 `radius-md` 10, 칩 · 태그 `radius-full`입니다.
- Desktop 콘텐츠 최대 폭 `layout-content-max` 1184, 글 본문 `layout-article` 720, 목차 `layout-toc` 220입니다.
- 좌우 여백은 Desktop 128 · Tablet 40 · Mobile 20, Header 높이는 88 / 72입니다.
- 브레이크포인트는 Mobile < 768 · Tablet 768 ~ 1199 · Desktop ≥ 1200입니다 (I-12 결정). 어느 폭에서도 페이지 가로 스크롤은 없고, 코드 블록 안에서만 가로 스크롤을 허용합니다.
- 터치 영역은 `layout-touch` 44 이상입니다.

## 아이콘

- Google Fonts의 Material Symbols Outlined를 씁니다 (weight 400, fill 0). 아이콘 이름을 글자로 넣고 `aria-hidden="true"`를 줍니다.
- 쓰는 아이콘: `arrow_forward` · `arrow_back` · `arrow_outward`(외부 링크 · 카드) · `arrow_upward`(맨 위로) · `arrow_downward`(정렬) · `search` · `menu` · `contrast`(테마) · `link`(공유) · `toc`(목차) · `expand_more` · `expand_less`(시리즈 목록 접기 · 펴기) · `chevron_left` · `chevron_right`(시리즈 이전 · 다음 편).
- 아이콘만 있는 버튼에는 `aria-label`을 줍니다.

## 로고

- 로고는 이미지가 아니라 `logo` 스타일로 조판한 글자 “im-wen3y.dev”입니다. 별도 로고 파일은 없습니다.

## 컴포넌트 사용

- 컴포넌트는 React 번들이 아니라 HTML 구조와 `components/bundle.css`의 `w-` 클래스로 정의했습니다. Astro 컴포넌트로 옮길 때 각 컴포넌트 설명의 구조와 클래스, 토큰을 그대로 따릅니다.
- `tokens.css`를 먼저, `components/bundle.css`를 다음에 불러옵니다.
- 시리즈 글에는 본문 위에 `SeriesBox`를 둡니다. 글마다 접힌 상태로 시작하고, 시리즈 이름은 시리즈 상세(`/series/[id]`)로 이어집니다. 시리즈 글의 본문 끝 `PostNav`는 시리즈 순서를 따릅니다.
- 비활성 아이콘 버튼은 아이콘을 `control-disabled`, 테두리를 `border-default`로 칠합니다.
