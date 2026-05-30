import { Platform } from 'react-native';
import * as Location from 'expo-location';
import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import type { LatLon } from '../lib/geo';

export const MOCK_USER_LOCATION: LatLon = { lat: 36.789, lon: 127.014 };

const USE_MOCK_LOCATION = false;

export type LocationStatus = 'idle' | 'loading' | 'real' | 'mocked' | 'denied' | 'error';

type Store = {
  coords: LatLon;
  status: LocationStatus;
  init: () => Promise<void>;
};

const useStore = create<Store>((set, get) => ({
  coords: MOCK_USER_LOCATION,
  status: 'idle',
  init: async () => {
    if (get().status !== 'idle') return;
    set({ status: 'loading' });

    if (USE_MOCK_LOCATION || Platform.OS === 'web') {
      set({ status: 'mocked' });
      return;
    }
    try {
      const { status: perm } = await Location.requestForegroundPermissionsAsync();
      if (perm !== 'granted') {
        set({ status: 'denied' });
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      set({
        coords: { lat: loc.coords.latitude, lon: loc.coords.longitude },
        status: 'real',
      });
    } catch {
      set({ status: 'error' });
    }
  },
}));

export const useUserCoords = (): LatLon => useStore((s) => s.coords);
export const useUserLocationStatus = (): LocationStatus => useStore((s) => s.status);
export const useUserLocation = () =>
  useStore(useShallow((s) => ({ coords: s.coords, status: s.status })));

export const initUserLocation = () => useStore.getState().init();
