import { Redirect } from 'expo-router';
import { useAuthStore } from '@/stores/auth';

export default function Index() {
  const { isAuthenticated, user } = useAuthStore();

  // If not authenticated, go to welcome screen
  if (!isAuthenticated) {
    return <Redirect href="/(auth)/welcome" />;
  }

  // If authenticated but onboarding not complete, go to onboarding
  if (!user?.onboardingCompleted) {
    return <Redirect href="/(auth)/onboarding" />;
  }

  // Otherwise, go to the main app
  return <Redirect href="/(tabs)/home" />;
}
