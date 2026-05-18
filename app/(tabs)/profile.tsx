// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { PageHeader } from '../../components/PageHeader';
import { Stamp } from '../../components/Stamp';
import { RankBadge } from '../../components/RankBadge';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionLabel } from '../../components/SectionLabel';
import { ArrowRightIcon, SettingsIcon } from '../../components/icons';

export default function ProfileScreen() {
  const router = useRouter();
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const achievementsQuery = useQuery({ queryKey: queryKeys.achievements, queryFn: api.achievements });
  const rankingQuery = useQuery({ queryKey: queryKeys.ranking, queryFn: api.ranking });

  if (!meQuery.data || !stampedQuery.data || !achievementsQuery.data || !rankingQuery.data) {
    return <View className="flex-1 bg-paper" />;
  }
  const USER = meQuery.data;
  const STAMPED = stampedQuery.data;
  const ACHIEVEMENTS = achievementsQuery.data;
  const RANKING = rankingQuery.data;
  const { current, next, progress, xpToNext } = USER.rank;

  return (
    <View className="flex-1 bg-paper">
      <PageHeader
        title="나의 답사기"
        action={
          <Pressable className="w-9 h-9 rounded-full bg-[rgba(26,22,20,0.05)] items-center justify-center">
            <SettingsIcon />
          </Pressable>
        }
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* 프로필 카드 */}
        <View className="px-5 pb-6">
          <View className="bg-paper border border-line p-5 rounded flex-row items-center gap-4">
            <View className="w-16 h-16 rounded-full bg-paperWarm border border-line items-center justify-center">
              <Text className="font-serif text-2xl text-ink">나</Text>
              <View className="absolute -bottom-0.5 -right-0.5">
                <Stamp glyph="初" size={24} rotate={-12} />
              </View>
            </View>
            <View className="flex-1">
              <Text className="font-serif text-lg text-ink">{USER.nickname}</Text>
              <Text className="font-sans text-[11px] text-mute mt-0.5">
                {USER.joinedAt} 시작 · 답사 {USER.daysActive}일째
              </Text>
              <View className="mt-2 flex-row">
                <RankBadge level={current} size="md" />
              </View>
            </View>
          </View>
        </View>

        {/* 등급 카드 */}
        <View className="px-5 pb-6">
          <Pressable
            onPress={() => router.push('/rank' as never)}
            className="bg-ink rounded p-[18px] overflow-hidden"
          >
            <View>
              <Text className="font-mono-bold text-[10px] text-white/50 tracking-[2px]">
                MY RANK · LV {current.level}
              </Text>
              <Text className="font-serif text-2xl text-paper mt-0.5">{current.name}</Text>
              {next && (
                <>
                  <View className="flex-row justify-between items-baseline mt-3.5">
                    <Text className="font-mono-bold text-[11px] text-paper">
                      {USER.xp} / {next.minXp} XP
                    </Text>
                    <Text className="font-sans text-[10px] text-white/60">
                      → {next.name}까지 {xpToNext}
                    </Text>
                  </View>
                  <View className="h-[3px] bg-white/15 rounded mt-1.5 overflow-hidden">
                    <View
                      style={{ width: `${progress * 100}%`, height: '100%', backgroundColor: next.color }}
                    />
                  </View>
                </>
              )}
              <View className="flex-row items-center gap-1 mt-3">
                <Text className="font-sans-bold text-[11px] text-white/70">전체 등급 보기</Text>
                <ArrowRightIcon />
              </View>
            </View>
          </Pressable>
        </View>

        {/* 통계 */}
        <View className="px-5 pb-6 flex-row gap-2">
          {[
            { v: STAMPED.length, l: '스탬프', s: 'STAMPS' },
            { v: 2, l: '완성 테마', s: 'THEMES' },
            { v: 7, l: '퀴즈 정답', s: 'QUIZ' },
          ].map((s) => (
            <View key={s.l} className="flex-1 bg-paper border border-line rounded p-3.5">
              <Text className="font-serif-black text-[28px] text-ink leading-7 tracking-tight">
                {s.v}
              </Text>
              <Text className="font-sans text-[11px] text-inkSoft mt-1.5">{s.l}</Text>
              <Text className="font-mono text-[9px] text-mute mt-px tracking-wider">{s.s}</Text>
            </View>
          ))}
        </View>

        {/* 업적 */}
        <SectionLabel>업적 · ACHIEVEMENTS</SectionLabel>
        <View className="px-5 pb-5 flex-row flex-wrap gap-2">
          {ACHIEVEMENTS.map((a) => (
            <View
              key={a.id}
              className="bg-paper border border-line rounded p-3"
              style={{ width: '31%', opacity: a.done ? 1 : 0.55 }}
            >
              <View className="items-center mb-2">
                <Stamp
                  glyph={a.title[0]}
                  size={38}
                  rotate={a.done ? -6 : 0}
                  dim={!a.done}
                  color={a.done ? TOKENS.red : TOKENS.mute}
                />
              </View>
              <Text className="font-serif text-[11px] text-ink text-center leading-[13px]">
                {a.title}
              </Text>
              <Text className="font-sans text-[9px] text-mute text-center mt-1 leading-3">
                {a.desc}
              </Text>
              {!a.done && a.progress !== undefined && a.max !== undefined && (
                <View className="mt-1.5">
                  <ProgressBar value={a.progress} max={a.max} color={TOKENS.mute} height={2} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 랭킹 */}
        <SectionLabel
          action={<Text className="font-sans-bold text-[11px] text-red">이번 주</Text>}
        >
          전국 랭킹 · LEADERBOARD
        </SectionLabel>
        <View className="px-5">
          <View className="bg-paper border border-line rounded overflow-hidden">
            {RANKING.map((r, i) => (
              <View
                key={r.rank}
                className={`flex-row items-center gap-3 py-3 px-3.5 ${r.me ? 'bg-paperWarm' : ''}`}
                style={{
                  borderBottomWidth: i < RANKING.length - 1 ? 0.5 : 0,
                  borderBottomColor: TOKENS.lineSoft,
                }}
              >
                <Text
                  className={`w-[22px] font-serif text-base text-center ${r.rank <= 3 ? 'text-red' : 'text-inkSoft'}`}
                >
                  {r.rank}
                </Text>
                <View className="w-8 h-8 rounded-full bg-paperWarm border border-line items-center justify-center">
                  <Text className="font-serif text-[13px] text-ink">{r.name[0]}</Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-sans-bold text-[13px] text-ink">{r.name}</Text>
                    {r.me && <Text className="text-red text-[10px]">● 나</Text>}
                  </View>
                  <Text className="font-sans text-[10px] text-mute mt-px">{r.badge}</Text>
                </View>
                <Text className="font-mono-bold text-[13px] text-ink">{r.stamps}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
