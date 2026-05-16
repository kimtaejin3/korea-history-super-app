// noinspection JSUnusedGlobalSymbols

import { useState } from 'react';
import { View, Text, ScrollView, Pressable, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  Pattern,
  G,
  Text as SvgText,
} from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { Tag } from '../../components/Tag';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';

const CITIES = [
  { x: 38, y: 23, t: '서울' },
  { x: 39, y: 25, t: '수원' },
  { x: 36, y: 32, t: '아산' },
  { x: 33, y: 38, t: '부여' },
  { x: 49, y: 38, t: '안동' },
  { x: 56, y: 41, t: '경주' },
];

const KOREA_PATH =
  'M28,8 L42,6 L46,10 L48,15 L44,20 L50,22 L55,18 L58,21 L52,26 L48,30 L45,35 L42,38 L40,42 L44,46 L50,48 L55,52 L58,58 L55,64 L52,68 L48,72 L42,76 L38,80 L34,84 L30,82 L28,76 L30,70 L28,64 L26,58 L24,52 L22,46 L20,40 L22,34 L20,28 L22,22 L24,16 L26,12 Z';

const FILTERS = ['전체', '조선', '백제', '통일신라', '근현대'];

export default function MapScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width, height } = useWindowDimensions();
  const [filter, setFilter] = useState('전체');

  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });

  if (!placesQuery.data || !stampedQuery.data) {
    return <View style={{ flex: 1, backgroundColor: '#E8E1D2' }} />;
  }
  const PLACES = placesQuery.data;
  const STAMPED = stampedQuery.data;
  const visible = PLACES.filter((p) => filter === '전체' || p.era === filter);
  const nearby = [...visible].sort((a, b) => a.distance - b.distance).slice(0, 5);

  return (
    <View style={{ flex: 1, backgroundColor: '#E8E1D2' }}>
      {/* 지도 */}
      <Svg
        width={width}
        height={height}
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid slice"
        style={{ position: 'absolute', top: 0, left: 0 }}
      >
        <Defs>
          <Pattern id="grid" width="6" height="6" patternUnits="userSpaceOnUse">
            <Path d="M 6 0 L 0 0 0 6" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="0.2" />
          </Pattern>
          <Pattern id="sea" width="3" height="3" patternUnits="userSpaceOnUse">
            <Circle cx="1.5" cy="1.5" r="0.3" fill="#A8B5C0" opacity="0.4" />
          </Pattern>
        </Defs>
        <Rect width="100" height="100" fill="url(#sea)" />
        <Rect width="100" height="100" fill="url(#grid)" />
        <Path
          d={KOREA_PATH}
          fill="#F4EFE3"
          stroke="#1A1614"
          strokeWidth="0.3"
          strokeOpacity={0.4}
        />
        {CITIES.map((c) => (
          <SvgText
            key={c.t}
            x={c.x}
            y={c.y - 2.5}
            textAnchor="middle"
            fontFamily={FONTS.serifRegular}
            fontSize="1.8"
            fill="#7A6F65"
          >
            {c.t}
          </SvgText>
        ))}
        {visible.map((p) => {
          const stamped = STAMPED.includes(p.id);
          return (
            <G key={p.id}>
              <Circle
                cx={p.coords.x}
                cy={p.coords.y}
                r="1.6"
                fill={stamped ? p.accent : TOKENS.paper}
                stroke={p.accent}
                strokeWidth="0.6"
              />
              {stamped && (
                <Circle cx={p.coords.x} cy={p.coords.y} r="0.6" fill={TOKENS.paper} />
              )}
            </G>
          );
        })}
        <Circle cx="36" cy="32" r="3" fill={TOKENS.red} fillOpacity={0.15} />
        <Circle
          cx="36"
          cy="32"
          r="1.4"
          fill={TOKENS.red}
          stroke={TOKENS.paper}
          strokeWidth="0.4"
        />
      </Svg>

      {/* 상단 검색 + 필터 */}
      <View style={{ paddingTop: insets.top + 12, paddingHorizontal: 16, paddingBottom: 12 }}>
        <LinearGradient
          colors={['rgba(232,225,210,0.95)', 'rgba(232,225,210,0)']}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, height: insets.top + 120 }}
          pointerEvents="none"
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            backgroundColor: TOKENS.paper,
            borderRadius: 999,
            paddingHorizontal: 16,
            paddingVertical: 10,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 12,
            elevation: 3,
          }}
        >
          <Svg width="14" height="14" viewBox="0 0 22 22" fill="none">
            <Circle cx="10" cy="10" r="6" stroke={TOKENS.mute} strokeWidth="1.8" />
            <Path d="M15 15l4 4" stroke={TOKENS.mute} strokeWidth="1.8" strokeLinecap="round" />
          </Svg>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 13, color: TOKENS.mute, flex: 1 }}>
            장소 · 테마 · 시대 검색
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 6, marginTop: 10 }}
        >
          {FILTERS.map((f) => {
            const on = filter === f;
            return (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: on ? TOKENS.ink : TOKENS.paper,
                  shadowColor: '#000',
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.sansBold,
                    fontSize: 12,
                    color: on ? TOKENS.paper : TOKENS.inkSoft,
                  }}
                >
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* 하단 시트 */}
      <View
        style={{
          position: 'absolute',
          bottom: 84,
          left: 0,
          right: 0,
          backgroundColor: TOKENS.paper,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: 10,
          paddingBottom: 12,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: -4 },
          shadowRadius: 20,
          elevation: 8,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 8 }}>
          <View style={{ width: 36, height: 4, borderRadius: 2, backgroundColor: TOKENS.line }} />
        </View>
        <View
          style={{
            paddingHorizontal: 20,
            paddingBottom: 8,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <Text style={{ fontFamily: FONTS.serif, fontSize: 15, color: TOKENS.ink }}>
            내 주변 {visible.length}곳
          </Text>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute }}>
            가까운 순
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 10, paddingVertical: 4 }}
        >
          {nearby.map((p) => {
            const stamped = STAMPED.includes(p.id);
            return (
              <Pressable
                key={p.id}
                onPress={() => router.push(`/place/${p.id}` as never)}
                style={{
                  width: 200,
                  borderWidth: 0.5,
                  borderColor: TOKENS.line,
                  borderRadius: 4,
                  overflow: 'hidden',
                }}
              >
                <PhotoPlaceholder label={p.id} height={90} />
                <View style={{ padding: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <Tag color={p.accent}>{p.era}</Tag>
                    {stamped && (
                      <Text style={{ fontFamily: FONTS.sansBold, fontSize: 10, color: TOKENS.red }}>
                        ● 획득
                      </Text>
                    )}
                  </View>
                  <Text style={{ fontFamily: FONTS.serif, fontSize: 14, color: TOKENS.ink }}>
                    {p.name}
                  </Text>
                  <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: TOKENS.mute, marginTop: 2 }}>
                    {p.distance}km · {p.region}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}
