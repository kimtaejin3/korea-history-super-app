/**
 * WGS84 좌표 기반 거리 계산 헬퍼.
 */

export type LatLon = { lat: number; lon: number };

/** 도(degree) → 라디안 */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/**
 * Haversine 공식으로 두 WGS84 좌표 사이 직선 거리 (km).
 * 지구 곡률 고려한 대원거리(great-circle distance).
 */
export function distanceKm(a: LatLon, b: LatLon): number {
  const R = 6371; // 지구 반지름 (km)
  const dLat = toRad(b.lat - a.lat);
  const dLon = toRad(b.lon - a.lon);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

/** 1km 미만은 "0.5km" 정도 정밀, 1km 이상은 정수로 */
export function formatDistance(km: number): string {
  if (km < 0) return '?';
  if (km < 1) return `${(Math.round(km * 10) / 10).toFixed(1)}km`;
  if (km < 100) return `${km.toFixed(1)}km`;
  return `${Math.round(km)}km`;
}
