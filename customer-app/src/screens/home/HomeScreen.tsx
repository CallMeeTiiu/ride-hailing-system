import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native'; 

import { useTheme } from '../../contexts/ThemeContext';

import MapBackground from '../../components/home/MapBackground';
import BottomSearchBoard from '../../components/home/BottomSearchBoard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

const HomeScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={[styles.topActionContainer, { top: insets.top + 10 }]}>
        <TouchableOpacity 
            style={[styles.circleButton, { backgroundColor: colors.circleButtonBg }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Search')}
          >
            <FontAwesomeIcon icon={faMagnifyingGlass} size={20} color={colors.textTitle} />
        </TouchableOpacity>
      </View>

      <MapBackground />
      <BottomSearchBoard />
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