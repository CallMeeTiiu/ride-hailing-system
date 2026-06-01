import 'react-native-gesture-handler';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { BookingHistoryProvider } from './src/contexts/BookingHistoryContext';
import { UserProvider } from './src/contexts/UserContext';
import { AddressProvider } from './src/contexts/AddressContext';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
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
import EditAddressScreen from './src/screens/profile/EditAddressScreen';
import AddressListScreen from './src/screens/profile/AddressListScreen';
import HistoryScreen from './src/screens/history/HistoryScreen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import TripDetailScreen from './src/screens/history/TripDetailScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  InfoInput: { 
    userName?: string; 
    phoneNumber?: string; 
    password?: string; 
    selectedPlace?: any;
  }; 
  Home: undefined;
  HomeTab: undefined;
  ForgotPassword: undefined;
  FillOTP: { contactMethod: string; contactValue: string };
  NewPassword: undefined;
  MainTabs: undefined;
  Search: { 
    type?: 'from' | 'destination' | 'search';
    mode?: string;
    onSelect?: (place: any) => void; 
  };
  SelectCar: { distance: number };
  SearchingDriver: { 
    selectedVehicleId?: string, 
    fare_quote_id?: string,
    isRecovery?: boolean,
    tripId?: string };
  Traveling: {
    tripId?: string;
    driverId?: string;
  };
  Rating: {tripId: string };
  RatingList: undefined;
  EditProfile: undefined;
  AddressList: undefined;
  EditAddress: { addressId?: string } | undefined;
  History: undefined;
  TripDetail: {
    tripId: string;
  };
};

const RootNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      // eslint-disable-next-line react-native/no-inline-styles
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <>
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="SignUp" component={SignUpScreen} />
            <Stack.Screen name="InfoInput" component={InfoInputScreen} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="FillOTP" component={FillOTPScreen} />
            <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="MainTabs" component={MainTabNavigator} />
            <Stack.Screen name="HomeTab" component={MainTabNavigator} />
            <Stack.Screen name="Search" component={SearchScreen} />
            <Stack.Screen name="SelectCar" component={SelectCarScreen}/>
            <Stack.Screen name="SearchingDriver" component={SearchingDriverScreen}  />
            <Stack.Screen name="Traveling" component={TravelingScreen} />
            <Stack.Screen name="Rating" component={RatingScreen} />
            <Stack.Screen name="RatingList" component={RatingListScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="AddressList" component={AddressListScreen} />
            <Stack.Screen name="EditAddress" component={EditAddressScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="TripDetail" component={TripDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          <UserProvider>
            <BookingHistoryProvider>
              <AddressProvider>
                <LocationProvider>
                  <ThemeProvider>
                    <RootNavigator />
                  </ThemeProvider>
                </LocationProvider>
              </AddressProvider>
            </BookingHistoryProvider>
          </UserProvider>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;