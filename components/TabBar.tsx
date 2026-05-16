import { View, Text, Pressable } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { FONTS, TOKENS } from '../data/tokens';

const TABS = [
  { name: 'index', label: '홈', icon: 'home' as const },
  { name: 'map', label: '지도', icon: 'map' as const },
  { name: 'themes', label: '테마', icon: 'theme' as const },
  { name: 'stampbook', label: '스탬프북', icon: 'stamp' as const },
  { name: 'profile', label: '나', icon: 'me' as const },
];

type IconKind = 'home' | 'map' | 'theme' | 'stamp' | 'me';

function TabIcon({ kind, active }: { kind: IconKind; active: boolean }) {
  const c = active ? TOKENS.ink : TOKENS.mute;
  const sw = 1.6;
  if (kind === 'home')
    return (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path d="M3 9.5L11 3l8 6.5V18a1 1 0 01-1 1h-4v-5H8v5H4a1 1 0 01-1-1V9.5z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      </Svg>
    );
  if (kind === 'map')
    return (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
        <Circle cx="11" cy="8" r="2.4" stroke={c} strokeWidth={sw} />
      </Svg>
    );
  if (kind === 'theme')
    return (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path d="M4 4h6v6H4zM12 4h6v6h-6zM4 12h6v6H4zM12 12h6v6h-6z" stroke={c} strokeWidth={sw} strokeLinejoin="round" />
      </Svg>
    );
  if (kind === 'stamp')
    return (
      <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <Path d="M4 6h14v11H4z" stroke={c} strokeWidth={sw} />
        <Path d="M8 6V4.5C8 3.7 8.7 3 9.5 3h3c.8 0 1.5.7 1.5 1.5V6" stroke={c} strokeWidth={sw} />
        <Path d="M3 19h16" stroke={c} strokeWidth={sw} strokeLinecap="round" />
      </Svg>
    );
  return (
    <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <Circle cx="11" cy="8" r="3.5" stroke={c} strokeWidth={sw} />
      <Path d="M4 19c0-3.5 3-6 7-6s7 2.5 7 6" stroke={c} strokeWidth={sw} strokeLinecap="round" />
    </Svg>
  );
}

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingBottom: Math.max(insets.bottom, 12),
        backgroundColor: 'rgba(251,251,249,0.92)',
        borderTopWidth: 0.5,
        borderTopColor: TOKENS.line,
      }}
    >
      <View style={{ flexDirection: 'row', height: 56 }}>
        {TABS.map((tab) => {
          const routeIndex = state.routes.findIndex((r) => r.name === tab.name);
          if (routeIndex === -1) return null;
          const isActive = state.index === routeIndex;
          return (
            <Pressable
              key={tab.name}
              onPress={() => navigation.navigate(tab.name as never)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                gap: 3,
              }}
            >
              <TabIcon kind={tab.icon} active={isActive} />
              <Text
                style={{
                  fontFamily: isActive ? FONTS.sansBold : FONTS.sans,
                  fontSize: 10,
                  color: isActive ? TOKENS.ink : TOKENS.mute,
                  letterSpacing: 0.2,
                }}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
