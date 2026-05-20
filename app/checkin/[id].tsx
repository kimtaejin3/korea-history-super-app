// noinspection JSUnusedGlobalSymbols

import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { Tag } from '../../components/Tag';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';
import { LottieAsset } from '../../components/LottieAsset';
import { CheckIcon, CloseIcon, InfoIcon, PinIconFilled } from '../../components/icons';

type Step = 'locating' | 'confirmed' | 'quiz' | 'result' | 'stamp';

export default function CheckinScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const placeQuery = useQuery({ queryKey: queryKeys.place(id), queryFn: () => api.place(id), enabled: !!id });
  const p = placeQuery.data;
  const [step, setStep] = useState<Step>('locating');
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step !== 'locating') return;
    const animatePulse = (v: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(v, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(v, { toValue: 0, duration: 0, useNativeDriver: true }),
        ])
      ).start();
    animatePulse(pulse1, 0);
    animatePulse(pulse2, 600);
    animatePulse(pulse3, 1200);
    const t = setTimeout(() => setStep('confirmed'), 2200);
    return () => clearTimeout(t);
  }, [step, pulse1, pulse2, pulse3]);

  if (!p) {
    return (
      <View className="flex-1 bg-paper p-5" style={{ paddingTop: insets.top + 40 }}>
        <Text>장소를 찾을 수 없어요</Text>
      </View>
    );
  }

  const stepLabels: Record<Step, string> = {
    locating: '위치 확인',
    confirmed: '인증 진행',
    quiz: '현장 퀴즈',
    result: '결과',
    stamp: '스탬프 획득',
  };

  return (
    <View className="flex-1 bg-paper">
      {/* 헤더 */}
      <View
        className="px-4 pb-3 flex-row items-center justify-between"
        style={{ paddingTop: insets.top + 8 }}
      >
        <Pressable
          onPress={() => router.back()}
          className="w-9 h-9 rounded-full items-center justify-center"
        >
          <CloseIcon />
        </Pressable>
        <Text className="font-sans text-xs text-mute tracking-wide">{stepLabels[step]}</Text>
        <View className="w-9" />
      </View>

      {/* STEP: GPS */}
      {step === 'locating' && (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-[180px] h-[180px] items-center justify-center mb-9">
            {[pulse1, pulse2, pulse3].map((v, i) => (
              <Animated.View
                key={i}
                className="absolute w-[180px] h-[180px] rounded-full border"
                style={{
                  borderColor: TOKENS.red,
                  transform: [{ scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }) }],
                  opacity: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                }}
              />
            ))}
            <View className="w-10 h-10 rounded-full bg-red items-center justify-center">
              <PinIconFilled />
            </View>
          </View>
          <Text className="font-serif text-xl text-ink">위치를 확인하고 있어요</Text>
          <Text className="font-sans text-[13px] text-mute mt-2">
            {p.name} 반경 50m 이내인지 확인 중
          </Text>
        </View>
      )}

      {/* STEP: 확인 완료 */}
      {step === 'confirmed' && (
        <View className="flex-1 items-center justify-center p-6">
          <View className="w-[76px] h-[76px] rounded-full bg-green items-center justify-center mb-6">
            <CheckIcon />
          </View>
          <Text className="font-serif text-[22px] text-ink text-center leading-7">
            {p.name}에{'\n'}도착하셨네요
          </Text>
          <Text className="font-sans text-[13px] text-mute mt-2.5 text-center">
            현장 퀴즈를 풀고 스탬프를 받으세요
          </Text>
          <View className="mt-9 p-4 bg-paperWarm border border-line rounded-xl w-full max-w-[320px] flex-row items-center gap-3">
            <PhotoPlaceholder height={56} width={56} />
            <View className="flex-1">
              <Tag color={p.accent} filled>
                {p.tag}
              </Tag>
              <Text className="font-serif text-sm text-ink mt-1">{p.name}</Text>
              <Text className="font-sans text-[11px] text-mute">{p.region}</Text>
            </View>
          </View>
          <View
            className="absolute left-5 right-5"
            style={{ bottom: insets.bottom + 20 }}
          >
            <Pressable
              onPress={() => (p.quiz ? setStep('quiz') : setStep('stamp'))}
              className="p-4 bg-ink rounded-xl items-center"
            >
              <Text className="font-sans-bold text-sm text-paper tracking-[0.3px]">
                {p.quiz ? '현장 퀴즈 풀기 →' : '스탬프 받기'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* STEP: 퀴즈 */}
      {step === 'quiz' && p.quiz && (
        <View className="flex-1 p-6" style={{ paddingBottom: insets.bottom + 20 }}>
          <View className="mb-3.5">
            <Text
              className="absolute font-serif-black"
              style={{ top: -50, right: -10, fontSize: 130, lineHeight: 130, color: `${p.accent}12` }}
            >
              問
            </Text>
            <Text
              className="font-sans-bold text-[11px] tracking-[2px] mb-3.5"
              style={{ color: p.accent }}
            >
              QUESTION 01
            </Text>
            <Text className="font-serif text-[22px] text-ink leading-[30px] tracking-[-0.3px]">
              {p.quiz.q}
            </Text>
          </View>
          <View className="gap-2.5 mt-5 flex-1">
            {p.quiz.options.map((opt, i) => {
              const isSel = selected === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => setSelected(i)}
                  className={`p-4 rounded-xl flex-row items-center gap-3 ${isSel ? 'bg-ink' : 'bg-paper border border-line'}`}
                >
                  <View
                    className={`w-[22px] h-[22px] rounded-full border-[1.5px] items-center justify-center ${isSel ? 'border-paper' : 'border-line'}`}
                  >
                    <Text
                      className={`font-mono-bold text-[11px] ${isSel ? 'text-paper' : 'text-mute'}`}
                    >
                      {['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'][i]}
                    </Text>
                  </View>
                  <Text
                    className={`flex-1 font-serif-regular text-[15px] ${isSel ? 'text-paper' : 'text-ink'}`}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View className="p-3 mt-4 bg-paperWarm rounded-xl flex-row gap-2">
            <View style={{ marginTop: 2 }}>
              <InfoIcon />
            </View>
            <Text className="flex-1 font-sans text-[11px] text-inkSoft leading-[17px]">
              {p.quiz.hint}
            </Text>
          </View>
          <Pressable
            disabled={selected === null}
            onPress={() => {
              setCorrect(selected === p.quiz!.answer);
              setStep('result');
            }}
            className={`mt-4 p-4 rounded-xl items-center ${selected === null ? 'bg-paperWarm' : 'bg-ink'}`}
          >
            <Text
              className={`font-sans-bold text-sm tracking-[0.3px] ${selected === null ? 'text-mute' : 'text-paper'}`}
            >
              제출하기
            </Text>
          </Pressable>
        </View>
      )}

      {/* STEP: 결과 */}
      {step === 'result' && p.quiz && (
        <View className="flex-1 items-center justify-center p-6">
          <Text
            className="font-serif-black leading-[60px] tracking-[-3px]"
            style={{ fontSize: 60, color: correct ? TOKENS.green : TOKENS.red }}
          >
            {correct ? '正' : '誤'}
          </Text>
          <Text className="font-serif text-[22px] text-ink mt-5">
            {correct ? '정답이에요!' : '아쉬워요'}
          </Text>
          <Text className="font-sans text-[13px] text-mute mt-2 text-center max-w-[280px] leading-[21px]">
            {correct
              ? '현장에서 직접 익힌 역사 한 조각. 스탬프 + 보너스 도장을 받으세요.'
              : '괜찮아요. 방문 스탬프는 그대로 받으실 수 있어요.'}
          </Text>
          <View className="mt-7 p-[18px] bg-paperWarm border border-line rounded-xl max-w-[320px] w-full">
            <Text className="font-sans-bold text-[10px] text-mute tracking-[2px]">정답</Text>
            <Text className="font-serif text-[15px] text-ink mt-1">
              {p.quiz.options[p.quiz.answer]}
            </Text>
            <Text className="font-sans text-xs text-inkSoft mt-2 leading-[18px]">
              {p.quiz.hint}
            </Text>
          </View>
          <View
            className="absolute left-5 right-5"
            style={{ bottom: insets.bottom + 20 }}
          >
            <Pressable
              onPress={() => setStep('stamp')}
              className="p-4 bg-ink rounded-xl items-center"
            >
              <Text className="font-sans-bold text-sm text-paper tracking-[0.3px]">
                스탬프 받기 →
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* STEP: 스탬프 */}
      {step === 'stamp' && (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="font-sans-bold text-[11px] text-red tracking-[3px] mb-2">
            STAMP ACQUIRED
          </Text>
          <Text className="font-serif text-2xl text-ink mb-10 text-center leading-[30px]">
            {p.name}{'\n'}방문 인증 완료
          </Text>
          <LottieAsset
            source={require('../../assets/animations/stamp.lottie')}
            size={260}
            loop={false}
            endFrame={40}
          />
          <View className="mt-7 items-center">
            <Text className="font-serif text-[15px] text-ink mb-1">{p.nameHanja}</Text>
            <Text className="font-sans text-xs text-mute text-center">
              2026.05.15 · 14:23 · {p.region}
            </Text>
          </View>
          <View
            className="absolute left-5 right-5 flex-row gap-2"
            style={{ bottom: insets.bottom + 20 }}
          >
            <Pressable
              onPress={() => router.back()}
              className="flex-1 p-3.5 border border-line rounded-xl items-center"
            >
              <Text className="font-sans-bold text-[13px] text-ink">장소 페이지로</Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/(tabs)/stampbook' as never)}
              className="p-3.5 bg-ink rounded-xl items-center"
              style={{ flex: 1.4 }}
            >
              <Text className="font-sans-bold text-[13px] text-paper">스탬프북 보기 →</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
