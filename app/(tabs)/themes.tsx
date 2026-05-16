// noinspection JSUnusedGlobalSymbols

import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Rect } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { LEVELS } from '../../data/user';
import { PageHeader } from '../../components/PageHeader';
import { GatedButton } from '../../components/GatedButton';

const TABS = ['전체', '진행중', '추천', '완성'];

export default function ThemesScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('전체');
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });

  if (!themesQuery.data || !meQuery.data) {
    return <View style={{ flex: 1, backgroundColor: TOKENS.paper }} />;
  }
  const THEMES = themesQuery.data;
  const myRank = meQuery.data.rank.current;

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <PageHeader
        title="테마 답사"
        subtitle="장소를 잇는 이야기, 한 갈래씩 모아 걷기"
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View
          style={{
            flexDirection: 'row',
            gap: 4,
            paddingHorizontal: 20,
            paddingBottom: 18,
            borderBottomWidth: 0.5,
            borderBottomColor: TOKENS.line,
          }}
        >
          {TABS.map((t) => {
            const on = tab === t;
            return (
              <Pressable
                key={t}
                onPress={() => setTab(t)}
                style={{ paddingHorizontal: 12, paddingVertical: 6, position: 'relative' }}
              >
                <Text
                  style={{
                    fontFamily: on ? FONTS.sansBold : FONTS.sans,
                    fontSize: 13,
                    color: on ? TOKENS.ink : TOKENS.mute,
                  }}
                >
                  {t}
                </Text>
                {on && (
                  <View
                    style={{
                      position: 'absolute',
                      bottom: -5,
                      left: 12,
                      right: 12,
                      height: 2,
                      backgroundColor: TOKENS.red,
                      borderRadius: 1,
                    }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>

        <View style={{ padding: 20, paddingBottom: 0 }}>
          <GatedButton
            label="나만의 테마 코스 만들기"
            requiredLevel={LEVELS[5]}
            currentLevel={myRank}
            onPress={() => {}}
            onLocked={() => {}}
          />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 14 }}>
          {THEMES.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => router.push(`/theme/${t.id}` as never)}
              style={{
                borderRadius: 4,
                overflow: 'hidden',
                borderWidth: 0.5,
                borderColor: TOKENS.line,
                backgroundColor: TOKENS.paper,
              }}
            >
              <LinearGradient
                colors={t.cover}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{ height: 130, padding: 18, justifyContent: 'space-between' }}
              >
                <Text
                  style={{
                    position: 'absolute',
                    top: 8,
                    right: 14,
                    fontFamily: FONTS.serifBlack,
                    fontSize: 110,
                    color: 'rgba(255,255,255,0.10)',
                    lineHeight: 110,
                  }}
                >
                  {t.glyph}
                </Text>
                <View>
                  <Text
                    style={{
                      fontFamily: FONTS.serifRegular,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.75)',
                      letterSpacing: 3,
                    }}
                  >
                    {t.subtitle.toUpperCase()}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.serif,
                      fontSize: 24,
                      color: TOKENS.paper,
                      marginTop: 4,
                      lineHeight: 28,
                    }}
                  >
                    {t.title}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text
                    style={{
                      fontFamily: FONTS.monoBold,
                      fontSize: 12,
                      color: TOKENS.paper,
                    }}
                  >
                    {t.visited}/{t.totalPlaces}
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 2,
                      backgroundColor: 'rgba(255,255,255,0.2)',
                      borderRadius: 2,
                      overflow: 'hidden',
                    }}
                  >
                    <View
                      style={{
                        width: `${(t.visited / t.totalPlaces) * 100}%`,
                        height: '100%',
                        backgroundColor: TOKENS.paper,
                      }}
                    />
                  </View>
                </View>
              </LinearGradient>
              <View style={{ padding: 16 }}>
                <Text
                  style={{ fontFamily: FONTS.sans, fontSize: 12, color: TOKENS.inkSoft, lineHeight: 19 }}
                >
                  {t.desc}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    marginTop: 10,
                  }}
                >
                  <Svg width="12" height="12" viewBox="0 0 22 22" fill="none">
                    <Rect x="4" y="6" width="14" height="13" rx="1" stroke={TOKENS.red} strokeWidth="1.6" />
                    <Path d="M8 6V4h6v2" stroke={TOKENS.red} strokeWidth="1.6" />
                  </Svg>
                  <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.red }}>
                    완성 보상 · {t.rewardGoods}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
