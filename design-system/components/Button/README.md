# Button

화면의 주 행동 하나에 쓰는 버튼입니다. Primary는 한 화면에 한 번만 (홈 Hero의 “글 둘러보기”).

- 종류: `w-btn--primary` (accent-primary 채움, text-on-accent 글자) · `w-btn--secondary` (테두리, 홈 목록 아래 “모든 글 보기”) · `w-btn--small` (공유 “링크 복사”, Mobile은 아이콘만 44×44 + aria-label).
- 크기: 높이 52 (Mobile 48) · 좌우 28 · `radius-sm` · 16/700 · 아이콘 21 · 간격 `space-2`.
- 상태: hover는 `accent-hover`, focus-visible은 `focus-ring` 2px · offset 3px, disabled는 `border-default` 채움 + `text-secondary`. 셋 다 [제안] (기획서 · 시안에 없음).
- 이동이면 `<a href>`, 동작이면 `<button type="button">`. 화살표 아이콘은 Material Symbols `arrow_forward`, `aria-hidden`.
- 문구: 동사로 끝나는 짧은 한국어 (“글 둘러보기”, “링크 복사”). 영어 · 이모지 쓰지 않음.
