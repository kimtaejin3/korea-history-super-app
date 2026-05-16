import { View, Text } from 'react-native';
import { FONTS, TOKENS } from '../data/tokens';
import { ReactNode } from 'react';

type Props = {
  children: string;
  action?: ReactNode;
};

export function SectionLabel({ children, action }: Props) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 10,
      }}
    >
      <Text
        style={{
          fontFamily: FONTS.sansBold,
          fontSize: 11,
          color: TOKENS.mute,
          letterSpacing: 2,
        }}
      >
        {children}
      </Text>
      {action}
    </View>
  );
}
