// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faLocationDot, faCrosshairs } from '@fortawesome/free-solid-svg-icons';

// import theme from '../../constants/theme';
// import { useTheme } from '../../contexts/ThemeContext';
// import SelectAddressSheet from './SelectAddressSheet';
// import { useLocation } from '../../contexts/LocationContext';

// const BottomSearchBoard = () => {
//   const { colors } = useTheme();

//   const { fromLocation, destinationLocation } = useLocation();
  
//   useEffect(() => {
//     if (fromLocation || destinationLocation) {
//       setIsAddressSheetVisible(true);
//     }
//   }, [fromLocation, destinationLocation]);

//   const suggestionChips = [
//     { id: 1, label: 'Home', icon: faLocationDot },
//     { id: 2, label: 'Office', icon: faLocationDot },
//     { id: 3, label: 'Apartment', icon: faLocationDot },
//   ];

//   const [isAddressSheetVisible, setIsAddressSheetVisible] = useState(false);

//   return (
//     <View style={styles.container}>
      // <View style={styles.locationButtonContainer}>
      //   <TouchableOpacity style={styles.locationButton} activeOpacity={0.8}>
      //     <FontAwesomeIcon icon={faCrosshairs} size={24} color={theme.COLORS.textTitle} />
      //   </TouchableOpacity>
      // </View>

      // <View style={styles.chipsContainer}>
      //   <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      //     {suggestionChips.map((chip) => (
      //       <TouchableOpacity key={chip.id} style={styles.chip} activeOpacity={0.7}>
      //         <FontAwesomeIcon icon={chip.icon} size={14} color={theme.COLORS.primary} />
      //         <Text style={styles.chipText}>{chip.label}</Text>
      //       </TouchableOpacity>
      //     ))}
      //   </ScrollView>
      // </View>

//       <View style={[styles.searchBoard, { backgroundColor: colors.background }]}>
        
//         <View style={styles.handleBar} />

//         <TouchableOpacity 
//           style={[styles.searchBar, { backgroundColor: colors.inputBg }]}
//           activeOpacity={0.9}
//           onPress={() => setIsAddressSheetVisible(true)}
//         >
//           <Text style={[styles.searchText, { color: colors.textBody }]}>Where would you go?</Text>
//           <FontAwesomeIcon icon={faLocationDot} size={20} color={colors.textBody} />
//         </TouchableOpacity>

//       </View>

//       <SelectAddressSheet 
//         onClose={() => setIsAddressSheetVisible(false)} 
//         visible={isAddressSheetVisible}
//       />

//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     width: '100%',
//   },
//   locationButtonContainer: {
//     alignItems: 'flex-end',
//     paddingHorizontal: theme.SIZES.padding,
//     marginBottom: 15,
//   },
//   locationButton: {
//     width: 50,
//     height: 50,
//     borderRadius: 25,
//     backgroundColor: theme.COLORS.primary,
//     justifyContent: 'center',
//     alignItems: 'center',
//     ...theme.SHADOWS.primaryGlow,
//   },
//   chipsContainer: {
//     marginBottom: 15,
//   },
//   scrollContent: {
//     paddingHorizontal: theme.SIZES.padding,
//     gap: 10, 
//   },
//   chip: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     paddingHorizontal: 16,
//     paddingVertical: 10,
//     borderRadius: 24,
//     borderWidth: 1.5,
//     borderColor: theme.COLORS.primary,
//     backgroundColor: 'transparent',
//   },
//   chipText: {
//     fontFamily: theme.FONTS.semiBold,
//     fontSize: 14,
//     color: theme.COLORS.primary,
//     marginLeft: 8,
//   },
//   searchBoard: {
//     width: '100%',
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//     paddingHorizontal: theme.SIZES.padding,
//     paddingTop: 10,
//     paddingBottom: 25,
    
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: -3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 10,
//     elevation: 10, 
//   },
//   handleBar: {
//     width: 40,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: '#E0E0E0',
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   searchBar: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     height: 56,
//     borderRadius: 16,
//     paddingHorizontal: 20,
//   },
//   searchText: {
//     fontFamily: theme.FONTS.regular,
//     fontSize: 16,
//   }
// });

// export default BottomSearchBoard;

import React, { useRef, useMemo, useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity
} from 'react-native';
import BottomSheet, { BottomSheetView, useBottomSheet } from '@gorhom/bottom-sheet';
import Animated, { interpolate, useAnimatedStyle, Extrapolation } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faLocationDot, 
  faCrosshairs, 
  faPenToSquare,
  faSearch
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocation } from '../../contexts/LocationContext';
import { RootStackParamList } from '../../../App';
import PrimaryButton from '../common/PrimaryButton';

const SheetAnimatedContent = ({ 
  colors, fromLocation, destinationLocation, distance, isOrderReady, handleNavigateToSearch, sheetRef 
}: any) => {
  const { animatedIndex } = useBottomSheet();

  const collapsedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0, 0.5], [1, 0], Extrapolation.CLAMP),
    zIndex: animatedIndex.value < 0.5 ? 10 : -1,
  }));

  const expandedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(animatedIndex.value, [0.2, 1], [0, 1], Extrapolation.CLAMP),
    zIndex: animatedIndex.value > 0.5 ? 10 : -1,
  }));

  return (
    <View style={styles.contentContainer}>
      
      {/* --- GIAO DIỆN 1: THU GỌN (Dùng absolute để nằm đè lên nhau) --- */}
      <Animated.View style={[styles.absoluteView, collapsedStyle]}>
        <TouchableOpacity 
          style={[styles.searchBar, { backgroundColor: colors.inputBackground }]}
          activeOpacity={0.9}
          onPress={() => sheetRef.current?.expand()} 
        >
          <FontAwesomeIcon icon={faSearch} size={20} color={colors.textBody} />
          <Text style={[styles.searchText, { color: colors.textBody }]}>
            Where are you going?
          </Text>
        </TouchableOpacity>
      </Animated.View>

      {/* eslint-disable-next-line react-native/no-inline-styles */} 
      <Animated.View style={[expandedStyle, { paddingTop: 10 }]}>
        <Text style={[styles.title, { color: colors.textTitle }]}>Select Address</Text>
        
        <View style={styles.distanceRow}>
          <Text style={[styles.distanceLabel, { color: colors.textTitle }]}>Distance</Text>
          <Text style={[styles.distanceValue, { color: colors.textTitle }]}>{distance} km</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.routeSection}>
          <View style={styles.iconColumn}>
            { fromLocation ? (
              <View style={[ styles.outerCircle, {backgroundColor: colors.backgroundLight} ]}>
                <View style={styles.innerCircle}>
                  <FontAwesomeIcon icon={faCrosshairs} size={12} color="black" />
                </View>
              </View>
            ) : (
              <View style={[ styles.outerCircle, {backgroundColor: colors.inputBg} ]}>
                <FontAwesomeIcon icon={faCrosshairs} size={12} color={colors.iconDisable} />
              </View>
            )}

            <View style={[styles.dashedLine, { borderColor: colors.textBody }]} />

            { destinationLocation ? (
              <View style={[ styles.outerCircle, {backgroundColor: colors.backgroundLight} ]}>
                <View style={styles.innerCircle}>
                  <FontAwesomeIcon icon={faLocationDot} size={12} color="black" />
                </View>
              </View>
            ) : (
              <View style={[ styles.outerCircle, {backgroundColor: colors.inputBg} ]}>
                <FontAwesomeIcon icon={faLocationDot} size={12} color={colors.iconDisable} />
              </View>
            )}
          </View>

          <View style={styles.contentColumn}>
            <TouchableOpacity 
              style={styles.locationItem} 
              activeOpacity={0.7}
              onPress={() => handleNavigateToSearch('from')}
            >
              <View style={styles.textContainer}>
                <Text style={[styles.locName, { color: colors.textTitle }]}>
                  {fromLocation ? fromLocation.name : 'My Current Location'}
                </Text>
                {fromLocation ? (
                  <Text style={[styles.locAddress, { color: colors.textBody }]} numberOfLines={1}>
                      {fromLocation.address}
                  </Text>
                ) : null}
              </View>
              <FontAwesomeIcon icon={faPenToSquare} size={16} color={theme.COLORS.primary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.locationItem} 
              activeOpacity={0.7}
              onPress={() => handleNavigateToSearch('destination')}
            >
              <View style={styles.textContainer}>
                <Text style={[styles.locName, { color: colors.textTitle }]}>
                  {destinationLocation ? destinationLocation.name : 'Select Destination'}
                </Text>
                {destinationLocation ? (
                  <Text style={[styles.locAddress, { color: colors.textBody }]} numberOfLines={1}>
                      {destinationLocation.address}
                  </Text>
                ) : null}
              </View>
              <FontAwesomeIcon icon={faPenToSquare} size={16} color={theme.COLORS.primary} />
            </TouchableOpacity>

          </View>
        </View>

        <View style={styles.buttonContainer} >
            <PrimaryButton
              title="Continue to Order" 
              disabled={!isOrderReady} 
              onPress={() => {
                if (isOrderReady) {
                    sheetRef.current?.collapse();
                    handleNavigateToSearch('checkout'); 
                }
              }}
            />
        </View>
      </Animated.View>

    </View>
  );
};

const BottomSearchBoard = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const { fromLocation, destinationLocation } = useLocation();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '85%'], []);

  const [distance] = useState(4.5);

  const isOrderReady = 
    fromLocation !== null && 
    destinationLocation !== null && 
    fromLocation.id !== destinationLocation.id;

  useEffect(() => {
    if (fromLocation || destinationLocation) {
      sheetRef.current?.expand(); 
    }
  }, [fromLocation, destinationLocation]);

  const handleNavigateToSearch = (type: 'from' | 'destination' | 'checkout') => {
    if (type === 'checkout') {
      navigation.navigate('SelectCar', { distance });
    } else {
      navigation.navigate('Search', { type });
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={0} 
      snapPoints={snapPoints}
      style={styles.sheetShadow}
      backgroundStyle={{ backgroundColor: colors.background }}
      handleIndicatorStyle={styles.dragHandle}
    >
      <BottomSheetView style={styles.sheetContent}>
        <SheetAnimatedContent 
          colors={colors}
          fromLocation={fromLocation}
          destinationLocation={destinationLocation}
          distance={distance}
          isOrderReady={isOrderReady}
          handleNavigateToSearch={handleNavigateToSearch}
          sheetRef={sheetRef}
        />
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  sheetContent: {
    flex: 1,
  },
  sheetShadow: {
    shadowColor: 'black',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 20, 
    borderTopWidth: 1,
    borderColor: '#EFEFEF',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
  },
  contentContainer: {
    flex: 1,
    position: 'relative',
  },
  absoluteView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100%',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 16,
    marginLeft: 15,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  distanceLabel: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
  },
  distanceValue: {
    fontFamily: theme.FONTS.regular,
    fontSize: 14,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  routeSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  iconColumn: {
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  outerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedLine: {
    height: 30,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    marginVertical: 4,
    opacity: 0.4,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  locName: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  locAddress: {
    fontFamily: theme.FONTS.regular,
    fontSize: 13,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  }
});

export default BottomSearchBoard;