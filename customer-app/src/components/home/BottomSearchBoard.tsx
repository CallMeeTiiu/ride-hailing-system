import React, { useState } from 'react';
import SearchBottomSheet from './SearchBottomSheet';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot, faCrosshairs } from '@fortawesome/free-solid-svg-icons';

import theme from '../../constants/theme';
import { useTheme } from '../../constants/ThemeContext';

const BottomSearchBoard = () => {
  const { colors } = useTheme();

  const [isSheetVisible, setIsSheetVisible] = useState(false);

  const suggestionChips = [
    { id: 1, label: 'Home', icon: faLocationDot },
    { id: 2, label: 'Office', icon: faLocationDot },
    { id: 3, label: 'Apartment', icon: faLocationDot },
  ];

  return (
    <View style={styles.container}>
      <SearchBottomSheet 
        visible={isSheetVisible} 
        onClose={() => setIsSheetVisible(false)} 
      />
      
      <View style={styles.locationButtonContainer}>
        <TouchableOpacity style={styles.locationButton} activeOpacity={0.8}>
          <FontAwesomeIcon icon={faCrosshairs} size={24} color={theme.COLORS.textTitle} />
        </TouchableOpacity>
      </View>

      <View style={styles.chipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {suggestionChips.map((chip) => (
            <TouchableOpacity key={chip.id} style={styles.chip} activeOpacity={0.7}>
              <FontAwesomeIcon icon={chip.icon} size={14} color={theme.COLORS.primary} />
              <Text style={styles.chipText}>{chip.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={[styles.searchBoard, { backgroundColor: colors.background }]}>
        
        <View style={styles.handleBar} />

        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: colors.inputBg }]}
          activeOpacity={0.9}
          onPress={() => setIsSheetVisible(true)}
        >
          <Text style={[styles.searchText, { color: colors.textBody }]}>Where would you go?</Text>
          <FontAwesomeIcon icon={faLocationDot} size={20} color={colors.textBody} />
        </TouchableOpacity>

      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  locationButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 15,
  },
  locationButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.SHADOWS.primaryGlow,
  },
  chipsContainer: {
    marginBottom: 15,
  },
  scrollContent: {
    paddingHorizontal: theme.SIZES.padding,
    gap: 10, 
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: theme.COLORS.primary,
    backgroundColor: 'transparent',
  },
  chipText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 14,
    color: theme.COLORS.primary,
    marginLeft: 8,
  },
  searchBoard: {
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: theme.SIZES.padding,
    paddingTop: 10,
    paddingBottom: 25,
    
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10, 
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  searchText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
  }
});

export default BottomSearchBoard;