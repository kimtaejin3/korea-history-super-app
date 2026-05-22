# 발자취 (Footsteps) — AI Agent Onboarding

이 문서는 AI 어시스턴트(Claude Code, Cursor, Copilot, ChatGPT 등)가 이 코드베이스를 빠르게 이해하고 작업을 시작할 수 있도록 작성된 컨텍스트 프롬프트입니다.

다른 AI 도구에 컨텍스트로 붙여넣어도 되고, repo에 두면 이 컨벤션을 지원하는 도구들이 자동으로 읽습니다.

---

# Part Ⅰ — 기획 (Product)

## 1. 제품 한 줄 요약

> **"한국 곳곳의 역사 장소를 걷고, GPS 인증 + 현장 퀴즈로 도장(印)을 모으는 답사 앱."**

- **이름**: 발자취 (한자 跡, 영문 FOOTPRINTS · ARCHIVE)
  - "발자취" = 걸어 다닌 흔적. 사용자가 직접 발로 걷고 남기는 기록이라는 의미와, 역사를 따라가는 답사라는 의미를 모두 함의.
- **카테고리**: 모바일 앱 (iOS/Android 우선, 웹 부차적)
- **단계**: MVP 디자인 + 클라이언트 구현. 백엔드 없음, 모든 데이터 mock.
- **개발 진행도**: 화면 구성 + 핵심 흐름 작동 단계. 실제 데이터/인증/푸시 미연결.

## 2. 비전과 가치 제안

### 왜 이 앱이 존재하는가
한국에는 전국 곳곳에 역사 유적, 객사, 사찰, 사적지, 서원, 유물 출토지가 산재하지만:
- 흩어져 있는 정보는 **문화재청 사이트**, **시청 관광 홈페이지**, **블로그**에 파편화
- 한국사 학습은 **교과서/EBS** 위주라 추상적·암기 중심
- 실제 장소를 가더라도 **현장에서 의미를 풀어주는 동반자**가 없음
- 답사를 시작하고 싶어도 **어디부터 가야 할지** 모름

### 우리가 제공하는 가치
1. **발견** — 내 주변, 오늘의 역사, 큐레이션된 테마 코스로 "갈 만한 곳"을 자연스럽게 제시
2. **현장 학습** — GPS 인증을 통해 진짜 "그 자리"에서 짧은 퀴즈와 이야기로 학습
3. **수집의 즐거움** — 도장(스탬프)이라는 시각적 보상으로 답사를 게임화
4. **기록** — 내가 다녀온 흔적을 시간순/지역순/테마순으로 보존

### 어떤 가치는 제공하지 않는가 (Non-goals)
- 한국사 전체 백과사전이 아님 (방문 가능한 장소 위주)
- 학습 평가/시험 대비 도구가 아님 (퀴즈는 동기 부여용 짧은 문제)
- 일반 관광/맛집 정보 X — 오직 역사 사적지·인물·유물에 집중
- 소셜 네트워크 아님 (관계 맺기보다는 개인 답사 기록 + 가벼운 랭킹)
- 가이드 투어 예약 플랫폼이 아님 (수익은 향후 굿즈·후원·프리미엄 검토)

## 3. 타깃 사용자

### Primary
- **20~40대 한국사 관심층**
  - 한국사능력검정시험을 본 적 있거나 준비 중
  - 사극·역사 다큐를 좋아함
  - 주말에 가볍게 답사 다니는 걸 즐기는 사람
- **가족 단위 외출자 (자녀 동반)**
  - 박물관·사적지 갈 때 자녀에게 의미를 더해주고 싶은 부모
  - "현장 퀴즈"는 자녀 학습 동기로 활용

### Secondary
- 학생 (역사 교과 보충, 수행평가)
- 외국인 관광객 중 한국사에 관심 있는 사람 (향후 다국어)
- 지역 문화재 가이드, 답사 동호회

### 사용자 페르소나 — "답사초보 (35세, 직장인)"
- 평일은 회사, 주말에 1박 2일 근교 여행 가끔
- 한국사능력검정 3급 보유. 정조·이순신 좋아함
- 자녀(8세)에게 역사 흥미를 길러주고 싶음
- 앱을 통해: 충남 출장 갈 때 "근처에 갈 만한 사적지 없나?" 검색 → 현충사 → 자녀와 함께 방문 → 짧은 퀴즈 풀고 스탬프 획득

## 4. 핵심 사용자 흐름 (User Flows)

### Flow A — 발견부터 첫 스탬프까지 (Onboarding Golden Path)

1. **앱 진입** → 로그인 화면 ("시작하기" 한 번 누르면 진입, 회원가입 필수 X)
2. **홈 화면** → 큰 인사말 + 가장 가까운 장소 1개 (Hero 카드)
3. **Hero 카드 탭** → 장소 상세 (사진, 한 줄 소개, 풀 스토리, 유물 리스트)
4. **"인증하기" 버튼** → 체크인 흐름 진입
5. **GPS 위치 확인** (애니메이션, 약 2초)
6. **"도착하셨네요" 확인** → 퀴즈 진입 버튼
7. **현장 퀴즈** (4지선다, 힌트 포함, 1문제)
8. **정/오답 결과**
9. **스탬프 획득 애니메이션** (Lottie + 한자 표시) — 강한 햅틱
10. **스탬프북으로 이동** 버튼

### Flow B — 테마 코스 따라 답사
1. **홈 또는 테마 탭** → 활성 테마 카드 ("이순신 발자취 1/9")
2. **테마 상세** → 9개 장소 리스트 + 진행도
3. 미방문 장소 탭 → 장소 상세
4. 이하 Flow A 와 동일
5. 9개 모두 완료 시 → **테마 완료 보상** (배지 + 굿즈 안내)

### Flow C — 지도 탐색
1. **지도 탭** → 한반도 지도 + 사적지 핀
2. 시대 필터 (전체/조선/백제/통일신라/근현대)
3. 바텀시트로 가까운 순 리스트
4. 핀 또는 리스트 항목 탭 → 장소 상세
5. 이하 Flow A

### Flow D — 오늘의 역사
1. 홈 → "오늘의 역사" 섹션 (가로 스크롤)
2. "5월 15일 — 세종대왕 탄생" 카드 탭
3. 관련 장소 (영릉) 또는 인물 (세종) 상세로 연결

### Flow E — 인물 ↔ 유물 ↔ 장소 (콘텐츠 탐색)
- 인물 상세 → 그 인물 관련 장소들 + 관련 유물
- 유물 상세 → 소장 장소
- 장소 상세 → 그곳의 유물 리스트
- 상호 링크로 깊이 있는 탐색 가능

## 5. 화면 구성 (Information Architecture)

| 경로 | 화면 | 주 컴포넌트 | 목적 |
|---|---|---|---|
| `/login` | 시작 | LoginScreen | 첫 진입, 인증 없이 둘러보기도 가능 |
| `/(tabs)/` | 홈 | HomeScreen | 인사말, Hero 추천, 오늘의 역사, 활성 테마, 가까운 장소, 추천 유물 |
| `/(tabs)/map` | 지도 | MapScreen | 한반도 핀맵, 시대 필터, 드래그 바텀시트 |
| `/(tabs)/themes` | 테마 | ThemesScreen | 5개 테마 카드, 진행도 |
| `/(tabs)/stampbook` | 스탬프북 | StampbookScreen | 모은 도장, 빈 슬롯, 통계 |
| `/(tabs)/profile` | 나 | ProfileScreen | 닉네임, 등급, XP, 업적, 랭킹 |
| `/place/[id]` | 장소 상세 | PlaceScreen | 사진, 시대, 한자, 풀 스토리, 유물, 위치 |
| `/artifact/[id]` | 유물 상세 | ArtifactScreen | 사진 갤러리, 지정/카테고리, 설명, 소재 장소 |
| `/figure/[id]` | 인물 상세 | FigureScreen | 초상, 생몰년, 업적, 관련 장소, 관련 유물 |
| `/checkin/[id]` | 체크인 5-step | CheckinScreen | locating → confirmed → quiz → result → stamp |

## 6. 콘텐츠 카테고리

### 6.1 장소 (Places) — 7곳 (현재 mock)
대표 예시:
- **팽성읍 객사** (彭城邑 客舍, 경기 평택, 1488, 조선) — 국가 보물. 객사의 원형
- **대동법 시행기념비** (大同法 施行記念碑, 경기 평택, 1659, 조선) — 김육의 세제 개혁
- **현충사** (顯忠祠, 충남 아산, 조선) — 이순신 사당
- **수원 화성** (華城, 경기 수원, 1796, 조선) — 정조의 신도시 (유네스코)
- **종묘** (宗廟, 서울, 조선) — 역대 왕 신주 (유네스코)
- **공산성** (公山城, 충남 공주, 백제) — 백제 왕성
- **도산서원** (陶山書院, 경북 안동, 1574, 조선) — 퇴계 이황 (유네스코)

각 장소 필드:
- `name`, `nameHanja`, `region`, `era`, `period`, `distance`
- `accent`(테마 색), `tag`(국가 보물/유형문화재/유네스코 등)
- `summary`(1~2줄), `story`(상세 본문)
- `quiz` (선택, 4지선다 + 힌트)
- `visits`, `nearbyStamps`

### 6.2 테마 (Themes) — 5개 코스
| ID | 제목 | 한자 | 색 | 장소 수 | 보상 |
|---|---|---|---|---|---|
| `daedongbeop` | 대동법의 길 | 法 | 적색 | 6 | 한지 엽서 세트 |
| `chungcheong-gaeksa` | 충청 객사 투어 | 舍 | 녹색 | 8 | 객사 텀블러 |
| `yi-sunsin` | 이순신 발자취 | 忠 | 청색 | 9 | 난중일기 미니어처 + 거북선 뱃지 |
| `jeongjo` | 정조의 길 | 正 | 주황 | 5 | 능행도 포스터 |
| `seowon` | 서원의 길 | 院 | 갈색 | 9 | 한지 서표 + 먹 미니어처 |

각 테마: `title`, `subtitle`, `desc`, `cover`(단색), `glyph`(한 글자), `placeIds`, `totalPlaces`, `visited`, `rewardGoods`, `badge`

### 6.3 유물 (Artifacts) — 약 6개 (mock)
국보·보물 위주. 각 유물에 `category`(서적/도자기/회화 등), `designation`(국보 X호), 관련 `placeId`, `figureId`.

### 6.4 인물 (Figures) — 약 6명
세종, 이순신, 정조, 이황, 김육, 정약용 등. 각 인물에 생몰년·약력·관련 장소·관련 유물 링크.

### 6.5 오늘의 역사 (Today in History) — 날짜 기반
예시:
- **5월 15일 (1397)** — 세종대왕 탄생 (誕)
- **5월 7일 (1592)** — 옥포해전 첫 승전 (勝)
- **5월 첫 일요일** — 종묘제례 봉행 (祭)

홈 상단 가로 스크롤로 노출.

## 7. 게임화 / 보상 체계

### 등급 (Levels) — 7단계, 한자로 명명
| Lv | 이름 | 한자 | minXP | 권한 |
|---|---|---|---|---|
| 1 | 초학 | 初學 | 0 | 스탬프 수집, 테마 참여, 지도 탐색 |
| 2 | 답사생 | 踏査生 | 50 | + 현장 사진 업로드, 후기 작성 |
| 3 | 사림 | 士林 | 150 | + 퀴즈 제안, 오류 신고 |
| 4 | 학사 | 學士 | 300 | + 장소 정보 보완 제안 |
| 5 | 진사 | 進士 | 500 | + 신규 장소 등록 제안, 도감 큐레이션 |
| 6 | 대제학 | 大提學 | 800 | + 테마 코스 직접 제작 |
| 7 | 사관 | 史官 | 1200 | + 신규 등록 검수 권한, 명예의 전당 |

→ **유저가 성장할수록 콘텐츠 기여 권한이 늘어남**. 학습 + UGC + 게이미피케이션 결합.

### XP 산정 (현재 룰)
- 스탬프 1개 = 10 XP
- 퀴즈 정답 1개 = 5 XP
- 테마 완료 1개 = 50 XP

### 업적 (Achievements)
예: "첫 발자국" (첫 스탬프), "백제 답사가" (백제 도읍 2곳), "주말 답사자" (7일 연속), "역사 마스터" (퀴즈 10문제 정답), "도감 완성가" (테마 100%)

### 랭킹 (Ranking)
스탬프 수 기준 리더보드. 본인 순위 강조 표시.

### 보상 굿즈
테마 완료 시 한정 굿즈 (한지 엽서, 텀블러, 미니어처 등). 현재는 표시만, 실제 발송 시스템 미구현.

## 8. 디자인 아이덴티티

### 컨셉
- **종이(紙) + 도장(印) + 활자(字)**
- 한국 전통 인쇄·기록 문화에서 모티프
- 모던 미니멀 + 정갈한 활판 인쇄 느낌

### 컬러 토큰
| 토큰 | 값 | 용도 |
|---|---|---|
| `paper` | `#FBFBF9` | 메인 배경 (따뜻한 종이) |
| `paperWarm` | `#F4EFE5` | 강조 카드 배경 (살짝 진한 종이) |
| `ink` | `#141416` | 메인 텍스트 |
| `inkSoft` | `#3A3838` | 본문 보조 텍스트 |
| `mute` | `#86858A` | 메타 정보, 부 텍스트 |
| `line` | `#E8E5DC` | 카드 보더, 구분선 |
| `red` | `#E5563E` | 도장색, 강조, CTA |
| `green` | `#3A8C66` | 성공, 객사 테마 |

테마별 색 (cover/accent):
- 대동법 적색 `#E5563E`, 객사 녹색 `#3A8C66`, 이순신 청색 `#2C5C8C`, 정조 주황 `#E07A30`, 서원 갈색 `#9D7849`

### 타이포그래피
- **Serif (Pretendard)** — 화면 제목, 장소 이름, 본문 강조 — "활자" 느낌
- **Sans (Pretendard)** — UI 라벨, 버튼, 메타 정보
- **Serif Black** — 큰 한자(도장), 점수 등 시각적 임팩트
- **Mono (JetBrains Mono)** — 거리, 숫자, 코드, 좌표

### 한자 사용 룰
- **Stamp(도장) 컴포넌트** — 한자 그대로 노출 (디자인 자산)
- **장소 이름 옆 한자 병기 X** — 가독성. 한자는 디자인 액센트로만.
- **테마 글리프** (法, 舍, 忠, 正, 院) — 카드 디자인 요소

### 사진 / 이미지 정책
- **현재 단계**: 실제 사진 없음. `PhotoPlaceholder` 컴포넌트가 따뜻한 회색 + 발자국 트레일 SVG로 대체
- **장기**: 각 장소·유물 실제 사진 (저작권 확인된 출처)

### 마이크로카피 톤
- **존댓말 기본**, 따뜻하고 차분
- 예: "오늘, 가까운 곳에서 역사 한 조각을 만나보세요"
- 영문 부제 자주 사용 (TODAY IN HISTORY, FOOTPRINTS · ARCHIVE 등) — 디자인 액센트
- 명령형 동사 ("탭하세요" 같은 거) 자제, 가능하면 "탭"

### 애니메이션 / 인터랙션 톤
- 부드러움, 묵직하지 않게
- 햅틱은 가볍게 (`haptic.tap()` 위주)
- 스탬프 획득은 강한 임팩트 (Lottie + 강한 햅틱)
- 화면 전환 — 검색 버튼 → 지도 진입 시 morph 애니메이션 (브랜드 시그니처)

## 9. 차별점 (Why us, not them?)

| 비교 | 차별점 |
|---|---|
| **vs. 문화재청 / 박물관 앱** | 모바일 UX 우선, 게임화, "발견 → 방문 → 학습" 통합 흐름 |
| **vs. Google Maps + 블로그** | 큐레이션된 테마 코스, 검증된 콘텐츠, 진행도 시각화 |
| **vs. 한국사 학습 앱 (가천대 등)** | 책상이 아닌 **현장 중심**. 짧고 즉시 보상 |
| **vs. 트레일/캠핑 앱** | 자연이 아닌 **역사 컨텍스트** 중심 |

핵심 차별점:
- **GPS 인증 기반 현장 학습** — 다른 앱에 거의 없음
- **테마 코스 시리즈** — 단발성 방문이 아닌 연속 답사 동기
- **한자/한국 전통 활자 디자인** — 차별화된 브랜드 정체성

## 10. 비즈니스 모델 (Tentative)

현재 단계에서는 미정. 향후 가능 옵션:

| 옵션 | 비고 |
|---|---|
| **굿즈 판매** | 테마 보상 굿즈를 실제 판매 (한지 엽서, 미니어처 등). 답사 동기 + 수익 일치 |
| **프리미엄 구독** | 무제한 스탬프, 독점 테마, 광고 제거 |
| **지자체 협찬** | 지역 답사 코스 광고/스폰서십 (충청남도 답사 코스 등) |
| **B2B (학교/박물관)** | 단체 계정, 그룹 진행도, 교사용 대시보드 |
| **광고** | 비추천. 콘텐츠 톤과 안 맞음 |

## 11. 로드맵 (러프)

### Phase 0 — 현재 (MVP 클라이언트)
- ✅ 디자인 시스템, 핵심 화면, mock 데이터
- ✅ 검색 morph, 바텀시트, 5-step 체크인
- ✅ 로그인 진입 → 탭 메인 흐름
- ✅ 햅틱, 폰트, 아이콘

### Phase 1 — 백엔드 연결
- 실제 장소 DB (문화재청 OpenAPI 후보)
- 사용자 인증 (카카오 / Apple)
- 스탬프 기록 영속화
- 사진 업로드

### Phase 2 — 콘텐츠 확장
- 100+ 장소
- 모든 시대 (고조선~근현대) 균형
- 인물·유물 콘텐츠 완성
- 다국어 (영어, 일본어 우선)

### Phase 3 — 커뮤니티 / UGC
- 사용자가 등록한 장소 검수
- 후기, 사진 갤러리
- 친구 답사 공유

### Phase 4 — 수익화
- 굿즈 스토어
- 프리미엄 / 지자체 협찬

## 12. 콘텐츠 운영 원칙

- **정확성** > 양 — 한 줄도 검증된 출처 (국가지정문화재, 학술서 등) 기반
- **균형** — 특정 시대(예: 조선) 편중 지양. 백제·신라·고려·근현대 골고루
- **장소-인물-유물 상호 링크** — 유저가 한 콘텐츠에서 다른 콘텐츠로 자연스럽게 흘러가게
- **현장에서 의미 있는 정보 우선** — 책에서 다 알 수 있는 내용보다 "여기서만 알 수 있는" 디테일
- **퀴즈는 학습이 아니라 동기 부여** — 어렵지 않게, 힌트 친절히

---

# Part Ⅱ — 코드 (Engineering)

## 13. 기술 스택

### Core
- **Expo SDK 54** + **React Native 0.81**
- **New Architecture (Fabric)** + **Hermes** 활성화
- **TypeScript** (strict)
- **expo-router v6** (file-based routing)

### UI / 스타일
- **NativeWind v4** (Tailwind for RN). `StyleSheet`보다 우선 사용.
- **Pretendard** (.otf 파일 `assets/fonts/`), `useFonts`로 로드
- **react-native-svg** — 모든 아이콘은 인라인 SVG로 `components/icons/`에 모음

### 상태 / 데이터
- **@tanstack/react-query** (staleTime 60s, retry 1, no refetchOnWindowFocus)
- **Context API** — Auth, SearchTransition (전역 state는 최소)
- 외부 데이터는 모두 `useQuery` 패턴

### 모킹
- **MSW 안 씀** (Hermes에 `MessageEvent` 없어서 크래시)
- `mocks/install.ts`의 **custom fetch interceptor** 사용
- 300~700ms 인위적 지연으로 실제 네트워크 시뮬레이션

### 애니메이션 / 제스처
- **Reanimated v4** — 워크릿 기반 (UI 스레드에서 도는 애니메이션). `docs/threads-and-performance.md`
- **react-native-gesture-handler** — 모든 제스처
- **@gorhom/bottom-sheet** — 드래그 가능한 시트 (지도)
- **Lottie** (`lottie-react-native` + 웹은 `@lottiefiles/dotlottie-react`)
- **react-native-screens** — `enableFreeze(true)` + `enableScreens(true)`

### 햅틱
- **expo-haptics** — 직접 호출 X, `lib/haptics.ts`의 추상화 사용

## 14. 폴더 구조

```
app/                  expo-router 라우트
  _layout.tsx         루트 — Providers, fonts, Stack
  (tabs)/             탭 네비게이션
    _layout.tsx       Auth 가드 + TabBar 커스텀
    index.tsx         홈
    map.tsx           지도 + 바텀시트
    themes.tsx
    stampbook.tsx
    profile.tsx
  login.tsx           로그인 진입
  place/[id].tsx
  artifact/[id].tsx
  figure/[id].tsx
  checkin/[id].tsx    5-step flow

components/           재사용 컴포넌트
  icons/              인라인 SVG 아이콘 모음
  BackHeader, PageHeader, TabBar, Tag, Stamp, StampSlot,
  Mascot, MascotLottie, PhotoPlaceholder, ProgressBar, RankBadge,
  SectionLabel, GatedButton, LottieAsset, LoginScreen, SearchTransitionOverlay

context/
  Auth.tsx            로그인 상태 (메모리 only)
  SearchTransition.tsx  검색 morph 트리거

data/                 mock 데이터 + 상수
  places, artifacts, figures, themes, today, user, tokens

lib/                  도메인 로직 / 헬퍼
  api.ts              API 표면 + queryKeys
  haptics.ts          햅틱 추상화
  searchBarLayout.ts  검색바 레이아웃 상수 (morph용)

mocks/install.ts      fetch 인터셉터

assets/               이미지, 폰트, Lottie

docs/                 팀/AI용 문서 (git tracked)
notes/                개인 메모 (gitignored)
```

## 15. 코딩 컨벤션

### 스타일
- **NativeWind 우선**, `StyleSheet` 거의 안 씀
- 인라인 `style` 객체는 동적 값(애니메이션, 안전영역, 동적 색 등)에만
- 색상은 `data/tokens.ts`의 `TOKENS` 또는 NativeWind 클래스
- 폰트는 `FONTS` 또는 NativeWind (`font-serif`, `font-sans`, `font-mono`)

### 타입
- TS strict. 모든 컴포넌트 props 명시 타입
- `as never`는 router.push의 string literal 강제 회피용 (필요악)

### 컴포넌트
- 모든 컴포넌트는 named export (`export function Foo`)
- 화면 컴포넌트는 default export
- 라우트 파일 첫 줄에 `// noinspection JSUnusedGlobalSymbols` (WebStorm 경고 억제)

### 코멘트
- 거의 안 씀. 코드가 자명하면 코멘트 X
- WHY가 비자명할 때만 짧게 (workaround, 비직관적 제약 등)

### 파일명
- camelCase: `searchBarLayout.ts`
- PascalCase 컴포넌트: `PhotoPlaceholder.tsx`
- 모든 SVG는 `components/icons/index.tsx`에 모음

## 16. 자주 만지는 패턴

### 새 화면 추가
1. `app/` 하위에 `.tsx` 파일 생성
2. `default export` 컴포넌트
3. `useSafeAreaInsets()`로 안전영역
4. 데이터는 `useQuery({ queryKey: queryKeys.X, queryFn: api.X })`

### 새 API 추가
1. `mocks/install.ts`에 라우트 추가
2. `lib/api.ts`에 fetcher + queryKey 추가
3. 컴포넌트에서 `useQuery`

### 새 아이콘 추가
1. `components/icons/index.tsx`에 새 컴포넌트 export
2. 다른 아이콘과 같은 시그니처 (`size`, `color`, `strokeWidth`)

### 햅틱 추가
```ts
import { haptic } from '../../lib/haptics';
haptic.tap();        // 일반 버튼
haptic.success();    // 체크인 성공
haptic.error();      // 위치 인증 실패
```

### 애니메이션 추가
- **무조건 Reanimated 워크릿** (`useSharedValue`, `withTiming`, `useAnimatedStyle`)
- 옛 `Animated` API 사용 금지 (JS 드리븐 → jank)

## 17. Gotchas (실제로 한 번 당한 것들)

| 함정 | 해결 |
|---|---|
| MSW가 Hermes에서 `MessageEvent` 없다고 크래시 | 직접 `mocks/install.ts` 인터셉터 |
| `npm run ios`가 매번 풀빌드 | 일상 개발은 `npx expo start --dev-client` |
| 새 네이티브 패키지 설치 후 "not available" | dev client 재빌드 (`npm run ios`) |
| `app/index.tsx`와 `app/(tabs)/index.tsx` 충돌 | 인증 가드는 `(tabs)/_layout.tsx`에서 `<Redirect>` |
| iOS 시뮬레이터에서 햅틱 안 울림 | 실기기 필수 |
| `useNativeDriver: false` 애니메이션 끊김 | Reanimated 워크릿으로 |
| `npm run ios --device`가 시뮬레이터로 새는 현상 | UDID 명시 또는 `xcrun devicectl` |
| 같은 Wi-Fi인데 폰 ↔ Mac 연결 안 됨 | AP isolation. 핫스팟이 가장 확실 |
| `.tsx` 파일 빨간색 (WebStorm) | unused export 경고. `// noinspection JSUnusedGlobalSymbols` |
| LinearGradient 타입 에러 | `colors`가 tuple `[string, string]` 강제 |

## 18. 개발 명령어

```bash
# 일상 (JS 변경만)
npx expo start --dev-client

# 풀빌드 (새 네이티브 패키지 추가 후)
npm run ios                   # iOS 시뮬레이터
npm run ios --device          # 실기기

# 웹
npm run web

# 타입 체크
npx tsc --noEmit

# 새 Expo 호환 패키지 설치
npx expo install <package>
```

## 19. AI 어시스턴트 작업 권장 사항

1. **수정 전에 관련 파일 읽기** — 컨벤션은 코드에 가장 잘 드러남
2. **새 의존성 추가 금지 (사용자 확인 없이)** — 가볍게 유지 중
3. **NativeWind 우선** — `StyleSheet` 사용하지 말 것
4. **한자 사용 자제** — design accent (Stamp)에서만
5. **애니메이션은 Reanimated 워크릿** — 옛 Animated 쓰지 말 것
6. **expo-router 라우트는 `app/`, 컴포넌트는 `components/`**
7. **타입 체크 후 보고** — `npx tsc --noEmit`
8. **커밋 메시지는 영어**, 짧고 명확 (기존 git log 참고)
9. **`docs/`(git tracked) vs `notes/`(gitignored)** 구분
10. **콘텐츠 추가 시 검증된 출처** — 위 §12 콘텐츠 운영 원칙 준수

## 20. 더 알아볼 곳

- `docs/threads-and-performance.md` — RN UI vs JS 스레드, 워크릿
- `docs/navigation-performance.md` — 제스처/네비 튜닝
- `docs/gesture-handler.md` — 제스처 라이브러리
- `docs/mascot.md` — 마스코트 (현재 미사용)

---

**이 문서가 오래되었다고 느껴지면**: `git log -- AGENTS.md`로 최근 업데이트 확인. 변경된 부분은 직접 코드를 더 신뢰할 것.
