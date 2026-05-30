// noinspection JSUnusedGlobalSymbols

import { useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { haptic } from '../../lib/haptics';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { PhotoCredit } from '../../components/PhotoCredit';
import { SectionLabel } from '../../components/SectionLabel';
import { PinIcon, SearchIcon } from '../../components/icons';
import { useSearchActions } from '../../context/SearchTransition';
import { getSearchBarRect } from '../../lib/searchBarLayout';
import { useUserLocation } from '../../lib/useUserLocation';
import { formatDistance } from '../../lib/geo';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { width: screenWidth } = useWindowDimensions();
  const searchBtnRef = useRef<View>(null);
  const { start: startSearchTransition } = useSearchActions();
  const { coords: userCoords } = useUserLocation();

  const onPressSearch = () => {
    haptic.tap();
    const node = searchBtnRef.current;
    if (!node) return;
    node.measureInWindow((x, y, width, height) => {
      const target = getSearchBarRect(insets.top, screenWidth);
      startSearchTransition({ x, y, width, height }, target);
      setTimeout(() => {
        router.push('/(tabs)/map' as never);
      }, 200);
    });
  };

  // 가까운 장소 — 서버측에서 거리 계산/필터/정렬. 클라이언트는 결과만.
  const nearbyQuery = useQuery({
    queryKey: queryKeys.nearby(userCoords.lat, userCoords.lon, { radius: 20, limit: 30 }),
    queryFn: () => api.nearby({ lat: userCoords.lat, lon: userCoords.lon, radius: 20, limit: 30 }),
  });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const recentStampsQuery = useQuery({
    queryKey: queryKeys.recentStamps(6),
    queryFn: () => api.recentStamps(6),
  });
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });

  // 콘텐츠 영역(인사말 아래) 전체를 하나의 상태로 처리.
  // 헤더 + 인사말은 정적이라 항상 보이고, 데이터 의존 콘텐츠만 로딩/에러 통합.
  const dataQueries = [nearbyQuery, themesQuery, recentStampsQuery];
  const loading = dataQueries.some((q) => q.isLoading);
  const error = dataQueries.some((q) => q.isError);
  const ready = dataQueries.every((q) => q.data !== undefined) && !error;
  const refetchAll = () => dataQueries.forEach((q) => q.refetch());

  const STAMPED = stampedQuery.data ?? [];
  const myStamps = STAMPED.length;

  return (
    <View className="flex-1 bg-paper">
      {/* 고정 헤더 (정적) */}
      <View
        className="px-5 pb-2 flex-row justify-between items-center bg-paper z-10"
        style={{ paddingTop: insets.top + 8 }}
      >
        <View className="flex-row items-center gap-1.5">
          <PinIcon />
          <Text className="font-sans-bold text-[13px] text-ink">충남 아산시 배방읍</Text>
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
        {/* 큰 인사말 (정적) */}
        <View className="px-5 pt-1 pb-4">
          <Text className="font-serif text-[26px] text-ink tracking-[-0.5px] leading-8">
            오늘, 가까운 곳에서{'\n'}
            <Text className="text-red">역사 한 조각</Text>을 만나보세요
          </Text>
        </View>

        {!ready ? (
          /* 인사말 아래 콘텐츠 — 통합 로딩/에러 */
          <View className="px-8 py-24 items-center justify-center">
            {error && !loading ? (
              <>
                <Text className="font-serif text-[16px] text-ink text-center">
                  데이터를 불러오지 못했어요
                </Text>
                <Text className="font-sans text-[12px] text-mute mt-2 text-center leading-5">
                  네트워크 또는 서버 상태를 확인해주세요.
                </Text>
                <Pressable onPress={refetchAll} className="mt-5 px-5 py-2.5 bg-ink rounded-full">
                  <Text className="font-sans-bold text-[13px] text-paper">다시 시도</Text>
                </Pressable>
              </>
            ) : (
              <ActivityIndicator size="small" color={TOKENS.mute} />
            )}
          </View>
        ) : (
          <HomeContent
            nearby={nearbyQuery.data!.items}
            themes={themesQuery.data!}
            recentStamps={recentStampsQuery.data!}
            stamped={STAMPED}
            myStamps={myStamps}
            router={router}
          />
        )}
      </ScrollView>
    </View>
  );
}

// ─── 콘텐츠 섹션들 (데이터 준비된 뒤에만 렌더) ────────────────
type ContentProps = {
  nearby: import('../../data/places').Place[];
  themes: import('../../data/themes').Theme[];
  recentStamps: { id: string; glyph: string; accent: string }[];
  stamped: string[];
  myStamps: number;
  router: ReturnType<typeof useRouter>;
};

function HomeContent({ nearby, themes, recentStamps, stamped, myStamps, router }: ContentProps) {
  const hero = nearby[0];
  const activeThemes = themes.filter((t) => t.visited > 0 && t.visited < t.totalPlaces).slice(0, 3);

  return (
    <>
      {/* HERO */}
      {hero && (
        <View className="px-5 pb-6">
          <Pressable
            onPress={() => router.push(`/place/${hero.id}` as never)}
            className="bg-paper border border-line rounded-xl overflow-hidden"
          >
            <View>
              <PhotoPlaceholder height={170} photoUrl={hero.photo?.url} />
              {hero.photo && (
                <PhotoCredit
                  photo={hero.photo}
                  style={{ position: 'absolute', bottom: 6, right: 8 }}
                />
              )}
            </View>
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

      {/* 내 주변 */}
      <SectionLabel
        action={
          <Pressable onPress={() => router.push('/(tabs)/map' as never)}>
            <Text className="font-sans-bold text-[11px] text-red">지도에서 보기 →</Text>
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
            <PhotoPlaceholder height={64} width={64} photoUrl={p.photo?.url} />
            <View className="flex-1">
              <View className="flex-row items-center gap-1.5 mb-0.5">
                <Tag color={p.accent}>{p.era}</Tag>
                <Text className="font-mono text-[10px] text-mute">
                  {formatDistance(p.distance)}
                </Text>
              </View>
              <Text className="font-serif text-[15px] text-ink">{p.name}</Text>
              <Text numberOfLines={1} className="font-sans text-[11px] text-mute mt-0.5">
                {p.summary}
              </Text>
            </View>
            {stamped.includes(p.id) && (
              <Stamp glyph={p.nameHanja[0]} size={36} rotate={-8} color={p.accent} />
            )}
          </Pressable>
        ))}
      </View>

      {/* 진행 중인 테마 */}
      <SectionLabel
        action={
          <Pressable onPress={() => router.push('/(tabs)/themes' as never)}>
            <Text className="font-sans-bold text-[11px] text-red">전체 →</Text>
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
                justifyContent: 'space-between',
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

      {/* 나의 발자취 */}
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
              {recentStamps.map((s, i) => (
                <Stamp key={s.id} glyph={s.glyph} size={32} rotate={-8 + i * 3} color={s.accent} />
              ))}
            </View>
          </View>
          <Pressable
            onPress={() => router.push('/(tabs)/stampbook' as never)}
            className="mt-3.5 p-3 bg-ink rounded-lg items-center"
          >
            <Text className="font-sans-bold text-[13px] text-paper tracking-[0.2px]">
              스탬프북 펼치기
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}
