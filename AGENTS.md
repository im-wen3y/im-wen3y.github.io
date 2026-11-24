# AGENTS.md — im-wen3y.dev 블로그 작업 안내

이 저장소에서 작업하는 코딩 에이전트(Codex 등)를 위한 안내입니다. 작업을 시작하기 전에 이 파일과 아래 "기준 문서"를 먼저 읽습니다.

## 프로젝트

- 프론트엔드 개발 과정의 문제와 해결 과정을 기록하는 개인 기술 블로그 `im-wen3y.dev`
- 새 스택: Astro · Markdown/MDX · Content Collections(zod) · Vercel 배포
- 디자인 키워드: Minimal · Editorial · Readable · Calm

## 저장소의 현재 상태 (중요)

- 지금 이 저장소는 **기존 Jekyll 블로그**입니다 (`_config.yml`, `_layouts/`, `_posts/`, `assets/style.css`, `DESIGN.md`).
- 루트의 `DESIGN.md`는 **기존 Jekyll 디자인(macOS Big Sur 스타일)** 문서입니다. 새 블로그의 디자인 기준이 아닙니다.
- 새 블로그 기준은 `design-system/`과 `docs/spec.md`입니다.
- Astro로 옮기는 방식(이 저장소에서 전환할지, 새 저장소를 만들지, 기존 `_posts` 글을 옮길지)은 **웬디에게 먼저 확인**합니다. 확인 전에는 Jekyll 파일을 지우거나 옮기지 않습니다.

## 기준 문서

| 파일 | 내용 |
|---|---|
| `docs/spec.md` | 화면 기획서 v0.1 요약: 화면 목록 · 라우팅 · 공통 정책 · 데이터 모델 · 상태 · 작업 분해(FE-01~34) · 완료 기준 · 결정 사항 |
| `design-system/README.md` | 디자인 시스템 사용 규칙 (문구 · 색 · 테마 · 글꼴 · 간격 · 아이콘) |
| `design-system/tokens.json` · `tokens.css` | 색(라이트 · 다크) · 글자 · 간격 · 모서리 · 레이아웃 토큰 |
| `design-system/components/*/README.md` | 컴포넌트 규격 |
| `design-system/components/*/preview.html` | 컴포넌트 HTML 구조 예시 |

문서끼리 다르면 `docs/spec.md`의 "결정 사항 · 결정됨"이 우선입니다. 그래도 애매하면 추측하지 말고 물어봅니다.

## 작업 방식

- 작업은 `docs/spec.md` 6장의 **FE-xx 단위**로 합니다. 작업 1개 = 커밋(또는 PR) 1개 크기.
- 순서는 마일스톤 M1 → M2 → M3, 같은 마일스톤 안에서는 "선행" 열을 따릅니다.
- 작업에 "관련 결정"(I-xx)이 걸려 있고 그 항목이 "아직 정하지 않음"이면, 시작 전에 웬디에게 묻습니다. 기다릴 수 없으면 [제안]으로 적힌 안으로 구현하고 커밋 메시지와 보고에 그렇게 했다고 적습니다.
- 작업을 끝내면 7장 "완료 기준" 중 해당 항목을 어떻게 확인했는지 보고합니다.
- 2단계 항목(소개 · 프로젝트 · 시리즈 목록 `/series` 등)은 만들지 않습니다.

## 디자인 규칙

- 색 · 간격 · 모서리 · 글꼴은 **토큰 변수만** 씁니다 (`var(--accent-primary)` 등). 컴포넌트에 hex 값을 직접 쓰지 않습니다.
- 테마는 `<html data-theme="light|dark">`로 바꿉니다. 모든 색 토큰이 두 값을 가집니다.
- 포인트 색 `accent-primary` 위 글자는 `text-on-accent`를 씁니다 (흰색 직접 지정 금지).
- 면 구분은 1px `border-default`와 `bg-surface`로만 합니다. 그림자는 맨 위로 버튼의 `shadow-float` 하나뿐입니다.
- 글꼴: 본문 · UI는 IBM Plex Sans KR, 코드는 IBM Plex Mono, **Bungee는 로고 "im-wen3y.dev"에만** 씁니다 (`font-synthesis: none`).
- 아이콘: Material Symbols Outlined. 아이콘에는 `aria-hidden="true"`, 아이콘만 있는 버튼에는 `aria-label`.
- 브레이크포인트: Mobile < 768 · Tablet 768 ~ 1199 · Desktop ≥ 1200. 페이지 가로 스크롤 없음 (코드 블록 안만 허용).
- 컴포넌트 클래스 이름(`w-btn` 등)은 구조 참고용입니다. Astro 컴포넌트의 클래스 방식(스코프 스타일 등)은 바꿔도 되지만 크기 · 간격 · 토큰은 README대로 맞춥니다.

## 문구 규칙

- 화면 문구는 모두 한국어로 씁니다. 영어는 기술 이름(Next.js, React 등)과 서비스 이름(GitHub, Velog)만.
- 이모지와 느낌표를 쓰지 않습니다.
- 날짜는 `YYYY.MM.DD`, 메타 항목 사이는 " · ".
- **읽기 시간("N분 읽기")은 표시하지 않습니다.**

## 코드 · 데이터 규칙

- 콘텐츠 데이터(frontmatter · 시리즈 파일) 필드 이름은 줄이지 않고 풀어 씁니다: `publishedDate`, `updatedDate`, `seriesOrder`. (`pubDate` 쓰지 않음)
- 화면에서만 쓰는 계산 값은 흔한 줄임말을 써도 됩니다: `prev`, `next`.
- 태그 slug는 소문자 kebab-case: `Next.js` → `next-js`, `TanStack Query` → `tanstack-query`.
- 시리즈: `src/content/series/{id}.json`(title · description) + 글 frontmatter `series`(reference) · `seriesOrder`. 시리즈 글의 본문 끝 이전 · 다음은 시리즈 순서를 따릅니다.
- draft 글은 목록 · 상세 · 검색 · 시리즈 · sitemap · RSS에서 모두 제외합니다.
- 다음 사람이 편하게 유지보수할 수 있는 코드를 우선합니다. 필요 없는 추상화와 라이브러리를 늘리지 않습니다.

## 하지 말 것

- 웬디 확인 없이 기존 Jekyll 파일 · 글 삭제나 이동
- 결정되지 않은 I-xx 항목을 혼자 정하고 보고하지 않기
- 시안 · 기획서에 없는 기능 추가 (필요해 보이면 제안만)
