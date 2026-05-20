# React Native: UI 스레드 vs JS 스레드

화면이 매끄럽게 보이는지 좌우하는 건 **어느 스레드에서 무슨 일을 시키느냐**. 본 문서는 RN 성능의 기본 모델과, 실제 우리 앱에서 어떻게 적용/체크할지를 정리.

## TL;DR

- RN에는 **UI 스레드**(=네이티브 렌더링)와 **JS 스레드**(=React/비즈니스 로직)가 따로 돈다.
- **UI가 끊기면 화면이 얼고**, **JS가 끊기면 인터랙션이 답답해진다**.
- **시각적인 일은 UI로**, **로직은 JS로** — 그게 RN 성능의 제1원칙.
- Reanimated 워크릿 / Gesture Handler는 "JS처럼 짜는데 UI 스레드에서 도는" 도구. 적극 활용.
- 측정 없이 최적화하지 말 것. Perf Monitor / React DevTools Profiler로 먼저 본 다음 핀포인트.

## 두 스레드의 역할

| 스레드 | 담당 | 비유 |
|---|---|---|
| **UI** | 네이티브 렌더링 (픽셀 그리기), 스크롤, 제스처, **Reanimated 워크릿** | 인쇄기 |
| **JS** | React 렌더 트리 계산, state, 이벤트 핸들러, fetch, NativeWind className 파싱 등 | 작가 |

> 작가(JS)가 느려도 인쇄기(UI)는 마지막 받은 내용을 60fps로 계속 인쇄한다 → 화면은 매끄러움.
> 인쇄기(UI)가 멈추면 작가가 멀쩡해도 사용자는 아무것도 못 본다.

## 우리가 겪은 사례 — 검색 → 지도 진입

홈에서 검색 버튼 탭 시 Perf Monitor:

```
UI: 60fps  ✅
JS: ~51fps (잠시 dip)
```

JS만 떨어지는 이유:

1. `haptic.tap()` 호출 (native bridge)
2. `measureInWindow` 콜백
3. `startSearchTransition` — 컨텍스트 state 갱신
4. `router.push('/(tabs)/map')` — 새 스크린 마운트
5. **Map 스크린의 마운트 비용**: `useQuery` 2개, `BottomSheet` 초기화, `LinearGradient`, 필터, 리스트 등 한 번에 렌더
6. NativeWind className 파싱(JS에서 동작)

이게 한꺼번에 몰려서 JS dip. 하지만 검색바 모핑 애니메이션은 **워크릿으로 UI 스레드에서 돌기 때문에** 사용자 눈에는 매끄럽게 보임. **이게 Reanimated 쓰는 진짜 이유**.

## 어디에 무엇을 둘 것인가

| 작업 | 어디서 도는 게 맞나 | 어떻게 |
|---|---|---|
| 애니메이션(spring, fade, scale, morph) | UI ✅ | Reanimated 워크릿 (`useSharedValue`, `withTiming`, `withSpring`) |
| 제스처(스와이프, 핀치, 드래그) | UI ✅ | `react-native-gesture-handler` |
| 스크롤 반응 효과(헤더 fade 등) | UI ✅ | `useAnimatedScrollHandler` |
| state 변경 | JS | React 트리 갱신은 본래 JS |
| fetch / 데이터 가공 | JS | React Query 등 |
| 컴포넌트 마운트 | JS | React 자체가 JS |
| 이벤트 핸들러 로직 | JS | onPress 콜백 등 |

## 실전 원칙

### 1. 애니메이션은 무조건 Reanimated 워크릿

```ts
// ❌ 옛날 Animated API + useNativeDriver:false → JS-driven, JS 51fps면 애니메이션도 51fps
Animated.timing(value, { useNativeDriver: false }).start();

// ✅ Reanimated 워크릿 → UI 스레드에서 매 프레임 계산. JS가 점유돼도 60fps 유지
const offset = useSharedValue(0);
offset.value = withTiming(100);
```

> 우리 앱의 `SearchTransitionOverlay`는 이미 워크릿 기반.

### 2. 무거운 JS 작업은 인터랙션 이후로 미루기

JS 스레드는 단일. 한 함수가 100ms 돌면 React 렌더, 이벤트, 콜백이 다 멈춤.

```ts
// ❌ 마운트 시 즉시 무거운 정렬
const sorted = bigArray.sort(complexCompare); // 100ms 블로킹

// ✅ 인터랙션 끝난 뒤로 미룸
import { InteractionManager } from 'react-native';

InteractionManager.runAfterInteractions(() => {
  const sorted = bigArray.sort(complexCompare);
  setData(sorted);
});
```

또는 `useMemo`로 캐시해서 동일 input일 때 재계산 자체를 피함.

### 3. 리스트는 가상화

`ScrollView`로 100개 아이템을 깔면 매 렌더 100개 JSX 처리 → JS 폭주.

- 짧고 정적 → `ScrollView` OK
- 길거나 동적 → `FlatList` 또는 `@shopify/flash-list` 사용 → 화면에 보이는 아이템만 렌더

지도 화면 `BottomSheetScrollView` 안의 장소가 많아지면 `FlatList`로 교체 고려.

### 4. 큰 컴포넌트는 `React.memo`

```tsx
export const PlaceRow = React.memo(function PlaceRow({ place }: Props) {
  return (...);
});
```

부모 리렌더 시 props가 동일하면 스킵. 단 props가 매번 새 객체/함수 참조면 memo 무의미 → `useCallback` / `useMemo`도 같이 챙김.

### 5. NativeWind 캐시 활용

`className`은 JS에서 파싱돼서 RN style로 변환됨. 같은 className은 캐시되므로, **동적으로 string을 조립하기보다** static className 사용하면 캐시 적중률 높아짐.

```tsx
// ❌ 매번 새로운 className 문자열 → 캐시 미스
<View className={`p-4 ${dynamic} rounded-xl`} />

// ✅ 분기 조합이라도 가능한 한 변수 분리
const card = on ? 'bg-ink text-paper' : 'bg-paper text-ink';
<View className={`p-4 rounded-xl ${card}`} />
```

성능 차이 적지만 누적되면 보임.

### 6. 네이티브 모듈로 떠넘기기 (필요할 때)

이미지 처리, 암호화, 대용량 직렬화 같은 진짜 무거운 일은 네이티브로. JS는 트리거만 보내고 결과만 받음. 토스의 Granite처럼 자체 네이티브 라이브러리 만드는 회사도 있음.

## 측정 도구

### Perf Monitor (간단 체크)
폰 dev menu(셰이크) → **Show Perf Monitor**. UI/JS fps만 빠르게.

### React DevTools (리렌더 시각화 + Profiler)
```bash
npx react-devtools
```
- ⚙️ → **Highlight updates when components render** → 인터랙션마다 색깔 박스로 리렌더 부분 보임
- **Profiler** 탭 → record → 인터랙션 → stop → flame chart로 컴포넌트별 렌더 시간/원인

### Production 빌드로 측정
```bash
npx expo run:ios --configuration Release
```
Dev 모드는 본질적으로 느림 (Strict Mode 더블 렌더, 인스펙터 등). **진짜 성능은 Release 빌드로 확인**.

## 안티패턴

| 패턴 | 왜 안 좋은가 |
|---|---|
| `useNativeDriver: false` 애니메이션 | JS-driven이라 JS 부하에 끌려감 |
| `onPress`에서 동기 무거운 계산 | JS 블로킹 → 인터랙션 응답 지연 |
| 큰 리스트에 `ScrollView` + `.map` | 화면 밖 아이템까지 다 마운트 |
| 인라인 함수/객체 props 남발 | 자식 `React.memo`가 무력화됨 |
| dev 모드 fps 보고 최적화 | 실제 빌드에선 멀쩡한데 시간 낭비 |
| 측정 없이 최적화 | 진짜 병목 아닌 곳 만지다가 가독성만 깎임 |

## 한 줄로

> UI 스레드는 60fps 유지 전담반. JS 스레드는 무거운 일을 하느라 가끔 떨어진다.
> **UI가 매끄러우면 사용자는 모른다.** 시각적인 일은 UI로, 로직은 JS로 — RN 성능의 기본.

## 우리 앱 체크리스트

- [x] 검색 모핑 — 워크릿 기반 (`SearchTransitionOverlay`)
- [x] 바텀시트 — `@gorhom/bottom-sheet` (워크릿 + gesture-handler)
- [x] React Query staleTime 60초 — 화면 진입 시 중복 fetch 방지
- [ ] Map 화면 마운트 무거움 — 필요 시 Profiler로 범인 확인
- [ ] Place/Artifact 리스트 길어지면 `FlatList`로 교체
- [ ] Release 빌드 한 번 측정해서 dev dip이 실제 영향인지 검증

## 참고

- [Reanimated 워크릿 모델](https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/worklets)
- [React Native 성능 가이드](https://reactnative.dev/docs/performance)
- [Why Did You Render — JS 측 리렌더 추적](https://github.com/welldone-software/why-did-you-render)
- [Expo 새 아키텍처(Fabric/Hermes)](https://reactnative.dev/architecture/landing-page)
