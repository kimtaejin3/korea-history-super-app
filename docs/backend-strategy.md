# 백엔드 전략 — 무료 옵션 비교 + 단계별 로드맵

이 문서는 발자취 앱의 백엔드 인프라 선택과 마이그레이션 전략을 정리한다.  
현재 mock 기반에서 시작해 사용자 규모에 따라 어떤 옵션이 합리적인지, 각 선택의 한계와 트레이드오프를 솔직하게 기록.

## 1. 현재 상태 — 인앱 Mock의 본질

### 동작 원리
```
[휴대폰 안 JavaScript 프로세스]
  fetch('/api/places/nearby')
       ↓
  mocks/install.ts의 fetch 인터셉터
       ↓
  핸들러 실행 (filter/sort/...)
       ↓
  JSON Response 반환
```

**핵심: mock은 결국 폰의 JS 스레드에서 실행된다.** MSW든 우리 커스텀 인터셉터든 동일.

### 라이브러리 선택 — 왜 커스텀?
초기에 MSW (Mock Service Worker) 시도 → Hermes에 `MessageEvent` API 없어 크래시.  
대안:
- `mocks/install.ts`에 `global.fetch` 직접 override (현재)
- 100줄 미만, 의존성 0, 모든 플랫폼 호환

### Mock의 진짜 가치 — 성능이 아닌 구조
| 목적 | 평가 |
|---|---|
| 백엔드 없이 개발 | ✅ 완벽 |
| 코드를 진짜 API처럼 | ✅ 마이그레이션 쉬움 |
| 예측 가능한 응답 | ✅ 테스트 안정 |
| 폰 CPU 절감 | ❌ **불가능 — 같은 프로세스에서 실행** |

→ "mock으로 백엔드 부담 줄이자"는 잘못된 기대.  
**진짜 CPU 절감은 인앱이 아닌 곳으로 옮겨야** 함.

## 2. 무료 옵션 솔직 비교

### 2.1 Vercel Hobby
| 항목 | 한도 |
|---|---|
| 대역폭 | 100GB/월 |
| Serverless 호출 | 100k/일 |
| Edge 함수 | 100k 요청/일 |
| 함수 실행 시간 | 10초 |

**함정**: **"Personal, non-commercial use only"** — 광고/유료/사업자 계정 사용 시 Pro ($20/월) 강제. 앱스토어 출시도 회색지대.

**적합**: Next.js 풀스택, 학습/포트폴리오용.  
**부적합**: 우리처럼 RN 앱 백엔드, 상업화 가능성 있는 경우.

### 2.2 Cloudflare Workers
| 항목 | 한도 |
|---|---|
| 요청 | **100k/일** |
| CPU 시간 | 10ms/요청 |
| 대역폭 | **무제한 (egress 무료)** |
| R2 스토리지 | 10GB |
| 한국 latency | **20~40ms (Seoul 엣지)** |
| 상업 사용 | **✅ 자유** |

**장점**: 가장 빠름, 무료 한도 큼, 상업 OK, Cold start 거의 없음 (V8 isolate).  
**단점**: JS/TS only, 함수 사이즈 < 1MB (큰 JSON은 R2로), Auth 직접 구현 필요.

### 2.3 Koyeb (컨테이너 풀백엔드)
| 항목 | 한도 |
|---|---|
| 서비스 | 1개 |
| RAM | 512MB |
| 트래픽 | 100GB/월 |
| Sleep | **15분 idle → 컨테이너 중단** |
| Cold start | **5~15초** |
| 한국 latency | 80~100ms (싱가포르) |

**장점**: 어떤 언어/프레임워크든, 컨테이너 풀백엔드, 상업 OK.  
**단점**: **유휴 시 sleep → 첫 요청 5~15초 cold start** (사용자 이탈 위험).

### 2.4 Supabase (DB + Auth + Storage 올인원)
| 항목 | 한도 |
|---|---|
| Postgres DB | 500MB |
| MAU | **50,000** |
| Storage | 1GB |
| 대역폭 | 2GB/월 |
| Realtime | 200 동시 |
| 한국 latency | Seoul 리전 ✓ |
| 상업 사용 | ✅ 자유 |

**유료 진입**: $25/월 (Pro) — Phase 2 단계.

**장점**: Postgres + PostGIS (좌표 쿼리), 카카오/Apple 인증 내장, 자동 REST API, Realtime.  
**단점**: 벤더 락인 일부 (Auth, Edge Function), RPC/Edge Function 한계 (§4).

### 2.5 Cloudflare Pages (정적만)
- 대역폭 무제한, 요청 무제한, 상업 OK
- **정적 사이트 한정** — 동적 계산·DB·인증 X
- 빌드 타임에 모든 응답 미리 만들어 두는 식

**평가**: MVP 시연용으로는 좋지만 **사업화엔 천장 명확** (인증, 사용자 데이터 들어오는 순간 막힘).

### 2.6 Oracle Cloud Always Free
- ARM VM 24GB RAM, 200GB 스토리지, 10TB egress
- **trial 아닌 영구 무료**
- 단점: 한국 가입 까다로움, DevOps 직접

### 2.7 비교 요약

| 옵션 | 무료 가능 | 상업 OK | 한국 빠름 | Cold start | 우리 적합도 |
|---|---|---|---|---|---|
| Vercel Hobby | ✅ | ❌ | ✅ | 있음 | ⭐⭐ |
| **Cloudflare Workers** | **✅** | **✅** | **✅** | **없음** | **⭐⭐⭐⭐** |
| Koyeb Free | ✅ | ✅ | △ | **5~15초** | ⭐⭐ |
| **Supabase Free** | **✅** | **✅** | **✅** | 없음 | **⭐⭐⭐⭐⭐** |
| Cloudflare Pages | ✅ | ✅ | ✅ | 없음 | ⭐⭐ (정적 한정) |
| Oracle Free | ✅ | ✅ | △ | 없음 (DIY) | ⭐⭐⭐ |

## 3. 사용자 규모별 비용 시뮬레이션

| 사용자 | Supabase | Cloudflare | Vercel |
|---|---|---|---|
| 100 (베타) | 무료 | 무료 | $0 (비상업 한정) |
| 1,000 | 무료 | 무료 | $20/월 (Pro 강제) |
| 10,000 | 무료 | 무료 | $20/월 |
| 50,000 MAU | **무료 (한도 마지막)** | 무료 | $20~ |
| 100,000 MAU | $25/월 (Pro) | $5~10/월 | $20~50 |
| 1M | $599/월 (Team) | $50~100/월 | $100+ |

→ **Supabase는 5만 명까지 영구 무료**, 그 이상도 $25부터.

## 4. Supabase RPC + Edge Function의 한계

Supabase는 "백엔드 없이 가능"을 표방하지만 실제로는 명확한 트레이드오프 존재.

### 4.1 RPC (Postgres functions)

**적합한 경우 ✅**
- 데이터 무거운 단일 쿼리 (조인, 집계, 좌표 검색)
- 트랜잭션 필요한 다단계 업데이트
- 30줄 이내 SQL

**부적합한 경우 ❌**
- 복잡한 비즈니스 로직 (PL/pgSQL 외계어화)
- 외부 API 호출 (pg_net 필요, 어색함)
- 테스트 어려움 (단위 테스트 X)
- 디버깅 어려움 (DB 레벨 메시지뿐)
- 100줄 넘으면 유지보수 지옥

### 4.2 Edge Functions (Deno 기반)

**적합한 경우 ✅**
- 가벼운 API 게이트웨이
- Supabase Auth/DB와 통합되는 로직
- 외부 webhook 처리

**부적합한 경우 ❌**
- Deno 런타임 (npm 일부 비호환)
- Cold start 1~3초 (실시간성 요구 기능 부적합)
- 실행 시간 짧음 (Pro 150초)
- 메모리 256MB
- 백그라운드 잡/큐 불가능 (별도 인프라 필요)
- 벤더 락인 (Supabase 떠나면 재작성)

### 4.3 진짜 백엔드(Hono on CF Workers 등)가 답인 신호
- 함수가 100줄 넘어감
- 외부 API 호출 빈번
- 이미지/파일 처리 (sharp 등 native)
- 결제 처리 (PG사 webhook + 복잡 분기)
- GPS anti-cheat (서버 검증)
- 백그라운드 잡 (BullMQ + Redis)
- 분기 로직이 SQL로 어색
- 테스트 짜기 두려움

## 5. 우리 앱 케이스 분석

### 필요한 기능 (현재 + 향후)
| 기능 | Supabase 단독 | 진짜 백엔드 필요 |
|---|---|---|
| 인증 (카카오/Apple) | ✅ Auth | - |
| 사용자 스탬프 CRUD | ✅ 자동 REST | - |
| 좌표 기반 nearby | ✅ RPC (PostGIS) | - |
| 사진 업로드 | ✅ Storage | - |
| 실시간 랭킹 | ✅ Realtime | - |
| **GPS 위변조 검증** | ⚠️ Edge Function 가능하지만 복잡 | ✅ 자유 |
| **퀴즈 anti-cheat** | ⚠️ 같음 | ✅ |
| **푸시 알림 스케줄** | ❌ pg_cron + 외부 | ✅ 큐로 자연스럽게 |
| **이미지 리사이즈/EXIF** | ❌ Deno에 sharp 없음 | ✅ |
| **결제 webhook** | ⚠️ Edge Function 가능하지만 | ✅ |
| **관리자 대시보드** | ✅ Supabase UI 기본 제공 | - |

→ **80% 기능은 Supabase 단독**, **20%는 별도 백엔드 필요**.

## 6. 하이브리드 아키텍처 (장기)

```
[정적 콘텐츠]
  heritage 데이터, 이미지
       ↓
  Cloudflare R2 + Cache (사실상 무료, egress 무료)

[사용자 데이터]
  인증, 스탬프, 사진, 실시간 랭킹
       ↓
  Supabase (Postgres + Auth + Storage + Realtime)

[복잡 비즈니스 로직]
  GPS 검증, 이미지 처리, 결제, 푸시
       ↓
  Hono on Cloudflare Workers
       ↓
  Supabase service-role key로 DB 접근
```

**장점**: 각 서비스가 자기 강점에 집중. 점진적 진화 가능.  
**단점**: 초기 설정 복잡, 도메인 여러 개 관리.

## 7. 단계별 로드맵

### Phase 0 — 지금 (MVP 디자인 검증)
**Mock 그대로 유지**
- 백엔드 셋업할 시간에 앱/UX 검증 우선
- `mocks/install.ts` + 1,018개 헤리티지 데이터로 충분
- 첫 베타 사용자 5~10명 확보까지

### Phase 1 — 첫 베타 사용자 (1~2개월 뒤, 작업 1~2주)
**Supabase로 풀백엔드 셋업**
- Postgres 스키마 정의 (places, heritage, users, stamps, ...)
- heritage.json 마이그레이션 (DB import)
- Supabase Auth 설정 (카카오 로그인)
- 자동 생성 REST API + RPC `nearby_heritage()` (PostGIS)
- RN의 `lib/api.ts` 한 파일만 교체
- `mocks/install.ts` 제거

**왜 이 시점**:
- 무료 한도 안에서 영구 운영 가능 (MAU 50k)
- 카카오 로그인 빠르게 붙음
- Auth 직접 구현 안 해도 됨

### Phase 2 — 사용자 1,000~10,000 (필요 기능 늘어남)
**Supabase + 별도 백엔드 (하이브리드)**
- Hono on Cloudflare Workers 별도 백엔드 추가
- 옮기는 기능:
  - 이미지 업로드 처리 (리사이즈, EXIF 제거)
  - GPS anti-cheat
  - 푸시 알림 스케줄링
  - 결제 webhook (수익화 시작 시)
- Supabase는 DB + Auth + Storage 전담
- CF Workers는 비즈니스 로직 + 외부 통합 전담
- 정적 콘텐츠 (이미지)는 CF R2로

### Phase 3 — 사용자 10만+ (본격 사업화)
**선택지**:
- **A. Supabase Pro ($25~)** + CF Workers — 가장 작은 변화
- **B. AWS RDS + Lambda** — 비용 더 절감 가능 (대규모 시)
- **C. 자체 Postgres on Fly.io / Oracle Cloud** — DevOps 부담 + 최저 비용

Postgres는 어디든 이식 가능하므로 마이그레이션 출구 명확.

### Phase 4 — 글로벌 / 멀티 리전 (사용자 100만+)
- 멀티 리전 DB (read replica)
- 엣지 캐싱 최적화
- 별도 검색 엔진 (Meilisearch, Typesense)
- 메시지 큐 (BullMQ + Redis)
- 옵저버빌리티 (Sentry, OpenTelemetry, Grafana)

## 8. 기술 선택 원칙

1. **현재 단계의 천장이 명확한 옵션 회피**
   - Cloudflare Pages 정적만 = 사용자 데이터 들어오면 막힘
   - Vercel Hobby = 상업화 시 강제 Pro
   
2. **마이그레이션 출구 항상 확보**
   - Postgres = 어디든 옮길 수 있음
   - 벤더 락인 강한 기능(Edge Function 등)은 최소화
   
3. **무료 한도가 진짜 사용량을 받는지 확인**
   - Supabase MAU 50k = 매월 5만 명 실 사용 가능
   - CF Workers 100k req/일 = 사용자 수천 명 OK
   
4. **응답 속도 = 사용자 이탈 직결**
   - Cold start 5초짜리 (Render, Koyeb free) → 비추
   - V8 isolate (CF Workers) → 거의 0ms
   
5. **DevOps 부담은 마지막에**
   - 처음엔 매니지드 서비스 (Supabase)
   - 규모 커지면 자체 호스팅

## 9. 결정 트리 (지금 누가 따라하면)

```
백엔드 필요?
  └─ 아니오 → mock 유지 (Phase 0)
  └─ 예, 인증 필요해? 
       └─ 예 → Supabase (Phase 1)
            └─ 곧 복잡한 로직(이미지/결제/anti-cheat) 추가?
                 └─ 예 → +Hono on CF Workers (Phase 2)
                 └─ 아니오 → Supabase 단독 유지
       └─ 아니오, 단순 JSON API만 → Hono on CF Workers
```

## 10. 핵심 메시지

> **"인앱 mock은 폰 CPU를 절감하지 못한다. 진짜 절감은 인앱이 아닌 곳(서버/CDN)으로 옮겨야 한다."**

> **"Supabase는 80% 시나리오엔 답. 나머지 20% 만나면 하이브리드. 처음부터 풀백엔드 짤 필요 X."**

> **"공짜는 결국 누군가 비용을 내거나, 사용량 제한이 있거나, 상업 사용을 막거나 한다. 한도 안에서 영구 무료는 Cloudflare/Supabase가 가장 정직."**

## 11. 참고 — 비용 절감 트릭

- **정적 데이터는 무조건 CDN** (egress 무료 CF R2 활용)
- **자주 쓰는 응답은 캐시** (Cache-Control, React Query staleTime)
- **불필요한 fetch 줄이기** (큰 응답 한 번 vs 작은 응답 자주 — 후자가 보통 비쌈)
- **이미지는 WebP + 적절한 리사이즈** (대역폭 90% 절감 가능)
- **Edge에 가까운 곳에서 응답** (CF Workers, Vercel Edge)
- **모니터링 무료 티어 활용** (Sentry, PostHog, Grafana Cloud)

## 12. 관련 문서
- `docs/threads-and-performance.md` — UI vs JS 스레드, 워크릿
- `docs/heritage-data-collection.md` — 헤리티지 데이터 수집 파이프라인
- `AGENTS.md` — 전체 앱 컨텍스트
