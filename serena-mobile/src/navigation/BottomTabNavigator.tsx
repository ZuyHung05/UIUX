import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Calendar, History, Home, User } from 'lucide-react-native';
import HomeScreen from '../screens/home/HomeScreen';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.secondary,
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                    height: 70,
                    paddingBottom: 10,
                    borderTopLeftRadius: 20,
                    borderTopRightRadius: 20,
                    position: 'absolute',
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
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
                component={HomeScreen} // Tạm thời để HomeScreen, sau này thay bằng HistoryScreen
                options={{
                    tabBarLabel: 'Lịch sử',
                    tabBarIcon: ({ color }) => <History color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Appointment"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Lịch hẹn',
                    tabBarIcon: ({ color }) => <Calendar color={color} size={24} />,
                }}
            />
            <Tab.Screen
                name="Profile"
                component={HomeScreen}
                options={{
                    tabBarLabel: 'Cá nhân',
                    tabBarIcon: ({ color }) => <User color={color} size={24} />,
                }}
            />
        </Tab.Navigator>
    );
}