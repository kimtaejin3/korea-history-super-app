// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { FONTS, TOKENS } from '../../data/tokens';
import { FIGURES } from '../../data/figures';
import { PLACES } from '../../data/places';
import { ARTIFACTS } from '../../data/artifacts';
import { BackHeader } from '../../components/BackHeader';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { Tag } from '../../components/Tag';
import { SectionLabel } from '../../components/SectionLabel';

export default function FigureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const f = FIGURES.find((x) => x.id === id);
  if (!f) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader title="인물을 찾을 수 없어요" />
      </View>
    );
  }
  const linkedPlaces = f.placeIds
    .map((pid) => PLACES.find((p) => p.id === pid))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
  const linkedArtifacts = ARTIFACTS.filter((a) =>
    linkedPlaces.some((p) => p.id === a.placeId)
  );

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        {/* 히어로 */}
        <LinearGradient
          colors={[f.accent, '#1A1614']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ height: 320, position: 'relative', overflow: 'hidden' }}
        >
          <Text
            style={{
              position: 'absolute',
              top: 20,
              right: -40,
              fontFamily: FONTS.serifBlack,
              fontSize: 380,
              lineHeight: 380,
              color: 'rgba(255,255,255,0.08)',
            }}
          >
            {f.glyph}
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
                fontSize: 12,
                color: 'rgba(255,255,255,0.7)',
                letterSpacing: 3,
              }}
            >
              {f.titleHanja} · {f.title.toUpperCase()}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 42,
                color: TOKENS.paper,
                marginTop: 6,
                lineHeight: 42,
                letterSpacing: -1,
              }}
            >
              {f.name}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serifRegular,
                fontSize: 14,
                color: 'rgba(255,255,255,0.7)',
                marginTop: 4,
                letterSpacing: 3,
              }}
            >
              {f.nameHanja}
            </Text>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}
            >
              <Text style={{ fontFamily: FONTS.monoBold, fontSize: 12, color: TOKENS.paper }}>
                {f.years}
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(255,255,255,0.15)',
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.sansBold,
                    fontSize: 11,
                    color: 'rgba(255,255,255,0.9)',
                  }}
                >
                  {f.era}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* 요약 */}
        <View style={{ padding: 20 }}>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 16,
              color: TOKENS.inkSoft,
              lineHeight: 28,
              letterSpacing: -0.2,
            }}
          >
            {f.summary}
          </Text>
        </View>

        {/* 본문 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: FONTS.serifRegular,
              fontSize: 14,
              color: TOKENS.inkSoft,
              lineHeight: 26,
              letterSpacing: -0.2,
            }}
          >
            {f.story}
          </Text>
        </View>

        {/* 연표 */}
        <SectionLabel>일생 · TIMELINE</SectionLabel>
        <View style={{ paddingHorizontal: 20, paddingBottom: 24, position: 'relative' }}>
          <View
            style={{
              position: 'absolute',
              left: 20 + 56,
              top: 16,
              bottom: 16,
              width: 1,
              backgroundColor: TOKENS.line,
            }}
          />
          {f.timeline.map((t, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                gap: 16,
                alignItems: 'flex-start',
                paddingVertical: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.monoBold,
                  fontSize: 12,
                  color: f.accent,
                  width: 40,
                  textAlign: 'right',
                  paddingTop: 6,
                }}
              >
                {t.year}
              </Text>
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: f.accent,
                  marginTop: 9,
                  flexShrink: 0,
                }}
              />
              <Text
                style={{
                  flex: 1,
                  fontFamily: FONTS.serif,
                  fontSize: 14,
                  color: TOKENS.ink,
                  lineHeight: 21,
                  paddingTop: 3,
                }}
              >
                {t.event}
              </Text>
            </View>
          ))}
        </View>

        {/* 발자취 */}
        {linkedPlaces.length > 0 && (
          <>
            <SectionLabel>발자취 · RELATED PLACES</SectionLabel>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}
              style={{ marginBottom: 24 }}
            >
              {linkedPlaces.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() => router.push(`/place/${p.id}` as never)}
                  style={{
                    width: 220,
                    borderWidth: 0.5,
                    borderColor: TOKENS.line,
                    borderRadius: 4,
                    overflow: 'hidden',
                    backgroundColor: TOKENS.paper,
                  }}
                >
                  <PhotoPlaceholder label={p.id} height={110} />
                  <View style={{ padding: 14 }}>
                    <Tag color={p.accent}>{p.region}</Tag>
                    <Text
                      style={{
                        fontFamily: FONTS.serif,
                        fontSize: 15,
                        color: TOKENS.ink,
                        marginTop: 6,
                      }}
                    >
                      {p.name}
                    </Text>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 11,
                        color: TOKENS.mute,
                        marginTop: 2,
                        lineHeight: 16,
                      }}
                    >
                      {p.summary}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </>
        )}

        {/* 관련 유물 */}
        {linkedArtifacts.length > 0 && (
          <>
            <SectionLabel>관련 유물 · ARTIFACTS</SectionLabel>
            <View style={{ paddingHorizontal: 20, gap: 8 }}>
              {linkedArtifacts.map((a) => (
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
                      {a.designation}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.serif,
                        fontSize: 14,
                        color: TOKENS.ink,
                        marginTop: 2,
                      }}
                    >
                      {a.name}
                    </Text>
                    <Text
                      style={{
                        fontFamily: FONTS.sans,
                        fontSize: 11,
                        color: TOKENS.mute,
                        marginTop: 2,
                      }}
                    >
                      {a.period}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
