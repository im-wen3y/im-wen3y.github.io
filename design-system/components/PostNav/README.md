# PostNav

글 상세 끝의 이전 · 다음 글 링크입니다.

- 두 칸 · 간격 `space-6` (Mobile 한 칸, `space-3`) · 안쪽 20 (Mobile `space-4`) · `radius-md` · 1px `border-default`.
- 라벨 “이전 글 / 다음 글” 14/700 `accent-primary` + 화살표 18 · 제목 16/700 `text-primary`.
- 없는 쪽은 숨깁니다. 다음 글 칸은 오른쪽 정렬.
- 기준: 보통 글은 `publishedDate` 순. 시리즈 글은 시리즈 순서(`seriesOrder`)로 이전 · 다음 편을 보여 주고, 첫 편 · 마지막 편에서는 시리즈 밖 글로 넘어가지 않습니다 (I-22).
