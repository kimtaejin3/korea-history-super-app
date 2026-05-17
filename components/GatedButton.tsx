import { Pressable, Text } from 'react-native';
import Svg, { Path, Rect } from 'react-native-svg';
import { ReactNode } from 'react';
import { TOKENS } from '../data/tokens';
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
      className={`w-full p-3.5 rounded flex-row items-center gap-2.5 ${locked ? 'bg-paperWarm border border-line' : 'bg-ink'}`}
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
        className={`flex-1 font-sans-bold text-[13px] tracking-[0.2px] ${locked ? 'text-mute' : 'text-paper'}`}
      >
        {label}
      </Text>
      {locked && (
        <Text
          className="font-sans-bold text-[10px] tracking-[0.5px]"
          style={{ color: requiredLevel.color }}
        >
          Lv{requiredLevel.level} 이상
        </Text>
      )}
    </Pressable>
  );
}
