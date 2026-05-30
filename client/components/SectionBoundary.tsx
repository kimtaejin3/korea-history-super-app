import { Suspense, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
  /** 로딩 중 표시할 스켈레톤 */
  fallback: ReactNode;
  /** 에러 시 표시 (생략 시 기본 메시지) */
  errorFallback?: ReactNode;
  children: ReactNode;
};

/**
 * 한 섹션 단위로 로딩(Suspense) + 에러(ErrorBoundary)를 격리.
 * 부모는 SectionBoundary 형제로 나란히 두기만 하면, 각 섹션이
 * 자기 useSuspenseQuery로 병렬 fetch + 독립 로딩/에러를 보여줌.
 */
export function SectionBoundary({ fallback, errorFallback, children }: Props) {
  return (
    <ErrorBoundary fallback={errorFallback ?? <DefaultError />}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

function DefaultError() {
  return (
    <View className="px-5 py-6 items-center">
      <Text className="font-sans text-[12px] text-mute text-center">
        이 섹션을 불러오지 못했어요
      </Text>
    </View>
  );
}
