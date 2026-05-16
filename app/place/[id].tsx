// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { LEVELS } from '../../data/user';
import { BackHeader } from '../../components/BackHeader';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { SectionLabel } from '../../components/SectionLabel';
import { GatedButton } from '../../components/GatedButton';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const placeQuery = useQuery({ queryKey: queryKeys.place(id), queryFn: () => api.place(id), enabled: !!id });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });
  const artifactsQuery = useQuery({ queryKey: queryKeys.artifacts, queryFn: api.artifacts });
  const figuresQuery = useQuery({ queryKey: queryKeys.figures, queryFn: api.figures });
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });

  if (placeQuery.isError || (placeQuery.isFetched && !placeQuery.data)) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader title="장소를 찾을 수 없어요" />
      </View>
    );
  }
  if (!placeQuery.data || !stampedQuery.data || !themesQuery.data || !artifactsQuery.data || !figuresQuery.data || !meQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader />
      </View>
    );
  }
  const p = placeQuery.data;
  const STAMPED = stampedQuery.data;
  const THEMES = themesQuery.data;
  const ARTIFACTS = artifactsQuery.data;
  const FIGURES = figuresQuery.data;
  const stamped = STAMPED.includes(p.id);
  const inThemes = THEMES.filter((t) => t.placeIds.includes(p.id));
  const placeArtifacts = ARTIFACTS.filter((a) => a.placeId === p.id);
  const placeFigures = FIGURES.filter((f) => f.placeIds.includes(p.id));
  const within = p.distance < 5;
  const myRank = meQuery.data.rank.current;

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 히어로 */}
        <View style={{ position: 'relative' }}>
          <PhotoPlaceholder label={`${p.id}__hero.jpg`} height={300} />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(250,247,240,0.95)']}
            locations={[0, 0.5, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <BackHeader overlay />
          {stamped && (
            <View style={{ position: 'absolute', top: 100, right: 24, zIndex: 2 }}>
              <Stamp glyph={p.nameHanja[0]} size={68} rotate={-12} color={p.accent} />
            </View>
          )}
        </View>

        {/* 제목 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 20, marginTop: -20 }}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
            <Tag color={p.accent} filled>
              {p.tag}
            </Tag>
            <Tag color={TOKENS.inkSoft}>{p.era}</Tag>
            <Tag color={TOKENS.mute}>{p.period}</Tag>
          </View>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 30,
              color: TOKENS.ink,
              letterSpacing: -0.5,
              lineHeight: 35,
            }}
          >
            {p.name}
          </Text>
          <View
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}
          >
            <Svg width="13" height="13" viewBox="0 0 22 22" fill="none">
              <Path
                d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
                stroke={TOKENS.mute}
                strokeWidth="1.6"
              />
            </Svg>
            <Text style={{ fontFamily: FONTS.sans, fontSize: 13, color: TOKENS.inkSoft }}>
              {p.region}
            </Text>
            <Text style={{ color: TOKENS.line }}>·</Text>
            <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: TOKENS.red }}>
              {p.distance}km
            </Text>
          </View>
        </View>

        {/* 인증 CTA */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          {stamped ? (
            <View
              style={{
                backgroundColor: TOKENS.paperWarm,
                borderWidth: 0.5,
                borderColor: `${p.accent}40`,
                padding: 14,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <Stamp glyph={p.nameHanja[0]} size={38} rotate={-8} color={p.accent} />
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: FONTS.sansBold, fontSize: 12, color: p.accent }}>
                  방문 완료
                </Text>
                <Text
                  style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute, marginTop: 2 }}
                >
                  2026.04.18 토 · 14:23 체크인
                </Text>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => within && router.push(`/checkin/${p.id}` as never)}
              disabled={!within}
              style={{
                padding: 16,
                backgroundColor: within ? TOKENS.ink : TOKENS.paperWarm,
                borderWidth: within ? 0 : 0.5,
                borderColor: TOKENS.line,
                borderRadius: 4,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Svg width="16" height="16" viewBox="0 0 22 22" fill="none">
                <Path
                  d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
                  stroke={within ? TOKENS.paper : TOKENS.mute}
                  strokeWidth="1.7"
                />
                <Circle cx="11" cy="8" r="2" fill={within ? TOKENS.paper : TOKENS.mute} />
              </Svg>
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 14,
                  color: within ? TOKENS.paper : TOKENS.mute,
                  letterSpacing: 0.3,
                }}
              >
                {within ? '여기에 도착했어요 · 인증하기' : `${p.distance}km 떨어진 곳 (5km 이내 인증 가능)`}
              </Text>
            </Pressable>
          )}
        </View>

        {/* 스토리 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Text style={{ fontFamily: FONTS.serif, fontSize: 16, color: TOKENS.ink, marginBottom: 8 }}>
            이 곳의 이야기
          </Text>
          <Text
            style={{
              fontFamily: FONTS.serifRegular,
              fontSize: 14,
              color: TOKENS.inkSoft,
              lineHeight: 26,
              letterSpacing: -0.2,
            }}
          >
            {p.story}
          </Text>
        </View>

        {/* 사진 */}
        <SectionLabel>사진 · PHOTOS</SectionLabel>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
          style={{ marginBottom: 24 }}
        >
          {[1, 2, 3, 4].map((i) => (
            <PhotoPlaceholder key={i} label={`${p.id}_${i}.jpg`} height={140} width={180} />
          ))}
        </ScrollView>

        {/* 이곳의 유물 */}
        {placeArtifacts.length > 0 && (
          <>
            <SectionLabel>이곳의 유물 · TREASURES HERE</SectionLabel>
            <View style={{ paddingHorizontal: 20, paddingBottom: 24, gap: 8 }}>
              {placeArtifacts.map((a) => (
                <Pressable
                  key={a.id}
                  onPress={() => router.push(`/artifact/${a.id}` as never)}
                  style={{
                    flexDirection: 'row',
                    gap: 12,
                    padding: 12,
                    backgroundColor: TOKENS.paper,
                    borderWidth: 0.5,
                    borderColor: TOKENS.line,
                    borderRadius: 4,
                    alignItems: 'center',
                  }}
                >
                  <PhotoPlaceholder label={a.id} height={64} width={64} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontFamily: FONTS.sansBold,
                        fontSize: 10,
                        color: a.accent,
                        letterSpacing: 1,
                      }}
                    >
                      {a.designation} · {a.category}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.serif,
                        fontSize: 15,
                        color: TOKENS.ink,
                        marginTop: 2,
                      }}
                    >
                      {a.name}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 11,
                        color: TOKENS.inkSoft,
                        marginTop: 3,
                      }}
                    >
                      {a.summary}
                    </Text>
                  </View>
                  <Svg width="8" height="14" viewBox="0 0 8 14">
                    <Path
                      d="M1 1l6 6-6 6"
                      stroke={TOKENS.mute}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* 관련 인물 */}
        {placeFigures.length > 0 && (
          <>
            <SectionLabel>관련 인물 · FIGURES</SectionLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              style={{ marginBottom: 24 }}
            >
              {placeFigures.map((f) => (
                <Pressable
                  key={f.id}
                  onPress={() => router.push(`/figure/${f.id}` as never)}
                  style={{
                    width: 200,
                    backgroundColor: TOKENS.paper,
                    borderWidth: 0.5,
                    borderColor: TOKENS.line,
                    borderRadius: 4,
                    flexDirection: 'row',
                    overflow: 'hidden',
                  }}
                >
                  <LinearGradient
                    colors={[f.accent, '#1A1614']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{
                      width: 64,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.serifBlack,
                        fontSize: 38,
                        color: TOKENS.paper,
                        lineHeight: 38,
                      }}
                    >
                      {f.glyph}
                    </Text>
                  </LinearGradient>
                  <View style={{ padding: 12, flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 14, color: TOKENS.ink }}>
                      {f.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.mono,
                        fontSize: 10,
                        color: TOKENS.mute,
                        marginTop: 3,
                      }}
                    >
                      {f.years}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 11,
                        color: TOKENS.inkSoft,
                        marginTop: 4,
                      }}
                    >
                      {f.title}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* 퀴즈 미리보기 */}
        {p.quiz && (
          <>
            <SectionLabel>현장 퀴즈 · QUIZ</SectionLabel>
            <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              <View
                style={{
                  backgroundColor: TOKENS.paper,
                  borderWidth: 0.5,
                  borderColor: TOKENS.line,
                  padding: 18,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <Text
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    fontFamily: FONTS.serifBlack,
                    fontSize: 90,
                    lineHeight: 90,
                    color: `${p.accent}10`,
                  }}
                >
                  問
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.sansBold,
                    fontSize: 10,
                    color: p.accent,
                    letterSpacing: 1.5,
                    marginBottom: 6,
                  }}
                >
                  QUESTION
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.serifRegular,
                    fontSize: 15,
                    color: TOKENS.ink,
                    lineHeight: 22,
                  }}
                >
                  {p.quiz.q}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 11,
                    color: TOKENS.mute,
                    marginTop: 10,
                  }}
                >
                  현장에서 답하면 스탬프와 함께 보너스 도장을 받을 수 있어요
                </Text>
              </View>
            </View>
          </>
        )}

        {/* 기여 */}
        <SectionLabel
          action={
            <Text style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute }}>
              등급에 따라 권한이 해제됩니다
            </Text>
          }
        >
          이 장소에 기여하기 · CONTRIBUTE
        </SectionLabel>
        <View style={{ paddingHorizontal: 20, paddingBottom: 24, gap: 8 }}>
          <GatedButton
            label="현장 사진 업로드"
            requiredLevel={LEVELS[1]}
            currentLevel={myRank}
            onPress={() => {}}
            onLocked={() => {}}
            icon={
              <Svg width="14" height="14" viewBox="0 0 22 22" fill="none">
                <Rect x="3" y="6" width="16" height="12" rx="1.5" stroke={TOKENS.paper} strokeWidth="1.7" />
                <Circle cx="11" cy="12" r="3" stroke={TOKENS.paper} strokeWidth="1.7" />
                <Path d="M8 6l1.5-2h3L14 6" stroke={TOKENS.paper} strokeWidth="1.7" />
              </Svg>
            }
          />
          <GatedButton
            label="현장 퀴즈 제안하기"
            requiredLevel={LEVELS[2]}
            currentLevel={myRank}
            onPress={() => {}}
            onLocked={() => {}}
          />
          <GatedButton
            label="장소 정보 보완 제안"
            requiredLevel={LEVELS[3]}
            currentLevel={myRank}
            onPress={() => {}}
            onLocked={() => {}}
          />
        </View>

        {/* 속한 테마 */}
        {inThemes.length > 0 && (
          <>
            <SectionLabel>속한 테마 · IN THEMES</SectionLabel>
            <View style={{ paddingHorizontal: 20, paddingBottom: 24, gap: 8 }}>
              {inThemes.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => router.push(`/theme/${t.id}` as never)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 14,
                    backgroundColor: TOKENS.paper,
                    borderWidth: 0.5,
                    borderColor: TOKENS.line,
                    borderRadius: 4,
                  }}
                >
                  <LinearGradient
                    colors={t.cover}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 4,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.serifBlack,
                        fontSize: 22,
                        color: 'rgba(255,255,255,0.5)',
                        lineHeight: 22,
                      }}
                    >
                      {t.glyph}
                    </Text>
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: FONTS.serif, fontSize: 14, color: TOKENS.ink }}>
                      {t.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 11,
                        color: TOKENS.mute,
                        marginTop: 2,
                      }}
                    >
                      {t.visited}/{t.totalPlaces}곳 방문
                    </Text>
                  </View>
                  <Svg width="8" height="14" viewBox="0 0 8 14">
                    <Path
                      d="M1 1l6 6-6 6"
                      stroke={TOKENS.mute}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </Svg>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* 방문자 통계 */}
        <View style={{ paddingHorizontal: 20 }}>
          <View
            style={{
              padding: 14,
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <View>
              <Text style={{ fontFamily: FONTS.monoBold, fontSize: 18, color: TOKENS.ink }}>
                {p.visits.toLocaleString()}
              </Text>
              <Text style={{ fontFamily: FONTS.sans, fontSize: 10, color: TOKENS.mute, marginTop: 1 }}>
                이번 달 방문
              </Text>
            </View>
            <View style={{ width: 0.5, height: 32, backgroundColor: TOKENS.line }} />
            <View>
              <Text style={{ fontFamily: FONTS.monoBold, fontSize: 18, color: TOKENS.ink }}>
                {p.nearbyStamps}
              </Text>
              <Text style={{ fontFamily: FONTS.sans, fontSize: 10, color: TOKENS.mute, marginTop: 1 }}>
                주변 답사지
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
