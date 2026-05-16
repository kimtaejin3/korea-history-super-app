// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { PageHeader } from '../../components/PageHeader';
import { Stamp } from '../../components/Stamp';
import { RankBadge } from '../../components/RankBadge';
import { ProgressBar } from '../../components/ProgressBar';
import { SectionLabel } from '../../components/SectionLabel';

export default function ProfileScreen() {
  const router = useRouter();
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const achievementsQuery = useQuery({ queryKey: queryKeys.achievements, queryFn: api.achievements });
  const rankingQuery = useQuery({ queryKey: queryKeys.ranking, queryFn: api.ranking });

  if (!meQuery.data || !stampedQuery.data || !achievementsQuery.data || !rankingQuery.data) {
    return <View style={{ flex: 1, backgroundColor: TOKENS.paper }} />;
  }
  const USER = meQuery.data;
  const STAMPED = stampedQuery.data;
  const ACHIEVEMENTS = achievementsQuery.data;
  const RANKING = rankingQuery.data;
  const { current, next, progress, xpToNext } = USER.rank;

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <PageHeader
        title="나의 답사기"
        hanja="踏査記"
        action={
          <Pressable
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: 'rgba(26,22,20,0.05)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Svg width="16" height="16" viewBox="0 0 22 22" fill="none">
              <Circle cx="11" cy="11" r="3" stroke={TOKENS.ink} strokeWidth="1.7" />
              <Path
                d="M11 2v3M11 17v3M2 11h3M17 11h3M4.5 4.5l2 2M15.5 15.5l2 2M4.5 17.5l2-2M15.5 6.5l2-2"
                stroke={TOKENS.ink}
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </Svg>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 프로필 카드 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 22 }}>
          <View
            style={{
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              padding: 20,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: TOKENS.paperWarm,
                borderWidth: 0.5,
                borderColor: TOKENS.line,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontFamily: FONTS.serif, fontSize: 26, color: TOKENS.ink }}>나</Text>
              <View style={{ position: 'absolute', bottom: -2, right: -2 }}>
                <Stamp glyph="初" size={24} rotate={-12} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONTS.serif, fontSize: 18, color: TOKENS.ink }}>
                {USER.nickname}
              </Text>
              <Text
                style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute, marginTop: 2 }}
              >
                {USER.joinedAt} 시작 · 답사 {USER.daysActive}일째
              </Text>
              <View style={{ marginTop: 8, flexDirection: 'row' }}>
                <RankBadge level={current} size="md" />
              </View>
            </View>
          </View>
        </View>

        {/* 등급 카드 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Pressable
            onPress={() => router.push('/rank' as never)}
            style={{
              backgroundColor: TOKENS.ink,
              borderRadius: 4,
              padding: 18,
              overflow: 'hidden',
            }}
          >
            <Text
              style={{
                position: 'absolute',
                top: -16,
                right: -10,
                fontFamily: FONTS.serifBlack,
                fontSize: 130,
                lineHeight: 130,
                color: `${current.color}60`,
              }}
            >
              {current.hanja[0]}
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: 2,
                }}
              >
                MY RANK · LV {current.level}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 24,
                  color: TOKENS.paper,
                  marginTop: 2,
                }}
              >
                {current.name}{' '}
                <Text
                  style={{
                    fontFamily: FONTS.serifRegular,
                    fontSize: 13,
                    color: 'rgba(255,255,255,0.5)',
                    letterSpacing: 2,
                  }}
                >
                  {current.hanja}
                </Text>
              </Text>
              {next && (
                <>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginTop: 14,
                    }}
                  >
                    <Text
                      style={{ fontFamily: FONTS.monoBold, fontSize: 11, color: TOKENS.paper }}
                    >
                      {USER.xp} / {next.minXp} XP
                    </Text>
                    <Text
                      style={{ fontFamily: FONTS.sans, fontSize: 10, color: 'rgba(255,255,255,0.6)' }}
                    >
                      → {next.name}까지 {xpToNext}
                    </Text>
                  </View>
                  <View
                    style={{
                      height: 3,
                      backgroundColor: 'rgba(255,255,255,0.15)',
                      borderRadius: 4,
                      marginTop: 6,
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
                </>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                  marginTop: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.sansBold,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  전체 등급 보기
                </Text>
                <Svg width="10" height="10" viewBox="0 0 22 22" fill="none">
                  <Path
                    d="M5 11h12M12 6l5 5-5 5"
                    stroke="rgba(255,255,255,0.7)"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </Svg>
              </View>
            </View>
          </Pressable>
        </View>

        {/* 통계 */}
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 24,
            flexDirection: 'row',
            gap: 8,
          }}
        >
          {[
            { v: STAMPED.length, l: '스탬프', s: 'STAMPS' },
            { v: 2, l: '완성 테마', s: 'THEMES' },
            { v: 7, l: '퀴즈 정답', s: 'QUIZ' },
          ].map((s) => (
            <View
              key={s.l}
              style={{
                flex: 1,
                backgroundColor: TOKENS.paper,
                borderWidth: 0.5,
                borderColor: TOKENS.line,
                borderRadius: 4,
                padding: 14,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.serifBlack,
                  fontSize: 28,
                  color: TOKENS.ink,
                  letterSpacing: -1,
                  lineHeight: 28,
                }}
              >
                {s.v}
              </Text>
              <Text
                style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.inkSoft, marginTop: 6 }}
              >
                {s.l}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  color: TOKENS.mute,
                  marginTop: 1,
                  letterSpacing: 1,
                }}
              >
                {s.s}
              </Text>
            </View>
          ))}
        </View>

        {/* 업적 */}
        <SectionLabel>업적 · ACHIEVEMENTS</SectionLabel>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 22,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 8,
          }}
        >
          {ACHIEVEMENTS.map((a) => (
            <View
              key={a.id}
              style={{
                width: '31%',
                backgroundColor: TOKENS.paper,
                borderWidth: 0.5,
                borderColor: TOKENS.line,
                borderRadius: 4,
                padding: 12,
                opacity: a.done ? 1 : 0.55,
              }}
            >
              <View style={{ alignItems: 'center', marginBottom: 8 }}>
                <Stamp
                  glyph={a.title[0]}
                  size={38}
                  rotate={a.done ? -6 : 0}
                  dim={!a.done}
                  color={a.done ? TOKENS.red : TOKENS.mute}
                />
              </View>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 11,
                  color: TOKENS.ink,
                  textAlign: 'center',
                  lineHeight: 13,
                }}
              >
                {a.title}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 9,
                  color: TOKENS.mute,
                  textAlign: 'center',
                  marginTop: 3,
                  lineHeight: 12,
                }}
              >
                {a.desc}
              </Text>
              {!a.done && a.progress !== undefined && a.max !== undefined && (
                <View style={{ marginTop: 6 }}>
                  <ProgressBar value={a.progress} max={a.max} color={TOKENS.mute} height={2} />
                </View>
              )}
            </View>
          ))}
        </View>

        {/* 랭킹 */}
        <SectionLabel
          action={
            <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.red }}>
              이번 주
            </Text>
          }
        >
          전국 랭킹 · LEADERBOARD
        </SectionLabel>
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            {RANKING.map((r, i) => (
              <View
                key={r.rank}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  borderBottomWidth: i < RANKING.length - 1 ? 0.5 : 0,
                  borderBottomColor: TOKENS.lineSoft,
                  backgroundColor: r.me ? TOKENS.paperWarm : 'transparent',
                }}
              >
                <Text
                  style={{
                    width: 22,
                    fontFamily: FONTS.serif,
                    fontSize: 16,
                    color: r.rank <= 3 ? TOKENS.red : TOKENS.inkSoft,
                    textAlign: 'center',
                  }}
                >
                  {r.rank}
                </Text>
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: TOKENS.paperWarm,
                    borderWidth: 0.5,
                    borderColor: TOKENS.line,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: FONTS.serif, fontSize: 13, color: TOKENS.ink }}>
                    {r.name[0]}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text
                      style={{ fontFamily: FONTS.sansBold, fontSize: 13, color: TOKENS.ink }}
                    >
                      {r.name}
                    </Text>
                    {r.me && (
                      <Text style={{ color: TOKENS.red, fontSize: 10 }}>● 나</Text>
                    )}
                  </View>
                  <Text
                    style={{ fontFamily: FONTS.sans, fontSize: 10, color: TOKENS.mute, marginTop: 1 }}
                  >
                    {r.badge}
                  </Text>
                </View>
                <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: TOKENS.ink }}>
                  {r.stamps}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
