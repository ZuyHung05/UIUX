import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <SafeAreaProvider>
      {isAuthenticated ? (
        <AppNavigator />
      ) : (
        <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />
      )}
    </SafeAreaProvider>
  );
}