import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

type State = {
  loggedIn: boolean;
};

type Actions = {
  login: () => void;
  logout: () => void;
};

type Store = State & Actions;

const useStore = create<Store>((set) => ({
  loggedIn: false,
  login: () => set({ loggedIn: true }),
  logout: () => set({ loggedIn: false }),
}));

/** 기존 API 호환 — { loggedIn, login, logout } 한 번에 받는 훅 */
export const useAuth = () =>
  useStore(
    useShallow((s) => ({
      loggedIn: s.loggedIn,
      login: s.login,
      logout: s.logout,
    }))
  );

/** 새 코드 권장 — 필요한 슬라이스만 구독해서 재렌더 최소화 */
export const useLoggedIn = (): boolean => useStore((s) => s.loggedIn);
export const useAuthActions = (): Actions =>
  useStore(useShallow((s) => ({ login: s.login, logout: s.logout })));
