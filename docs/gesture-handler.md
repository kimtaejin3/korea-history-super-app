# Gesture Handler — 우리 앱은 어떻게 쓰고 있나

"제스처 라이브러리가 값비싼 연산이라더라"라는 발표를 듣고 우리 앱이 괜찮은지 확인한 결과 정리.

## 결론 먼저

- `react-native-gesture-handler` (RNGH) 패키지는 **설치돼 있음** (expo-router peer dep)
- 우리가 **직접 import해서 쓰는 곳은 0건**
- 뒤로가기 제스처는 **RNGH가 아니라 iOS UIKit이 처리** → 사실상 공짜 연산
- 지금이 가장 가볍고 빠른 구성

## 뒤로가기 제스처가 동작하는 실제 메커니즘

```
사용자가 가장자리 스와이프
  ↓
iOS UIKit (UINavigationController.interactivePopGestureRecognizer)
  ↓
화면 전환 애니메이션
  ↓
react-native-screens가 JS에 알림 (필요 시)
```

JS 스레드 거의 안 거침. UIKit이 다 처리. **사실상 공짜.**

## "값비싼 제스처"가 진짜로 비싼 경우

발표에서 말하는 게 다음 중 하나:

| 케이스 | 비용 | 설명 |
|---|---|---|
| `PanResponder` (RN 본가) | 비쌈 ❌ | JS 스레드에서 처리, 60fps 보장 못함 |
| RNGH v1 + JS bridge | 비쌈 ❌ | 옛날 방식, bridge 왕복 |
| **RNGH v2+ + Reanimated worklet** | 싸요 ✅ | UI 스레드 worklet으로 직접 처리 |
| **우리 케이스: UIKit native** | 가장 쌈 ✅✅ | iOS 시스템이 직접 처리 |

RNGH v2 이후로는 worklet으로 UI 스레드에서 돌아서 60fps 보장. 옛날 평판 때문에 "RNGH 비싸다"는 오해가 있는데, 지금은 안 그래요.

## 우리 앱 import 현황

- ✅ `react-native` 본가에서: `Pressable`, `ScrollView`, `Animated`, `View`, `Text` 등
- ❌ RNGH에서 import: 0건
- 체크인 플로우의 GPS 펄스 애니메이션도 RN 본가 `Animated` 사용 (RNGH 아님)

## 그래서 패키지는 왜 설치돼 있나

`expo-router`의 peer dependency. 내부적으로 일부 기능에 쓸 수 있어서 자동 설치되지만, **우리가 명시적으로 사용한 적 없음**. `npm uninstall`하면 expo-router 경고 뜨므로 그대로 둠.

## 토스급 제스처가 필요해지면

[navigation-performance.md](./navigation-performance.md) 참고. 그 단계에서는 RNGH + Reanimated worklet으로 커스텀 작성하게 되는데, 그때도 v2는 비싸지 않음.

## 한 줄 요약

지금 구성에서 **제스처 비용 걱정할 거 없음**. iOS UIKit이 다 처리해서 가장 싼 방식.
