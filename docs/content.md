# 콘텐츠 작성 규칙

글은 `src/content/blog/{slug}.md`, 시리즈 정보는 `src/content/series/{id}.json`에 둡니다.
기존 Jekyll 글은 아직 이전하지 않았습니다.

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
