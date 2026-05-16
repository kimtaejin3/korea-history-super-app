export const TOKENS = {
  paper: '#FBFBF9',
  paperWarm: '#F3F2EE',
  ink: '#141413',
  inkSoft: '#36363A',
  mute: '#86858A',
  line: 'rgba(20,20,22,0.08)',
  lineSoft: 'rgba(20,20,22,0.04)',
  red: '#C8442A',
  redDark: '#9C2F1B',
  green: '#4F6B5C',
  greenDark: '#3D5249',
  brown: '#7A6450',
  navy: '#1F3A52',
} as const;

/**
 * 폰트 토큰. 전부 Pretendard 단독. 과거 serif/sans 구분은 weight로만 표현.
 * - "serif" 계열 키는 기존 화면들 호환 위해 유지하되 모두 Pretendard로 매핑.
 */
export const FONTS = {
  serif: 'Pretendard-Bold',
  serifRegular: 'Pretendard-Regular',
  serifBlack: 'Pretendard-ExtraBold',
  sans: 'Pretendard-Medium',
  sansBold: 'Pretendard-SemiBold',
  mono: 'JetBrainsMono_400Regular',
  monoBold: 'JetBrainsMono_700Bold',
} as const;
