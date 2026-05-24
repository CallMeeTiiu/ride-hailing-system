import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHouse, faClipboardList, faUser } from '@fortawesome/free-solid-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../constants/theme';
import { useTheme } from '../contexts/ThemeContext'

import HomeScreen from '../screens/home/HomeScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import RatingListScreen from '../screens/rating/RatingListScreen';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets(); 
  const TAB_BAR_HEIGHT = 65;

  return (
    <Tab.Navigator
      initialRouteName='HomeTab'
      screenOptions={() => ({
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textBody,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: TAB_BAR_HEIGHT + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 5,
          paddingTop: 10,
        },
        tabBarLabelStyle: {
          fontFamily: theme.FONTS.medium,
          fontSize: 12,
          marginTop: 5,
        }
      })}
    >
      <Tab.Screen 
        name="RatingTab" 
        component={RatingListScreen} 
        options={{
          tabBarLabel: 'Rating',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faClipboardList} color={color} size={size + 2} />
          ),
        }}
      />
      <Tab.Screen 
        name="HomeTab" 
        component={HomeScreen} 
        options={{
          tabBarLabel: 'Home',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faHouse} color={color} size={size + 2} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          // eslint-disable-next-line react/no-unstable-nested-components
          tabBarIcon: ({ color, size }) => (
            <FontAwesomeIcon icon={faUser} color={color} size={size + 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;