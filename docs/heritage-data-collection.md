# 국가유산 데이터 수집 — 방법론 + 진행 기록

이 문서는 발자취 앱이 사용하는 **역사 장소·유물 데이터를 어떻게 수집·정제·통합**하는지 기록한다. 향후 데이터 보강·자동화 시 참조용.

## 1. 우리 앱이 필요로 하는 데이터

발자취 앱의 핵심은 "역사적 장소 또는 유물"을 사용자가 발견·방문하고 스탬프로 수집하는 것. 따라서 필요한 데이터:

- **이름** (한글 + 한자 병기)
- **위치** (광역시도, 시군구, 정확한 GPS 좌표)
- **시대** (고려시대, 조선시대 등)
- **지정 등급** (국보, 보물, 사적, 시도유형문화재 등 → 태그 표시용)
- **분류 카테고리** (객사, 향교, 사찰, 비석, 능 등)
- **요약** (1~2줄)
- **상세 스토리** (한 단락 이상)
- **현장 퀴즈** (선택, 동기 부여용)

## 2. 데이터 소스 비교

### 2.1 gis-heritage.go.kr OpenAPI (국가유산청 GIS)
- **URL**: `https://gis-heritage.go.kr/openapi/xmlService/spca.do?ccbaKdcd=<code>`
- **응답**: XML (`<ns2:response>` 안에 `<spca>` 레코드 반복)
- **장점**: 좌표 포함, 키 발급 불필요, 한 번에 종목별 전체 다운로드
- **단점**:
  - **국가지정만** 제공 (시도지정·문화유산자료 등 invalid)
  - 좌표가 **한국 좌표계** (EPSG:9020203 추정) — WGS84 변환 필요
  - 상세 스토리·사진 없음
  - 일부 필드 누락 가능

### 2.2 WMS (Web Map Service) — 같은 서버
- **URL**: `?service=WMS&request=GetMap&LAYERS=...`
- **응답**: PNG 이미지 (지도 위에 점 찍어서 렌더된 그림)
- **용도**: 시각화용. 데이터 가공 불가.
- → 우리 용도에는 부적합

### 2.3 한국어 위키피디아 REST API
- **URL**: `https://ko.wikipedia.org/api/rest_v1/page/summary/<제목>`
- **응답**: JSON (title, extract, coordinates, content_urls 등)
- **장점**:
  - **WGS84 좌표** 바로 제공 (변환 불필요)
  - 한자, 시대, 지정 번호가 extract 첫 문장에 보통 포함
  - **시도지정도 커버**
  - 키 불필요
- **단점**:
  - **항목별로 따로 조회** (배치 처리 불가)
  - 일부 페이지 좌표 없음
  - 동음이의어 처리 필요 (예: "광주향교" → 하남시/광주광역시 disambiguation)
  - extract가 1~2 문장으로 짧음 (상세 스토리 부족)

### 2.4 국가유산청 통합검색 (heritage.go.kr)
- **URL**: HTML 페이지 스크래핑 필요
- **장점**: 시도지정 포함 최대 커버리지, 사진/상세 설명 있음
- **단점**: HTML 구조 파싱 필요, rate limit 가능성, 구조 변경 위험

### 2.5 공공데이터포털 (data.go.kr)
- **장점**: 공식 OpenAPI, 다양한 시도지정 API
- **단점**: 키 발급 필요 (즉시 발급 가능), API마다 응답 형식 다름

### 2.6 LLM (Claude / GPT) 활용
- **용도**:
  - HTML/extract → 구조화된 JSON 변환
  - 짧은 extract를 풍부한 스토리로 확장
  - **현장 퀴즈 자동 생성** (가장 가치 높음)
  - 시대/카테고리 정규화
- **비용**: Claude Sonnet 기준 1건당 ~$0.01, 2,000건 ~$20
- **단점**: API 키 필요, hallucination 위험 (검수 필수)

## 3. 우리 전략 — 하이브리드

```
┌─────────────────────────────────────────────────────────────┐
│  데이터 소스                                                  │
├─────────────────────────────────────────────────────────────┤
│  ① gis-heritage OpenAPI       → data/heritage.json         │
│     (국가지정 2,712건, 자동 fetch)                            │
│                                                              │
│  ② 위키피디아 REST API         → data/heritage-curated.json │
│     (시도지정·중요 사적 ~30건, 큐레이션 + 자동 fetch 혼합)     │
│                                                              │
│  ③ 우리 자체 mock 콘텐츠       → data/places.ts             │
│     (디자인 시연용 풍부한 스토리·퀴즈)                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
                  lib/heritage.ts에서 머지
                            ↓
            UI는 하나의 HeritageRecord[] 로 사용
```

### 단계별 진화

| Phase | 목표 | 데이터 규모 |
|---|---|---|
| **0 (현재)** | OpenAPI + 위키 큐레이션 | 2,712 + ~30 |
| 1 | 공공데이터포털 시도지정 API 추가 | ~수천 더 |
| 2 | Claude API로 퀴즈 자동 생성 | 전체 |
| 3 | 스크래핑 + AI 정제 파이프라인 | 풀스케일 |
| 4 | 사용자 UGC + 검수 시스템 | 무제한 |

## 4. 데이터 구조

### HeritageRecord (통합 타입)

```ts
type HeritageRecord = {
  // OpenAPI 원본 필드
  ccbaKdcd: HeritageCategoryCode;
  name: string;
  admin: string | null;
  designatedDate: string | null;  // YYYYMMDD
  era: string | null;
  category: string | null;
  cnX: string | null;       // 한국 좌표계 X
  cnY: string | null;       // 한국 좌표계 Y
  designation: string | null;
  classification: string | null;
  sn: string | null;
  location: string | null;

  // 큐레이션/위키 추가 필드 (optional)
  source?: 'openapi' | 'curated';
  nameHanja?: string | null;
  coords?: { lat: number; lon: number } | null;  // WGS84
  summary?: string | null;
  story?: string | null;
  wikipediaUrl?: string | null;
  tags?: string[];
};
```

### 카테고리 코드 (ccbaKdcd)

| 코드 | 종목 | 데이터 출처 |
|---|---|---|
| 11 | 국보 | gis-heritage |
| 12 | 보물 | gis-heritage |
| 13 | 사적 | gis-heritage |
| 14 | 명승 | invalid (15와 혼재 가능) |
| 15 | 명승 (실제) | gis-heritage |
| 16 | 천연기념물 | gis-heritage (제외 — 자연물) |
| 17 | 국가무형유산 | gis-heritage (제외 — 무형) |
| 18 | 국가민속문화유산 | gis-heritage |
| 21 | 시도유형문화재 | **위키 큐레이션** ⭐ |
| 22 | 시도무형유산 | 미수집 (무형) |
| 23 | 시도기념물 | 위키 큐레이션 (TODO) |
| 24 | 시도민속문화재 | 위키 큐레이션 (TODO) |
| 25 | 시도등록문화재 | 위키 큐레이션 (TODO) |
| 31 | 문화유산자료 | 위키 큐레이션 (TODO) |
| 79 | 국가등록문화유산 | gis-heritage |

## 5. 좌표계 처리

- **gis-heritage**: `cnX`, `cnY` — **한국 좌표계** (UTM-K, EPSG:9020203 추정). 위경도 아님. 지도 표시하려면 `proj4`로 WGS84 변환 필요.
- **위키피디아**: `coordinates.lat/lon` — **WGS84** 위경도 바로 사용 가능.
- **장기 해결**:
  - `proj4` 라이브러리로 일괄 변환 → 모든 레코드에 `coords` (WGS84) 부여
  - 또는 fetch 단계에서 변환해서 저장

지금은: **위키 큐레이션 항목만 `coords` 채움**. OpenAPI 항목은 추후.

## 6. 필터링 정책

수집 대상은 **유물 + 역사적 장소**. 제외:

| 종목 | 제외 이유 |
|---|---|
| 천연기념물 (16) | 노목·동물·암석 → 자연물 |
| 국가무형유산 (17) | 판소리·탈춤 → 무형 |
| 시도무형유산 (22) | 동상 |
| 명승 자연경관 | 산·폭포 → 역사성 약함 |

명승은 `ctgrname`에 "문화경관" 또는 "역사" 포함되는 것만 keep.

## 7. 자동화 스크립트

### 7.1 `scripts/fetch-heritage.mjs` — OpenAPI 일괄 fetch
```bash
node scripts/fetch-heritage.mjs
```
- 6개 종목 (11, 12, 13, 15, 18, 79) fetch
- 필터 적용 (천연기념물, 무형 제외)
- → `data/heritage.json` 저장

### 7.2 `scripts/fetch-curated-heritage.mjs` — 위키 큐레이션 fetch
```bash
node scripts/fetch-curated-heritage.mjs
```
- 사전 정의된 타겟 목록 (`TARGETS` 배열)
- 각각 위키 API 호출 → extract 파싱 → 구조화
- 한자, 시대, 지정 번호, 좌표 추출
- → `data/heritage-curated.json` 저장

타겟 목록 늘리는 법: `TARGETS` 배열에 위키 페이지 제목 추가.

## 8. AI/LLM 활용 (향후)

### 8.1 퀴즈 자동 생성 (Phase 2 목표)
```
입력: HeritageRecord (name, era, story)
↓ Claude API
출력: Quiz { q, options[], answer, hint }
```
- 비용: ~$0.01/건, 2,712건 → ~$27
- 검수: 샘플링으로 사람 검토

### 8.2 스토리 확장 (Phase 3)
위키 extract (1~2 문장) → LLM → 풍부한 답사 스토리 (3~5 단락)

### 8.3 한자/시대 정규화 (Phase 1)
원본 데이터의 표기 불일치 정리:
- "조선 후기" → "조선시대"
- 한자 누락 → 한국한자사전 + LLM 보완

## 9. 진행 기록

### 2026-05-21
- ✅ gis-heritage OpenAPI 8개 코드 fetch → 2,821건 (heritage.json 1.2MB)
- ✅ 카테고리 코드 매핑 오류 발견 (15=명승, 16=천연기념물) → 수정
- ✅ 천연기념물(16) + 국가무형(17) + 명승 자연경관 제외 필터 적용
- ✅ 최종 OpenAPI 데이터: **2,712건** (1.13MB)
- ✅ 위키 API 검증 — 시도지정 데이터 수집 가능 확인
- ✅ `scripts/fetch-curated-heritage.mjs` 작성 (위키 REST API + 검색 fallback + throttling)
- ✅ 초기 큐레이션 배치 — **20건 성공 / 4건 실패**
  - 성공: 팽성읍 객사, 대동법 시행기념비, 향교 9곳(강릉/안성/양주/청주/영동/경주/전주/남원/나주), 강릉 임영관, 안성 객사 정청, 김제동헌, 청주 동헌, 북관대첩비, 척화비, 인천우체국, 문화역서울 284, 효창공원
  - 실패: 충주_동헌, 노량진_사육신_묘역, 정릉_(서울_정릉동) [disambiguation], 충주_관아공원
- ✅ `lib/heritage.ts` 머지 로직 — OpenAPI + 큐레이션 합쳐서 `HERITAGE` 노출
- ✅ `data/heritageCategories.ts`에 시도지정 코드(21, 23, 24, 31) 추가
- ✅ 통합 결과: **HERITAGE 2,732건** (OpenAPI 2,712 + 큐레이션 20)
- ✅ 타입체크 통과
- ✅ **그룹핑 (옵션 A — 자식 숨김 + 우산만 표시)**
  - prefix 자동 감지 룰: 어떤 레코드 X의 공백 prefix가 다른 레코드 이름과 정확히 일치하면 X는 자식
  - 65개 우산 자동 인식, 217건 자식 자동 묶음
  - 메인 리스트: **HERITAGE_COLLAPSED = 2,515건** (2,732 → 자식 217 숨김)
  - 우산 TOP: 창덕궁(13), 경주 양동마을(12), 보은 법주사(11), 남원 실상사(11), 경복궁(9), 창경궁(9), 안동 하회마을(9), 순천 낙안읍성(9), 경주 불국사(8), 구례 화엄사(7), ...
  - 보너스: 절터(고달사지·성주사지·만복사지·보원사지)도 자동 인식
  - API: `HERITAGE_COLLAPSED`, `getGroupChildren(umbrellaName)`, `getUmbrellaOf(record)`, `isUmbrella(record)`
- 🔲 UI 통합 ("전체 유산 둘러보기" 화면)
- 🔲 실패 4건 슬러그 보정 / 위키 검색 fallback 강화
- 🔲 향교 등 시대 누락 정규식 보강 (extract에 "조선시대" 직접 표기 없는 경우)

#### 그룹핑 설계 결정

**옵션 A 채택 이유**:
- 답사 앱은 "한 장소 = 한 방문 = 한 스탬프" 단위가 자연스러움
- 낙안읍성 안의 ㄱ자집·주막집을 따로 9번 방문하는 건 학습 의도와 안 맞음
- 자식 데이터는 우산 상세 페이지의 "함께 보호되는 N개 자산" 섹션에서 노출 가능
- 정밀 검색 시 자식도 찾히게 하되 결과는 우산으로 리다이렉트

**자동 감지의 정확도**:
- 공백 기반 prefix 매칭 → 한국 유산 명명 컨벤션 ("[지역] [이름] [세부]")과 잘 맞음
- 예외 케이스: "수원 화성행궁" 처럼 띄어쓰기 없는 합성어는 미감지 (이런 건 적음)
- 우산이 데이터에 없는 자식은 미감지 → 현재로선 문제 없음

**향후**:
- 좌표 기반 보정 (~100m 이내 + 같은 분류) — 띄어쓰기 예외 케이스 잡기
- 수동 그룹 추가 가능하게 `data/heritage-groups.ts` 옵션
- 시도지정 추가되면 같은 우산 룰 적용

### Future
- 🔲 공공데이터포털 키 발급 + 시도지정 OpenAPI 추가
- 🔲 좌표계 변환 (proj4)
- 🔲 Claude API로 퀴즈 생성
- 🔲 사진 수집 전략
- 🔲 사용자 UGC 검수 흐름

## 10. 라이선스 / 출처

- **gis-heritage.go.kr** — 공공누리 (출처 표기 시 자유 이용)
- **위키피디아** — CC BY-SA 3.0 (출처 표기 + 동일 라이선스 적용)
- **자체 큐레이션 콘텐츠** — 별도 정책 수립 필요

앱 내 표기: 장소 상세 페이지 하단에 "출처: 국가유산청 · 위키피디아" 명시 권장.
