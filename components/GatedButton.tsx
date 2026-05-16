import { Pressable, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ReactNode } from 'react';
import { FONTS, TOKENS } from '../data/tokens';
import { Level } from '../data/user';

type Props = {
  label: string;
  requiredLevel: Level;
  currentLevel: Level;
  onPress?: () => void;
  onLocked?: () => void;
  icon?: ReactNode;
};

export function GatedButton({ label, requiredLevel, currentLevel, onPress, onLocked, icon }: Props) {
  const locked = currentLevel.level < requiredLevel.level;
  return (
    <Pressable
      onPress={locked ? onLocked : onPress}
      style={{
        width: '100%',
        padding: 14,
        backgroundColor: locked ? TOKENS.paperWarm : TOKENS.ink,
        borderWidth: locked ? 0.5 : 0,
        borderColor: TOKENS.line,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {locked ? (
        <Svg width="14" height="14" viewBox="0 0 22 22" fill="none">
          <Rect x="5" y="10" width="12" height="9" rx="1" stroke={TOKENS.mute} strokeWidth="1.6" />
          <Path d="M8 10V7a3 3 0 016 0v3" stroke={TOKENS.mute} strokeWidth="1.6" />
        </Svg>
      ) : (
        icon || (
          <Svg width="14" height="14" viewBox="0 0 22 22" fill="none">
            <Path d="M11 4v14M4 11h14" stroke={TOKENS.paper} strokeWidth="1.8" strokeLinecap="round" />
          </Svg>
        )
      )}
      <Text
        style={{
          flex: 1,
          fontFamily: FONTS.sansBold,
          fontSize: 13,
          color: locked ? TOKENS.mute : TOKENS.paper,
          letterSpacing: 0.2,
        }}
      >
        {label}
      </Text>
      {locked && (
        <Text
          style={{
            fontFamily: FONTS.serif,
            fontSize: 10,
            color: requiredLevel.color,
            letterSpacing: 0.5,
          }}
        >
          {requiredLevel.hanja} 이상
        </Text>
      )}
    </Pressable>
  );
}
