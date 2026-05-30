// noinspection JSUnusedGlobalSymbols

import { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { api, queryKeys } from '../../lib/api';
import { LEVELS } from '../../data/user';
import { PageHeader } from '../../components/PageHeader';
import { GatedButton } from '../../components/GatedButton';
import { StampBoxIcon } from '../../components/icons';
import { ScreenState } from '../../components/ScreenState';

const TABS = ['전체', '진행중', '추천', '완성'];

export default function ThemesScreen() {
  const router = useRouter();
  const [tab, setTab] = useState('전체');
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });

  const loading = themesQuery.isLoading || meQuery.isLoading;
  const error = themesQuery.isError || meQuery.isError;

  if (!themesQuery.data || !meQuery.data) {
    return (
      <ScreenState
        loading={loading}
        error={error}
        onRetry={() => {
          themesQuery.refetch();
          meQuery.refetch();
        }}
      />
    );
  }
  const THEMES = themesQuery.data;
  const myRank = meQuery.data.rank.current;

  return (
    <View className="flex-1 bg-paper">
      <PageHeader title="테마 답사" subtitle="장소를 잇는 이야기, 한 갈래씩 모아 걷기" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <View className="flex-row gap-1 px-5 pb-4 border-b border-line">
          {TABS.map((t) => {
            const on = tab === t;
            return (
              <Pressable key={t} onPress={() => setTab(t)} className="px-3 py-1.5 relative">
                <Text
                  className={`text-[13px] ${on ? 'font-sans-bold text-ink' : 'font-sans text-mute'}`}
                >
                  {t}
                </Text>
                {on && (
                  <View className="absolute -bottom-1 left-3 right-3 h-0.5 bg-red rounded-sm" />
                )}
              </Pressable>
            );
          })}
        </View>

        <View className="p-5 pb-0">
          <GatedButton
            label="나만의 테마 코스 만들기"
            requiredLevel={LEVELS[5]!}
            currentLevel={myRank}
            onPress={() => {}}
            onLocked={() => {}}
          />
        </View>

        <View className="px-5 pt-4 gap-3.5">
          {THEMES.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => router.push(`/theme/${t.id}` as never)}
              className="rounded-xl overflow-hidden border border-line bg-paper"
            >
              <View
                style={{
                  height: 130,
                  padding: 18,
                  justifyContent: 'space-between',
                  backgroundColor: t.cover,
                }}
              >
                <View>
                  <Text className="font-serif-regular text-[11px] text-white/75 tracking-[3px]">
                    {t.subtitle.toUpperCase()}
                  </Text>
                  <Text className="font-serif text-2xl text-paper mt-1 leading-7">{t.title}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="font-mono-bold text-xs text-paper">
                    {t.visited}/{t.totalPlaces}
                  </Text>
                  <View className="flex-1 h-0.5 bg-white/20 rounded-sm overflow-hidden">
                    <View
                      className="h-full bg-paper"
                      style={{ width: `${(t.visited / t.totalPlaces) * 100}%` }}
                    />
                  </View>
                </View>
              </View>
              <View className="p-4">
                <Text className="font-sans text-xs text-inkSoft leading-5">{t.desc}</Text>
                <View className="flex-row items-center gap-1.5 mt-2.5">
                  <StampBoxIcon />
                  <Text className="font-sans-bold text-[11px] text-red">
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
