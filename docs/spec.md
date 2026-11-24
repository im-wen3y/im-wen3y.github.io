# im-wen3y.dev 화면 기획서 v0.1 요약

Design 캔버스(화면 기획서 v0.1)의 내용을 개발용으로 옮긴 문서입니다. 시안 그림은 캔버스에만 있고 이 저장소에는 없습니다. 화면 구조는 이 문서와 `design-system/components/*/preview.html`을 기준으로 합니다.

표기: **[제안]** = 기획서 v0.1에 없고 구현을 위해 덧붙인 안. **I-xx** = 결정 항목(아래 "결정 사항"). **FE-xx** = 개발 작업 ID.

## 1. 개요

- 목적: 프론트엔드 개발 과정에서 겪은 문제와 해결 과정을 기록하고 공유하는 개인 기술 블로그
- 핵심 경험: 관심 있는 기술 글을 쉽게 찾고, 긴 글도 편안하게 읽는다
- 디자인 키워드: Minimal · Editorial · Readable · Calm
- 스택: Astro · Markdown/MDX · Content Collections (zod)
- 배포: Vercel, 도메인 `im-wen3y.dev` (I-11). `astro.config`의 `site`는 `https://im-wen3y.dev`
- 콘텐츠 운영: dev-wil(Private 원문) → 발행용 Markdown → 이 저장소에 push → Vercel 자동 배포
- MVP 포함: 최신 글 · 태그 탐색, 글 목록 · 페이지네이션, 글 상세 · 목차 · 코드, 제목 · 본문 검색, 시리즈 박스 · 시리즈 상세, 라이트/다크, 메타 · sitemap · RSS, 자동 배포
- MVP 제외: 댓글, 조회수, 좋아요, 회원가입 · 로그인, 관리자 페이지, 데이터베이스, 읽기 시간 표시(I-09)

## 2. 화면 목록 · 라우팅
| 화면 ID | 화면명 | 목적 | 우선순위 | URL | Astro 파일 [제안] |
|---|---|---|---|---|---|
| HOME-01 | 메인 홈 | 블로그 소개 및 최신 글 탐색 | 필수 | / | pages/index.astro |
| BLOG-01 | 전체 글 | 게시글 목록 및 탐색 | 필수 | /blog, /blog/page/2 | pages/blog/index.astro, blog/page/[page].astro |
| BLOG-02 | 글 상세 | 본문 읽기 및 관련 글 이동 | 필수 | /blog/[slug] | pages/blog/[...slug].astro |
| SEARCH-01 | 검색 | 제목·본문 기반 글 검색 | 필수 | /search | pages/search.astro |
| TAG-01 | 태그별 글 | 기술 주제별 글 탐색 | 필수 | /tags/[tag] | pages/tags/[tag].astro |
| SYS-01 | 404 | 잘못된 경로에서 복귀 | 필수 | (없는 경로) | pages/404.astro |
| SERIES-01 | 시리즈 목록 | 연재 묶음 둘러보기 | 2단계 | /series | pages/series/index.astro |
| SERIES-02 | 시리즈 상세 | 시리즈 설명과 글을 순서대로 보기 | 필수 | /series/[id] | pages/series/[id].astro |
| ABOUT-01 | 소개 | 개발자 소개 및 경력 | 2단계 | /about | pages/about.astro |
| PROJECT-01 | 프로젝트 | 프로젝트 및 기술 경험 소개 | 2단계 | /projects | pages/projects/ |

- 목록 2페이지부터 `/blog/page/2` [제안] (글 상세 `/blog/[...slug]`와 겹치지 않게)
- 태그 페이지 2페이지부터 `/tags/[tag]/page/2` [제안]
- 그 외: `/rss.xml`, sitemap은 빌드 시 자동 생성. 404 · draft는 sitemap 제외
- 시리즈 목록 `/series`는 2단계. 주소만 비워 둡니다 (I-19, I-23)

### URL 정책

- 글 주소는 `/blog/{slug}`로 고정. slug는 Markdown 파일명, 영문 kebab-case 권장 [제안]
- 태그 URL: 소문자 kebab-case (`Next.js` → `next-js`, `TanStack Query` → `tanstack-query`) (I-10). 한글 태그는 그대로 두는 안 [제안]
- 외부 링크는 새 탭 + `rel="noopener"`, 링크 옆 `arrow_outward` 아이콘

### 주요 이동 경로
- F1: HOME-01 최근 글 → BLOG-02
- F2: HOME-01 주제 칩 → TAG-01 → BLOG-02
- F3: HOME-01 글 둘러보기 · 전체 보기 · 모든 글 보기 → BLOG-01 → BLOG-02
- F4: Header 검색 → SEARCH-01 → BLOG-02
- F5: BLOG-02 태그 → TAG-01 · 이전/다음 글 → BLOG-02 · 전체 글 → BLOG-01
- F6: 잘못된 URL → SYS-01 → HOME-01 또는 BLOG-01
- F7: BLOG-02 시리즈 박스 → SERIES-02 → BLOG-02 (순서대로). 시리즈 진입은 글 상세에서만 (I-23 결정)

### 내비게이션

- 로고 `/` · 글 `/blog` (`/blog/**`, `/tags/**`에서 활성 [제안]) · 소개 `/about` (2단계, MVP 노출 여부 I-01) · 검색 `/search` · 테마 전환 버튼
- Footer: © 2026 im-wen3y.dev · GitHub ↗ · Velog ↗ (새 탭)
- 메뉴 이름은 모두 한국어

## 3. 공통 정책

### 레이아웃 · 브레이크포인트 (I-12 결정)

| 구간 | 폭 | 규칙 |
|---|---|---|
| Mobile | < 768 | 좌우 20px · Nav는 ☰ 메뉴 · 목차는 하단 버튼 + 바텀시트 |
| Tablet | 768 – 1199 | 좌우 40px · Nav 텍스트 노출 · 목차는 Mobile 방식 |
| Desktop | ≥ 1200 | 콘텐츠 최대 1184px · 상세 본문 720px + 간격 64 + 오른쪽 목차 220 |

모든 구간에서 페이지 가로 스크롤 없음. 코드 블록 안에서만 가로 스크롤 허용.

### 공통 영역

- Header (모든 화면): Desktop 로고 · 글 · 소개 · 검색 · 테마 / Mobile 로고 · ☰ · 테마. 높이 88 / 72, 하단 1px 구분선, 스크롤 고정 안 함 [제안]
- 모바일 메뉴: 열기/닫기 버튼, 항목 세로 나열, Esc와 바깥 영역으로 닫기 [제안]
- Footer (모든 화면): © 2026 · GitHub ↗ · Velog ↗. 모바일 노출 여부 I-16 (시안은 노출)

### 테마 (I-15 결정: 기획서 v0.1 팔레트)

- 첫 방문은 `prefers-color-scheme`를 따름 [제안]. 토글로 고르면 localStorage에 저장하고 유지
- `<html data-theme="light|dark">`로 전환. 그리기 전에 `<head>` 인라인 스크립트로 적용해 깜빡임 방지 [제안]
- 토글 버튼: `aria-label="테마 전환"`, 현재 상태는 `aria-pressed`
- 코드 하이라이팅 테마도 라이트/다크를 함께 바꿈 [제안]

### 타이포

- 본문 IBM Plex Sans KR · 로고만 Bungee · 코드 IBM Plex Mono · 아이콘 Material Symbols Outlined (모두 Google Fonts)
- 크기 단계는 `design-system/tokens.json`의 type 그룹

### SEO

- title: `글 제목 | im-wen3y.dev` [제안] · description: frontmatter description · canonical · Open Graph (title · description · url · type)
- sitemap 자동 생성, RSS `/rss.xml`, draft 글은 sitemap · RSS · 목록에서 제외. 404는 noindex [제안]

### 접근성

- 텍스트 대비 4.5:1 이상, 터치 영역 44px 이상
- `focus-visible` 표시, "본문으로 건너뛰기" 링크 [제안]
- 이미지 alt 필수, 아이콘 버튼 `aria-label`
- 바텀시트 · 메뉴는 열릴 때 포커스 이동, Esc로 닫기
- `prefers-reduced-motion`이면 스크롤 애니메이션 끔

### 공통 표기

- 날짜 `YYYY.MM.DD` (예: 2026.10.15)
- 메타 항목 사이 " · " (가운뎃점, 앞뒤 공백)
- 읽기 시간은 표시하지 않음 (I-09)

## 4. 콘텐츠 데이터 모델

글 1편 = `src/content/blog`의 Markdown/MDX 파일 1개. Content Collections 스키마(zod)로 빌드 시 검증.

**이름 규칙**: 콘텐츠 데이터(frontmatter · 시리즈 파일) 필드는 줄이지 않고 풀어 씁니다 (`publishedDate`). 화면에서만 쓰는 계산 값은 흔한 줄임말을 써도 됩니다 (`prev`, `next`).

### Frontmatter
| 필드 | 타입 | 필수 | 쓰임 · 규칙 |
|---|---|---|---|
| title | string | 필수 | 모든 목록 · 상세 제목, <title>, OG, RSS |
| description | string | 필수 | 목록 요약문, meta description, RSS. 1~2문장 |
| publishedDate | date | 필수 | 최신순 정렬, 이전/다음 글 기준, 날짜 표시 |
| updatedDate | date | 선택 | sitemap lastmod. 화면 표시는 하지 않음 [제안] |
| tags | string[] | 필수 | 1개 이상. 칩, TAG-01, 상세 상단 · 하단 태그 (I-08) |
| series | string | 선택 | 시리즈 id. src/content/series/{id}.json을 참조 (I-20 결정). 없는 id면 빌드 오류 |
| seriesOrder | number | series 있으면 필수 | 시리즈 안 순서 1, 2, 3 … 같은 시리즈에서 중복 불가 |
| draft | boolean | 선택 | 기본 false. true면 목록 · 상세 · 검색 · sitemap · RSS에서 제외 |

### 계산 값 (빌드 시 생성)

| 값 | 규칙 |
|---|---|
| slug | 파일 경로에서 생성 → /blog/{slug} |
| topic | 대표 주제 = tags[0]. 목록 메타에 1개만 표시 [제안] |
| headings | 본문 H2 · H3 → 목차. H2가 없으면 목차 숨김 |
| prev / next | publishedDate 순으로 앞뒤 글. 없으면 해당 링크 숨김 단, 시리즈 글은 seriesOrder 순 (I-22 결정) |
| seriesPosts | 같은 series 글을 seriesOrder 순으로. 위치 N/M · 시리즈 안 이전/다음 · draft 제외 |

### 시리즈 파일 (I-20 결정)

- 경로: `src/content/series/{id}.json`
- 필드: `title`, `description`
- 글은 frontmatter `series`(id)로 참조 (`reference('series')`). 없는 id면 빌드 오류

### 예시

```md
---
title: 버그 세 개를 각각 쫓다가, 뿌리가 하나였다
description: 서버와 클라이언트의 로그인 상태가 달라진 이유를 추적한 기록.
publishedDate: 2026-10-15
tags: [Next.js, React, TanStack Query]
series: login-state
seriesOrder: 2
draft: false
---
```

```json
// src/content/series/login-state.json
{ "title": "로그인 상태를 서버에서 다루기", "description": "서버에서 세션을 읽어 첫 화면부터 로그인 상태를 맞추기까지의 기록." }
```

### 설정 값

- 주요 주제 목록: 설정 파일의 고정 배열 [제안] (I-04)
- 목록 페이지당 글 수: 10
- 홈 최근 글 수: 5 (I-06)
- 본문 이미지: 글 파일 옆 폴더에 두고 Astro 이미지 최적화 사용 [제안]

## 5. 상태 · 예외
| 화면 · 요소 | 상태 | 조건 | 표시 · 동작 |
|---|---|---|---|
| HOME-01 | 글 없음 | 공개 글 0개 (초기) | 최근 글 영역에 “아직 공개된 글이 없습니다”. 주제 숨김 |
| HOME-01 | 글 5개 미만 | 공개 글 1~4개 | 있는 만큼만 표시, 빈 자리 채우지 않음 |
| BLOG-01 | 범위 밖 페이지 | /blog/page/n 에서 n이 마지막보다 큼 | 페이지가 생성되지 않으므로 SYS-01 |
| BLOG-01 | 한 페이지뿐 | 공개 글 10개 이하 | 페이지네이션 숨김 |
| SEARCH-01 | 입력 전 | 검색어 없음 | 안내 문구 “제목이나 본문의 단어로 검색해 보세요” + 주제 칩 [제안] |
| SEARCH-01 | 인덱스 로딩 | 첫 검색 시 인덱스 내려받는 중 | 결과 영역에 “검색 준비 중” 한 줄. 입력은 막지 않음 |
| SEARCH-01 | 결과 있음 | 1건 이상 | “‘검색어’ 검색 결과 N건” + 목록. aria-live로 건수 알림 |
| SEARCH-01 | 결과 없음 | 0건 | “‘검색어’에 맞는 글이 없습니다” + 다른 검색어 안내 + [전체 글 보기] |
| SEARCH-01 | 인덱스 실패 | 네트워크 오류 등 | “검색을 불러오지 못했습니다” + [다시 시도] + [전체 글 보기] |
| TAG-01 | 없는 태그 | 어떤 글에도 없는 태그 주소 | 페이지가 생성되지 않으므로 SYS-01 |
| BLOG-02 | 목차 없음 | 본문에 H2 없음 | 오른쪽 목차와 모바일 목차 버튼 숨김. 본문 폭 그대로 |
| BLOG-02 | 이전/다음 없음 | 가장 오래된 글 · 가장 최신 글 | 없는 쪽 링크 숨김 |
| BLOG-02 | 비공개 글 | draft: true | 페이지를 만들지 않음 → SYS-01 |
| BLOG-02 | 이미지 실패 | 이미지 파일 없음 | alt 텍스트 표시. 빌드 단계에서 경로 오류를 잡도록 Astro 이미지 사용 [제안] |
| CodeBlock | 복사 완료 / 실패 | 복사 버튼 클릭 | 버튼 문구 “복사” → “복사됨” 2초 후 복귀 / 실패 시 “복사 실패” |
| CopyLink | 공유 완료 / 실패 | URL 복사 클릭 | “링크를 복사했습니다” 안내 2초. 실패 시 “복사 실패” |
| TocSheet | 열림 / 닫힘 | 목차 버튼 · 항목 선택 · Esc · 바깥 영역 | 열리면 첫 항목에 포커스, 본문 스크롤 잠금. 닫히면 버튼으로 포커스 복귀 |
| ScrollTop | 숨김 / 노출 | 스크롤 위치가 화면 높이 1배 이상 [제안] | 오른쪽 아래 [↑]. 클릭 시 맨 위로 (reduced-motion이면 즉시 이동) |
| 공통 · 테마 | 시스템 / 라이트 / 다크 | 저장값 없음 · 사용자 선택 | 저장값 없으면 시스템 설정. 선택은 저장해 다음 방문에도 유지 |
| 공통 · JS 꺼짐 | 부분 동작 | 스크립트 비활성 | 본문 · 목록 · 링크는 정상. 검색 · 테마 토글 · 복사 · 바텀시트는 동작하지 않음 (목차는 링크 목록으로 노출) [제안] |
| SeriesBox | 시리즈 글 1편 | 공개된 시리즈 글이 1편뿐 | 박스 표시, “1/1”, 이전 · 다음 비활성, 목록 보기 가능 [제안] — I-24 |
| SeriesBox | draft 포함 | 시리즈 안 일부 글이 draft: true | 목록 · N/M · 이전/다음에서 제외. 번호는 공개 글 기준으로 다시 셈 |
| SeriesBox | 첫 편 · 마지막 편 | seriesOrder 처음 · 끝 | 없는 쪽 버튼 비활성 (DS 03) |
| PostNav · 시리즈 | 첫 편 · 마지막 편 | 시리즈 글의 본문 끝 | 없는 쪽 숨김. 시리즈 밖 글로 넘어가지 않음 [제안] (I-22) |
| 시리즈 데이터 | 없는 시리즈 id | series 값에 맞는 시리즈 파일 없음 | 빌드 오류 (reference 검증) — 배포 전에 잡힘 |
| 시리즈 데이터 | 순서 누락 · 중복 | seriesOrder 없음 또는 같은 시리즈에서 겹침 | 빌드 오류로 처리 [제안]. 스키마 refine 또는 빌드 스크립트 검사 |
| SERIES-02 | 공개 글 없음 | 시리즈 파일은 있지만 공개 글 0편 | 페이지를 만들지 않음 → SYS-01 |

## 6. 개발 작업 분해

작업 1개 = 이슈 · PR 1개 크기. 마일스톤 순서대로 진행합니다.

- **M1 읽을 수 있는 블로그가 배포된다**: Markdown 추가 → 자동 배포, 홈 · 목록 · 상세가 라이트 테마로 동작. 샘플 글 2~3편 (FE-01 ~ 08 · 10 · 12 ~ 18)
- **M2 찾기 쉽고 읽기 편하다**: 태그 · 검색 · 시리즈 · 다크 모드 · 목차 · 모바일 읽기 보조 기능 (FE-09 · 11 · 19 ~ 25 · 31 · 32 · 34)
- **M3 검색엔진에 노출되고 마감된다**: 404 · 메타 · sitemap · RSS · 완료 기준 점검 (FE-26 ~ 30)

| ID | 에픽 | 작업 | 산출물 | 화면 | 선행 | 우선 | 단계 | 관련 결정 |
|---|---|---|---|---|---|---|---|---|
| FE-01 | 셋업 | Astro 프로젝트 생성, TypeScript, 폴더 구조 | astro.config.mjs, src/ 구조 | 공통 | — | P0 | M1 | — |
| FE-02 | 셋업 | Vercel 프로젝트 연결 · im-wen3y.dev 도메인 연결 (push 시 자동 배포) | Vercel 설정 · astro.config.mjs site | 공통 | FE-01 | P0 | M1 | — |
| FE-03 | 셋업 | 디자인 토큰 CSS 변수(라이트 · 다크), 폰트 로딩, 기본 타이포 | src/styles/global.css | 공통 | FE-01 | P0 | M1 | I-15 |
| FE-04 | 콘텐츠 | Content Collection 스키마 (04 필드) | content config (zod) | 공통 | FE-01 | P0 | M1 | — |
| FE-05 | 콘텐츠 | 샘플 글 2~3편 작성 · 이전 | src/content/blog/*.md | 공통 | FE-04 | P0 | M1 | — |
| FE-06 | 콘텐츠 | 콘텐츠 유틸: 정렬 · draft 제외 · 날짜 포맷 · 이전/다음 · 태그 집계와 slug | src/lib/posts.ts | 공통 | FE-04 | P0 | M1 | — |
| FE-07 | 레이아웃 | BaseLayout: head · SEO 슬롯 · 본문 건너뛰기 링크 | layouts/BaseLayout.astro | 공통 | FE-03 | P0 | M1 | — |
| FE-08 | 레이아웃 | Header + Nav 활성 규칙 | components/Header.astro | 공통 | FE-07 | P0 | M1 | I-01 |
| FE-09 | 레이아웃 | 모바일 메뉴 (☰) 열기/닫기 · 포커스 관리 | components/MobileMenu | 공통 | FE-08 | P1 | M2 | — |
| FE-10 | 레이아웃 | Footer | components/Footer.astro | 공통 | FE-07 | P0 | M1 | I-16 |
| FE-11 | 레이아웃 | ThemeToggle + 깜빡임 방지 스크립트 + 선택 저장 | components/ThemeToggle.tsx | 공통 | FE-03 · FE-08 | P0 | M2 | — |
| FE-12 | 컴포넌트 | PostCard(홈 카드형) · PostListItem(목록형) | components/PostCard.astro 외 | HOME · BLOG · TAG · SEARCH | FE-06 | P0 | M1 | I-05 |
| FE-13 | 컴포넌트 | TopicChip · Tag · Button · TextLink | components/* | 전체 | FE-03 | P0 | M1 | — |
| FE-14 | 컴포넌트 | Pagination | components/Pagination.astro | BLOG-01 · TAG-01 | FE-03 | P0 | M1 | — |
| FE-15 | 페이지 | HOME-01 메인 홈 | pages/index.astro | HOME-01 | FE-12 · FE-13 | P0 | M1 | I-04 · I-06 · I-07 |
| FE-16 | 페이지 | BLOG-01 목록 + 페이지 분할(10개) | pages/blog/index.astro, blog/page/[page].astro | BLOG-01 | FE-12 · FE-14 | P0 | M1 | I-03 |
| FE-17 | 페이지 | BLOG-02 상세 + PostLayout (헤더 · 본문 타이포 · 태그 · 이전/다음) | pages/blog/[...slug].astro, layouts/PostLayout.astro | BLOG-02 | FE-06 · FE-07 | P0 | M1 | I-08 |
| FE-18 | 상세 기능 | 코드 블록: 하이라이팅 · 언어 표시 · 복사 · 가로 스크롤 | Shiki 설정, components/CodeCopy | BLOG-02 | FE-17 | P0 | M1 | — |
| FE-19 | 상세 기능 | 목차: H2 · H3 생성 + 스크롤 위치 활성 (Desktop) | components/Toc | BLOG-02 | FE-17 | P0 | M2 | — |
| FE-20 | 상세 기능 | 모바일 목차 버튼 + 바텀시트 | components/TocSheet | BLOG-02 | FE-19 | P1 | M2 | I-13 |
| FE-21 | 상세 기능 | 맨 위로 버튼 | components/ScrollTop | BLOG-02 | FE-17 | P1 | M2 | — |
| FE-22 | 상세 기능 | 공유: 현재 글 URL 복사 | components/CopyLink | BLOG-02 | FE-17 | P1 | M2 | — |
| FE-23 | 상세 기능 | 본문 이미지: 폭 맞춤 · 클릭 확대 | Prose 스타일, 확대 컴포넌트 | BLOG-02 | FE-17 | P1 | M2 | I-14 |
| FE-24 | 탐색 | TAG-01 태그별 글 (+ 페이지 분할) | pages/tags/[tag].astro | TAG-01 | FE-12 · FE-14 | P0 | M2 | I-03 · I-10 |
| FE-25 | 탐색 | SEARCH-01 검색 인덱스 + 검색 UI + 결과 없음 안내 | pages/search.astro, 검색 인덱스 | SEARCH-01 · BLOG-01 | FE-12 | P0 | M2 | I-02 |
| FE-26 | 마감 | SYS-01 404 | pages/404.astro | SYS-01 | FE-07 | P0 | M3 | — |
| FE-27 | SEO | title · description · canonical · Open Graph | BaseLayout head | 전체 | FE-07 | P0 | M3 | — |
| FE-28 | SEO | sitemap 자동 생성 (draft · 404 제외) | @astrojs/sitemap | 전체 | FE-02 | P0 | M3 | — |
| FE-29 | SEO | RSS 피드 | pages/rss.xml.js | 전체 | FE-06 | P1 | M3 | — |
| FE-31 | 시리즈 | 시리즈 컬렉션 + 유틸: 순서 정렬 · 위치 N/M · 시리즈 안 이전/다음 | src/content/series/*.json, src/lib/series.ts | 공통 | FE-04 | P0 | M2 | — |
| FE-32 | 시리즈 | SeriesBox: 접기/펼치기 · 목록 · 이전/다음 (DS 03) | components/SeriesBox.astro | BLOG-02 | FE-31 · FE-17 | P0 | M2 | I-21 · I-22 |
| FE-33 | 시리즈 | SERIES-01 시리즈 목록 (2단계 · MVP 제외) | pages/series/index.astro | SERIES-01 | FE-31 | — | 2단계 | — |
| FE-34 | 시리즈 | SERIES-02 시리즈 상세 (설명 + 순서대로 글 목록) | pages/series/[id].astro | SERIES-02 | FE-31 · FE-12 | P0 | M2 | — |
| FE-30 | QA | 완료 기준 점검: 반응형 · 가로 스크롤 · 다크 모드 · 키보드 · 대비 | 07 체크리스트 | 전체 | 전체 | P0 | M3 | — |

## 7. 1차 개발 완료 기준

| 기준 | 화면 | 작업 | 확인 방법 |
|---|---|---|---|
| 홈에서 최신 글과 주요 태그를 확인할 수 있다. | HOME-01 | FE-15 | 샘플 글 기준 최신순 노출, 칩 클릭 시 TAG-01 이동 |
| 글 목록에서 태그별 탐색과 검색이 가능하다. | BLOG-01 TAG-01 SEARCH-01 | FE-16 24 25 | 태그 선택 · 검색 결과 · 결과 없음 안내 확인 |
| 글 상세에서 코드 · 이미지 · 목차가 정상적으로 표시된다. | BLOG-02 | FE-17 ~ 23 | 코드 · 이미지 · H2/H3가 모두 들어간 점검용 글로 확인 |
| 모바일에서 가로 스크롤 없이 본문을 읽을 수 있다. 코드 블록은 내부 스크롤 허용. | 전체 | FE-30 | 360 · 390px 폭에서 페이지 가로 스크롤 없음 |
| 라이트 · 다크 테마를 전환하고 선택을 유지할 수 있다. | 전체 | FE-11 | 전환 → 새로고침 · 다른 페이지 이동 후 유지, 깜빡임 없음 |
| Markdown 파일을 추가해 push하면 Vercel로 자동 배포된다. | — | FE-02 05 | 새 글 push 후 사람 손 없이 im-wen3y.dev에 반영 |
| 시리즈 글을 순서대로 읽고, 시리즈 상세에서 전체 글을 볼 수 있다. | BLOG-02 SERIES-02 | FE-31 32 34 | 3편 이상 샘플 시리즈로 순서 · N/M · 이전/다음 · 접기/펼치기 확인 |
| 검색엔진이 게시글을 수집할 수 있도록 메타데이터와 사이트맵을 제공한다. | 전체 | FE-27 28 29 | 페이지 소스의 meta · OG 확인, sitemap에 모든 공개 글 포함 |

## 8. 결정 사항

### 결정됨

| ID | 항목 | 결정 내용 | 영향 작업 |
|---|---|---|---|
| I-01 | 소개 메뉴 노출 | MVP에서는 숨김. 소개 페이지를 구현할 때 추가 | FE-08 |
| I-16 | 모바일 Footer | 데스크톱·모바일 모두 이 블로그 저장소 GitHub와 Velog 링크 표시. Velog 글 이전 완료 후 Velog 링크 제거 | FE-10 |
| I-09 | 읽기 시간 | 표시하지 않음. 기준(분당 글자 수 · 코드 포함 여부)이 서비스마다 달라 숫자가 대략값이라 뺌. 시안 · 컴포넌트 · 데이터 모델(readingTime)에서 제거 | FE-06 |
| I-10 | 태그 URL 규칙 | 소문자 kebab-case: Next.js → next-js, TanStack Query → tanstack-query. 한글 태그(회고 등) 처리는 아직 안 정함 — 그대로 두는 안 [제안] | FE-06 24 |
| I-11 | 도메인 · 배포 | 커스텀 도메인 im-wen3y.dev 사용. 배포는 GitHub Pages 대신 Vercel (웬디가 직접 연결). astro.config의 site를 https://im-wen3y.dev로 | FE-02 28 |
| I-12 | 브레이크포인트 | 03의 구간 그대로 확정: Mobile < 768 · Tablet 768 ~ 1199 · Desktop ≥ 1200 | FE-03 |
| I-15 | 색 토큰 기준 | 기획서 v0.1 팔레트(라이트 · 다크)로 통일. DS 01 · 02 보드와 디자인 시스템에 반영. 크기 · 간격 · 모서리 · 코드 글꼴은 기존 값 유지 | FE-03 |
| I-18 | 추가 시안 | 모두 그림 (시안 줄 오른쪽): 시리즈 글 상세 · SERIES-02 · TAG-01 · SEARCH-01(결과 없음 포함) · SYS-01 · 모바일 메뉴 열림 · 목차 바텀시트 · 다크 모드(HOME-01 D·M, 시리즈 글 상세 D). 다른 화면 다크는 같은 토큰 치환 | FE-09 20 24 25 26 |
| I-23 | 시리즈 진입 경로 | 글 상세 시리즈 박스에서만 진입 (글 하나하나가 단독 글이기도 해서 메뉴 · 탭은 두지 않음). 박스의 시리즈 이름 → SERIES-02. 시리즈 목록 페이지는 MVP에서 뺌 (2단계, /series 주소만 비워 둠) | FE-32 34 |
| I-19 | 시리즈 기능 범위 | 이름은 “시리즈”. MVP 범위는 시리즈 박스 + 시리즈 상세(SERIES-02, /series/[id]). 시리즈 목록(SERIES-01, /series)은 2단계 | FE-31 32 34 |
| I-20 | 시리즈 데이터 | 시리즈 파일을 따로 둠: src/content/series/{id}.json에 title · description, 글 frontmatter는 series(id) · seriesOrder로 참조 (reference). 이름 · 설명을 한 곳에서 관리하고 SERIES-02에 설명 표시 | FE-04 31 |
| I-21 | 시리즈 박스 기본 상태 | 글마다 접힌 상태로 시작. 펼침 여부는 저장하지 않음 | FE-32 |
| I-22 | 시리즈 글의 이전 · 다음 | 시리즈 글은 본문 끝 PostNav도 시리즈 순서(seriesOrder)로 이전 · 다음 편을 보여 줌 (벨로그 v2 방식). 시리즈가 아닌 글은 publishedDate 순 | FE-17 31 |

### 아직 정하지 않음

해당 작업을 시작할 때 웬디에게 확인합니다. 시안은 적힌 "시안 가정"대로 그려져 있습니다.

| ID | 항목 | 내용 · 선택지 | 영향 작업 |
|---|---|---|---|
| I-02 | 검색 진입 방식 | BLOG-01 검색창과 SEARCH-01이 모두 있음. ① 검색창 입력 시 SEARCH-01로 이동 ② BLOG-01 안에서 결과 표시, SEARCH-01은 Header용 | FE-16 25 |
| I-03 | 태그 칩 동작 | BLOG-01 칩 선택 시 ① TAG-01 페이지 이동 [제안: 정적 사이트에 단순] ② 같은 화면에서 목록 필터 | FE-16 24 |
| I-04 | 주제 목록 | HOME은 TypeScript 포함 5개, BLOG-01 와이어프레임은 TypeScript 제외. 고정 목록 / 글 태그에서 자동 생성 중 선택 | FE-15 16 |
| I-05 | 글 메타 표기 | 읽기 시간은 빼기로 함 (I-09). 남은 것: HOME “주제 · 날짜”와 BLOG-01 “날짜 · 주제” 순서를 맞출지. BLOG-02는 “날짜”만 | FE-12 |
| I-06 | 홈 최근 글 수 | 구성표 5개, 와이어프레임 2개. 시안은 5개로 그림 | FE-15 |
| I-07 | 홈 이동 버튼 중복 | “글 둘러보기 →” · “전체 보기 →” · “모든 글 보기 →” 모두 BLOG-01. 모두 유지 또는 정리 | FE-15 |
| I-08 | 상세 태그 표기 | 상단 “Next.js · React · TanStack Query”와 하단 칩 개수를 맞출지. 시안은 둘 다 전체 태그로 그림 | FE-17 |
| I-13 | 모바일 목차 버튼 노출 | 하단 바 항상 노출 / 작은 플로팅 버튼 / 스크롤 방향에 따라 숨김 | FE-20 |
| I-14 | 이미지 확대 범위 | 새 탭 원본 열기 / 화면 위 확대 보기(라이트박스) | FE-23 |
| I-17 | 공유 버튼 위치 | 메타 줄 옆 / 본문 끝 / 이전·다음 위 중 선택 | FE-22 |
| I-24 | 시리즈 글 1편일 때 | 공개된 시리즈 글이 1편뿐이면 ① 박스 표시 “1/1” (연재 시작을 알림) [제안] ② 2편이 될 때까지 박스 숨김 | FE-32 |
