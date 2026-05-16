// noinspection JSUnusedGlobalSymbols

import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ViewStyle } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { PageHeader } from '../../components/PageHeader';
import { Stamp } from '../../components/Stamp';
import { StampSlot } from '../../components/StampSlot';

const VIEWS = ['테마별', '시대별', '지역별'];

export default function StampbookScreen() {
  const router = useRouter();
  const [view, setView] = useState('테마별');

  const placesQuery = useQuery({ queryKey: queryKeys.places, queryFn: api.places });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });

  if (!placesQuery.data || !stampedQuery.data || !themesQuery.data) {
    return <View style={{ flex: 1, backgroundColor: TOKENS.paper }} />;
  }
  const PLACES = placesQuery.data;
  const STAMPED = stampedQuery.data;
  const THEMES = themesQuery.data;

  const byTheme = THEMES.map((t) => {
    const places = t.placeIds
      .map((id) => PLACES.find((p) => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p));
    return { theme: t, places, total: t.totalPlaces };
  });

  const progressPct = (STAMPED.length / PLACES.length) * 100;
  const circumference = 2 * Math.PI * 28;
  const dashLength = (progressPct / 100) * circumference;

  return (
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      <PageHeader
        title="스탬프북"
        subtitle={`${STAMPED.length}개의 발자국 · 모은 도장 ${STAMPED.length}/${PLACES.length}`}
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
              <Path
                d="M11 3v12M11 3l-4 4M11 3l4 4M5 13v5h12v-5"
                stroke={TOKENS.ink}
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
        }
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* 도감 진척도 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 18 }}>
          <View
            style={{
              backgroundColor: TOKENS.paperWarm,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              padding: 18,
              borderRadius: 4,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <View style={{ width: 64, height: 64 }}>
              <Svg width="64" height="64" viewBox="0 0 64 64">
                <Circle cx="32" cy="32" r="28" fill="none" stroke={TOKENS.line} strokeWidth="3" />
                <Circle
                  cx="32"
                  cy="32"
                  r="28"
                  fill="none"
                  stroke={TOKENS.red}
                  strokeWidth="3"
                  strokeDasharray={`${dashLength} ${circumference}`}
                  strokeLinecap="round"
                  rotation="-90"
                  origin="32, 32"
                />
              </Svg>
              <View
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontFamily: FONTS.serif, fontSize: 16, color: TOKENS.ink }}>
                  {Math.round(progressPct)}%
                </Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: FONTS.serif, fontSize: 16, color: TOKENS.ink }}>
                도감 진척도
              </Text>
              <Text
                style={{
                  fontFamily: FONTS.sans,
                  fontSize: 12,
                  color: TOKENS.mute,
                  marginTop: 4,
                  lineHeight: 19,
                }}
              >
                전국 {PLACES.length}곳 중 {STAMPED.length}곳 완료. 다음 목표까지{' '}
                {PLACES.length - STAMPED.length}곳
              </Text>
            </View>
          </View>
        </View>

        {/* 탭 */}
        <View style={{ paddingHorizontal: 20, paddingBottom: 14, flexDirection: 'row', gap: 4 }}>
          {VIEWS.map((v) => {
            const on = view === v;
            return (
              <Pressable
                key={v}
                onPress={() => setView(v)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 999,
                  backgroundColor: on ? TOKENS.ink : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: FONTS.sansBold,
                    fontSize: 12,
                    color: on ? TOKENS.paper : TOKENS.inkSoft,
                  }}
                >
                  {v}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* 테마별 도감 */}
        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          {byTheme.map(({ theme, places, total }) => (
            <View key={theme.id}>
              <Pressable
                onPress={() => router.push(`/theme/${theme.id}` as never)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}
              >
                <View
                  style={{ width: 4, height: 18, backgroundColor: theme.color, borderRadius: 2 }}
                />
                <Text style={{ fontFamily: FONTS.serif, fontSize: 16, color: TOKENS.ink, flex: 1 }}>
                  {theme.title}
                </Text>
                <Text style={{ fontFamily: FONTS.mono, fontSize: 10, color: TOKENS.mute }}>
                  {places.filter((p) => STAMPED.includes(p.id)).length}/{total}
                </Text>
              </Pressable>
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: 8,
                  padding: 12,
                  paddingVertical: 14,
                  backgroundColor: TOKENS.paper,
                  borderWidth: 0.5,
                  borderColor: TOKENS.line,
                  borderRadius: 4,
                }}
              >
                {Array.from({ length: total }).map((_, i) => {
                  const p = places[i];
                  const cellStyle: ViewStyle = { width: '18%', alignItems: 'center', gap: 4 };
                  if (p && STAMPED.includes(p.id)) {
                    return (
                      <Pressable
                        key={i}
                        onPress={() => router.push(`/place/${p.id}` as never)}
                        style={cellStyle}
                      >
                        <Stamp
                          glyph={p.nameHanja[0]}
                          size={48}
                          rotate={-6 + (i % 3) * 4}
                          color={p.accent}
                        />
                        <Text
                          numberOfLines={1}
                          style={{
                            fontFamily: FONTS.sans,
                            fontSize: 9,
                            color: TOKENS.inkSoft,
                            maxWidth: 56,
                          }}
                        >
                          {p.name}
                        </Text>
                      </Pressable>
                    );
                  }
                  if (p) {
                    return (
                      <Pressable
                        key={i}
                        onPress={() => router.push(`/place/${p.id}` as never)}
                        style={cellStyle}
                      >
                        <Stamp glyph={p.nameHanja[0]} size={48} rotate={0} dim color={p.accent} />
                        <Text
                          numberOfLines={1}
                          style={{ fontFamily: FONTS.sans, fontSize: 9, color: TOKENS.mute, maxWidth: 56 }}
                        >
                          {p.name}
                        </Text>
                      </Pressable>
                    );
                  }
                  return (
                    <View key={i} style={cellStyle}>
                      <StampSlot size={48} />
                      <View style={{ height: 11 }} />
                    </View>
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
