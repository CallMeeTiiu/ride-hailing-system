import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import InfoInputScreen from './src/screens/auth/InfoInputScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  InfoInput: { userName: string }; 
  Home: undefined;
  ForgotPassword: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const HomeScreen = () => (
  // eslint-disable-next-line react-native/no-inline-styles
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text>Chào mừng bạn đã vào trang chủ!</Text>
  </View>
);
import { View, Text } from 'react-native';

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }} 
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="InfoInput" component={InfoInputScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;