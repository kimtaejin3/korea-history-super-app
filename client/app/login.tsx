// noinspection JSUnusedGlobalSymbols

import { useRouter } from 'expo-router';
import { LoginScreen } from '@features/auth/ui/LoginScreen';
import { useAuth } from '@features/auth/model/store';

export default function LoginRoute() {
  const router = useRouter();
  const { login } = useAuth();

  return (
    <LoginScreen
      onLogin={() => {
        login();
        router.replace('/(tabs)' as never);
      }}
    />
  );
}
