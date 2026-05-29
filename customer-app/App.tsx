<<<<<<< HEAD
import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ThemeProvider } from './src/contexts/ThemeContext';
import { LocationProvider } from './src/contexts/LocationContext';
import { BookingHistoryProvider } from './src/contexts/BookingHistoryContext';
import { UserProvider } from './src/contexts/UserContext';
import { AddressProvider } from './src/contexts/AddressContext';
import { AuthProvider } from './src/contexts/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import WelcomeScreen from './src/screens/auth/WelcomeScreen';
import LoginScreen from './src/screens/auth/LoginScreen';
import SignUpScreen from './src/screens/auth/SignUpScreen';
import InfoInputScreen from './src/screens/auth/InfoInputScreen';
import ForgotPasswordScreen from './src/screens/auth/ForgotPasswordScreen';
import FillOTPScreen from './src/screens/auth/FillOTPScreen';
import NewPasswordScreen from './src/screens/auth/NewPasswordScreen';
=======
import React from 'react';
import { StatusBar, StyleSheet, useColorScheme, View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CustomerRatingBottomSheet } from './src/components/rating/CustomerRatingBottomSheet';
import { useTripStore } from './src/store/tripStore';
>>>>>>> frontend_driverapp

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
  ForgotPassword: undefined;
  FillOTP: { contactMethod: string; contactValue: string };
  NewPassword: undefined;
  MainTabs: undefined;
  Search: { 
    type?: 'from' | 'destination';
    mode?: string;
    onSelect?: (place: any) => void; 
  };
  SelectCar: { distance: number };
  SearchingDriver: undefined;
  Traveling: undefined;
  Rating: {tripId: string };
  RatingList: undefined;
  EditProfile: undefined;
  AddressList: undefined;
  EditAddress: { addressId?: string } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
<<<<<<< HEAD
    // eslint-disable-next-line react-native/no-inline-styles
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <UserProvider>
          <BookingHistoryProvider>
            <AddressProvider>
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
                      <Stack.Screen name="AddressList" component={AddressListScreen} />
                      <Stack.Screen name="EditAddress" component={EditAddressScreen} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </ThemeProvider>
              </LocationProvider>
            </AddressProvider>
          </BookingHistoryProvider>
        </UserProvider>
      </AuthProvider>
=======
    <GestureHandlerRootView style={styles.flex}>
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <AppContent />
      </SafeAreaProvider>
>>>>>>> frontend_driverapp
    </GestureHandlerRootView>
  );
};

<<<<<<< HEAD
export default App;
=======
function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();
  const { isRatingSheetVisible, openRatingSheet, cancelRating } = useTripStore();

  return (
    <View style={[styles.container, { paddingTop: safeAreaInsets.top }]}>
      <View style={styles.demoContainer}>
        <Text style={styles.title}>Customer App</Text>
        <Text style={styles.subtitle}>Ride-Hailing System</Text>

        <TouchableOpacity
          style={styles.demoButton}
          onPress={openRatingSheet}
          activeOpacity={0.8}>
          <Text style={styles.demoButtonText}>🚗 Simulate Trip Finished</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>
          Tap above to trigger the rating flow
        </Text>
      </View>

      <CustomerRatingBottomSheet
        visible={isRatingSheetVisible}
        onClose={cancelRating}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  demoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 48,
  },
  demoButton: {
    backgroundColor: '#F5A623',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 999,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
  demoButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  hint: {
    marginTop: 16,
    fontSize: 14,
    color: '#BDBDBD',
  },
});

export default App;
>>>>>>> frontend_driverapp
