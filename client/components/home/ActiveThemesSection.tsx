import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSuspenseQuery } from '@tanstack/react-query';
import { themesQueryOptions } from '../../queries/themes';
import { SectionLabel } from '../SectionLabel';

export function ActiveThemesSection() {
  const router = useRouter();
  const { data: themes } = useSuspenseQuery(themesQueryOptions());
  const activeThemes = themes
    .filter((t) => t.visited > 0 && t.visited < t.totalPlaces)
    .slice(0, 3);

  return (
    <>
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
    </>
  );
}
