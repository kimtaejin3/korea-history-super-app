# Navigation & 화면 전환 성능

뒤로가기 제스처와 화면 전환이 다른 RN 앱보다 빠르게 느껴지는 이유와, 토스급으로 가려면 어디까지 더 가야 하는지에 대한 정리.

## 현재 적용된 설정

`app/_layout.tsx`:

```tsx
import { enableFreeze, enableScreens } from 'react-native-screens';

enableScreens(true);
enableFreeze(true);
```

`app.json`:

```json
{
  "expo": {
    "newArchEnabled": true
  }
}
```

이게 전부. 그 외에는 expo-router의 기본 `<Stack>` 사용.

## 각 설정의 역할

### `enableScreens(true)`
화면 백엔드를 네이티브로 강제. 이게 켜져야 `react-native-screens`가 네이티브 컴포넌트로 마운트됨.

- **iOS**: `UIViewController` 기반 스택 (UIKit)
- **Android**: `FragmentContainerView` 기반 스택

기본값으로 켜져 있긴 한데 명시적으로 보장하기 위해 호출.

### `enableFreeze(true)` ⭐ 체감 차이의 주인공
스택에 깔린 뒷화면들의 **렌더링을 정지**시킴.

- 홈 → 장소 상세 → 유물 상세로 깊게 들어가면 뒤 두 화면 그리기 멈춤
- CPU/GPU가 top 화면에만 100% 집중
- 뒤로 갈 때 freeze 해제만 하면 되니 **재마운트 없이 즉시 복귀**
- 메모리도 절약 (특히 큰 ScrollView/리스트가 깔려 있을 때)

**부작용**: freeze된 화면의 `useEffect` 콜백, 타이머, 애니메이션 루프가 일시정지될 수 있음. 우리 앱에는 영향 없는 수준 (체크인 화면의 GPS 펄스도 본인이 top일 때만 돌아서 OK).

### New Architecture (Fabric)
`app.json`의 `"newArchEnabled": true`. 렌더링 파이프라인 자체가 빨라짐 (JS 브릿지 없이 JSI로 직통).

### Native Stack
expo-router의 `<Stack>`이 기본적으로 `@react-navigation/native-stack` 사용. JS 기반 stack 아님.

- **iOS**: `UINavigationController` 직접 사용 → 화면 전환과 뒤로가기 제스처를 시스템 UIKit이 핸들링 → 60fps 보장
- **Android**: `FragmentTransaction`

### Hermes
Expo 54 기본 JS 엔진. 콜드 스타트 + 런타임 둘 다 빠름.

## iOS vs Android 차이

| 항목 | iOS | Android |
|---|---|---|
| 백엔드 | UIKit (`UIViewController`) | Fragment |
| 뒤로가기 제스처 | 가장자리 스와이프 (iOS 기본) | 시스템 백 버튼 또는 Predictive Back (Android 13+) |
| 제스처 임계점 | iOS UIKit hardcoded (~50% 또는 빠른 속도) | OS 의존 |
| 전환 애니메이션 | iOS 시스템 슬라이드 | Android 시스템 (보통 fade/slide) |
| `enableFreeze` 효과 | ✅ | ✅ |

**Android Predictive Back**: 현재 `app.json`에 `"predictiveBackGestureEnabled": false`로 꺼져 있음. Android 13+에서 시스템 백 제스처 미리보기를 켜고 싶다면 `true`로 바꿔야 함.

## 시도했다가 제거한 옵션들

### `fullScreenGestureEnabled: true`
화면 전체에서 스와이프 가능. 토스 느낌 시도용.

**제거 사유**: 수직 스크롤과 충돌. 아래로 스크롤하다가 뒤로가기 트리거되는 부작용 발생.

### `gestureResponseDistance: { start: N }`
가장자리 N픽셀 영역만 제스처 활성.

**제거 사유**: `fullScreenGestureEnabled: true`와 함께 써야만 동작하는데, 그 조합에서도 임계점 자체는 못 바꿔서 체감 변화가 미미.

### `animationDuration: 220`
전환 애니메이션 빠르게.

**제거 사유**: 결국 임계점이 같으니 체감 변화 미미. 단순한 옵션이라 원하면 다시 켜도 됨.

### `customAnimationOnGesture: true`
v3에서 사용. **react-native-screens v4에서 제거됨** (기본 동작이 됐기 때문).

## 토스 vs 우리 vs 일반 RN 앱

### 일반 RN 앱
- `enableFreeze` 안 쓰는 경우 많음 → 뒤 화면도 그려서 CPU 낭비
- 화면 전환 시 끊김 + 메모리 사용량 높음

### 우리 앱 (현재)
- `enableFreeze` + Native Stack + Fabric + Hermes
- iOS 기본 가장자리 스와이프 + 시스템 임계점
- "표준 RN 앱보다는 확실히 빠른" 수준

### 토스
- UIKit 우회 + 자체 네이티브 제스처 모듈
- Reanimated worklet으로 메인 스레드 안 거치는 진행도 추적
- 임계점 30% 정도로 낮춤 + 부드러운 곡선
- **iOS API로는 도달 불가, 네이티브 코드(Swift) 작성 필요**

당근(Karrot) 앱도 토스만큼 빠르진 않다는 게 일반적 평가 — 그만큼 토스가 outlier.

## 토스급으로 가려면 (필요해질 때)

순서대로 시도:

1. **`@react-navigation/stack` (JS 기반)으로 교체** + `gestureVelocityImpact: 0.8`
   - native-stack보다 무겁지만 임계점 튜닝 가능
   
2. **`react-native-gesture-handler` 커스텀**
   - `PanGestureHandler` + `activeOffsetX([-15, 15])` + `failOffsetY([-15, 15])`
   - 수평 우선 / 수직 양보 룰 직접 구현
   
3. **Reanimated worklet으로 진행도 추적**
   - 메인 스레드 안 거치고 화면 위치 업데이트
   - 60fps 보장

4. **Swift 네이티브 모듈로 화면 전환 재구현**
   - UIKit 우회, iOS native pop animation을 자체적으로 재구현
   - interruptible, snappier curve
   - 토스가 추정컨대 여기까지 함

1번부터 시도하면서 충분해지면 멈추기. 우리 앱은 출시 직전 폴리시 단계에 다시 보면 됨.

## 참고 자료

- [react-native-screens 공식 문서](https://github.com/software-mansion/react-native-screens)
- [Toss 기술 블로그 — RN 도입기](https://toss.tech/article/react-native-2024)
- [당근 stackflow](https://github.com/daangn/stackflow) — RN보다 웹에 가까운 라이브러리
- [@react-navigation/native-stack 옵션](https://reactnavigation.org/docs/native-stack-navigator)
