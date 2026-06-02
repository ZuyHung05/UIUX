import { NavigationContainer } from '@react-navigation/native';
import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import AuthScreen from './src/screens/auth/AuthScreen';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isAuthenticated ? (
          <BottomTabNavigator />
        ) : (
          <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  )
}
