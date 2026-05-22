// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../data/tokens';
import { api, queryKeys } from '../lib/api';
import { BackHeader } from '../components/BackHeader';
import { SectionLabel } from '../components/SectionLabel';

export default function RankScreen() {
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });
  const levelsQuery = useQuery({ queryKey: queryKeys.levels, queryFn: api.levels });

  if (!meQuery.data || !levelsQuery.data) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader title="등급 · RANK" />
      </View>
    );
  }
  const USER = meQuery.data;
  const LEVELS = levelsQuery.data;
  const { current, next, progress, xpToNext } = USER.rank;

  return (
    <View className="flex-1 bg-paper">
      <BackHeader title="등급 · RANK" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 현재 등급 카드 */}
        <View className="px-5 pb-7">
          <View className="bg-ink rounded-xl p-6 overflow-hidden">
            <Text className="font-mono-bold text-[11px] tracking-[2px] text-white/50">
              CURRENT RANK · LV {current.level}
            </Text>
            <Text className="font-serif text-[38px] text-paper mt-1 tracking-[-0.8px]">
              {current.name}
            </Text>
            <Text className="font-sans text-xs text-white/70 mt-3.5 leading-[18px] max-w-[240px]">
              {current.desc}
            </Text>
            {next && (
              <View className="mt-5">
                <View className="flex-row justify-between items-baseline mb-2">
                  <Text className="font-mono-bold text-xs text-paper">
                    {USER.xp} / {next.minXp} XP
                  </Text>
                  <Text className="font-sans text-[11px] text-white/55">
                    다음: {next.name}까지 {xpToNext} XP
                  </Text>
                </View>
                <View className="h-1 bg-white/15 rounded-xl overflow-hidden">
                  <View
                    className="h-full"
                    style={{ width: `${progress * 100}%`, backgroundColor: next.color }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* XP 적립 방법 */}
        <SectionLabel>XP 적립</SectionLabel>
        <View className="px-5 pb-6 flex-row gap-2">
          {[
            { label: '스탬프', xp: '+10', sub: `${USER.stamps}개 · ${USER.stamps * 10}` },
            { label: '퀴즈 정답', xp: '+5', sub: `${USER.quizCorrect}개 · ${USER.quizCorrect * 5}` },
            { label: '테마 완성', xp: '+50', sub: `${USER.themesCompleted}개 · ${USER.themesCompleted * 50}` },
          ].map((s) => (
            <View key={s.label} className="flex-1 p-3.5 bg-paper border border-line rounded-xl">
              <View className="flex-row items-baseline">
                <Text className="font-serif text-xl text-ink leading-5">{s.xp}</Text>
                <Text className="text-[11px] text-mute ml-0.5 font-sans">XP</Text>
              </View>
              <Text className="font-sans text-[11px] text-inkSoft mt-2">{s.label}</Text>
              <Text className="font-mono text-[9px] text-mute mt-px">{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* 전체 등급표 */}
        <SectionLabel>모든 등급 · 7단계</SectionLabel>
        <View className="px-5 relative">
          <View
            className="absolute w-px bg-line"
            style={{ left: 20 + 15, top: 26, bottom: 26 }}
          />
          {LEVELS.map((lv) => {
            const isCurrent = lv.level === current.level;
            const isPast = lv.level < current.level;
            const isLocked = lv.level > current.level;
            const dim = isLocked ? 0.55 : 1;
            return (
              <View key={lv.level} className="flex-row gap-4 items-start py-3">
                <View
                  className="w-8 h-8 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: isPast || isCurrent ? lv.color : TOKENS.paper,
                    borderWidth: isCurrent ? 2 : isPast ? 0 : 1.5,
                    borderColor: isCurrent ? TOKENS.ink : TOKENS.line,
                    borderStyle: isLocked && !isCurrent ? 'dashed' : 'solid',
                    opacity: dim,
                  }}
                >
                  <Text
                    className={`font-sans-bold text-xs ${isPast || isCurrent ? 'text-paper' : 'text-mute'}`}
                  >
                    {lv.level}
                  </Text>
                </View>
                <View className="flex-1" style={{ opacity: dim }}>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="font-mono-bold text-[10px] text-mute">LV {lv.level}</Text>
                    {isCurrent && (
                      <View className="px-1.5 py-px rounded-sm bg-ink">
                        <Text className="font-sans-bold text-[9px] text-paper tracking-[0.5px]">
                          나의 등급
                        </Text>
                      </View>
                    )}
                  </View>
                  <Text className="font-serif text-[17px] text-ink mt-0.5">{lv.name}</Text>
                  <Text className="font-sans text-xs text-inkSoft mt-1 leading-[18px]">
                    {lv.desc}
                  </Text>
                  <View className="flex-row flex-wrap items-center gap-1.5 mt-2">
                    <Text
                      className="font-mono-bold text-[10px]"
                      style={{ color: lv.color }}
                    >
                      {lv.minXp}+ XP
                    </Text>
                    {lv.perks.map((perk) => (
                      <View key={perk} className="px-1.5 py-0.5 bg-paperWarm rounded-sm">
                        <Text className="font-sans text-[11px] text-inkSoft">{perk}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
