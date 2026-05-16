// noinspection JSUnusedGlobalSymbols

import 'react-native-url-polyfill/auto';
import { installMocks } from '../mocks/install';

installMocks();

import { Stack } from 'expo-router';
import { enableFreeze, enableScreens } from 'react-native-screens';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import {
  NotoSerifKR_400Regular,
  NotoSerifKR_700Bold,
  NotoSerifKR_900Black,
} from '@expo-google-fonts/noto-serif-kr';
import {
  NotoSansKR_500Medium,
  NotoSansKR_700Bold,
} from '@expo-google-fonts/noto-sans-kr';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';
import { View } from 'react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '../global.css';

enableScreens(true);
enableFreeze(true);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    NotoSerifKR_400Regular,
    NotoSerifKR_700Bold,
    NotoSerifKR_900Black,
    NotoSansKR_500Medium,
    NotoSansKR_700Bold,
    JetBrainsMono_400Regular,
    JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return <View className="flex-1 bg-paper" />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#FBFBF9' } }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
