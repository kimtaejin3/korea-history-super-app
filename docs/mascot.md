# Mascot (삽살개) + Lottie 셋업

전통 삽살개를 마스코트로 Lottie 애니메이션 통합. 컨셉은 "역사덕후 여행하는 삽살개".

## 현재 상태

- `lottie-react-native` 설치 완료
- `expo-dev-client` 설치 완료 (Lottie는 Expo Go에서 안 돌아감)
- `components/Mascot.tsx` — 진입점. `source` prop 있으면 Lottie 사용, 없으면 SVG 폴백
- `components/MascotLottie.tsx` — Lottie 전용 (Expo Go에서는 import 자체를 막기 위해 분리)
- `assets/animations/` — `.json` 파일 둘 자리
- 지금은 .json 파일이 없어서 SVG 폴백 작동 중

## 사용법

```tsx
import { Mascot } from '../components/Mascot';

// SVG 폴백 (지금 상태)
<Mascot size={140} />

// Lottie 파일 들어온 뒤
<Mascot
  size={140}
  source={require('../assets/animations/mascot.json')}
  loop
  speed={1}
/>
```

## Dev Client 빌드 (한 번만)

Lottie도 네이티브 모듈이라 Expo Go 아닌 dev client가 필요해요. 이미 빌드한 적 있으면 패키지가 바뀌었으니 한 번 재빌드:

```bash
npx expo prebuild --clean
npx expo run:ios
# 또는
npx expo run:android
```

그 다음부터는:
```bash
npx expo start --dev-client
```

## Lottie 파일 만들기 / 받기

### 직접 디자인하는 경우 (이 프로젝트의 길)

캐릭터 컨셉: **한국 전통 삽살개, 역사덕후 여행자**
- 풍성한 눈썹, 둥글둥글한 얼굴, 베이지+짙은 갈색
- 소품: 작은 갓 또는 머리띠, 등에 봇짐, 도장/두루마리
- 톤: 우리 앱 스타일(모던 미니멀 + 약간의 전통)에 맞춰 플랫 벡터

### 도구

| 도구 | 장점 | 단점 | 가격 |
|---|---|---|---|
| **Lottielab** (lottielab.com) | 웹 기반, 노코드, Figma import | 복잡한 본 리그 한계 | 무료/유료 |
| **Jitter** (jitter.video) | 웹, 깔끔한 UX | 캐릭터 본 리깅 약함 | 무료/유료 |
| **After Effects + Bodymovin** | 정통, 풀 컨트롤 | 학습곡선, AE 라이센스 | $20.99/월 |
| **LottieFiles Creator** | 무료 웹 에디터 | 기능 제한적 | 무료 |

### 추천 워크플로우

1. **컨셉 스케치** — 종이/Figma에서 캐릭터 정적 디자인
2. **벡터 정리** — Figma 또는 Illustrator에서 SVG 완성
3. **Lottielab 또는 Jitter로 import** — 웹 에디터에 SVG 올리고 모션 추가
4. **idle 애니메이션 먼저** — 꼬리 흔들기, 눈 깜빡임, 살짝 위아래 호흡
5. **.json 또는 .lottie export**
6. `assets/animations/mascot.json`으로 저장

## Lottie 파일 추가 후 할 일

1. `.json` 파일을 `assets/animations/mascot.json`으로 저장 (이름은 자유)
2. 홈 화면(또는 원하는 곳)에서:
   ```tsx
   <Mascot size={88} source={require('../assets/animations/mascot.json')} />
   ```
3. Metro에서 `r` 눌러 리로드
4. 캐시 문제 있으면 `npx expo start --dev-client --clear`

## 권장 적용 위치

1. **홈 화면 인사말 옆** (이미 자리 잡혀 있음 — SVG 폴백 중)
2. **로딩 상태** (지금 흰 화면인 자리)
3. **체크인 → 스탬프 획득 후** (보상 애니메이션)
4. **테마 100% 완성 시** (굿즈 카드)

처음에는 홈 + 로딩 정도만 박고 늘려가기.

## 관련 파일

- `components/Mascot.tsx` — 진입 컴포넌트 + SVG 폴백
- `components/MascotLottie.tsx` — Lottie 래퍼
- `assets/animations/` — .json 파일 자리
