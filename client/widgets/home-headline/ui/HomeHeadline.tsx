import { useEffect } from 'react';
import { Text } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ENTRY_DURATION = 500;
const SLIDE_DISTANCE = 12;

export function HomeHeadline() {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(SLIDE_DISTANCE);

  useEffect(() => {
    opacity.value = withTiming(1, {
      duration: ENTRY_DURATION,
      easing: Easing.out(Easing.cubic),
    });
    translateY.value = withTiming(0, {
      duration: ENTRY_DURATION,
      easing: Easing.out(Easing.cubic),
    });
  }, [opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View className="px-5 pt-1 pb-4" style={animatedStyle}>
      <Text className="font-serif text-[26px] text-ink tracking-[-0.5px] leading-8">
        오늘, 가까운 곳에서{'\n'}
        <Text className="text-red">역사 한 조각</Text>을 만나보세요
      </Text>
    </Animated.View>
  );
}
