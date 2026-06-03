import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet, useWindowDimensions } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { width } = useWindowDimensions();
  const isDesktopWeb = Platform.OS === 'web' && width > 480;

  return (
    <View style={isDesktopWeb ? styles.webContainer : styles.mobileContainer}>
      <View style={isDesktopWeb ? styles.phoneFrame : styles.mobileContainer}>
        <SafeAreaProvider>
          <AppNavigator />
        </SafeAreaProvider>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  webContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#E2E8F0', // Slate 200 background
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  phoneFrame: {
    width: '100%',
    maxWidth: 420,
    height: '100%',
    maxHeight: 880,
    backgroundColor: '#FFFFFF',
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 10,
    borderColor: '#1E293B', // Slate 800 phone bezel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 10,
  },
});