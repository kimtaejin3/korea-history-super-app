import { get } from '@shared/api/base';
import type { Place } from '@entities/place/model/types';

export type NearbyParams = {
  lat: number;
  lon: number;
  radius?: number;
  limit?: number;
  page?: number;
  era?: string;
};

export type NearbyResponse = {
  items: Place[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};

export const getPlaces = (signal?: AbortSignal) => get<Place[]>('/places', signal);

export const getPlace = (
  id: string,
  coords?: { lat: number; lon: number },
  signal?: AbortSignal
) => {
  const q = coords ? `?lat=${coords.lat}&lon=${coords.lon}` : '';
  return get<Place>(`/places/${id}${q}`, signal);
};

/** 서버측에서 거리 계산 + 정렬 + 페이징된 가까운 장소. */
export const getNearby = (
  { lat, lon, radius = 20, limit = 50, page = 1, era }: NearbyParams,
  signal?: AbortSignal
) => {
  const params = new URLSearchParams({
    lat: String(lat),
    lon: String(lon),
    radius: String(radius),
    limit: String(limit),
    page: String(page),
  });
  if (era && era !== '전체') params.set('era', era);
  return get<NearbyResponse>(`/places/nearby?${params.toString()}`, signal);
};
