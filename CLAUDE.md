# CLAUDE.md

이 저장소에서 작업하는 AI 에이전트가 따라야 할 규칙. 매 세션 시작 시 로드됨.

상세한 제품/디자인/도메인 컨텍스트는 [AGENTS.md](./AGENTS.md) 참고.

## Repo 구조

- `client/` — Expo 앱 (SDK 54, React Native 0.81, NativeWind, expo-router 6)
- `server/` — Hono + Drizzle ORM + Postgres
- `docs/` — 설계 문서
- `notes/` — 개인 메모 (gitignored)

monorepo지만 lerna/turborepo 같은 도구 없이 단순 디렉토리 분리. 각 워크스페이스에서 직접 `npm install`.

## 데이터 흐름 (중요)

```
server/src/data/*.ts ─ seed.ts ──→ Postgres ──→ 라우트 ──→ 클라이언트
                       (1회)        (런타임)
```

- **모든 정적 데이터는 Postgres에서 옴**. 라우트가 `server/src/data/*`를 직접 import하지 않음.
- `server/src/data/*.ts`와 `server/data/*.json`은 **seed 입력 전용**.
- 데이터 추가/수정 흐름: `*.ts` 수정 → `cd server && npm run db:seed` → DB 갱신.
- `server/src/db/schema.ts`가 모든 테이블 정의. 변경 시 `npm run db:generate` → `npm run db:migrate`.
- 클라이언트 LAN IP는 `Constants.expoConfig.hostUri`로 자동 추출. 하드코딩 금지.

## 절대 하지 말 것

- **`.env`, `.env.*` 커밋**. 이미 gitignore 돼 있지만 절대 추가 금지.
- **`node_modules/` 직접 수정**. 필요하면 patch-package로 영구화.
- **`git add -A` 또는 `git add .` (의도치 않은 파일 포함 위험)**. 파일을 명시적으로 add.
- **`--no-verify`로 hook 스킵**. hook이 막으면 원인 고침.
- **client에 새 mock 데이터 export 추가**. 정적 데이터는 server DB로.
- **라우트에 raw SQL**. Drizzle 쿼리 사용.
- **`try/catch`로 에러 삼키기**. throw 하거나 의미 있는 응답.
- **임의의 새 의존성 추가**. 표준 라이브러리/기존 의존성으로 안 되는 이유 먼저 검증.
- **AGENTS.md, CLAUDE.md를 사용자 확인 없이 수정**. 규칙 변경은 사용자가 결정.

## 코드 스타일

- **주석 최소**. 코드가 자명하면 쓰지 않음. WHY가 비자명할 때만 한 줄.
- **명시적 타입**. `any` 금지. 불가피하면 `unknown` + 타입가드.
- **인덱스 접근은 가드**. `noUncheckedIndexedAccess` 켜져있음 — `arr[0]`은 `T | undefined`.
- **React Native**: NativeWind className 우선. 인라인 style은 동적 값에만.
- **import 순서**: 외부 → expo/RN → 절대 alias → 상대 → 타입.
- **서버 응답 shape**: `client/data/*` 타입과 정확히 일치. 다르면 라우트에서 명시 매핑.
- **불완전한 작업 남기지 않기**. `TODO`/`FIXME` 작성 시 이유와 후속 행동 명시.

## 워크플로

코드 변경 후 **반드시**:

```bash
# 변경된 워크스페이스에서
npm run typecheck
npm run lint
```

커밋 메시지:
- 영어 imperative ("Add X", "Fix Y", "Refactor Z")
- 제목 70자 이내
- 본문 1~2문장으로 WHY (WHAT은 diff로 보임)
- 한 커밋 = 한 논리적 변경. 무관한 정리는 분리.
- 최근 `git log` 스타일 확인 후 맞추기.

## 자주 실수하는 부분

- **expo-image vs Image**: 새 코드는 `expo-image` 사용.
- **Reanimated worklet**: 일반 JS 함수 호출 시 `runOnJS()`.
- **expo-router**: 파일 기반 라우팅. 새 화면은 디렉토리 구조로.
- **server 응답 필드명**: DB 컬럼명이 다르면 (예: `description` ↔ `desc`) 라우트에서 매핑.
- **`getDb()` 호출 시점**: 모듈 top-level 금지. 라우트 핸들러 안에서.

## 의존성 (현재)

**Client 주요**:
- expo ^54, react-native 0.81, react 19
- expo-router ~6
- nativewind ^4, tailwindcss ^3.4
- @gorhom/bottom-sheet, react-native-reanimated ~4, react-native-gesture-handler
- @tanstack/react-query
- expo-image, expo-haptics, expo-location, expo-linear-gradient

**Server 주요**:
- hono ^4, @hono/node-server, @hono/zod-validator
- drizzle-orm ^0.38, drizzle-kit
- postgres (postgres-js)
- zod

## 명령어 참조

```bash
# Server
cd server
npm run dev               # tsx watch
npm run typecheck         # tsc --noEmit
npm run db:generate       # 스키마 → SQL 마이그레이션 생성
npm run db:migrate        # 마이그레이션 적용
npm run db:seed           # 데이터 적재

# Client
cd client
npm start                 # Expo dev server (LAN)
npx expo run:ios          # iOS 빌드 + 실행
npx tsc --noEmit          # 타입체크
```

## 사람에게 확인할 것

다음은 임의 결정 금지. 사용자에게 물어볼 것:

- 새 의존성 추가
- 스키마 변경 (마이그레이션 필요)
- 화면/라우트 구조 변경
- `package.json`의 script 의미 변경
- 기존 API 응답 shape 변경 (클라이언트 호환성)
- 빌드/배포 설정 변경
