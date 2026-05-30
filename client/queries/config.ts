/**
 * React Query staleTime / gcTime 상수.
 *
 * 카테고리:
 * - SHORT   : 자주 바뀜 (사용자 활동 직후 영향, 랭킹 등)
 * - MEDIUM  : 보통 (장소·테마 상세)
 * - LONG    : 거의 변경 없음 (등급 메타, 정적 카테고리)
 * - INFINITE: 런타임 중 변경 없음 (배포 시점에만 바뀜)
 */

export const STALE = {
  SHORT: 30 * 1000, // 30초
  MEDIUM: 5 * 60 * 1000, // 5분
  LONG: 30 * 60 * 1000, // 30분
  INFINITE: Infinity,
} as const;

export const GC = {
  SHORT: 5 * 60 * 1000, // 5분
  MEDIUM: 30 * 60 * 1000, // 30분
  LONG: 24 * 60 * 60 * 1000, // 24시간
} as const;
