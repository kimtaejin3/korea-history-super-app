// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONTS, TOKENS } from '../../data/tokens';
import { THEMES } from '../../data/themes';
import { PLACES, STAMPED } from '../../data/places';
import { BackHeader } from '../../components/BackHeader';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { SectionLabel } from '../../components/SectionLabel';

export default function ThemeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const t = THEMES.find((x) => x.id === id);
  if (!t) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader title="테마를 찾을 수 없어요" />
      </View>
    );
  }
  const places = t.placeIds
    .map((pid) => PLACES.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const pct = (t.visited / t.totalPlaces) * 100;

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 커버 */}
        <LinearGradient
          colors={t.cover}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 320, position: 'relative', overflow: 'hidden' }}
        >
          <Text
            style={{
              position: 'absolute',
              top: 40,
              right: -30,
              fontFamily: FONTS.serifBlack,
              fontSize: 340,
              lineHeight: 340,
              color: 'rgba(255,255,255,0.08)',
            }}
          >
            {t.glyph}
          </Text>
          <BackHeader overlay />
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              paddingHorizontal: 20,
              paddingBottom: 24,
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.serifRegular,
                fontSize: 11,
                color: 'rgba(255,255,255,0.8)',
                letterSpacing: 3,
              }}
            >
              {t.subtitle.toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 34,
                color: TOKENS.paper,
                marginTop: 4,
                lineHeight: 38,
                letterSpacing: -0.5,
              }}
            >
              {t.title}
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 14 }}
            >
              <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: TOKENS.paper }}>
                {t.visited} / {t.totalPlaces}
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 2,
                  backgroundColor: 'rgba(255,255,255,0.25)',
                  borderRadius: 2,
                  overflow: 'hidden',
                }}
              >
                <View
                  style={{ width: `${pct}%`, height: '100%', backgroundColor: TOKENS.paper }}
                />
              </View>
              <Text style={{ fontFamily: FONTS.monoBold, fontSize: 13, color: TOKENS.paper }}>
                {Math.round(pct)}%
              </Text>
            </View>
          </View>
        </LinearGradient>

        {/* 설명 */}
        <View style={{ padding: 20, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: FONTS.serifRegular,
              fontSize: 15,
              color: TOKENS.inkSoft,
              lineHeight: 26,
            }}
          >
            {t.desc}
          </Text>
        </View>

        {/* 보상 카드 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: TOKENS.paperWarm,
              borderWidth: 0.5,
              borderColor: `${t.color}40`,
              padding: 16,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <LinearGradient
              colors={t.cover}
              style={{
                width: 56,
                height: 56,
                borderRadius: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <Path
                  d="M4 10l7-7 7 7v9a1 1 0 01-1 1H5a1 1 0 01-1-1v-9z"
                  stroke={TOKENS.paper}
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
                <Path
                  d="M8 14l2 2 4-4"
                  stroke={TOKENS.paper}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 10,
                  color: t.color,
                  letterSpacing: 1.5,
                }}
              >
                완성 시 보상
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 15,
                  color: TOKENS.ink,
                  marginTop: 3,
                }}
              >
                {t.rewardGoods}
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 11,
                  color: TOKENS.mute,
                  marginTop: 2,
                }}
              >
                + "{t.badge}" 칭호 획득
              </Text>
            </View>
          </View>
        </View>

        {/* 장소 타임라인 */}
        <SectionLabel
          action={
            <Text style={{ fontFamily: FONTS.sansBold, fontSize: 11, color: TOKENS.mute }}>
              코스 순서대로
            </Text>
          }
        >
          {`이 테마의 장소들 · ${t.totalPlaces}곳`}
        </SectionLabel>

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
          {places.map((p, i) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/place/${p.id}` as never)}
              style={{
                flexDirection: 'row',
                gap: 16,
                alignItems: 'flex-start',
                paddingVertical: 14,
              }}
            >
              <View
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  backgroundColor: STAMPED.includes(p.id) ? t.color : TOKENS.paper,
                  borderWidth: 1.5,
                  borderColor: t.color,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.monoBold,
                    fontSize: 12,
                    color: STAMPED.includes(p.id) ? TOKENS.paper : t.color,
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </Text>
              </View>
              <View style={{ flex: 1, paddingTop: 4 }}>
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}
                >
                  <Tag color={p.accent}>{p.region}</Tag>
                  {STAMPED.includes(p.id) && (
                    <Text
                      style={{ fontFamily: FONTS.sansBold, fontSize: 10, color: t.color }}
                    >
                      ● 방문 완료
                    </Text>
                  )}
                </View>
                <Text style={{ fontFamily: FONTS.serif, fontSize: 16, color: TOKENS.ink }}>
                  {p.name}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.sans,
                    fontSize: 12,
                    color: TOKENS.mute,
                    marginTop: 3,
                    lineHeight: 18,
                  }}
                >
                  {p.summary}
                </Text>
              </View>
              {STAMPED.includes(p.id) && (
                <View style={{ paddingTop: 4 }}>
                  <Stamp glyph={p.nameHanja[0]} size={36} rotate={-8} color={p.accent} />
                </View>
              )}
            </Pressable>
          ))}

          {/* 미답사 노드 */}
          {Array.from({ length: t.totalPlaces - places.length }).map((_, i) => {
            const idx = places.length + i;
            return (
              <View
                key={`x${i}`}
                style={{
                  flexDirection: 'row',
                  gap: 16,
                  alignItems: 'flex-start',
                  paddingVertical: 14,
                  opacity: 0.5,
                }}
              >
                <View
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: TOKENS.paper,
                    borderWidth: 1.5,
                    borderColor: TOKENS.line,
                    borderStyle: 'dashed',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 12, color: TOKENS.mute }}>
                    {String(idx + 1).padStart(2, '0')}
                  </Text>
                </View>
                <View style={{ flex: 1, paddingTop: 6 }}>
                  <Text style={{ fontFamily: FONTS.serifRegular, fontSize: 14, color: TOKENS.mute }}>
                    미답사 장소
                  </Text>
                  <Text style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute, marginTop: 2 }}>
                    방문하면 공개됩니다
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
