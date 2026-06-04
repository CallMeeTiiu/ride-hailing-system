import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuthStore } from '../store/authStore';
import AuthStack from './AuthStack';
import MainTab from './MainTab';
import SetupScreen from '../screens/SetupScreen';

export default function RootNavigator() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
    const isProfileComplete = useAuthStore((state) => state.isProfileComplete);
    const loadToken = useAuthStore((state) => state.loadToken);

    useEffect(() => {
        loadToken();
    }, [loadToken]);

    return (
        <NavigationContainer>
            {!isLoggedIn ? (
                <AuthStack />
            ) : !isProfileComplete ? (
                <SetupScreen />
            ) : (
                <MainTab />
            )}
        </NavigationContainer>
    );
}
