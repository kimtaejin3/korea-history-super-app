// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../data/tokens';
import { api, queryKeys } from '../lib/api';
import { BackHeader } from '../components/BackHeader';
import { SectionLabel } from '../components/SectionLabel';

export default function RankScreen() {
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });
  const levelsQuery = useQuery({ queryKey: queryKeys.levels, queryFn: api.levels });

  if (!meQuery.data || !levelsQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader title="등급 · RANK" />
      </View>
    );
  }
  const USER = meQuery.data;
  const LEVELS = levelsQuery.data;
  const { current, next, progress, xpToNext } = USER.rank;

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <BackHeader title="등급 · RANK" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 현재 등급 카드 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 28 }}>
          <View
            style={{
              backgroundColor: TOKENS.ink,
              borderRadius: 6,
              padding: 24,
              overflow: 'hidden',
            }}
          >
            <Text
              style={{
                position: 'absolute',
                top: -30,
                right: -30,
                fontFamily: FONTS.serifBlack,
                fontSize: 280,
                lineHeight: 280,
                color: `${current.color}40`,
              }}
            >
              {current.hanja[0]}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.monoBold,
                fontSize: 11,
                letterSpacing: 2,
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              CURRENT RANK · LV {current.level}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 38,
                color: TOKENS.paper,
                marginTop: 4,
                letterSpacing: -0.8,
              }}
            >
              {current.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serifRegular,
                fontSize: 13,
                color: 'rgba(255,255,255,0.55)',
                marginTop: 2,
                letterSpacing: 3,
              }}
            >
              {current.hanja}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                marginTop: 14,
                lineHeight: 18,
                maxWidth: 240,
              }}
            >
              {current.desc}
            </Text>
            {next && (
              <View style={{ marginTop: 22 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    marginBottom: 8,
                  }}
                >
                  <Text style={{ fontFamily: FONTS.monoBold, fontSize: 12, color: TOKENS.paper }}>
                    {USER.xp} / {next.minXp} XP
                  </Text>
                  <Text
                    style={{ fontFamily: FONTS.sans, fontSize: 11, color: 'rgba(255,255,255,0.55)' }}
                  >
                    다음: {next.name}까지 {xpToNext} XP
                  </Text>
                </View>
                <View
                  style={{
                    height: 4,
                    backgroundColor: 'rgba(255,255,255,0.15)',
                    borderRadius: 4,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${progress * 100}%`,
                      height: '100%',
                      backgroundColor: next.color,
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>

        {/* XP 적립 방법 */}
        <SectionLabel>XP 적립</SectionLabel>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {[
            { label: '스탬프', xp: '+10', sub: `${USER.stamps}개 · ${USER.stamps * 10}` },
            {
              label: '퀴즈 정답',
              xp: '+5',
              sub: `${USER.quizCorrect}개 · ${USER.quizCorrect * 5}`,
            },
            {
              label: '테마 완성',
              xp: '+50',
              sub: `${USER.themesCompleted}개 · ${USER.themesCompleted * 50}`,
            },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                padding: 14,
                backgroundColor: TOKENS.paper,
                borderWidth: 0.5,
                borderColor: TOKENS.line,
                borderRadius: 4,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                <Text
                  style={{
                    fontFamily: FONTS.serif,
                    fontSize: 20,
                    color: TOKENS.ink,
                    lineHeight: 20,
                  }}
                >
                  {s.xp}
                </Text>
                <Text
                  style={{ fontSize: 11, color: TOKENS.mute, marginLeft: 2, fontFamily: FONTS.sans }}
                >
                  XP
                </Text>
              </View>
              <Text
                style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.inkSoft, marginTop: 8 }}
              >
                {s.label}
              </Text>
              <Text
                style={{ fontFamily: FONTS.mono, fontSize: 9, color: TOKENS.mute, marginTop: 1 }}
              >
                {s.sub}
              </Text>
            </View>
          ))}
        </View>

        {/* 전체 등급표 */}
        <SectionLabel>모든 등급 · 7단계</SectionLabel>
        <View style={{ paddingHorizontal: 20, position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              left: 20 + 15,
              top: 26,
              bottom: 26,
              width: 1,
              backgroundColor: TOKENS.line,
            }}
          />
          {LEVELS.map((lv) => {
            const isCurrent = lv.level === current.level;
            const isPast = lv.level < current.level;
            const isLocked = lv.level > current.level;
            const dim = isLocked ? 0.55 : 1;
            return (
              <View
                key={lv.level}
                style={{
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: 'flex-start',
                  paddingVertical: 12,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: isPast || isCurrent ? lv.color : TOKENS.paper,
                    borderWidth: isCurrent ? 2 : isPast ? 0 : 1.5,
                    borderColor: isCurrent ? TOKENS.ink : TOKENS.line,
                    borderStyle: isLocked && !isCurrent ? 'dashed' : 'solid',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: dim,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.serifBlack,
                      fontSize: 13,
                      color: isPast || isCurrent ? TOKENS.paper : TOKENS.mute,
                    }}
                  >
                    {lv.hanja[0]}
                  </Text>
                </View>
                <View style={{ flex: 1, opacity: dim }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontFamily: FONTS.monoBold, fontSize: 10, color: TOKENS.mute }}>
                      LV {lv.level}
                    </Text>
                    {isCurrent && (
                      <View
                        style={{
                          paddingHorizontal: 6,
                          paddingVertical: 1,
                          borderRadius: 2,
                          backgroundColor: TOKENS.ink,
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: FONTS.sansBold,
                            fontSize: 9,
                            color: TOKENS.paper,
                            letterSpacing: 0.5,
                          }}
                        >
                          나의 등급
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 2 }}>
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 17, color: TOKENS.ink }}>
                      {lv.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.serifRegular,
                        fontSize: 12,
                        color: TOKENS.mute,
                        letterSpacing: 2,
                      }}
                    >
                      {lv.hanja}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 12,
                      color: TOKENS.inkSoft,
                      marginTop: 4,
                      lineHeight: 18,
                    }}
                  >
                    {lv.desc}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    <Text style={{ fontFamily: FONTS.monoBold, fontSize: 10, color: lv.color }}>
                      {lv.minXp}+ XP
                    </Text>
                    {lv.perks.map((perk) => (
                      <View
                        key={perk}
                        style={{
                          paddingHorizontal: 7,
                          paddingVertical: 2,
                          backgroundColor: TOKENS.paperWarm,
                          borderRadius: 2,
                        }}
                      >
                        <Text
                          style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.inkSoft }}
                        >
                          {perk}
                        </Text>
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
