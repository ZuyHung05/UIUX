import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthScreen from "../screens/auth/AuthScreen";
import ConsultationScreen from "../screens/chat/ChatScreen";
import ConsultationDetailScreen from "../screens/chat/ConsultationDetailScreen";
import NotificationScreen from "../screens/notifications/NotificationScreen";
import BottomTabNavigator from "./BottomTabNavigator";

const Stack = createNativeStackNavigator();
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          gestureEnabled: true,
          gestureDirection: 'horizontal'
        }}
      >
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen
          name="MainTabs"
          component={BottomTabNavigator}
        />
        <Stack.Screen
          name="Notification"
          component={NotificationScreen}
        />
        <Stack.Screen name="Consultation" component={ConsultationScreen} />
        <Stack.Screen name="ConsultationDetail" component={ConsultationDetailScreen} />

      </Stack.Navigator>

    </NavigationContainer>
  );
}