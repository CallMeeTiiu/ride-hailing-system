import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeStack from './HomeStack';
import ProfileStack from './ProfileStack';
import WalletScreen from '../screens/WalletScreen';
import ActivityScreen from '../screens/ActivityScreen';
import { COLORS } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

export type MainTabParamList = {
    HomeTab: undefined;
    WalletTab: undefined;
    ActivityTab: undefined;
    ProfileTab: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

export default function MainTab() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarActiveTintColor: COLORS.primaryDark,
                tabBarInactiveTintColor: COLORS.textTertiary,
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home';
                    if (route.name === 'WalletTab') {
                        iconName = 'credit-card';
                    } else if (route.name === 'ActivityTab') {
                        iconName = 'clock';
                    } else if (route.name === 'ProfileTab') {
                        iconName = 'user';
                    }
                    return <Icon name={iconName} size={size} color={color} />;
                },
                tabBarStyle: {
                    backgroundColor: COLORS.background,
                    borderTopWidth: 1,
                    borderTopColor: '#EEEEEE',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
            })}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{ tabBarLabel: 'Home' }}
            />
            <Tab.Screen
                name="WalletTab"
                component={WalletScreen}
                options={{ tabBarLabel: 'Ví' }}
            />
            <Tab.Screen
                name="ActivityTab"
                component={ActivityScreen}
                options={{ tabBarLabel: 'Hoạt động' }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileStack}
                options={{ tabBarLabel: 'Profile' }}
            />
        </Tab.Navigator>
    );
}
