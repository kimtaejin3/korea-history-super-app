import { useEffect, useState } from 'react';
import { View } from 'react-native';
import Rive from 'rive-react-native';
import { Asset } from 'expo-asset';

type Props = {
  size: number;
  /** require()로 받은 .riv 파일 모듈 */
  source: number;
  stateMachineName?: string;
  artboardName?: string;
};

export function MascotRive({ size, source, stateMachineName, artboardName }: Props) {
  const [uri, setUri] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const asset = Asset.fromModule(source);
      if (!asset.localUri) {
        await asset.downloadAsync();
      }
      if (!cancelled) {
        setUri(asset.localUri ?? asset.uri);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [source]);

  if (!uri) {
    return <View style={{ width: size, height: size }} />;
  }

  return (
    <View style={{ width: size, height: size }}>
      <Rive
        autoplay
        url={uri}
        stateMachineName={stateMachineName}
        artboardName={artboardName}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
