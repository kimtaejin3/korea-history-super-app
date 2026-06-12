import Constants from 'expo-constants';
import ky, { HTTPError } from 'ky';

// 실기기는 Metro의 LAN IP를 자동 추출하므로 Wi-Fi가 바뀌어도 IP를 갱신할 필요 없음.
// EXPO_PUBLIC_API_BASE로 명시 override 가능 (스테이징/프로덕션 빌드용).
const host = Constants.expoConfig?.hostUri?.split(':')[0];
const BASE = process.env.EXPO_PUBLIC_API_BASE ?? `http://${host ?? 'localhost'}:3000/api`;

/** API 에러. 상태코드 + 서버 응답 body까지 보존해서 디버깅 가능. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: unknown,
    message: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const client = ky.create({
  timeout: 10_000,
  retry: 0, // React Query가 재시도 정책 담당. 두 군데서 retry하면 backoff 의도가 깨짐.
});

/**
 * 공통 GET 헬퍼. 각 entity의 api/client.ts에서 이 함수만 import해 endpoint를 정의.
 * 응답 body를 ApiError에 담아 throw하므로 호출부에서 상태코드 + 본문 모두 접근 가능.
 */
export async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  try {
    return await client.get(`${BASE}${path}`, { signal }).json<T>();
  } catch (err) {
    if (err instanceof HTTPError) {
      let body: unknown = '';
      try {
        body = await err.response.clone().json();
      } catch {
        body = await err.response.clone().text().catch(() => '');
      }
      const detail =
        typeof body === 'object' && body && 'error' in body
          ? String((body as { error: unknown }).error)
          : typeof body === 'string' && body
            ? body
            : '';
      throw new ApiError(
        err.response.status,
        body,
        detail
          ? `${err.response.status} ${err.response.statusText}: ${detail}`
          : `${err.response.status} ${err.response.statusText}`
      );
    }
    throw err;
  }
}
