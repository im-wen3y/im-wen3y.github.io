# 콘텐츠 작성 규칙

글은 `src/content/blog/{slug}.md`, 시리즈 정보는 `src/content/series/{id}.json`에 둡니다.
기존 Jekyll 글 중 `mutating-state`, `state-queue`, `approving-review` 3편을 복사했습니다.
원문은 `_posts/`에 보존하며, 복사본에서는 Jekyll의 `layout` · `date`와 전용 파일명 스타일 표기를 새 형식에 맞췄습니다.

```md
---
title: 글 제목
description: 글을 소개하는 한두 문장.
publishedDate: 2026-11-25
tags: [React, TypeScript]
draft: true
---

본문을 작성합니다.
```

- `title`, `description`, 태그는 공백만 있는 값을 허용하지 않습니다.
- `publishedDate`는 필수이며 `updatedDate`는 선택입니다.
- `tags`는 1개 이상 필요합니다. `draft`의 기본값은 `false`입니다.
- 시리즈 글에는 `series`와 양의 정수 `seriesOrder`를 함께 입력합니다.
- 같은 시리즈에서 `seriesOrder`가 겹치거나 시리즈 JSON이 없으면 빌드가 실패합니다. draft도 검사합니다.
- 시리즈 JSON은 `title`, `description`을 갖습니다.
- MDX는 통합 설정을 추가하는 후속 작업 이후 지원합니다. 현재 로더는 Markdown만 읽습니다.

검증 명령은 `pnpm build`입니다. draft의 목록·페이지·검색 제외는 후속 콘텐츠 조회 및 페이지 작업에서 연결합니다.

## 조회 유틸 (FE-06)

`src/lib/posts.ts`의 `getPublishedPosts()`는 draft를 제외한 최신순 목록을 반환합니다.
페이지는 이 함수를 통해 공개 글을 가져옵니다. 글 링크는 `postHref`, 날짜 표시는 `formatDate`를 사용합니다.
`getTags`는 공개 글의 태그별 글 수를 집계하고 `getPostsByTag`는 태그 slug로 글을 조회합니다.
`getPostNavigation`은 일반 글에서 날짜순, 시리즈 글에서 공개된 시리즈 순서를 따릅니다.

- [제안] 같은 발행 시각이면 파일 id 오름차순으로 정렬해 빌드마다 순서를 유지합니다.
- [제안] I-10의 한글 태그는 원문을 보존합니다. URL로 만들 수 없거나 서로 충돌하는 태그는 오류로 알립니다.
- [제안] 날짜는 배포 서버 시간대와 무관하게 한국 시간으로 표시합니다.

유틸 검증: `node --test tests/posts.test.ts`.
