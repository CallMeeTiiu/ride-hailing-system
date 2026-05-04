import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'; 

import { useTheme } from '../../constants/ThemeContext';

import MapBackground from '../../components/home/MapBackground';
import BottomSearchBoard from '../../components/home/BottomSearchBoard';
import SearchBottomSheet from '../../components/home/SearchBottomSheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const HomeScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [isSearchSheetVisible, setIsSearchSheetVisible] = useState(false);

  return (
    <View style={styles.container}>
      <View style={[styles.topActionContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity 
            style={[styles.circleButton, { backgroundColor: colors.circleButtonBg }]}
            activeOpacity={0.8}
            onPress={() => setIsSearchSheetVisible(true)}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color={colors.textTitle} />
        </TouchableOpacity>
      </View>

      <MapBackground />
      <BottomSearchBoard />

      <SearchBottomSheet 
        visible={isSearchSheetVisible}
        onClose={() => setIsSearchSheetVisible(false)}
      />
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
  }
});

export default HomeScreen;