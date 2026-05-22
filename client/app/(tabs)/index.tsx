// noinspection JSUnusedGlobalSymbols

import { useMemo, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { haptic } from "../../lib/haptics";
import { useQuery } from "@tanstack/react-query";
import { TOKENS } from "../../data/tokens";
import { api, queryKeys } from "../../lib/api";
import { Tag } from "../../components/Tag";
import { Stamp } from "../../components/Stamp";
import { PhotoPlaceholder } from "../../components/PhotoPlaceholder";
import { SectionLabel } from "../../components/SectionLabel";
import { PinIcon, SearchIcon } from "../../components/icons";
import { useSearchTransition } from "../../context/SearchTransition";
import { getSearchBarRect } from "../../lib/searchBarLayout";
import { useUserLocation } from "../../lib/useUserLocation";
import { formatDistance } from "../../lib/geo";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const searchBtnRef = useRef<View>(null);
  const { start: startSearchTransition } = useSearchTransition();
  const { coords: userCoords } = useUserLocation();

  const onPressSearch = () => {
    haptic.tap();
    const node = searchBtnRef.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      const target = getSearchBarRect(insets.top, screenWidth);
      startSearchTransition({ x, y, width, height }, target);
      setTimeout(() => {
        router.push("/(tabs)/map" as never);
      }, 200);
    });
  };

  // 가까운 장소 — 서버측에서 거리 계산/필터/정렬. 클라이언트는 결과만.
  const nearbyQuery = useQuery({
    queryKey: queryKeys.nearby(userCoords.lat, userCoords.lon, { radius: 20, limit: 30 }),
    queryFn: () =>
      api.nearby({ lat: userCoords.lat, lon: userCoords.lon, radius: 20, limit: 30 }),
  });
  const stampedQuery = useQuery({
    queryKey: queryKeys.stamped,
    queryFn: api.stamped,
  });
  // 최근 스탬프 표시용 가벼운 응답 (글리프 + 색 동봉)
  const recentStampsQuery = useQuery({
    queryKey: queryKeys.recentStamps(6),
    queryFn: () => api.recentStamps(6),
  });
  const themesQuery = useQuery({
    queryKey: queryKeys.themes,
    queryFn: api.themes,
  });
  const artifactsQuery = useQuery({
    queryKey: queryKeys.artifacts,
    queryFn: api.artifacts,
  });
  const figuresQuery = useQuery({
    queryKey: queryKeys.figures,
    queryFn: api.figures,
  });
  const todayQuery = useQuery({
    queryKey: queryKeys.today,
    queryFn: api.today,
  });

  const loading =
    nearbyQuery.isLoading ||
    stampedQuery.isLoading ||
    recentStampsQuery.isLoading ||
    themesQuery.isLoading ||
    artifactsQuery.isLoading ||
    figuresQuery.isLoading ||
    todayQuery.isLoading;

  // hooks는 반드시 early return 앞에서.
  const NEARBY_DATA = nearbyQuery.data;
  const STAMPED_DATA = stampedQuery.data;
  const RECENT_STAMPS_DATA = recentStampsQuery.data;
  const THEMES_DATA = themesQuery.data;

  const activeThemes = useMemo(() => {
    if (!THEMES_DATA) return [];
    return THEMES_DATA.filter(
      (t) => t.visited > 0 && t.visited < t.totalPlaces,
    ).slice(0, 3);
  }, [THEMES_DATA]);

  if (
    loading ||
    !NEARBY_DATA ||
    !STAMPED_DATA ||
    !RECENT_STAMPS_DATA ||
    !THEMES_DATA ||
    !artifactsQuery.data ||
    !figuresQuery.data ||
    !todayQuery.data
  ) {
    return <View className="flex-1 bg-paper" />;
  }

  const STAMPED = STAMPED_DATA;
  const RECENT_STAMPS = RECENT_STAMPS_DATA;
  const ARTIFACTS = artifactsQuery.data;
  const FIGURES = figuresQuery.data;
  const TODAY_IN_HISTORY = todayQuery.data;

  const myStamps = STAMPED.length;
  const nearby = NEARBY_DATA.items;
  const hero = nearby[0];

  return (
    <View className="flex-1 bg-paper">
      {/* 고정 헤더 */}
      <View
        className="px-5 pb-2 flex-row justify-between items-center bg-paper z-10"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-1.5">
          <PinIcon />
          <Text className="font-sans-bold text-[13px] text-ink">
            충남 아산시 배방읍
          </Text>
        </View>
        <Pressable
          ref={searchBtnRef}
          accessibilityLabel="search"
          onPress={onPressSearch}
          className="w-9 h-9 rounded-full bg-[rgba(26,22,20,0.05)] items-center justify-center"
        >
          <SearchIcon />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* 큰 인사말 */}
        <View className="px-5 pt-1 pb-4">
          <Text className="font-serif text-[26px] text-ink tracking-[-0.5px] leading-8">
            오늘, 가까운 곳에서{"\n"}
            <Text className="text-red">역사 한 조각</Text>을 만나보세요
          </Text>
        </View>

        {/* HERO */}
        {hero && (
          <View className="px-5 pb-6">
            <Pressable
              onPress={() => router.push(`/place/${hero.id}` as never)}
              className="bg-paper border border-line rounded-xl overflow-hidden"
            >
              <PhotoPlaceholder height={170} />
              <View className="p-4">
                <View className="flex-row items-center gap-1.5 mb-1.5">
                  <Tag color={hero.accent} filled>
                    {hero.tag}
                  </Tag>
                  <Tag color={TOKENS.mute}>{hero.era}</Tag>
                  <View className="flex-1" />
                  <Text className="font-mono-bold text-[11px] text-red">
                    {formatDistance(hero.distance)}
                  </Text>
                </View>
                <Text className="font-serif text-xl text-ink tracking-[-0.3px] leading-6">
                  {hero.name}
                </Text>
                <Text className="font-serif-regular text-[11px] text-mute mt-0.5 tracking-[1.5px]">
                  {hero.region}
                </Text>
                <Text className="font-sans text-[13px] text-inkSoft mt-2.5 leading-5">
                  {hero.summary}
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* 오늘의 역사 */}
        <SectionLabel
          action={
            <Text className="font-sans text-[11px] text-mute">
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
              onPress={() =>
                item.placeId && router.push(`/place/${item.placeId}` as never)
              }
              className="w-[260px] bg-paper border border-line rounded-xl overflow-hidden flex-row"
            >
              <View
                className="w-[76px] items-center justify-center px-1.5 py-2.5"
                style={{ backgroundColor: item.accent }}
              >
                <Text className="font-serif-black text-[40px] text-paper leading-10">
                  {item.glyph}
                </Text>
                <Text className="font-mono-bold text-[10px] tracking-[0.5px] mt-2 text-white/85">
                  {item.year ? String(item.year) : "연례"}
                </Text>
              </View>
              <View className="p-3 flex-1">
                <Text className="font-sans-bold text-[10px] text-mute tracking-[1.5px]">
                  {item.date}
                </Text>
                <Text className="font-serif text-[15px] text-ink mt-1 leading-[18px]">
                  {item.title}
                </Text>
                <Text
                  numberOfLines={3}
                  className="font-sans text-[11px] text-inkSoft mt-1.5 leading-4"
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
            <Pressable onPress={() => router.push("/(tabs)/map" as never)}>
              <Text className="font-sans-bold text-[11px] text-red">
                지도에서 보기 →
              </Text>
            </Pressable>
          }
        >
          내 주변 · NEARBY
        </SectionLabel>
        <View className="px-5 pb-6 gap-2.5">
          {nearby.slice(1, 4).map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/place/${p.id}` as never)}
              className="flex-row gap-3 p-3 bg-paper border border-line rounded-xl items-center"
            >
              <PhotoPlaceholder height={64} width={64} />
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5 mb-0.5">
                  <Tag color={p.accent}>{p.era}</Tag>
                  <Text className="font-mono text-[10px] text-mute">
                    {formatDistance(p.distance)}
                  </Text>
                </View>
                <Text className="font-serif text-[15px] text-ink">
                  {p.name}
                </Text>
                <Text
                  numberOfLines={1}
                  className="font-sans text-[11px] text-mute mt-0.5"
                >
                  {p.summary}
                </Text>
              </View>
              {STAMPED.includes(p.id) && (
                <Stamp
                  glyph={p.nameHanja[0]}
                  size={36}
                  rotate={-8}
                  color={p.accent}
                />
              )}
            </Pressable>
          ))}
        </View>

        {/* 진행 중인 테마 */}
        <SectionLabel
          action={
            <Pressable onPress={() => router.push("/(tabs)/themes" as never)}>
              <Text className="font-sans-bold text-[11px] text-red">
                전체 →
              </Text>
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
              className="w-[220px] h-[220px] rounded-xl overflow-hidden"
            >
              <View
                style={{
                  flex: 1,
                  padding: 16,
                  justifyContent: "space-between",
                  backgroundColor: t.cover,
                }}
              >
                <View>
                  <Text className="font-serif-regular text-[10px] text-white/70 tracking-[2px]">
                    {t.subtitle}
                  </Text>
                  <Text className="font-serif text-[22px] text-paper mt-1 leading-[26px]">
                    {t.title}
                  </Text>
                </View>
                <View>
                  <View className="flex-row justify-between mb-1.5">
                    <Text className="font-sans-bold text-[11px] text-white/85">
                      {t.visited} / {t.totalPlaces}곳
                    </Text>
                    <Text className="font-mono text-[11px] text-white/70">
                      {Math.round((t.visited / t.totalPlaces) * 100)}%
                    </Text>
                  </View>
                  <View className="h-0.5 bg-white/20 rounded-sm overflow-hidden">
                    <View
                      className="h-full bg-paper"
                      style={{ width: `${(t.visited / t.totalPlaces) * 100}%` }}
                    />
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* 국보·유물 */}
        <SectionLabel
          action={
            <Text className="font-sans-bold text-[11px] text-red">전체 →</Text>
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
              className="w-[160px] bg-paper border border-line rounded-xl overflow-hidden"
            >
              <PhotoPlaceholder height={160} />
              <View className="p-3">
                <Text
                  className="font-sans-bold text-[9px] tracking-wider"
                  style={{ color: a.accent }}
                >
                  {a.designation}
                </Text>
                <Text className="font-serif text-sm text-ink mt-0.5 leading-[17px]">
                  {a.name}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* 인물 */}
        <SectionLabel
          action={
            <Text className="font-sans-bold text-[11px] text-red">전체 →</Text>
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
            <Pressable
              key={f.id}
              onPress={() => router.push(`/figure/${f.id}` as never)}
              className="w-[140px]"
            >
              <LinearGradient
                colors={[f.accent, "#1A1614"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  height: 160,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <Text className="font-serif-black text-[28px] text-paper tracking-[-0.5px] px-3 text-center">
                  {f.name}
                </Text>
                <Text className="absolute bottom-2 left-2.5 right-2.5 font-mono text-[9px] text-white/70 tracking-[0.5px]">
                  {f.years}
                </Text>
              </LinearGradient>
              <View className="pt-2">
                <Text
                  numberOfLines={1}
                  className="font-sans text-xs text-inkSoft"
                >
                  {f.title}
                </Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>

        {/* 내 발자취 */}
        <SectionLabel>나의 발자취 · MY JOURNEY</SectionLabel>
        <View className="px-5">
          <View className="bg-paper border border-line rounded-xl p-[18px]">
            <View className="flex-row items-end gap-4">
              <View>
                <Text className="font-serif-black text-[44px] text-ink leading-[44px] tracking-[-2px]">
                  {myStamps}
                </Text>
                <Text className="font-sans text-[11px] text-mute mt-1 tracking-wide">
                  획득한 스탬프
                </Text>
              </View>
              <View className="flex-1 flex-row gap-1 pb-1">
                {RECENT_STAMPS.map((s, i) => (
                  <Stamp
                    key={s.id}
                    glyph={s.glyph}
                    size={32}
                    rotate={-8 + i * 3}
                    color={s.accent}
                  />
                ))}
              </View>
            </View>
            <Pressable
              onPress={() => router.push("/(tabs)/stampbook" as never)}
              className="mt-3.5 p-3 bg-ink rounded-lg items-center"
            >
              <Text className="font-sans-bold text-[13px] text-paper tracking-[0.2px]">
                스탬프북 펼치기
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
