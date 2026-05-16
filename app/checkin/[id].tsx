// noinspection JSUnusedGlobalSymbols

import { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Animated, Easing } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { FONTS, TOKENS } from '../../data/tokens';
import { api, queryKeys } from '../../lib/api';
import { Tag } from '../../components/Tag';
import { Stamp } from '../../components/Stamp';
import { PhotoPlaceholder } from '../../components/PhotoPlaceholder';

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

  // 펄스 애니메이션
  const pulse1 = useRef(new Animated.Value(0)).current;
  const pulse2 = useRef(new Animated.Value(0)).current;
  const pulse3 = useRef(new Animated.Value(0)).current;
  // 스탬프 드롭 애니메이션
  const stampScale = useRef(new Animated.Value(2.5)).current;
  const stampOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (step === 'locating') {
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
    }
    if (step === 'stamp') {
      stampScale.setValue(2.5);
      stampOpacity.setValue(0);
      Animated.parallel([
        Animated.spring(stampScale, {
          toValue: 1,
          friction: 4,
          tension: 60,
          delay: 300,
          useNativeDriver: true,
        }),
        Animated.timing(stampOpacity, {
          toValue: 1,
          duration: 400,
          delay: 300,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [step, pulse1, pulse2, pulse3, stampScale, stampOpacity]);

  if (!p) {
    return (
      <View style={{ flex: 1, backgroundColor: TOKENS.paper, paddingTop: insets.top + 40, padding: 20 }}>
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
    <View style={{ flex: 1, backgroundColor: TOKENS.paper }}>
      {/* 헤더 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          paddingBottom: 12,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <Path
              d="M5 5l12 12M17 5L5 17"
              stroke={TOKENS.ink}
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </Svg>
        </Pressable>
        <Text style={{ fontFamily: FONTS.sans, fontSize: 12, color: TOKENS.mute, letterSpacing: 1 }}>
          {stepLabels[step]}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* STEP: GPS */}
      {step === 'locating' && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
          }}
        >
          <View
            style={{
              width: 180,
              height: 180,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 36,
            }}
          >
            {[pulse1, pulse2, pulse3].map((v, i) => (
              <Animated.View
                key={i}
                style={{
                  position: 'absolute',
                  width: 180,
                  height: 180,
                  borderRadius: 90,
                  borderWidth: 1,
                  borderColor: TOKENS.red,
                  transform: [
                    {
                      scale: v.interpolate({ inputRange: [0, 1], outputRange: [0.5, 1.2] }),
                    },
                  ],
                  opacity: v.interpolate({ inputRange: [0, 1], outputRange: [1, 0] }),
                }}
              />
            ))}
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: TOKENS.red,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <Path
                  d="M11 19s7-6.5 7-11a7 7 0 10-14 0c0 4.5 7 11 7 11z"
                  stroke={TOKENS.paper}
                  strokeWidth="1.8"
                />
                <Circle cx="11" cy="8" r="2" fill={TOKENS.paper} />
              </Svg>
            </View>
          </View>
          <Text style={{ fontFamily: FONTS.serif, fontSize: 20, color: TOKENS.ink }}>
            위치를 확인하고 있어요
          </Text>
          <Text style={{ fontFamily: FONTS.sans, fontSize: 13, color: TOKENS.mute, marginTop: 8 }}>
            {p.name} 반경 50m 이내인지 확인 중
          </Text>
        </View>
      )}

      {/* STEP: 확인 완료 */}
      {step === 'confirmed' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <View
            style={{
              width: 76,
              height: 76,
              borderRadius: 38,
              backgroundColor: TOKENS.green,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 24,
            }}
          >
            <Svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <Path
                d="M7 16l6 6 12-12"
                stroke={TOKENS.paper}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </View>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 22,
              color: TOKENS.ink,
              textAlign: 'center',
              lineHeight: 28,
            }}
          >
            {p.name}에{'\n'}도착하셨네요
          </Text>
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              color: TOKENS.mute,
              marginTop: 10,
              textAlign: 'center',
            }}
          >
            현장 퀴즈를 풀고 스탬프를 받으세요
          </Text>
          <View
            style={{
              marginTop: 36,
              padding: 16,
              backgroundColor: TOKENS.paperWarm,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              width: '100%',
              maxWidth: 320,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <PhotoPlaceholder label={p.id} height={56} width={56} />
            <View style={{ flex: 1 }}>
              <Tag color={p.accent} filled>
                {p.tag}
              </Tag>
              <Text
                style={{
                  fontFamily: FONTS.serif,
                  fontSize: 14,
                  color: TOKENS.ink,
                  marginTop: 4,
                }}
              >
                {p.name}
              </Text>
              <Text style={{ fontFamily: FONTS.sans, fontSize: 11, color: TOKENS.mute }}>
                {p.region}
              </Text>
            </View>
          </View>
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 20 }}>
            <Pressable
              onPress={() => (p.quiz ? setStep('quiz') : setStep('stamp'))}
              style={{
                padding: 16,
                backgroundColor: TOKENS.ink,
                borderRadius: 4,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 14,
                  color: TOKENS.paper,
                  letterSpacing: 0.3,
                }}
              >
                {p.quiz ? '현장 퀴즈 풀기 →' : '스탬프 받기'}
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* STEP: 퀴즈 */}
      {step === 'quiz' && p.quiz && (
        <View style={{ flex: 1, padding: 24, paddingBottom: insets.bottom + 20 }}>
          <View style={{ marginBottom: 14 }}>
            <Text
              style={{
                position: 'absolute',
                top: -50,
                right: -10,
                fontFamily: FONTS.serifBlack,
                fontSize: 130,
                lineHeight: 130,
                color: `${p.accent}12`,
              }}
            >
              問
            </Text>
            <Text
              style={{
                fontFamily: FONTS.sansBold,
                fontSize: 11,
                color: p.accent,
                letterSpacing: 2,
                marginBottom: 14,
              }}
            >
              QUESTION 01
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 22,
                color: TOKENS.ink,
                lineHeight: 30,
                letterSpacing: -0.3,
              }}
            >
              {p.quiz.q}
            </Text>
          </View>
          <View style={{ gap: 10, marginTop: 20, flex: 1 }}>
            {p.quiz.options.map((opt, i) => {
              const isSel = selected === i;
              return (
                <Pressable
                  key={i}
                  onPress={() => setSelected(i)}
                  style={{
                    padding: 16,
                    backgroundColor: isSel ? TOKENS.ink : TOKENS.paper,
                    borderWidth: isSel ? 0 : 0.5,
                    borderColor: TOKENS.line,
                    borderRadius: 4,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 1.5,
                      borderColor: isSel ? TOKENS.paper : TOKENS.line,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        fontFamily: FONTS.monoBold,
                        fontSize: 11,
                        color: isSel ? TOKENS.paper : TOKENS.mute,
                      }}
                    >
                      {['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ'][i]}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      fontFamily: FONTS.serifRegular,
                      fontSize: 15,
                      color: isSel ? TOKENS.paper : TOKENS.ink,
                    }}
                  >
                    {opt}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <View
            style={{
              padding: 12,
              marginTop: 16,
              backgroundColor: TOKENS.paperWarm,
              borderRadius: 4,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Svg width="14" height="14" viewBox="0 0 22 22" fill="none" style={{ marginTop: 2 }}>
              <Circle cx="11" cy="11" r="8" stroke={TOKENS.mute} strokeWidth="1.5" />
              <Path
                d="M11 7v5M11 15v0.5"
                stroke={TOKENS.mute}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </Svg>
            <Text
              style={{
                flex: 1,
                fontFamily: FONTS.sans,
                fontSize: 11,
                color: TOKENS.inkSoft,
                lineHeight: 17,
              }}
            >
              {p.quiz.hint}
            </Text>
          </View>
          <Pressable
            disabled={selected === null}
            onPress={() => {
              setCorrect(selected === p.quiz!.answer);
              setStep('result');
            }}
            style={{
              marginTop: 16,
              padding: 16,
              backgroundColor: selected === null ? TOKENS.paperWarm : TOKENS.ink,
              borderRadius: 4,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.sansBold,
                fontSize: 14,
                color: selected === null ? TOKENS.mute : TOKENS.paper,
                letterSpacing: 0.3,
              }}
            >
              제출하기
            </Text>
          </Pressable>
        </View>
      )}

      {/* STEP: 결과 */}
      {step === 'result' && p.quiz && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text
            style={{
              fontFamily: FONTS.serifBlack,
              fontSize: 60,
              color: correct ? TOKENS.green : TOKENS.red,
              lineHeight: 60,
              letterSpacing: -3,
            }}
          >
            {correct ? '正' : '誤'}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 22,
              color: TOKENS.ink,
              marginTop: 20,
            }}
          >
            {correct ? '정답이에요!' : '아쉬워요'}
          </Text>
          <Text
            style={{
              fontFamily: FONTS.sans,
              fontSize: 13,
              color: TOKENS.mute,
              marginTop: 8,
              textAlign: 'center',
              maxWidth: 280,
              lineHeight: 21,
            }}
          >
            {correct
              ? '현장에서 직접 익힌 역사 한 조각. 스탬프 + 보너스 도장을 받으세요.'
              : '괜찮아요. 방문 스탬프는 그대로 받으실 수 있어요.'}
          </Text>
          <View
            style={{
              marginTop: 28,
              padding: 18,
              backgroundColor: TOKENS.paperWarm,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              borderRadius: 4,
              maxWidth: 320,
              width: '100%',
            }}
          >
            <Text
              style={{
                fontFamily: FONTS.sansBold,
                fontSize: 10,
                color: TOKENS.mute,
                letterSpacing: 2,
              }}
            >
              정답
            </Text>
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 15,
                color: TOKENS.ink,
                marginTop: 4,
              }}
            >
              {p.quiz.options[p.quiz.answer]}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12,
                color: TOKENS.inkSoft,
                marginTop: 8,
                lineHeight: 18,
              }}
            >
              {p.quiz.hint}
            </Text>
          </View>
          <View style={{ position: 'absolute', left: 20, right: 20, bottom: insets.bottom + 20 }}>
            <Pressable
              onPress={() => setStep('stamp')}
              style={{
                padding: 16,
                backgroundColor: TOKENS.ink,
                borderRadius: 4,
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontFamily: FONTS.sansBold,
                  fontSize: 14,
                  color: TOKENS.paper,
                  letterSpacing: 0.3,
                }}
              >
                스탬프 받기 →
              </Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* STEP: 스탬프 */}
      {step === 'stamp' && (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text
            style={{
              fontFamily: FONTS.sansBold,
              fontSize: 11,
              color: TOKENS.red,
              letterSpacing: 3,
              marginBottom: 8,
            }}
          >
            STAMP ACQUIRED
          </Text>
          <Text
            style={{
              fontFamily: FONTS.serif,
              fontSize: 24,
              color: TOKENS.ink,
              marginBottom: 40,
              textAlign: 'center',
              lineHeight: 30,
            }}
          >
            {p.name}{'\n'}방문 인증 완료
          </Text>
          <View
            style={{
              width: 220,
              height: 220,
              borderRadius: 8,
              backgroundColor: TOKENS.paperWarm,
              borderWidth: 0.5,
              borderColor: TOKENS.line,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 8 },
              shadowRadius: 32,
              elevation: 8,
            }}
          >
            <Animated.View
              style={{
                transform: [{ scale: stampScale }],
                opacity: stampOpacity,
              }}
            >
              <Stamp glyph={p.nameHanja[0]} size={140} rotate={-8} color={p.accent} />
            </Animated.View>
          </View>
          <View style={{ marginTop: 28, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: FONTS.serif,
                fontSize: 15,
                color: TOKENS.ink,
                marginBottom: 4,
              }}
            >
              {p.nameHanja}
            </Text>
            <Text
              style={{
                fontFamily: FONTS.sans,
                fontSize: 12,
                color: TOKENS.mute,
                textAlign: 'center',
              }}
            >
              2026.05.15 · 14:23 · {p.region}
            </Text>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 20,
              right: 20,
              bottom: insets.bottom + 20,
              flexDirection: 'row',
              gap: 8,
            }}
          >
            <Pressable
              onPress={() => router.back()}
              style={{
                flex: 1,
                padding: 14,
                borderWidth: 0.5,
                borderColor: TOKENS.line,
                borderRadius: 4,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: FONTS.sansBold, fontSize: 13, color: TOKENS.ink }}>
                장소 페이지로
              </Text>
            </Pressable>
            <Pressable
              onPress={() => router.replace('/(tabs)/stampbook' as never)}
              style={{
                flex: 1.4,
                padding: 14,
                backgroundColor: TOKENS.ink,
                borderRadius: 4,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontFamily: FONTS.sansBold, fontSize: 13, color: TOKENS.paper }}>
                스탬프북 보기 →
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
