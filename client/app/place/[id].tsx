// noinspection JSUnusedGlobalSymbols

import { View, Text, ScrollView, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { LEVELS } from '../../data/user';
import { BackHeader } from '../../components/BackHeader';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { PhotoCredit } from '../../components/PhotoCredit';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { SectionLabel } from '../../components/SectionLabel';
import { GatedButton } from '../../components/GatedButton';
import { CameraIcon, ChevronRightIcon, PinIconFilled, PinIconOutline } from '../../components/icons';
import { formatDistance } from '../../lib/geo';

export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const placeQuery = useQuery({ queryKey: queryKeys.place(id), queryFn: () => api.place(id), enabled: !!id });
  const stampedQuery = useQuery({ queryKey: queryKeys.stamped, queryFn: api.stamped });
  const themesQuery = useQuery({ queryKey: queryKeys.themes, queryFn: api.themes });
  const meQuery = useQuery({ queryKey: queryKeys.me, queryFn: api.me });

  if (placeQuery.isError || (placeQuery.isFetched && !placeQuery.data)) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader title="장소를 찾을 수 없어요" />
      </View>
    );
  }
  if (!placeQuery.data || !stampedQuery.data || !themesQuery.data || !meQuery.data) {
    return (
      <View className="flex-1 bg-paper">
        <BackHeader />
      </View>
    );
  }
  const p = placeQuery.data;
  const STAMPED = stampedQuery.data;
  const THEMES = themesQuery.data;
  const stamped = STAMPED.includes(p.id);
  const inThemes = THEMES.filter((t) => t.placeIds.includes(p.id));
  const within = p.distance < 5;
  const myRank = meQuery.data.rank.current;

  return (
    <View className="flex-1 bg-paper">
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* 히어로 */}
        <View className="relative">
          <PhotoPlaceholder height={300} photoUrl={p.photo?.url} />
          <LinearGradient
            colors={['rgba(0,0,0,0.35)', 'transparent', 'rgba(250,247,240,0.95)']}
            locations={[0, 0.5, 1]}
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
            pointerEvents="none"
          />
          <BackHeader overlay />
          {stamped && (
            <View className="absolute top-[100px] right-6 z-[2]">
              <Stamp glyph={p.nameHanja[0]} size={68} rotate={-12} color={p.accent} />
            </View>
          )}
          {p.photo && (
            <PhotoCredit
              photo={p.photo}
              style={{ position: 'absolute', bottom: 8, right: 10, zIndex: 2 }}
            />
          )}
        </View>

        {/* 제목 */}
        <View className="px-5 pb-5 -mt-5">
          <View className="flex-row gap-1.5 mb-2.5">
            <Tag color={p.accent} filled>
              {p.tag}
            </Tag>
            <Tag color={TOKENS.inkSoft}>{p.era}</Tag>
            <Tag color={TOKENS.mute}>{p.period}</Tag>
          </View>
          <Text className="font-serif text-[30px] text-ink tracking-[-0.5px] leading-[35px]">
            {p.name}
          </Text>
          <View className="flex-row items-center gap-2 mt-2.5">
            <PinIconOutline />
            <Text className="font-sans text-[13px] text-inkSoft">{p.region}</Text>
            <Text className="text-line">·</Text>
            <Text className="font-mono-bold text-[13px] text-red">{formatDistance(p.distance)}</Text>
          </View>
        </View>

        {/* 인증 CTA */}
        <View className="px-5 pb-6">
          {stamped ? (
            <View
              className="bg-paperWarm p-3.5 rounded-xl flex-row items-center gap-3"
              style={{ borderWidth: 0.5, borderColor: `${p.accent}40` }}
            >
              <Stamp glyph={p.nameHanja[0]} size={38} rotate={-8} color={p.accent} />
              <View className="flex-1">
                <Text className="font-sans-bold text-xs" style={{ color: p.accent }}>
                  방문 완료
                </Text>
                <Text className="font-sans text-[11px] text-mute mt-0.5">
                  2026.04.18 토 · 14:23 체크인
                </Text>
              </View>
            </View>
          ) : (
            <Pressable
              onPress={() => within && router.push(`/checkin/${p.id}` as never)}
              disabled={!within}
              className={`p-4 rounded-xl flex-row items-center justify-center gap-2 ${within ? 'bg-ink' : 'bg-paperWarm border border-line'}`}
            >
              <PinIconFilled size={16} color={within ? TOKENS.paper : TOKENS.mute} strokeWidth={1.7} />
              <Text
                className={`font-sans-bold text-sm tracking-[0.3px] ${within ? 'text-paper' : 'text-mute'}`}
              >
                {within ? '여기에 도착했어요 · 인증하기' : `${formatDistance(p.distance)} 떨어진 곳 (5km 이내 인증 가능)`}
              </Text>
            </Pressable>
          )}
        </View>

        {/* 스토리 */}
        <View className="px-5 pb-6">
          <Text className="font-serif text-base text-ink mb-2">이 곳의 이야기</Text>
          <Text className="font-serif-regular text-sm text-inkSoft leading-[26px] tracking-[-0.2px]">
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
            <PhotoPlaceholder key={i} height={140} width={180} />
          ))}
        </ScrollView>

        {/* 퀴즈 미리보기 */}
        {p.quiz && (
          <>
            <SectionLabel>현장 퀴즈 · QUIZ</SectionLabel>
            <View className="px-5 pb-6">
              <View className="bg-paper border border-line p-4 rounded-xl overflow-hidden">
                <Text
                  className="absolute font-serif-black"
                  style={{ top: -10, right: -10, fontSize: 90, lineHeight: 90, color: `${p.accent}10` }}
                >
                  問
                </Text>
                <Text
                  className="font-sans-bold text-[10px] tracking-[1.5px] mb-1.5"
                  style={{ color: p.accent }}
                >
                  QUESTION
                </Text>
                <Text className="font-serif-regular text-[15px] text-ink leading-[22px]">
                  {p.quiz.q}
                </Text>
                <Text className="font-sans text-[11px] text-mute mt-2.5">
                  현장에서 답하면 스탬프와 함께 보너스 도장을 받을 수 있어요
                </Text>
              </View>
            </View>
          </>
        )}

        {/* 기여 */}
        <SectionLabel
          action={<Text className="font-sans text-[11px] text-mute">등급에 따라 권한이 해제됩니다</Text>}
        >
          이 장소에 기여하기 · CONTRIBUTE
        </SectionLabel>
        <View className="px-5 pb-6 gap-2">
          <GatedButton
            label="현장 사진 업로드"
            requiredLevel={LEVELS[1]}
            currentLevel={myRank}
            onPress={() => {}}
            onLocked={() => {}}
            icon={<CameraIcon />}
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
            <View className="px-5 pb-6 gap-2">
              {inThemes.map((t) => (
                <Pressable
                  key={t.id}
                  onPress={() => router.push(`/theme/${t.id}` as never)}
                  className="flex-row items-center gap-3 p-3.5 bg-paper border border-line rounded-xl"
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: t.cover,
                    }}
                  >
                    <Text className="font-serif-black text-[22px] text-white/50 leading-[22px]">
                      {t.glyph}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="font-serif text-sm text-ink">{t.title}</Text>
                    <Text className="font-sans text-[11px] text-mute mt-0.5">
                      {t.visited}/{t.totalPlaces}곳 방문
                    </Text>
                  </View>
                  <ChevronRightIcon />
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* 방문자 통계 */}
        <View className="px-5">
          <View className="p-3.5 bg-paper border border-line rounded-xl flex-row items-center gap-4">
            <View>
              <Text className="font-mono-bold text-lg text-ink">
                {p.visits.toLocaleString()}
              </Text>
              <Text className="font-sans text-[10px] text-mute mt-px">이번 달 방문</Text>
            </View>
            <View className="w-px h-8 bg-line" />
            <View>
              <Text className="font-mono-bold text-lg text-ink">{p.nearbyStamps}</Text>
              <Text className="font-sans text-[10px] text-mute mt-px">주변 답사지</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
