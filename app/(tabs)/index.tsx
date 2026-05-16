// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { SectionLabel } from '../../components/SectionLabel';
import { Mascot } from '../../components/Mascot';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });
  const artifactsQuery = useQuery({ queryKey: queryKeys.artifacts, queryFn: api.artifacts });
  const figuresQuery = useQuery({ queryKey: queryKeys.figures, queryFn: api.figures });
  const todayQuery = useQuery({ queryKey: queryKeys.today, queryFn: api.today });

  const loading =
    placesQuery.isLoading ||
    stampedQuery.isLoading ||
    themesQuery.isLoading ||
    artifactsQuery.isLoading ||
    figuresQuery.isLoading ||
    todayQuery.isLoading;

  if (loading || !placesQuery.data || !stampedQuery.data || !themesQuery.data || !artifactsQuery.data || !figuresQuery.data || !todayQuery.data) {
    return <View style={{ flex: 1, backgroundColor: TOKENS.paper }} />;
  }

  const PLACES = placesQuery.data;
  const STAMPED = stampedQuery.data;
  const THEMES = themesQuery.data;
  const ARTIFACTS = artifactsQuery.data;
  const FIGURES = figuresQuery.data;
  const TODAY_IN_HISTORY = todayQuery.data;

  const myStamps = STAMPED.length;
  const nearby = [...PLACES].filter((p) => p.distance < 20).sort((a, b) => a.distance - b.distance);
  const activeThemes = THEMES.filter((t) => t.visited > 0 && t.visited < t.totalPlaces).slice(0, 3);
  const hero = nearby[0];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: TOKENS.paper }}
      contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
    >
      {/* 헤더 */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingBottom: 8,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Svg width="14" height="14" viewBox="0 0 22 22" fill="none">
            <Path d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z" stroke={TOKENS.red} strokeWidth="1.8" />
            <Circle cx="11" cy="8" r="2" fill={TOKENS.red} />
          </Svg>
          <Text style={{ fontFamily: FONTS.sansBold, fontSize: 13, color: TOKENS.ink }}>
            충남 아산시 배방읍
          </Text>
        </View>
        <Pressable
          accessibilityLabel="search"
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
            <Circle cx="10" cy="10" r="6" stroke={TOKENS.ink} strokeWidth="1.7" />
            <Path d="M15 15l4 4" stroke={TOKENS.ink} strokeWidth="1.7" strokeLinecap="round" />
          </Svg>
        </Pressable>
      </View>

      {/* 큰 인사말 + 마스코트 */}
      <View
        style={{
          paddingHorizontal: 20,
          paddingTop: 4,
          paddingBottom: 18,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <Mascot size={88} source={require('../../assets/animations/mascot.riv')} />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 22,
              color: TOKENS.ink,
              letterSpacing: -0.5,
              lineHeight: 28,
            }}
          >
            오늘, 가까운 곳에서{'\n'}
            <Text style={{ color: TOKENS.red }}>역사 한 조각</Text>을 만나보세요
          </Text>
        </View>
      </View>

      {/* HERO */}
      {hero && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Pressable
            onPress={() => router.push(`/place/${hero.id}` as never)}
            style={{
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <PhotoPlaceholder label={`${hero.id}__hero.jpg`} height={170} />
            <View style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <Tag color={hero.accent} filled>
                  {hero.tag}
                </Tag>
                <Tag color={TOKENS.mute}>{hero.era}</Tag>
                <View style={{ flex: 1 }} />
                <Text style={{ fontFamily: FONTS.monoBold, fontSize: 11, color: TOKENS.red }}>
                  {hero.distance}km
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 20,
                  color: TOKENS.ink,
                  letterSpacing: -0.3,
                  lineHeight: 24,
                }}
              >
                {hero.name}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serifRegular,
                  fontSize: 11,
                  color: TOKENS.mute,
                  marginTop: 2,
                  letterSpacing: 1.5,
                }}
              >
                {hero.nameHanja} · {hero.region}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 13,
                  color: TOKENS.inkSoft,
                  marginTop: 10,
                  lineHeight: 20,
                }}
              >
                {hero.summary}
              </Text>
            </View>
          </Pressable>
        </View>
      )}

      {/* 오늘의 역사 */}
      <SectionLabel
        action={
          <Text style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute }}>
            5월 15일 · MAY 15
          </Text>
        }
      >
        오늘의 역사 · TODAY IN HISTORY
      </SectionLabel>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        style={{ marginBottom: 24 }}
      >
        {TODAY_IN_HISTORY.map((item) => (
          <Pressable
            key={item.title}
            onPress={() => item.placeId && router.push(`/place/${item.placeId}` as never)}
            style={{
              width: 260,
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              overflow: 'hidden',
              flexDirection: 'row',
            }}
          >
            <View
              style={{
                width: 76,
                backgroundColor: item.accent,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 6,
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.serifBlack,
                  fontSize: 40,
                  color: TOKENS.paper,
                  lineHeight: 40,
                }}
              >
                {item.glyph}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 10,
                  letterSpacing: 0.5,
                  marginTop: 8,
                  color: 'rgba(255,255,255,0.85)',
                }}
              >
                {item.year ? String(item.year) : '연례'}
              </Text>
            </View>
            <View style={{ padding: 12, flex: 1 }}>
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 10,
                  color: TOKENS.mute,
                  letterSpacing: 1.5,
                }}
              >
                {item.date}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 15,
                  color: TOKENS.ink,
                  marginTop: 3,
                  lineHeight: 18,
                }}
              >
                {item.title}
              </Text>
              <Text
                numberOfLines={3}
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 11,
                  color: TOKENS.inkSoft,
                  marginTop: 6,
                  lineHeight: 16,
                }}
              >
                {item.summary}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* 내 주변 */}
      <SectionLabel
        action={
          <Pressable onPress={() => router.push('/(tabs)/map' as never)}>
            <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.red }}>
              지도에서 보기 →
            </Text>
          </Pressable>
        }
      >
        내 주변 · NEARBY
      </SectionLabel>
      <View style={{ paddingHorizontal: 20, paddingBottom: 24, gap: 10 }}>
        {nearby.slice(1, 4).map((p) => (
          <Pressable
            key={p.id}
            onPress={() => router.push(`/place/${p.id}` as never)}
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
            <PhotoPlaceholder label={p.id} height={64} width={64} />
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Tag color={p.accent}>{p.era}</Tag>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: TOKENS.mute }}>
                  {p.distance}km
                </Text>
              </View>
              <Text style={{ fontFamily: FONTS.serif, fontSize: 15, color: TOKENS.ink }}>
                {p.name}
              </Text>
              <Text
                numberOfLines={1}
                style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute, marginTop: 2 }}
              >
                {p.summary}
              </Text>
            </View>
            {STAMPED.includes(p.id) && <Stamp glyph={p.nameHanja[0]} size={36} rotate={-8} color={p.accent} />}
          </Pressable>
        ))}
      </View>

      {/* 진행 중인 테마 */}
      <SectionLabel
        action={
          <Pressable onPress={() => router.push('/(tabs)/themes' as never)}>
            <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.red }}>전체 →</Text>
          </Pressable>
        }
      >
        진행 중인 테마 · IN PROGRESS
      </SectionLabel>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
        style={{ marginBottom: 24 }}
      >
        {activeThemes.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => router.push(`/theme/${t.id}` as never)}
            style={{
              width: 220,
              height: 220,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <LinearGradient
              colors={t.cover}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ flex: 1, padding: 16, justifyContent: 'space-between' }}
            >
              <Text
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 12,
                  fontFamily: FONTS.serifBlack,
                  fontSize: 88,
                  color: 'rgba(255,255,255,0.10)',
                  lineHeight: 88,
                }}
              >
                {t.glyph}
              </Text>
              <View>
                <Text
                  style={{
                    fontFamily: FONTS.serifRegular,
                    fontSize: 10,
                    color: 'rgba(255,255,255,0.7)',
                    letterSpacing: 2,
                  }}
                >
                  {t.subtitle}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.serif,
                    fontSize: 22,
                    color: TOKENS.paper,
                    marginTop: 4,
                    lineHeight: 26,
                  }}
                >
                  {t.title}
                </Text>
              </View>
              <View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginBottom: 6,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: FONTS.sansBold,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.85)',
                    }}
                  >
                    {t.visited} / {t.totalPlaces}곳
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.mono,
                      fontSize: 11,
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {Math.round((t.visited / t.totalPlaces) * 100)}%
                  </Text>
                </View>
                <View
                  style={{
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
          </Pressable>
        ))}
      </ScrollView>

      {/* 국보·유물 */}
      <SectionLabel
        action={
          <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.red }}>전체 →</Text>
        }
      >
        국보·유물 · TREASURES
      </SectionLabel>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        style={{ marginBottom: 24 }}
      >
        {ARTIFACTS.slice(0, 5).map((a) => (
          <Pressable
            key={a.id}
            onPress={() => router.push(`/artifact/${a.id}` as never)}
            style={{
              width: 160,
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <PhotoPlaceholder label={a.id} height={160} />
            <View style={{ padding: 12 }}>
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 9,
                  color: a.accent,
                  letterSpacing: 1,
                }}
              >
                {a.designation}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 14,
                  color: TOKENS.ink,
                  marginTop: 3,
                  lineHeight: 17,
                }}
              >
                {a.name}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serifRegular,
                  fontSize: 10,
                  color: TOKENS.mute,
                  marginTop: 2,
                  letterSpacing: 1.5,
                }}
              >
                {a.nameHanja}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* 인물 */}
      <SectionLabel
        action={
          <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.red }}>전체 →</Text>
        }
      >
        역사 속 인물 · FIGURES
      </SectionLabel>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
        style={{ marginBottom: 28 }}
      >
        {FIGURES.map((f) => (
          <Pressable key={f.id} onPress={() => router.push(`/figure/${f.id}` as never)} style={{ width: 140 }}>
            <LinearGradient
              colors={[f.accent, '#1A1614']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                height: 160,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.serifBlack,
                  fontSize: 100,
                  color: 'rgba(255,255,255,0.95)',
                  lineHeight: 100,
                }}
              >
                {f.glyph}
              </Text>
              <Text
                style={{
                  position: 'absolute',
                  bottom: 8,
                  left: 10,
                  right: 10,
                  fontFamily: FONTS.mono,
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.7)',
                  letterSpacing: 0.5,
                }}
              >
                {f.years}
              </Text>
            </LinearGradient>
            <View style={{ paddingTop: 8 }}>
              <Text style={{ fontFamily: FONTS.serif, fontSize: 14, color: TOKENS.ink }}>
                {f.name}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serifRegular,
                  fontSize: 10,
                  color: TOKENS.mute,
                  marginTop: 2,
                  letterSpacing: 2,
                }}
              >
                {f.nameHanja}
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

      {/* 내 발자취 */}
      <SectionLabel>나의 발자취 · MY JOURNEY</SectionLabel>
      <View style={{ paddingHorizontal: 20 }}>
        <View
          style={{
            backgroundColor: TOKENS.paper,
            borderWidth: 0.5,
            borderColor: TOKENS.line,
            borderRadius: 4,
            padding: 18,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 16 }}>
            <View>
              <Text
                style={{
                  fontFamily: FONTS.serifBlack,
                  fontSize: 44,
                  color: TOKENS.ink,
                  lineHeight: 44,
                  letterSpacing: -2,
                }}
              >
                {myStamps}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 11,
                  color: TOKENS.mute,
                  marginTop: 4,
                  letterSpacing: 1,
                }}
              >
                획득한 스탬프
              </Text>
            </View>
            <View style={{ flex: 1, flexDirection: 'row', gap: 4, paddingBottom: 4 }}>
              {STAMPED.slice(0, 6).map((id, i) => {
                const p = PLACES.find((x) => x.id === id);
                return (
                  <Stamp
                    key={id}
                    glyph={p?.nameHanja?.[0] || '印'}
                    size={32}
                    rotate={-8 + i * 3}
                    color={p?.accent || TOKENS.red}
                  />
                );
              })}
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/stampbook' as never)}
            style={{
              marginTop: 14,
              padding: 11,
              backgroundColor: TOKENS.ink,
              borderRadius: 4,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.sansBold,
                fontSize: 13,
                color: TOKENS.paper,
                letterSpacing: 0.2,
              }}
            >
              스탬프북 펼치기
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}
