import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { BookingHistoryProvider } from './src/contexts/BookingHistoryContext';
import { UserProvider } from './src/contexts/UserContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import InfoInputScreen from './src/screens/auth/InfoInputScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import FillOTPScreen from './src/screens/auth/FillOTPScreen';
import NewPasswordScreen from './src/screens/auth/NewPasswordScreen';

import MainTabNavigator from './src/navigation/MainTabNavigation';
import SearchScreen from './src/screens/home/SearchScreen';
import SelectCarScreen from './src/screens/home/SelectCarScreen';
import SearchingDriverScreen from './src/screens/home/SearchingDriverScreen';
import TravelingScreen from './src/screens/home/TravelingScreen';
import RatingScreen from './src/screens/rating/RatingScreen'; 
import RatingListScreen from './src/screens/rating/RatingListScreen';
import EditProfileScreen from './src/screens/profile/EditProfileScreen';

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
  Search: { type?: 'from' | 'destination' } | undefined;
  SelectCar: { distance: number };
  SearchingDriver: undefined;
  Traveling: undefined;
  Rating: {tripId: string };
  RatingList: undefined;
  EditProfile: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <UserProvider>
        <BookingHistoryProvider>
          <LocationProvider>
            <ThemeProvider>
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
                  <Stack.Screen name="SelectCar" component={SelectCarScreen}/>
                  <Stack.Screen name="SearchingDriver" component={SearchingDriverScreen}  />
                  <Stack.Screen name="Traveling" component={TravelingScreen} />
                  <Stack.Screen name="Rating" component={RatingScreen} />
                  <Stack.Screen name="RatingList" component={RatingListScreen} />
                  <Stack.Screen name="EditProfile" component={EditProfileScreen} />
                </Stack.Navigator>
              </NavigationContainer>
            </ThemeProvider>
          </LocationProvider>
        </BookingHistoryProvider>
      </UserProvider>
    </GestureHandlerRootView>
  );
};

export default App;