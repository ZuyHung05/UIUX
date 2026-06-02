import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <AppNavigator /> // Đã đổi từ BottomTabNavigator sang AppNavigator của nhánh chat
        ) : (
          <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}