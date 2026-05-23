import { View, ViewStyle, Image, ImageStyle, StyleProp } from "react-native";
import Svg, { G, Path } from "react-native-svg";

type Props = {
  height?: number;
  width?: number | string;
  style?: ViewStyle;
  /** 실제 사진 URL이 있으면 사진을 표시, 없으면 발자국 placeholder. */
  photoUrl?: string | null;
};

/** noun-footprint-179366 — by Sergey Demushkin (Noun Project). 그대로 차용. */
function Footprint({ opacity }: { opacity: number }) {
  const fill = `rgba(20,20,22,${opacity})`;
  return (
    <G>
      <Path
        d="M66.02,31.768c-3.621,4.801-9.457,6.616-13.059,4.025c-3.564-2.571-3.537-8.547,0.115-13.367c3.615-4.807,9.453-6.63,13.018-4.039C69.695,20.967,69.658,26.941,66.02,31.768z"
        fill={fill}
      />
      <Path
        d="M45.86,31.453c-3.62,4.797-9.465,6.611-13.058,4.031c-3.574-2.563-3.537-8.552,0.102-13.372c3.634-4.802,9.456-6.63,13.044-4.04C49.531,20.653,49.494,26.633,45.86,31.453z"
        fill={fill}
      />
      <Path
        d="M68.236,33.979c-4.793,3.62-6.604,9.466-4.027,13.049c2.559,3.574,8.551,3.546,13.354-0.102c4.83-3.625,6.631-9.457,4.063-13.03C79.021,30.313,73.047,30.35,68.236,33.979z"
        fill={fill}
      />
      <Path
        d="M68.512,54.184c-4.801,3.625-6.611,9.479-4.025,13.063c2.559,3.564,8.533,3.537,13.354-0.11c4.82-3.62,6.621-9.471,4.045-13.035C79.309,50.518,73.324,50.545,68.512,54.184z"
        fill={fill}
      />
      <Path
        d="M60.645,62.537c-2.383-7.093,0.352-13.778-4.543-18.668c-4.908-4.918-11.562-2.166-18.673-4.566c-11.123-3.764-23.88,5.23-19.661,16.114c3.468,8.967,8.547,6.953,14.203,12.596c5.624,5.624,3.62,10.813,12.568,14.268C55.436,86.51,64.432,73.655,60.645,62.537z"
        fill={fill}
      />
    </G>
  );
}

export function PhotoPlaceholder({
  height = 200,
  width = "100%",
  style,
  photoUrl,
}: Props) {
  // photoUrl 있으면 사진 표시
  if (photoUrl) {
    const imgStyle: StyleProp<ImageStyle> = [
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        height: height as any,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        width: width as any,
        backgroundColor: "#EFEDE7",
      },
      style as unknown as ImageStyle,
    ];
    return <Image source={{ uri: photoUrl }} style={imgStyle} resizeMode="cover" />;
  }

  const iconSize = Math.max(56, Math.min(height * 0.65, 130));

  return (
    <View
      style={[
        {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          height: height as any,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          width: width as any,
          backgroundColor: "#EFEDE7",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Svg width={iconSize} height={iconSize} viewBox="0 0 240 240">
        {/* 왼발 — 좌하단, 살짝 외전 (CCW) */}
        <G transform="translate(30 120) rotate(-60 50 50)">
          <Footprint opacity={0.22} />
        </G>
        {/* 오른발 — 우상단, 살짝 외전 (CW) */}
        <G transform="translate(110 30) rotate(-30 50 50)">
          <Footprint opacity={0.22} />
        </G>
      </Svg>
    </View>
  );
}
