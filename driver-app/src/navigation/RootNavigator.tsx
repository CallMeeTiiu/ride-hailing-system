import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import AuthStack from './AuthStack';
import MainTab from './MainTab';

export default function RootNavigator() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);

    return (
        <NavigationContainer>
            {isLoggedIn ? <MainTab /> : <AuthStack />}
        </NavigationContainer>
    );
}
