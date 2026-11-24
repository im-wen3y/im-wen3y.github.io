# Header

모든 화면 상단의 공통 영역입니다.

- 높이 `layout-header` 88 (Mobile `layout-header-mobile` 72) · 하단 1px `border-default` · 스크롤 고정 안 함 [제안].
- 로고: `logo` 스타일 (Bungee 26, Mobile 21) · `text-primary` · 홈 링크. Bungee는 로고에만 씁니다.
- 메뉴 “글 · 소개 · 검색” 16 · 간격 40 · 현재 메뉴는 `aria-current` + 700 `text-primary`, 나머지 500 `text-secondary`. 홈에서는 활성 메뉴 없음.
- 소개 메뉴 노출 여부는 I-01 (ABOUT-01은 2단계).
- Mobile: 로고 · ☰(`menu`) · 테마. 메뉴 열림 상태 시안은 I-18.
