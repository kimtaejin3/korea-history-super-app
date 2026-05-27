# 지도탭 리스트 스크롤 성능 잡기 (expo-image + memo + getItemLayout)

지도탭 "내 주변" 리스트가 항목 수십 개만 돼도 JS 프레임이 급락하며 스크롤·애니메이션이 버벅였다. 진단 → 원인 → 처방 기록.

## 증상

- 항목 **10개**일 땐 매끄러움. **80~260개**가 되면 스크롤 시 JS 프레임 급락, 버벅임.
- 직관적 의문: "가상화가 되면 화면엔 ~10개만 그릴 텐데, 왜 총 개수에 따라 이렇게 차이가 나지?"

## 진단 — 렌더 카운트 로그

가상화 작동 여부부터 확정. `renderItem`에 카운터를 심었다:

```tsx
let __rowRenderCount = 0;
// renderItem 안:
__rowRenderCount += 1;
console.log(`[map row] #${__rowRenderCount} id=${p.id} (total=${nearby.length})`);
```

판정 기준:
- 마운트 직후 **~N번** 찍힘 → 가상화 안 됨 (전부 렌더)
- **~10~20번**에서 멈추고, **스크롤할 때마다** 새 id가 찍힘 → 가상화 됨

결과: **후자**. 스크롤로 화면에 들어오는 행만 그때그때 찍혔다 → **가상화는 정상 작동**. 화면 밖은 안 그린다.

→ 그러면 범인은 가상화가 아니라 **(1) 행 mount 비용 + (2) mount/unmount churn + (3) 리렌더 전파** 였다.

## 진짜 원인

### 1. FlatList는 재활용(recycling)을 안 한다
행이 화면 밖으로 나가면 **언마운트(파괴)**, 다시 들어오면 **새로 마운트(생성)**. 스크롤 = 끊임없는 mount/unmount. 그리고 행 하나 mount가 비쌌다:

- **RN 기본 `<Image>`** — uri 디코딩이 행 mount마다 발생, 메인 스레드 블로킹. 다운샘플링·캐시 약함. (유산 99%가 사진이라 거의 모든 행에 해당)
- 새 View 트리 생성, Tag·Text 레이아웃

→ 스크롤하는 매 프레임마다 "무거운 행을 새로 생성" → JS·UI 프레임 드랍.

### 2. 왜 10개 vs 260개 차이가 큰가
- **10개**: 화면에 다 들어와 한 번 mount 후 끝. 스크롤할 게 없으니 churn 0.
- **80~260개**: 계속 스크롤 → 계속 mount/unmount churn → 지속적인 JS·UI 압박. 개수↑ = 스크롤 거리↑ = churn 총량↑.

### 3. 리렌더 전파
- `renderItem`이 인라인 클로저 → MapScreen 리렌더(필터·쿼리상태·fetchReady·infiniteQuery 갱신…)마다 새 함수 → 마운트된 행 전부 재렌더
- 행에 `React.memo` 없음 → 부모 리렌더가 그대로 전파
- `STAMPED.includes(id)` → 행마다 O(n)
- `ItemSeparatorComponent={() => ...}`, `keyExtractor={(p)=>p.id}` 인라인 → 매 렌더 새 참조

## 처방

### 1. expo-image로 교체 (`PhotoPlaceholder.tsx`) — 효과 최대
```tsx
import { Image } from "expo-image";
<Image
  source={{ uri: photoUrl }}
  contentFit="cover"
  cachePolicy="memory-disk"   // 재진입 시 재디코드 안 함
  transition={150}
  recyclingKey={photoUrl}     // 뷰 재활용 시 이전 이미지 잔상 방지
/>
```
디코딩이 메인 스레드 밖 + 메모리/디스크 캐시 → 행 mount가 더 이상 디코드로 블로킹되지 않음.

### 2. 행을 memo로 분리 (`map.tsx`)
```tsx
const PlaceRow = memo(function PlaceRow({ place, stamped, onPress }) { ... });
```
부모(MapScreen) 리렌더가 각 행에 전파되지 않음. props 같으면 스킵.

### 3. 모든 참조 고정
```tsx
const keyExtractor = (p: Place) => p.id;     // 모듈 스코프
const Separator = () => <View style={{ height: ROW_GAP }} />;
const onPressPlace = useCallback((id) => router.push(`/place/${id}`), [router]);
const renderItem = useCallback(({ item }) => (
  <PlaceRow place={item} stamped={stampedSet.has(item.id)} onPress={onPressPlace} />
), [stampedSet, onPressPlace]);
```
리렌더마다 새 함수가 안 생겨 FlatList가 행을 통째로 다시 그리지 않음.

### 4. stamped 조회 O(1)
```tsx
const stampedSet = useMemo(() => new Set(stampedQuery.data ?? []), [stampedQuery.data]);
// stampedSet.has(id)  ← 이전: STAMPED.includes(id) O(n)
```

### 5. getItemLayout (행 높이 고정)
```tsx
const ROW_HEIGHT = 88;  // 사진 64 + p-3(12*2) 패딩. 이름/주소 numberOfLines={1}로 1줄 고정
const getItemLayout = useCallback((_, index) => ({
  length: ROW_HEIGHT,
  offset: (ROW_HEIGHT + ROW_GAP) * index,
  index,
}), []);
```
FlatList가 위치를 O(1)로 알아 측정 없이 정확히 윈도우만 렌더.

### 6. 윈도우 축소
```tsx
windowSize={7}            // 기본 21 → 동시 마운트 셀 수↓
maxToRenderPerBatch={8}
initialNumToRender={8}
removeClippedSubviews     // 화면 밖 뷰 언마운트
```

## 결과

스크롤·애니메이션 버벅임이 체감상 크게 사라짐. 라이브러리 교체(FlashList/Legend List) **없이**, FlatList 그대로 해결.

헤비 스크롤에서 프레임을 지킨 기여도 (메커니즘 기반 추정 — 아래 caveat 참고):

| 기여 | 역할 | 비중 |
|---|---|---|
| **expo-image** | 행 mount마다 막던 이미지 디코드를 오프스레드+캐시로 제거 | ★ 최대 |
| **getItemLayout** | 새 행 mount 시 레이아웃 측정 패스 제거 (높이 미리 앎) | 큼 |
| **memo + 참조 고정** | 스크롤 끝 `fetchNextPage`→부모 리렌더 시 마운트된 행 전부 재렌더되던 것 차단 | 큼 |
| **windowSize 축소** | 동시 마운트 수·메모리↓ (mount **개수**를 줄임, mount **비용**은 못 낮춤) | 보조 |

> ⚠️ **windowSize는 주역이 아니다.** 버퍼 크기를 줄여 동시 마운트 수를 낮출 뿐, 스크롤 중 매번 생기는 행 mount의 비용 자체는 안 낮춘다 (오히려 너무 작으면 빠른 스크롤 시 빈칸이 보일 수 있음). 헤비 스크롤이 매끄러워진 건 mount를 싸게 만든 **expo-image·getItemLayout**과, 페이지네이션 리렌더를 막은 **memo** 덕이 크다.

**검증의 한계**: 위 처방을 한꺼번에 적용해서 각 항목의 기여를 격리 측정하진 않았다. 위 비중은 메커니즘 기반 추정이다. windowSize의 몫만 따로 보려면 다시 21로 되돌려 비교하면 된다 — 그래도 매끄러우면 windowSize는 거의 무관하다는 증거.

## 교훈

1. **"가상화 됐는데 왜 느리지?"의 답은 보통 "재활용이 없어서 + 행이 무거워서".**
   FlatList는 가상화(화면 밖 안 그림)는 하지만 재활용(뷰 인스턴스 재사용)은 안 한다. 스크롤 = mount/unmount 반복 → 행 mount가 비싸면 그대로 프레임 드랍.
2. **이미지 많은 리스트는 expo-image가 거의 항상 정답.** RN 기본 Image의 메인 스레드 디코드가 숨은 범인인 경우가 많다.
3. **추측 전에 측정.** 렌더 카운트 로그 한 줄로 "가상화 안 됨(A)"과 "가상화는 되는데 다른 데서 O(N)(B)"을 1분 만에 갈랐고, 처방이 완전히 달라졌다.
4. **라이브러리 교체는 마지막 수단.** 행 비용·리렌더부터 잡으면 FlashList/Legend List 없이도 해결될 때가 많다. (특히 `@gorhom/bottom-sheet` 안에서는 전용 스크롤러블 통합이 필요해 교체 비용이 큼.)

## 다음 단계 (필요 시)
스크롤 churn이 더 남으면 **Legend List `recycleItems`** 또는 FlashList로 재활용을 얹는다. 단 `@gorhom/bottom-sheet`와의 제스처 연동을 위해 전용 스크롤러블로 래핑해야 한다 (별도 작업).

## 관련 문서
- `docs/context-split-rerender.md` — 컨텍스트 분리로 morph 시작 리렌더 제거
- `docs/threads-and-performance.md` — UI vs JS 스레드, 워크릿
