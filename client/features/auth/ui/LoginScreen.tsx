import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onLogin: () => void;
};

export function LoginScreen({ onLogin }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-paper justify-between"
      style={{ paddingTop: insets.top + 80, paddingBottom: insets.bottom + 32 }}
    >
      {/* 로고 + 카피 */}
      <View className="px-8 items-center">
        <Text className="font-serif text-[36px] text-ink mt-10 tracking-[-1px]">발자취</Text>
        <Text className="font-sans text-[13px] text-mute mt-2 tracking-[3px]">
          FOOTPRINTS · ARCHIVE
        </Text>
        <Text className="font-serif-regular text-[15px] text-inkSoft mt-8 text-center leading-[24px]">
          한국 곳곳의 역사 장소를 걷고,{'\n'}
          도장을 모으는 답사 앱
        </Text>
      </View>

      {/* CTA */}
      <View className="px-5 gap-3">
        <Pressable onPress={onLogin} className="p-4 bg-ink rounded-xl items-center">
          <Text className="font-sans-bold text-[15px] text-paper tracking-[0.3px]">시작하기</Text>
        </Pressable>
        <Text className="font-sans text-[11px] text-mute text-center">
          계정이 없어도 둘러볼 수 있어요
        </Text>
      </View>
    </View>
  );
}
