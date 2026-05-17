import { View, Text } from 'react-native';
import { ReactNode } from 'react';

type Props = {
  children: string;
  action?: ReactNode;
};

export function SectionLabel({ children, action }: Props) {
  return (
    <View className="flex-row items-end justify-between px-5 mb-2.5">
      <Text className="font-sans-bold text-[11px] text-mute tracking-[2px]">{children}</Text>
      {action}
    </View>
  );
}
