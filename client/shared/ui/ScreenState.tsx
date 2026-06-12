import { View, Text, Pressable, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TOKENS } from '@shared/lib/tokens';

type Props = {
  /** 로딩 중 */
  loading?: boolean;
  /** 에러 발생 */
  error?: boolean;
  /** 재시도 콜백 */
  onRetry?: () => void;
  /** 배경색 (기본 paper) */
  bg?: string;
  /** 에러 메시지 커스텀 */
  errorMessage?: string;
};

/**
 * 화면 전체 로딩/에러 상태. 빈 화면 대신 사용자에게 상황을 알리고 재시도 제공.
 */
export function ScreenState({
  loading,
  error,
  onRetry,
  bg = TOKENS.paper,
  errorMessage = '데이터를 불러오지 못했어요',
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 items-center justify-center px-8"
      style={{ backgroundColor: bg, paddingTop: insets.top }}
    >
      {loading && !error ? (
        <ActivityIndicator size="small" color={TOKENS.mute} />
      ) : (
        <View className="items-center">
          <Text className="font-serif text-[16px] text-ink text-center">{errorMessage}</Text>
          <Text className="font-sans text-[12px] text-mute mt-2 text-center leading-5">
            네트워크 또는 서버 상태를 확인해주세요.
          </Text>
          {onRetry && (
            <Pressable onPress={onRetry} className="mt-5 px-5 py-2.5 bg-ink rounded-full">
              <Text className="font-sans-bold text-[13px] text-paper">다시 시도</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
