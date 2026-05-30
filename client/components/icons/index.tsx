/**
 * 프로젝트 전체에서 쓰는 인라인 SVG 아이콘들을 한 곳에 모아둔 것.
 * 새로 인라인 SVG를 박지 말고 여기에 추가해서 import해서 쓰세요.
 *
 * 모든 아이콘은 22×22 viewBox 기준 — width/height만 바꾸면 비례 스케일.
 */

import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { TOKENS } from '../../lib/tokens';

type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** 돋보기 검색 아이콘 */
export function SearchIcon({ size = 16, color = TOKENS.ink, strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="10" cy="10" r="6" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M15 15l4 4" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/** 위치 핀 (속이 빈 핀) */
export function PinIcon({ size = 14, color = TOKENS.red, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Circle cx="11" cy="8" r="2" fill={color} />
    </Svg>
  );
}

/** 위치 핀 (속에 동그라미 윤곽) */
export function PinIconOutline({ size = 13, color = TOKENS.mute, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </Svg>
  );
}

/** 위치 핀 (속이 채워진 큰 원 — 체크인 GPS 마커) */
export function PinIconFilled({ size = 20, color = TOKENS.paper, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
        stroke={color}
        strokeWidth={strokeWidth}
      />
      <Circle cx="11" cy="8" r="2" fill={color} />
    </Svg>
  );
}

/** 뒤로가기 (왼쪽 화살표) */
export function BackIcon({ size = 16, color = TOKENS.ink, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M14 4l-7 7 7 7"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 닫기 (X) */
export function CloseIcon({ size = 20, color = TOKENS.ink, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M5 5l12 12M17 5L5 17"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** 체크 (성공/완료) */
export function CheckIcon({ size = 32, color = TOKENS.paper, strokeWidth = 2.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Path
        d="M7 16l6 6 12-12"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 더하기 (+) */
export function PlusIcon({ size = 14, color = TOKENS.paper, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path d="M11 4v14M4 11h14" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/** 자물쇠 (잠금 권한) */
export function LockIcon({ size = 14, color = TOKENS.mute, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Rect x="5" y="10" width="12" height="9" rx="1" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 10V7a3 3 0 016 0v3" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

/** 오른쪽 화살표 (긴 형태, "전체 등급 보기" 같은 라벨 옆) */
export function ArrowRightIcon({
  size = 10,
  color = 'rgba(255,255,255,0.7)',
  strokeWidth = 1.8,
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M5 11h12M12 6l5 5-5 5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 셰브론 오른쪽 (리스트 아이템 끝의 작은 > 표시) */
export function ChevronRightIcon({ size = 8, color = TOKENS.mute, strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={(size * 14) / 8} viewBox="0 0 8 14" fill="none">
      <Path
        d="M1 1l6 6-6 6"
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** 설정 톱니바퀴 */
export function SettingsIcon({ size = 16, color = TOKENS.ink, strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="3" stroke={color} strokeWidth={strokeWidth} />
      <Path
        d="M11 2v3M11 17v3M2 11h3M17 11h3M4.5 4.5l2 2M15.5 15.5l2 2M4.5 17.5l2-2M15.5 6.5l2-2"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </Svg>
  );
}

/** 공유 (위쪽 화살표 + 상자) */
export function ShareIcon({ size = 16, color = TOKENS.ink, strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M11 3v12M11 3l-4 4M11 3l4 4M5 13v5h12v-5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 카메라 */
export function CameraIcon({ size = 14, color = TOKENS.paper, strokeWidth = 1.7 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Rect x="3" y="6" width="16" height="12" rx="1.5" stroke={color} strokeWidth={strokeWidth} />
      <Circle cx="11" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 6l1.5-2h3L14 6" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

/** 정보 (i 동그라미) */
export function InfoIcon({ size = 14, color = TOKENS.mute, strokeWidth = 1.5 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="11" r="8" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M11 7v5M11 15v0.5" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" />
    </Svg>
  );
}

/** 보상 (집/방패 + 체크 — 테마 보상 카드) */
export function RewardIcon({ size = 22, color = TOKENS.paper, strokeWidth = 1.8 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Path
        d="M4 10l7-7 7 7v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
      />
      <Path
        d="M8 14l2 2 4-4"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** 도장 책 (테마 카드의 굿즈/보상 작은 아이콘) */
export function StampBoxIcon({ size = 12, color = TOKENS.red, strokeWidth = 1.6 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 22 22" fill="none">
      <Rect x="4" y="6" width="14" height="13" rx="1" stroke={color} strokeWidth={strokeWidth} />
      <Path d="M8 6V4h6v2" stroke={color} strokeWidth={strokeWidth} />
    </Svg>
  );
}

// PhotoPlaceholder가 쓰는 대각선 라인은 자기 코드에 두는 게 자연스러우니 여기서는 export 안 함.
// Stamp 컴포넌트의 도장 SVG도 마찬가지로 Stamp.tsx 안에 둠.
// TabBar의 5개 아이콘(home/map/theme/stamp/me)도 TabBar 안에서만 쓰이니 그대로 둠.

// 명시적으로 export하지 않아도 위 아이콘들로 충분. 필요 시 추가.
export type { IconProps };
