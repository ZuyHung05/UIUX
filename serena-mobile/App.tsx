import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform, View, StyleSheet, Dimensions } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

// On desktop web, constrain portals (Modals) to the iPhone 12 Pro frame dimensions
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const styleId = 'serena-mobile-web-modal-frame';
  if (!document.getElementById(styleId)) {
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
      @media (min-width: 481px) {
        body > div[style*="position: fixed"],
        body > div > div[style*="position: fixed"],
        body [style*="position: fixed"][style*="inset: 0"],
        body [style*="position: fixed"][style*="top: 0"] {
          inset: auto !important;
          right: auto !important;
          bottom: auto !important;
          left: 50% !important;
          top: 50% !important;
          width: min(390px, 100vw) !important;
          max-width: min(390px, 100vw) !important;
          height: min(844px, 100vh) !important;
          max-height: min(844px, 100vh) !important;
          transform: translate(-50%, -50%) !important;
          border-radius: 26px !important;
          overflow: hidden !important;
          box-sizing: border-box !important;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const isDesktopWeb = Platform.OS === 'web' && (() => {
    const screenWidth = typeof window !== 'undefined' && window.screen ? window.screen.width : Dimensions.get('screen').width;
    return screenWidth > 480;
  })();

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
    width: 390,
    height: 844,
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
