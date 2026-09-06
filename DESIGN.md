# DESIGN — macOS Big Sur 스타일

이 블로그가 쓰는 스타일 규칙. 다른 페이지·프로젝트에 옮겨 쓸 때 이 문서만 보면 된다.
실제 구현은 [`assets/style.css`](assets/style.css), 뼈대는 [`_layouts/default.html`](_layouts/default.html).

## 한 줄 요약

**바탕화면 위에 창 하나.** 페이지 전체가 반투명 macOS 창이고, 그 안에 내용이 들어간다.

## 토큰

라이트를 기본으로 두고, 다크는 `@media (prefers-color-scheme: dark)`에서 **토큰만** 다시 정의한다.
색을 미디어 쿼리 안에서만 정의하지 않는다 (그 색은 라이트에서 사라진다).

```css
:root{
  /* 바탕화면 */
  --wall-1:#cfe0f7;  --wall-2:#e7d9f2;  --wall-3:#f6e7d8;
  /* 창 */
  --win:rgba(255,255,255,.72);      /* 반투명 본문 바닥 */
  --win-edge:rgba(255,255,255,.75); /* 1px 테두리 = 창 가장자리 광택 */
  --chrome:rgba(246,246,248,.82);   /* 타이틀바 */
  /* 글자·선 */
  --ink:#1d1d1f;  --ink-soft:#6e6e73;
  --sep:rgba(0,0,0,.10);            /* 구분선 */
  --hover:rgba(0,0,0,.045);         /* 행 hover, 인용, 인라인 코드 */
  --accent:#0071e3;                 /* 링크 */
  --shadow:0 24px 70px rgba(35,30,60,.22), 0 3px 10px rgba(35,30,60,.10);
}
@media (prefers-color-scheme: dark){
  :root{
    --wall-1:#1c2340;  --wall-2:#2b2247;  --wall-3:#3a2436;
    --win:rgba(38,38,42,.72);
    --win-edge:rgba(255,255,255,.14);
    --chrome:rgba(52,52,58,.82);
    --ink:#f5f5f7;  --ink-soft:#9b9ba1;
    --sep:rgba(255,255,255,.12);
    --hover:rgba(255,255,255,.06);
    --accent:#4aa3ff;
    --shadow:0 24px 70px rgba(0,0,0,.5), 0 3px 10px rgba(0,0,0,.35);
  }
}
```

### 코드 패널 (shiki `material-theme-palenight`)

```css
--code-bg:#292d3e;   --code-bar:#323647;  --code-fg:#a6accd;  --code-dim:#8f97b8;
--code-key:#c792ea;  /* 키워드 */      --code-str:#c3e88d;  /* 문자열 */
--code-fn:#82aaff;   /* 함수·변수 */    --code-attr:#f07178; /* 태그·속성 */
--code-num:#f78c6c;  /* 숫자 */         --code-op:#89ddff;   /* 연산자·구두점 */
```

코드 패널은 두 테마 모두 어둡게 고정한다. 창은 밝아도 코드는 어둡다.

## 타이포그래피

| 역할 | 폰트 | 비고 |
|---|---|---|
| 본문·제목 | `-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Segoe UI", system-ui` | macOS에서 SF로 뜬다. 웹폰트를 싣지 않는다 |
| 코드·날짜·라벨 | `"IBM Plex Mono"` (Google Fonts) | 숫자 정렬이 필요한 곳엔 `font-variant-numeric: tabular-nums` |

크기: 본문 16 / h1 27 / h2 19 / h3 16 / 라벨·메타 12.5 (px).
제목은 `letter-spacing:-0.02em`, `text-wrap:balance`.

## 뼈대

```html
<body>
  <div class="window">
    <div class="titlebar"><span class="lights"></span><span class="titlebar-name">페이지 이름</span></div>
    <div class="toolbar"><a class="home">사이트 이름</a><span class="toolbar-desc">설명</span></div>
    <main>…</main>
    <footer>…</footer>
  </div>
</body>
```

- `body` — 바탕화면 그라디언트(`background-attachment:fixed`) + 바깥 여백
- `.window` — `max-width:780px`, `border-radius:12px`, `backdrop-filter:blur(30px) saturate(180%)`, `overflow:hidden`
- `.titlebar` — 높이 38px, 타이틀 가운데, 아래 1px `--sep`
- `.lights` — 12px 원 하나 + `box-shadow:20px 0 0 #febc2e, 40px 0 0 #28c840` (요소 3개를 만들지 않는다)

신호등 색: 빨강 `#ff5f57` · 노랑 `#febc2e` · 초록 `#28c840`

## 컴포넌트 규칙

- **모서리**: 창 12px / 패널·표·코드 10px / 목록 행·인용 8px / 인라인 코드 4px
- **경계**: 카드 테두리를 남발하지 않는다. 구분은 `--sep` 선 또는 `--hover` 바닥으로.
- **목록**: Finder 리스트처럼 — 행 전체가 링크, hover 시 `--hover` 바닥, 오른쪽 끝에 `›`
- **표**: 바깥만 1px 테두리 + 라운드, 행 사이는 `--sep`, 헤더는 `--hover`
- **코드 블록**: 위에 파일명 바(`p.filename`), 아래 어두운 패널. 언어를 반드시 표기한다
- **그림자**: 창에만 준다. 안쪽 요소는 그림자 대신 바닥색으로 구분한다

## 하지 않는 것

- **신호등은 창 하나에만.** 창 안의 코드 블록에 또 달면 창 속의 창이 되어 지저분하다
- 웹폰트로 본문 폰트를 싣지 않는다 (시스템 폰트가 이 스타일의 핵심)
- 히어로·큰 여백·컬러 그라디언트 텍스트 같은 장식을 추가하지 않는다. 창과 내용만 있다
- 애니메이션은 hover 배경 전환(0.12s) 정도까지

## 옮겨 쓸 때

1. 위 토큰 블록을 그대로 복사한다
2. `.window` / `.titlebar` / `.lights` 세 규칙만 가져가면 macOS 창이 된다
3. 나머지는 그 안에 무엇을 넣느냐의 문제다
