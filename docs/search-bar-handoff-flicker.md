# 검색바 morph 종료 시 깜박임 잡기

홈 검색 버튼 → 지도 검색바로의 morph가 끝나는 순간 검색바 UI가 **간헐적으로 한 프레임 깜박이던** 문제. 원인은 핸드오프 구조의 1프레임 race였고, 실제 바를 항상 mount해두는 것으로 해결.

관련 문서: [context-split-rerender.md](./context-split-rerender.md) (Context 분리로 morph 시작 끊김 잡은 글)

## 증상

- 홈에서 검색 버튼 → 지도 화면 진입
- morph 애니메이션이 끝나고 실제 검색바로 인계되는 순간, **가끔씩** 바가 한 프레임 사라졌다가 다시 나타남
- 항상 재현되지 않고 "10번 중 2~3번" 정도로 자주 보임
- JS 스레드 부하가 클수록 빈도 ↑

## 흐름 트레이스

```
T=0     사용자 탭 → measureInWindow (1프레임 async)
T=16    callback:
        - startSearchTransition(source, target)
        - store: active=true
        - Overlay mount, useEffect 실행
        - Reanimated worklet: opacity=1, withTiming(target) 시작
T=216   setTimeout(200ms) → router.push('/(tabs)/map')
        - Home unmount, Map mount
        - Map의 showBar = !active = false → 실제 바 마운트되지 않음
T=416   worklet 완료 → runOnJS(end)
        - store: active=false
        - Overlay 언마운트 (return null)
        - Map: showBar=true → 실제 바 새로 JSX 마운트
```

## 진짜 원인 — Overlay 언마운트와 실제 바 마운트의 1프레임 race

기존 Map 코드:

```tsx
<View style={{ height: SEARCH_BAR_HEIGHT }}>
  {showBar && (
    <View
      className="absolute left-0 right-0 top-0 ..."
      style={{ ... }}
    >
      <SearchIcon ... />
      <Text>장소 · 테마 · 시대 검색</Text>
    </View>
  )}
</View>
```

`showBar`는 `!searchTransition.active`. morph가 끝나서 active가 false로 바뀌는 순간:

1. Overlay 컴포넌트: `if (!state.active) return null` → 언마운트
2. Map 컴포넌트: `{showBar && <View />}` 조건이 진실로 바뀜 → **새 View 마운트**

이 둘이 같은 React commit에 묶이면 매끄러운데, 실전에서는 묶이지 않는 케이스가 있음:

```
Frame N   worklet 완료 (UI 스레드)
          runOnJS(end) → JS 스레드에 콜백 큐잉
Frame N+1 JS 스레드: end() 실행 → zustand set
          → React 리렌더 스케줄링
          → Overlay: null 반환
          → Map: 새 View 마운트 (Yoga layout 필요)
Frame N+2 새 View가 painting 완료
```

문제 지점:
- worklet 완료(Frame N)에서 화면에 그려진 Overlay 픽셀은 여전히 그대로 (worklet 마지막 프레임 = morph 끝난 모양 = 검색바처럼 보임)
- end()가 JS 스레드에서 실행되기까지 한 프레임 이상 걸림 (`runOnJS`는 마샬링 비용 있음)
- 실제 바는 새로 마운트되어 layout/paint 절차를 거쳐야 함

이 비결정성이 결합해서 **Overlay는 사라졌는데 실제 바는 아직 painting이 끝나지 않은 16ms 간격**이 생김 → 깜박.

"가끔씩"인 이유: `runOnJS` 큐잉 지연과 layout latency가 JS 스레드 부하/디바이스 상태에 따라 다름.

## 해결 — 실제 바를 항상 마운트해두고 opacity로만 토글

```tsx
<View style={{ height: SEARCH_BAR_HEIGHT }}>
  <View
    className="absolute left-0 right-0 top-0 ..."
    style={{
      ...
      opacity: showBar ? 1 : 0,         // ← 핵심
    }}
    pointerEvents={showBar ? 'auto' : 'none'}
  >
    <SearchIcon ... />
    <Text>장소 · 테마 · 시대 검색</Text>
  </View>
</View>
```

이게 race를 어떻게 없애는지:

- **실제 바가 이미 마운트되어 있음** — 화면 진입 직후부터 (보이지 않지만) JSX 트리에 존재, layout 완료, paint 캐시됨
- **end() 시점에 할 일이 단순 prop 변경뿐** — `opacity: 0 → 1`. 새 노드 마운트 없음, layout pass 없음.
- **React가 같은 commit에 묶을 가능성 ↑** — Overlay의 `if (!state.active) return null` 와 Map의 `opacity` prop 변경이 둘 다 zustand subscription 콜백에서 동일한 동기 작업으로 시작 → React 18+의 자동 batching이 같은 paint 프레임에 넣음
- **묶이지 않더라도 fallback이 우아함** — 만에 하나 Overlay가 먼저 언마운트되고 Map opacity 변경이 다음 프레임이라도, 그 사이에 보이는 건 "이미 그려진 흰 바탕"이지 빈 공간 아님

`pointerEvents={showBar ? 'auto' : 'none'}`는 안 보일 때 터치가 가로채지지 않게 하는 안전장치.

## 일반화할 수 있는 교훈

morph/transition으로 두 UI 요소 사이를 인계할 때:
1. **사라지는 쪽 + 나타나는 쪽이 같은 commit에서 토글되는지** 확인
2. 새로 마운트하는 비용(layout pass)을 핸드오프 순간에 부담시키지 말 것
3. 두 요소를 **모두 항상 mount**해두고 가시성만 토글하는 게 race를 없애는 가장 안전한 패턴

조건부 마운트(`{x && <Y/>}`)는 메모리 측면에선 매력적이지만, **인계 순간에 새로 마운트되어야 한다면 race source**가 됨.

## 검증

- iOS 시뮬레이터 Debug → Slow Animations 켜고 슬로모션으로 morph 종료 시점 관찰 → 깜박 없어야 함
- 폰에서 빠르게 10회 반복 탭 → 0회 깜박이어야 정상
- 변경 전 대비 마운트 비용 0 (실제 바 한 번만 마운트, 이후 prop 변경만)
