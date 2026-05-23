import { useEffect, useState } from 'react';
import { Platform } from 'react-native';
import * as Location from 'expo-location';
import type { LatLon } from './geo';

/** 권한 거부 / 실패 시 사용할 모킹 위치 — 충남 아산 (디폴트) */
export const MOCK_USER_LOCATION: LatLon = { lat: 36.789, lon: 127.014 };

/** 강제로 모킹 위치만 쓰고 싶을 때 true (개발용) */
const USE_MOCK_LOCATION = false;

export type LocationStatus = 'loading' | 'real' | 'mocked' | 'denied' | 'error';

export type UserLocation = {
  coords: LatLon;
  status: LocationStatus;
};

/**
 * 사용자 위치 훅.
 * - 실 GPS (expo-location)
 * - 권한 거부/실패 → 모킹 fallback
 * - 웹 / 시뮬레이터 위치 미설정 시 → 모킹
 */
export function useUserLocation(): UserLocation {
  const [coords, setCoords] = useState<LatLon>(MOCK_USER_LOCATION);
  const [status, setStatus] = useState<LocationStatus>('loading');

  useEffect(() => {
    let cancelled = false;

    async function fetchLocation() {
      if (USE_MOCK_LOCATION || Platform.OS === 'web') {
        if (!cancelled) setStatus('mocked');
        return;
      }
      try {
        const { status: perm } = await Location.requestForegroundPermissionsAsync();
        if (perm !== 'granted') {
          if (!cancelled) setStatus('denied');
          return;
        }
        const loc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });
        if (!cancelled) {
          setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
          setStatus('real');
        }
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    fetchLocation();
    return () => {
      cancelled = true;
    };
  }, []);

  return { coords, status };
}
