# Context 분리로 검색바 모핑 성능 잡기

검색 버튼 → 지도 검색바 morph 애니메이션이 끊기던 문제가 **Context를 state/actions로 분리**한 것만으로 사라졌다. 왜 그런지 정확히 기록.

## 증상

- 홈 검색 버튼을 누르면 `SearchTransitionOverlay`의 morph(원 → 알약)가 끊김/버벅임.
- 특히 홈에 카드(가까운 장소·테마·유물·인물)가 많을수록 심함.
- Perf Monitor에선 UI 60fps인데 시각적으로 끊겨 보임 (별개 글: `threads-and-performance.md`).

## 진짜 원인 — morph 시작 순간의 대규모 리렌더

`onPressSearch`가 호출하던 코드:

```ts
startSearchTransition({ x, y, width, height }, target); // = context의 setState
```

이전 Context 구조 (단일 컨텍스트):

```tsx
function SearchTransitionProvider({ children }) {
  const [state, setState] = useState({ active: false, source: null, target: null });
  const start = useCallback(...);
  const end = useCallback(...);
  return (
    <Ctx.Provider value={{ state, start, end }}>  {/* ← 매 렌더 새 객체 */}
      {children}
    </Ctx.Provider>
  );
}
```

`start()` 호출 시 일어난 일:

```
start() → setState(active:true)
  → Provider 리렌더
  → value = { state, start, end }  // 매번 새 객체 참조
  → useSearchTransition()(= useContext)을 쓰는 모든 컴포넌트 리렌더:
       ├─ HomeScreen           (start만 필요한데 같은 컨텍스트라 끌려옴)
       │    └─ HomeContent (memo 안 됨)
       │         └─ Hero · 가까운 장소 · 테마 · 유물 · 인물 카드 전부 리렌더
       ├─ SearchTransitionOverlay (state 필요 — 정상)
       └─ MapScreen            (state 필요 — 마운트 시)
```

→ **morph가 시작되는 바로 그 프레임에 홈의 모든 카드가 React 재조정(reconciliation) + 재렌더**.

## 왜 이게 morph를 끊었나

1. **JS 스레드 폭증**: 수십 개 카드의 리렌더(가상 DOM diff, 스타일 계산, NativeWind className 처리)가 morph 시작 시점에 몰림.
2. morph 값 자체는 Reanimated 워크릿(UI 스레드)이지만, **리렌더로 생성된 새 view 트리 commit이 UI 스레드의 layout/commit 큐를 점유** → 워크릿이 만든 프레임이 밀림.
3. 결과: morph가 "정지했다가 점프"하는 잰크 (`threads-and-performance.md`의 "UI fps 60인데 끊김" 메커니즘과 동일).

즉 morph 애니메이션 코드(transform이든 layout이든)를 손대기 전에, **"morph 시작 트리거가 화면 절반을 리렌더시키는 것"** 이 더 근본 원인이었다.

## 해결 — state와 actions를 분리

```tsx
const StateContext = createContext<State | null>(null);    // 자주 변함
const ActionsContext = createContext<Actions | null>(null); // 불변

function SearchTransitionProvider({ children }) {
  const [state, setState] = useState(...);
  const start = useCallback(...);
  const end = useCallback(...);
  const actions = useMemo(() => ({ start, end }), [start, end]); // 참조 고정

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

export const useSearchActions = () => useContext(ActionsContext)!; // 홈
export const useSearchState  = () => useContext(StateContext)!;    // 오버레이·지도
```

구독 관계:

| 컴포넌트 | 구독 | `state` 변경 시 리렌더 |
|---|---|---|
| HomeScreen | `useSearchActions()` (start) | ❌ **안 됨** |
| SearchTransitionOverlay | `useSearchState()` + actions | ✅ (morph 구동에 필요) |
| MapScreen | `useSearchState()` | ✅ (필요) |

**핵심**: HomeScreen이 구독하는 `actions`는 `useMemo`로 참조가 고정 → `state`가 바뀌어도 ActionsContext 값은 동일 → **HomeScreen은 리렌더되지 않음** → HomeContent와 모든 카드도 그대로.

## 왜 이것만으로 끊김이 사라졌나

morph 시작 순간:
- 이전: 홈 카드 수십 개 리렌더 → JS 폭증 + UI commit 큐 점유 → 워크릿 프레임 밀림 → 끊김
- 이후: 홈은 리렌더 0 → JS·UI 스레드 한가 → 워크릿이 매 16ms 정확히 그림 → 매끄러움

morph 애니메이션 코드는 한 줄도 안 바꿨다. **불필요한 리렌더를 없앤 것만으로 해결.**

## 일반화할 수 있는 교훈

1. **Context value는 가변(state)과 불변(actions)을 분리하라.**
   한 컨텍스트에 묶으면 state가 바뀔 때 actions만 쓰는 소비자까지 전부 리렌더된다.
2. **Context value 객체는 `useMemo`로 참조를 안정화하라.**
   `value={{ ... }}`는 매 렌더 새 객체 → 모든 소비자 리렌더.
3. **애니메이션 잰크를 만나면, 애니메이션 코드보다 "그 순간 무엇이 리렌더되는가"를 먼저 의심하라.**
   워크릿은 UI 스레드지만, 동시에 일어나는 대규모 리렌더의 commit이 UI 큐를 점유하면 워크릿도 끊긴다.
4. **측정 우선.** React DevTools Profiler의 "Highlight updates"를 켜고 인터랙션하면, 의도치 않게 리렌더되는 컴포넌트가 색 박스로 드러난다.

## 관련 문서
- `docs/threads-and-performance.md` — UI vs JS 스레드, 워크릿, "UI fps 60인데 끊김"의 메커니즘
- `context/SearchTransition.tsx` — 분리된 컨텍스트 구현
