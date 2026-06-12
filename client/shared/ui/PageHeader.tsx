import { View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ReactNode } from 'react';

type Props = {
  title: string;
  hanja?: string;
  subtitle?: string;
  action?: ReactNode;
  dense?: boolean;
};

export function PageHeader({ title, hanja, subtitle, action, dense = false }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      className={`px-5 ${dense ? 'pb-3' : 'pb-4'}`}
      style={{ paddingTop: insets.top + (dense ? 12 : 16) }}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text
            className={`font-serif text-ink ${dense ? 'text-[22px] leading-[26px]' : 'text-[28px] leading-8'} tracking-[-0.5px]`}
          >
            {title}
          </Text>
          {hanja && (
            <Text className="font-serif-regular text-xs text-mute mt-0.5 tracking-[2px]">
              {hanja}
            </Text>
          )}
          {subtitle && (
            <Text className="font-sans text-[13px] text-mute mt-1.5 tracking-[-0.2px]">
              {subtitle}
            </Text>
          )}
        </View>
        {action}
      </View>
    </View>
  );
}
