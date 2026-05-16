// noinspection JSUnusedGlobalSymbols

import { Tabs } from 'expo-router';
import { TabBar } from '../../components/TabBar';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="map" options={{ title: '지도' }} />
      <Tabs.Screen name="themes" options={{ title: '테마' }} />
      <Tabs.Screen name="stampbook" options={{ title: '스탬프북' }} />
      <Tabs.Screen name="profile" options={{ title: '나' }} />
    </Tabs>
  );
}
