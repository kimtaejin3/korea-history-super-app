// noinspection JSUnusedGlobalSymbols

import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ViewStyle } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { PageHeader } from '../../components/PageHeader';
import { Stamp } from '../../components/Stamp';
import { StampSlot } from '../../components/StampSlot';
import { ScreenState } from '../../components/ScreenState';
import { ShareIcon } from '../../components/icons';

const VIEWS = ['테마별', '시대별', '지역별'];

export default function StampbookScreen() {
  const router = useRouter();
  const [view, setView] = useState('테마별');

  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });

  const loading = placesQuery.isLoading || stampedQuery.isLoading || themesQuery.isLoading;
  const error = placesQuery.isError || stampedQuery.isError || themesQuery.isError;

  if (!placesQuery.data || !stampedQuery.data || !themesQuery.data) {
    return (
      <ScreenState
        loading={loading}
        error={error}
        onRetry={() => {
          placesQuery.refetch();
          stampedQuery.refetch();
          themesQuery.refetch();
        }}
      />
    );
  }
  const PLACES = placesQuery.data;
  const STAMPED = stampedQuery.data;
  const THEMES = themesQuery.data;

  const byTheme = THEMES.map((t) => {
    const places = t.placeIds
      .map((id) => PLACES.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    return { theme: t, places, total: t.totalPlaces };
  });

  const progressPct = (STAMPED.length / PLACES.length) * 100;
  const circumference = 2 * Math.PI * 28;
  const dashLength = (progressPct / 100) * circumference;

  return (
    <View className="flex-1 bg-paper">
      <PageHeader
        title="스탬프북"
        subtitle={`${STAMPED.length}개의 발자국 · 모은 도장 ${STAMPED.length}/${PLACES.length}`}
        action={
          <Pressable className="w-9 h-9 rounded-full bg-[rgba(26,22,20,0.05)] items-center justify-center">
            <ShareIcon />
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 도감 진척도 */}
        <View className="px-5 pb-4">
          <View className="bg-paperWarm border border-line p-4 rounded-xl flex-row items-center gap-3.5">
            <View className="w-16 h-16">
              <Svg width="64" height="64" viewBox="0 0 64 64">
                <Circle cx="32" cy="32" r="28" fill="none" stroke={TOKENS.line} strokeWidth="3" />
                <Circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={TOKENS.red}
                  strokeWidth="3"
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="32, 32"
                />
              </Svg>
              <View className="absolute inset-0 items-center justify-center">
                <Text className="font-serif text-base text-ink">{Math.round(progressPct)}%</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-serif text-base text-ink">도감 진척도</Text>
              <Text className="font-sans text-xs text-mute mt-1 leading-5">
                전국 {PLACES.length}곳 중 {STAMPED.length}곳 완료. 다음 목표까지{' '}
                {PLACES.length - STAMPED.length}곳
              </Text>
            </View>
          </View>
        </View>

        {/* 탭 */}
        <View className="px-5 pb-3.5 flex-row gap-1">
          {VIEWS.map((v) => {
            const on = view === v;
            return (
              <Pressable
                key={v}
                onPress={() => setView(v)}
                className={`px-3 py-1.5 rounded-full ${on ? 'bg-ink' : 'bg-transparent'}`}
              >
                <Text className={`font-sans-bold text-xs ${on ? 'text-paper' : 'text-inkSoft'}`}>
                  {v}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 테마별 도감 */}
        <View className="px-5 gap-5">
          {byTheme.map(({ theme, places, total }) => (
            <View key={theme.id}>
              <Pressable
                onPress={() => router.push(`/theme/${theme.id}` as never)}
                className="flex-row items-center gap-2.5 mb-2.5"
              >
                <View
                  className="w-1 h-[18px] rounded-sm"
                  style={{ backgroundColor: theme.color }}
                />
                <Text className="font-serif text-base text-ink flex-1">{theme.title}</Text>
                <Text className="font-mono text-[10px] text-mute">
                  {places.filter((p) => STAMPED.includes(p.id)).length}/{total}
                </Text>
              </Pressable>
              <View className="flex-row flex-wrap gap-2 p-3 py-3.5 bg-paper border border-line rounded-xl">
                {Array.from({ length: total }).map((_, i) => {
                  const p = places[i];
                  const cellStyle: ViewStyle = { width: '18%', alignItems: 'center', gap: 4 };
                  if (p && STAMPED.includes(p.id)) {
                    return (
                      <Pressable
                        key={i}
                        onPress={() => router.push(`/place/${p.id}` as never)}
                        style={cellStyle}
                      >
                        <Stamp
                          glyph={p.nameHanja[0]}
                          size={48}
                          rotate={-6 + (i % 3) * 4}
                          color={p.accent}
                        />
                        <Text
                          numberOfLines={1}
                          className="font-sans text-[9px] text-inkSoft max-w-[56px]"
                        >
                          {p.name}
                        </Text>
                      </Pressable>
                    );
                  }
                  if (p) {
                    return (
                      <Pressable
                        key={i}
                        onPress={() => router.push(`/place/${p.id}` as never)}
                        style={cellStyle}
                      >
                        <Stamp glyph={p.nameHanja[0]} size={48} rotate={0} dim color={p.accent} />
                        <Text
                          numberOfLines={1}
                          className="font-sans text-[9px] text-mute max-w-[56px]"
                        >
                          {p.name}
                        </Text>
                      </Pressable>
                    );
                  }
                  return (
                    <View key={i} style={cellStyle}>
                      <StampSlot size={48} />
                      <View className="h-3" />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
