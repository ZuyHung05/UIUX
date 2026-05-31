import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, History, Home, User } from 'lucide-react-native';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { COLORS, TYPOGRAPHY } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.secondary,
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    height: 90,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                },
                tabBarLabelStyle: { ...TYPOGRAPHY.caption, fontWeight: '600' },
            }}
        >
            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Trang chủ',
                    tabBarIcon: ({ color }) => <Home color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="History"
                component={HistoryScreen}
                options={{
                    tabBarLabel: 'Lịch sử',
                    tabBarIcon: ({ color }) => <History color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Appointment"
                component={AppointmentScreen}
                options={{
                    tabBarLabel: 'Lịch hẹn',
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
}