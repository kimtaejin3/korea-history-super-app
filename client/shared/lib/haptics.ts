import * as Haptics from 'expo-haptics';

/**
 * 햅틱 헬퍼. 의도 기반 네이밍으로 호출부에서 강도/유형 의식 없이 사용.
 * - 모든 함수는 fire-and-forget (await 불필요)
 * - 웹/시뮬레이터에선 자동 no-op (expo-haptics 자체가 처리)
 * - 추후 사용자 설정으로 끄고 싶으면 여기 한 곳만 손대면 됨
 */
export const haptic = {
  /** 가벼운 탭 — 일반 버튼, 검색, 토글 */
  tap: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
  /** 중간 탭 — 선택 확정, 의미 있는 액션 */
  press: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium),
  /** 강한 탭 — 스탬프 획득 같은 중요한 순간 */
  heavy: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy),
  /** 선택 변경 — 필터, 슬라이더 눈금, 탭 전환 */
  select: () => Haptics.selectionAsync(),
  /** 성공 알림 — 체크인 성공, 정답 */
  success: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success),
  /** 경고 알림 — 오답, 주의 필요 */
  warning: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning),
  /** 에러 알림 — 위치 확인 실패, 네트워크 에러 */
  error: () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error),
};
