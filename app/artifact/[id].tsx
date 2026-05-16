// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { BackHeader } from '../../components/BackHeader';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { Tag } from '../../components/Tag';
import { SectionLabel } from '../../components/SectionLabel';

export default function ArtifactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const artifactQuery = useQuery({ queryKey: queryKeys.artifact(id), queryFn: () => api.artifact(id), enabled: !!id });
  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });

  if (artifactQuery.isError || (artifactQuery.isFetched && !artifactQuery.data)) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader title="유물을 찾을 수 없어요" />
      </View>
    );
  }
  if (!artifactQuery.data || !placesQuery.data) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
        <BackHeader />
      </View>
    );
  }
  const a = artifactQuery.data;
  const place = placesQuery.data.find((p) => p.id === a.placeId);

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={{ position: 'relative' }}>
          <PhotoPlaceholder label={`${a.id}__artifact.jpg`} height={340} />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(251,251,249,0.95)']}
            locations={[0, 0.5, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <BackHeader overlay />
          <View
            style={{
              position: 'absolute',
              top: 110,
              left: 20,
              paddingHorizontal: 10,
              paddingVertical: 4,
              backgroundColor: 'rgba(251,251,249,0.92)',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.sansBold,
                fontSize: 10,
                color: a.accent,
                letterSpacing: 1.5,
              }}
            >
              {a.designation}
            </Text>
          </View>
        </View>

        {/* 제목 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 18, marginTop: -20 }}>
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
            <Tag color={a.accent} filled>
              {a.category}
            </Tag>
            <Tag color={TOKENS.inkSoft}>{a.period}</Tag>
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
            {a.name}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              color: TOKENS.inkSoft,
              marginTop: 12,
              lineHeight: 21,
            }}
          >
            {a.summary}
          </Text>
        </View>

        {/* 팩트 그리드 (2열) */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <View
            style={{
              backgroundColor: TOKENS.paper,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}
          >
            {a.facts.map((f, i) => (
              <View
                key={i}
                style={{
                  width: '50%',
                  padding: 16,
                  borderRightWidth: i % 2 === 0 ? 0.5 : 0,
                  borderRightColor: TOKENS.lineSoft,
                  borderBottomWidth: i < a.facts.length - 2 ? 0.5 : 0,
                  borderBottomColor: TOKENS.lineSoft,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.mono,
                    fontSize: 9,
                    color: TOKENS.mute,
                    letterSpacing: 1,
                  }}
                >
                  {f.label.toUpperCase()}
                </Text>
                <Text
                  style={{
                    fontFamily: FONTS.serif,
                    fontSize: 14,
                    color: TOKENS.ink,
                    marginTop: 4,
                  }}
                >
                  {f.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* 본문 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 16,
              color: TOKENS.ink,
              marginBottom: 8,
            }}
          >
            이 유물의 이야기
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
            {a.story}
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
          {[1, 2, 3].map((i) => (
            <PhotoPlaceholder key={i} label={`${a.id}_${i}.jpg`} height={140} width={200} />
          ))}
        </ScrollView>

        {/* 소재 장소 */}
        {place && (
          <>
            <SectionLabel>소재 장소 · LOCATION</SectionLabel>
            <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
              <Pressable
                onPress={() => router.push(`/place/${place.id}` as never)}
                style={{
                  backgroundColor: TOKENS.paper,
                  borderWidth: 0.5,
                  borderColor: TOKENS.line,
                  borderRadius: 4,
                  flexDirection: 'row',
                  overflow: 'hidden',
                  alignItems: 'center',
                }}
              >
                <PhotoPlaceholder label={place.id} height={92} width={92} />
                <View style={{ flex: 1, padding: 14 }}>
                  <Tag color={place.accent}>{place.era}</Tag>
                  <Text
                    style={{
                      fontFamily: FONTS.serif,
                      fontSize: 15,
                      color: TOKENS.ink,
                      marginTop: 4,
                    }}
                  >
                    {place.name}
                  </Text>
                  <Text
                    style={{
                      fontFamily: FONTS.sans,
                      fontSize: 11,
                      color: TOKENS.mute,
                      marginTop: 2,
                    }}
                  >
                    {place.region} · {place.distance}km
                  </Text>
                </View>
                <View style={{ paddingRight: 14 }}>
                  <Svg width="8" height="14" viewBox="0 0 8 14">
                    <Path
                      d="M1 1l6 6-6 6"
                      stroke={TOKENS.mute}
                      strokeWidth="1.5"
                      fill="none"
                      strokeLinecap="round"
                    />
                  </Svg>
                </View>
              </Pressable>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
