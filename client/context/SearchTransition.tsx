import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

export type Rect = { x: number; y: number; width: number; height: number };

type State = {
  active: boolean;
  source: Rect | null;
  target: Rect | null;
};

type Ctx = {
  state: State;
  start: (source: Rect, target: Rect) => void;
  end: () => void;
};

const SearchTransitionContext = createContext<Ctx | null>(null);

export function useSearchTransition() {
  const ctx = useContext(SearchTransitionContext);
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

  return (
    <SearchTransitionContext.Provider value={{ state, start, end }}>
      {children}
    </SearchTransitionContext.Provider>
  );
}
