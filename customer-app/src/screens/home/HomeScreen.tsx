import React, { useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native'; 

import { useTheme } from '../../contexts/ThemeContext';

import BottomSearchBoard from '../../components/home/HomeBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';
import FloatingMapActions from '../../components/home/FloatingMapActions';
import { useSharedValue } from 'react-native-reanimated';
import AppMap from '../../components/home/AppMap';
import RadarAnimation from '../../components/home/RadarAnimation';
import theme from '../../constants/theme';
import { MapBackgroundRef } from '../../components/home/MapBackground';

const HomeScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const animatedSheetIndex = useSharedValue(0);

  const mapRef = useRef<MapBackgroundRef>(null);
  
  return (
    <View style={styles.container}>
      <AppMap ref={mapRef}>
        <View style={styles.userCenterAnchor}>
          <RadarAnimation />
          <View style={[styles.avatarBorder, { borderColor: colors.primaryLight }]}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }}
              style={styles.userAvatar} 
            />
          </View>
        </View>
      </AppMap>

      <View style={[styles.topActionContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity
          style={[styles.circleButton, { backgroundColor: colors.circleButtonBg }]}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Search')}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color={colors.textTitle} />
        </TouchableOpacity>
      </View>
      <FloatingMapActions animatedIndex={animatedSheetIndex} />
      <BottomSearchBoard animatedIndex={animatedSheetIndex}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  topActionContainer: {
    position: 'absolute',
    right: 20,
    flexDirection: 'row',
    gap: 15,
    zIndex: 10,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userCenterAnchor: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBorder: {
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 4, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: theme.COLORS.white,
  },
  userAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
});

export default HomeScreen;