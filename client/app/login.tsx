// noinspection JSUnusedGlobalSymbols

import { useRouter } from 'expo-router';
import { LoginScreen } from '../components/user/LoginScreen';
import { useAuth } from '../stores/auth';

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
