/**
 * 지도 검색바 + 홈→지도 search-morph transition이 공유하는 레이아웃 상수.
 * 한 곳만 바꾸면 양쪽이 따라옴.
 */

import type { Rect } from '@features/search-transition/model/store';

/** 컨테이너 좌우 패딩 (Map 화면 paddingHorizontal) */
export const SEARCH_BAR_PADDING_X = 16;

/** 컨테이너 상단 패딩 (insets.top 위 추가분) */
export const SEARCH_BAR_PADDING_TOP = 12;

/** 검색바 자체의 높이 */
export const SEARCH_BAR_HEIGHT = 44;

/** 바 내부 좌우 패딩 (rounded pill 안쪽) */
export const SEARCH_BAR_INNER_PX = 16;

/** 검색 아이콘 크기 */
export const SEARCH_BAR_ICON_SIZE = 14;

/** 아이콘과 placeholder 텍스트 사이 간격 (gap-2 = 8) */
export const SEARCH_BAR_ICON_GAP = 8;

/** placeholder 텍스트 left 좌표 (바 내부 기준). 아이콘 끝 + gap */
export const SEARCH_BAR_TEXT_LEFT =
  SEARCH_BAR_INNER_PX + SEARCH_BAR_ICON_SIZE + SEARCH_BAR_ICON_GAP;

/** 홈 검색 버튼 (작은 원형) 크기 */
export const HOME_SEARCH_BTN_SIZE = 36;

/**
 * 지도 화면 검색바의 실제 화면 좌표.
 * search transition의 target rect로도 사용됨.
 */
export function getSearchBarRect(insetsTop: number, screenWidth: number): Rect {
  return {
    x: SEARCH_BAR_PADDING_X,
    y: insetsTop + SEARCH_BAR_PADDING_TOP,
    width: screenWidth - SEARCH_BAR_PADDING_X * 2,
    height: SEARCH_BAR_HEIGHT,
  };
}
