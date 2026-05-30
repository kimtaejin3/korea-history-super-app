import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

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

type Store = State & Actions;

// state(자주 변함)와 actions(불변)를 분리해서 export.
// → start만 쓰는 컴포넌트(홈)는 state 변경에 리렌더되지 않음.
const useStore = create<Store>((set) => ({
  active: false,
  source: null,
  target: null,
  start: (source, target) => set({ active: true, source, target }),
  end: () => set({ active: false, source: null, target: null }),
}));

/** state 구독 — 오버레이·지도 등 morph 진행을 따라가야 하는 곳 */
export const useSearchState = (): State =>
  useStore(useShallow((s) => ({ active: s.active, source: s.source, target: s.target })));

/** actions 구독 — 홈 등 start/end만 호출하는 곳. action ref는 zustand에서 안정. */
export const useSearchActions = (): Actions =>
  useStore(useShallow((s) => ({ start: s.start, end: s.end })));
