import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  ReactNode,
} from 'react';

export type Rect = { x: number; y: number; width: number; height: number };

type State = {
  active: boolean;
  source: Rect | null;
  target: Rect | null;
};

type Actions = {
  start: (source: Rect, target: Rect) => void;
  end: () => void;
};

// state(자주 변함)와 actions(불변)를 분리.
// → start만 쓰는 컴포넌트(홈)는 state 변경에 리렌더되지 않음.
const StateContext = createContext<State | null>(null);
const ActionsContext = createContext<Actions | null>(null);

/** state 구독 — 오버레이·지도 등 morph 진행을 따라가야 하는 곳 */
export function useSearchState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error('SearchTransitionProvider missing');
  return ctx;
}

/** actions 구독 — 홈 등 start/end만 호출하는 곳 (리렌더 안 됨) */
export function useSearchActions() {
  const ctx = useContext(ActionsContext);
  if (!ctx) throw new Error('SearchTransitionProvider missing');
  return ctx;
}

export function SearchTransitionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>({ active: false, source: null, target: null });

  const start = useCallback((source: Rect, target: Rect) => {
    setState({ active: true, source, target });
  }, []);

  const end = useCallback(() => {
    setState({ active: false, source: null, target: null });
  }, []);

  // actions는 마운트 후 절대 안 바뀜 → state 변경 시 actions 구독자는 리렌더 X
  const actions = useMemo<Actions>(() => ({ start, end }), [start, end]);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}
