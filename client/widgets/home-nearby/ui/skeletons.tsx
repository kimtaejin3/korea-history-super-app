import { View } from 'react-native';

/**
 * 홈 화면 각 섹션의 로딩 placeholder.
 * 색·여백을 섹션 실제 모양과 비슷하게 맞춰 layout shift를 최소화.
 */

const BLOCK = 'bg-[rgba(26,22,20,0.04)] rounded-xl';


export function NearbySkeleton() {
  return (
    <View className="px-5 pb-6 gap-2.5">
      {[0, 1, 2].map((i) => (
        <View key={i} className={`${BLOCK} h-[88px]`} />
      ))}
    </View>
  );
}

export function ActiveThemesSkeleton() {
  return (
    <View className="px-5 pb-6 flex-row gap-3">
      {[0, 1, 2].map((i) => (
        <View key={i} className={`${BLOCK} w-[220px] h-[220px]`} />
      ))}
    </View>
  );
}

export function MyJourneySkeleton() {
  return (
    <View className="px-5 pb-6">
      <View className={`${BLOCK} h-[140px]`} />
    </View>
  );
}
