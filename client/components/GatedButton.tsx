import { Pressable, Text } from 'react-native';
import { ReactNode } from 'react';
import { Level } from '../types/user';
import { LockIcon, PlusIcon } from './icons';

type Props = {
  label: string;
  requiredLevel: Level;
  currentLevel: Level;
  onPress?: () => void;
  onLocked?: () => void;
  icon?: ReactNode;
};

export function GatedButton({
  label,
  requiredLevel,
  currentLevel,
  onPress,
  onLocked,
  icon,
}: Props) {
  const locked = currentLevel.level < requiredLevel.level;
  return (
    <Pressable
      onPress={locked ? onLocked : onPress}
      className={`w-full p-3.5 rounded-xl flex-row items-center gap-2.5 ${locked ? 'bg-paperWarm border border-line' : 'bg-ink'}`}
    >
      {locked ? <LockIcon /> : icon || <PlusIcon />}
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
