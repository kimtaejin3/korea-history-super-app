# 검색 트랜지션 오버레이 첫 누름 딜레이 잡기

홈 검색 버튼을 누르면 morph가 시작되기까지 살짝 지연이 느껴지던 문제. 특히 **앱 세션의 첫 누름**에서 더 두드러짐. 원인은 오버레이가 매번 새로 mount/unmount되며 Reanimated 인프라를 다시 셋업하던 것. 항상 mount해두고 opacity로만 가시성 토글하는 것으로 해결.

관련 문서: [search-bar-handoff-flicker.md](./search-bar-handoff-flicker.md) (지도 검색바에 같은 패턴 적용한 글)

## 증상

- 홈에서 검색 버튼을 처음 탭 → 모핑이 시작되기까지 50~120ms 정도 지연
- 두 번째 탭부터는 덜하지만 여전히 측정 가능한 지연
- 빠른 디바이스보다 저사양 디바이스에서 더 두드러짐

## 흐름 트레이스 (Before)

```
[앱 시작]
  Overlay 컴포넌트가 if (!state.active) return null로 트리에서 빠짐
  Reanimated 런타임 미가동

[탭]
  store.start() → state.active=true
  ↓
  Overlay 컴포넌트 재렌더 → JSX 반환 시작
  ├─ Animated.View 네이티브 뷰 새로 생성 (RN 브릿지 작업)
  ├─ useSharedValue × 7 메모리 할당
  ├─ useAnimatedStyle worklet 등록
  └─ Reanimated 런타임 첫 가동 ← 가장 비쌈 (앱 세션 1회)
  ↓
  useEffect 실행 → 값 source로 세팅 + withTiming
  ↓
  첫 모핑 프레임
```

매 탭마다 동일한 mount 비용 발생. 첫 탭은 거기에 더해 Reanimated 런타임 콜드 스타트 비용까지.

## 원인 — 조건부 mount의 함정

```tsx
// Before
if (!state.active) return null;
return <Animated.View ...>...</Animated.View>;
```

`null` 반환은 "트리에서 제거"라 다음 mount 시 처음부터 다시 셋업. 트리에 들어오는 순간이 비싼 거지, 트리에 있는 것 자체가 비싸진 않음.

특히 **Reanimated 런타임 첫 가동**은 앱 세션에서 한 번만 발생하지만, 그 한 번이 사용자의 첫 인터랙션 타이밍과 겹치면 "처음 누르면 굼뜸" 인상을 줌.

## 해결 — 항상 mount + opacity로만 가시성 토글

```tsx
// After
useEffect(() => {
  if (!state.active || !state.source || !state.target) {
    opacity.value = 0;       // ← 비활성 시 숨김 (트리에는 남김)
    return;
  }
  // ... morph 시작 ...
}, [...]);

// if (!state.active) return null;  ← 제거
return <Animated.View style={[styles.container, containerStyle]} pointerEvents="none">
```

`useSharedValue(0)`로 초기 opacity가 0이라 처음엔 보이지 않음. 누르면 effect가 opacity=1로 바꾸며 source로 점프 + withTiming 시작.

### 흐름 트레이스 (After)

```
[앱 시작]
  Overlay 컴포넌트 마운트 (opacity=0이라 보이지 않음)
  ├─ Animated.View 네이티브 뷰 생성 ← 1회만
  ├─ useSharedValue × 7 할당 ← 1회만
  ├─ useAnimatedStyle worklet 등록 ← 1회만
  └─ Reanimated 런타임 가동 ← 1회만, 스플래시 가려진 동안

[탭]
  store.start() → state.active=true
  ↓
  useEffect 실행 → 값 source로 세팅 + opacity=1 + withTiming
  ↓
  곧장 첫 모핑 프레임 (mount 비용 0)
```

세션 전체에서 Animated.View와 그 인프라는 단 한 번만 생성됨. 사용자가 누른 순간엔 이미 다 준비돼있어서 값 갱신만 하면 됨.

## 마운트 vs 가시성 — 헷갈리지 않기

| 상태 | 트리에 있는가 | 보이는가 | 비고 |
|---|---|---|---|
| `null 반환` | ❌ | ❌ | mount/unmount 비용 발생 |
| `opacity=0` | ✅ | ❌ | 평상시 상태, 비용 거의 없음 |
| `opacity=1` | ✅ | ✅ | morph 중 |

**mount ≠ visible**. 안 보이는 것과 트리에서 빠진 것은 다른 비용 구조.

## 트레이드오프

- ✅ 첫 누름·후속 누름 모두 응답 빠름 (mount 비용 0)
- ✅ Reanimated 런타임이 앱 시작 시 warmup (스플래시 화면이 가려줌)
- ⚠️ 평소에도 빈 Animated.View 1개가 루트에 떠있음 — opacity 0 + pointerEvents none이라 시각/터치 영향 없음, leaf 1개 layout 비용은 무시할 만함
- ⚠️ 매 morph 시작 시 effect가 shared value 초기화를 책임짐 — null 분기에서 명시적으로 opacity=0 리셋 필요 (자동 정리 안 됨)

## 일반화 — 인터랙션 응답성 챙길 때의 패턴

이 프로젝트에서 같은 원리가 적용된 곳들:

1. **SearchTransitionOverlay** (이 글) — morph 시작 응답성
2. **지도 검색바** ([search-bar-handoff-flicker.md](./search-bar-handoff-flicker.md)) — morph 종료 시 핸드오프 매끄러움
3. **NearbySheet의 FlatList** (`initialNumToRender`, `maxToRenderPerBatch`) — 스크롤 시 새 행 mount 비용 분산

공통 교훈:
> **인터랙션 응답이 느리다고 느껴지면, "그 순간 mount하는 무엇이 있는지" 의심하기.**
> 가능하면 mount를 인터랙션 시점에서 떼어내 앱 시작/스크롤 prep 같은 시점으로 옮기고, 인터랙션 순간엔 prop/opacity 변경만 일어나도록 만들기.

조건부 mount는 메모리/idle 비용 절약이라는 매력이 있지만, **인터랙션 핫패스에 있다면 응답성을 갈아 마시는 트레이드오프**임을 기억할 것.

## 검증

- iOS 시뮬레이터 Debug → Slow Animations 켜고 첫 탭 → morph 시작 시점 관찰 (전엔 시각적 갭, 후엔 즉시 시작)
- 폰에서 앱 cold start 후 처음 탭 → 50~100ms 지연이 사라졌는지
- 두 번째 탭부터 차이가 미세하면 정상 (이전부터 이미 무거운 첫 탭 이후엔 캐싱되어 빠름)
