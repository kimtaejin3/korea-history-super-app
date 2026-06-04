import { View, Text } from 'react-native';
import { TOKENS } from '../../lib/tokens';

type Props = {
  children: string;
  color?: string;
  filled?: boolean;
};

export function Tag({ children, color = TOKENS.ink, filled = false }: Props) {
  return (
    <View
      className="py-[3px] px-[7px] rounded-sm self-start"
      style={{
        borderWidth: filled ? 0 : 0.8,
        borderColor: color + '55',
        backgroundColor: filled ? color : 'transparent',
      }}
    >
      <Text
        className="font-sans text-[11px] tracking-[0.2px]"
        style={{ color: filled ? TOKENS.paper : color }}
      >
        {children}
      </Text>
    </View>
  );
}
