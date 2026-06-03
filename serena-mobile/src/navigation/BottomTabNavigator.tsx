import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BotMessageSquare, Calendar, History, Home, User } from 'lucide-react-native';
import { View } from 'react-native';
import AppointmentScreen from '../screens/appointment/AppointmentScreen';
import { HistoryScreen } from '../screens/history/HistoryScreen';
import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { COLORS } from '../utils/theme';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
    return (
        <Tab.Navigator
            // screenOptions={{
            //     headerShown: false,
            //     tabBarActiveTintColor: COLORS.secondary,
            //     tabBarInactiveTintColor: '#999',
            //     tabBarStyle: {
            //         height: 90,
            //         paddingBottom: 10,
            //         paddingTop: 10,
            //         borderTopLeftRadius: 20,
            //         borderTopRightRadius: 20,
            //         position: 'absolute',
            //     },
            //     tabBarLabelStyle: { ...TYPOGRAPHY.caption, fontWeight: '600' },
            // }}
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.primary,
                tabBarStyle: {
                    height: 80,
                    borderTopWidth: 1.27,
                    borderTopColor: COLORS.border,
                    backgroundColor: COLORS.white,
                },
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
                name="ConsultTab"
                component={View}
                listeners={({ navigation }) => ({
                    tabPress: (e) => {
                        e.preventDefault();
                        navigation.navigate('Consultation');
                    },
                })}
                options={{
                    tabBarLabel: '',
                    tabBarIcon: ({ color }) => (
                        <View style={{
                            width: 56,
                            height: 56,
                            backgroundColor: COLORS.primary,
                            borderRadius: 28,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: 13,
                            elevation: 5,
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 2 },
                            shadowOpacity: 0.2,
                        }}>
                            <BotMessageSquare color="white" size={28} />
                        </View>
                    ),

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