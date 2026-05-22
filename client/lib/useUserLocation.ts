import { useState } from 'react';
import type { LatLon } from './geo';

/**
 * ⚠️ 임시 모킹 버전.
 * expo-location 네이티브 빌드가 안 잡히는 동안 import 자체를 제거하고 하드코딩.
 *
 * 실 GPS 복구하려면:
 *   1. dev client 깨끗하게 풀빌드 (`rm -rf ios && npx expo prebuild --platform ios && npm run ios --device`)
 *   2. 이 파일을 git에서 이전 expo-location 버전으로 복구
 *   3. 또는 dynamic require 패턴으로 작성
 */

// 사용자 위치 모킹 — 대전 유성구 관평동
export const MOCK_USER_LOCATION: LatLon = { lat: 36.412, lon: 127.391 };

export type LocationStatus = 'loading' | 'real' | 'mocked' | 'denied' | 'error';

export type UserLocation = {
  coords: LatLon;
  status: LocationStatus;
};

export function useUserLocation(): UserLocation {
  const [coords] = useState<LatLon>(MOCK_USER_LOCATION);
  return { coords, status: 'mocked' };
}
