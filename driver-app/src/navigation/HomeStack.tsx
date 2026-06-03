import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import CallScreen from '../screens/CallScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

export type HomeStackParamList = {
    HomeMain: undefined;
    Chat: undefined;
    Call: undefined;
    EditProfile: undefined;
};

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="HomeMain" component={HomeScreen} />
            <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ presentation: 'transparentModal', animation: 'slide_from_bottom' }}
            />
            <Stack.Screen
                name="Call"
                component={CallScreen}
                options={{ presentation: 'fullScreenModal' }}
            />
            <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
            />
        </Stack.Navigator>
    );
}
