import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { LocationProvider } from './src/contexts/LocationContext';

import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import InfoInputScreen from './src/screens/auth/InfoInputScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import FillOTPScreen from './src/screens/auth/FillOTPScreen';
import NewPasswordScreen from './src/screens/auth/NewPasswordScreen';

import MainTabNavigator from './src/navigation/MainTabNavigation';
import SearchScreen from './src/screens/home/SearchScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  InfoInput: { userName: string }; 
  Home: undefined;
  ForgotPassword: undefined;
  FillOTP: { contactMethod: string; contactValue: string };
  NewPassword: undefined;
  MainTabs: undefined;
  Search: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <LocationProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{ headerShown: false }} 
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="InfoInput" component={InfoInputScreen} />
          <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          <Stack.Screen name="FillOTP" component={FillOTPScreen} />
          <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen name="Search" component={SearchScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </LocationProvider>
  );
};

export default App;