# Mascot (삽살개) + Rive 셋업

전통 삽살개를 마스코트로 Rive 애니메이션 통합.

## 현재 상태

- `expo-dev-client` + `rive-react-native` 설치 완료
- `rive-react-native`는 config plugin 없는 일반 네이티브 모듈 — `app.json` plugins에 등록 X. `npx expo prebuild` 시 autolinking으로 자동 인식됨
- `components/Mascot.tsx` — 진입점. `rive` prop 있으면 Rive 사용, 없으면 SVG 폴백
- `components/MascotRive.tsx` — Rive 전용 (Expo Go에서는 import 자체를 막기 위해 분리)
- `assets/animations/` — `.riv` 파일 둘 자리
- **Expo Go에서는 더 이상 안 돌아감** → dev client 빌드 필요

## 사용법

```tsx
import { Mascot } from '../components/Mascot';

// SVG 폴백 (Rive 파일 없을 때 — 지금 상태)
<Mascot size={140} />

// Rive 파일 들어온 뒤
<Mascot
  size={140}
  rive="salsalgae"          // assets/animations/salsalgae.riv
  stateMachine="State Machine 1"
  artboard="Salsalgae"
/>
```

## Dev Client 빌드 (첫 1회만)

이제 Expo Go로는 못 띄움. 둘 중 하나 선택:

### A. Mac + Xcode (가장 빠름)

```bash
# 네이티브 폴더 생성 (ios/, android/)
npx expo prebuild --clean

# iOS 시뮬레이터에 빌드 + 실행
npx expo run:ios

# 또는 안드로이드
npx expo run:android
```

첫 빌드는 10~20분. 그 다음부터는 `npx expo start --dev-client`로 일반 개발.

### B. EAS Build (Mac 없거나 클라우드 선호)

```bash
# Expo 계정 로그인 (한 번만)
npx eas login

# 프로젝트 초기화 (한 번만)
npx eas init

# development 빌드
npx eas build --profile development --platform ios
# 또는 안드로이드
npx eas build --profile development --platform android
```

EAS가 클라우드에서 .ipa/.apk 빌드해서 링크 제공. 폰에 설치 후 `npx expo start --dev-client`로 개발.

### `eas.json` 설정 (B 옵션 시)

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    }
  }
}
```

## Rive 디자인 워크플로우

캐릭터 디자인 자신 없으셔도 다음 경로들이 있어요:

### 1. Rive Community 무료 캐릭터 활용
- https://rive.app/community/ → "dog" 검색
- 무료로 다운로드 → 색깔/크기/디테일만 수정해서 사용
- 가장 빠른 길

### 2. AI 레퍼런스 + Rive에서 재구성
- Midjourney / ChatGPT / Stable Diffusion에 "cute Korean Sapsali dog cartoon mascot, traditional but modern, vector flat style" 같은 프롬프트로 레퍼런스 생성
- Rive 또는 Figma에서 그 이미지를 참고로 path/shape 다시 그리기

### 3. 디자이너 외주
- Fiverr / 크몽: 2~10만 원에 마스코트 + 기본 애니메이션 의뢰 가능
- 요구사항: "Rive로 export, state machine 포함, idle/happy/sad 상태"

### 4. 단순화 (현재 SVG 폴백)
- 정말 간단한 캐릭터는 SVG로 충분
- 지금 `components/Mascot.tsx`의 SVG 폴백이 그 예시
- 눈 깜빡임, 꼬리 흔들기 정도면 Reanimated로 추가 가능

## Rive 파일 추가 후 할 일

1. `.riv` 파일을 `assets/animations/salsalgae.riv`로 저장 (이름은 자유)
2. Rive 에디터에서 state machine 이름 확인
3. 화면에서:
   ```tsx
   <Mascot rive="salsalgae" stateMachine="State Machine 1" />
   ```
4. iOS는 Xcode 프로젝트에 .riv 파일이 자동 인식되지만, 안 되면 Xcode에서 "Add Files to..."로 추가

## 권장 적용 위치

지금 우리 앱에서는:

1. **홈 화면 인사말 옆** (가장 자연스러움)
2. **로딩 상태** (지금 흰 화면인 자리)
3. **체크인 → 스탬프 획득 후** (보상 애니메이션)
4. **테마 100% 완성 시** (굿즈 카드)

처음에는 홈 + 로딩 정도만 박고 늘려가기.

## 관련 파일

- `components/Mascot.tsx` — 진입 컴포넌트 + SVG 폴백
- `components/MascotRive.tsx` — Rive 래퍼
- `assets/animations/` — .riv 파일 자리
