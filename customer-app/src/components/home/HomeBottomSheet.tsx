import React, { useRef, useMemo, useEffect } from 'react';
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
  faSearch,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocation } from '../../contexts/LocationContext';
import { RootStackParamList } from '../../../App';
import PrimaryButton from '../common/PrimaryButton';

const SheetAnimatedContent = ({ 
  colors, fromLocation, destinationLocation, distance, isOrderReady, handleNavigateToSearch, sheetRef,
  setFromLocation, setDestinationLocation, 
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
      
      {/* --- GIAO DIỆN 1: THU GỌN --- */}
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

      {/* --- GIAO DIỆN 2: MỞ RỘNG --- */}
      {/* eslint-disable-next-line react-native/no-inline-styles */} 
      <Animated.View style={[expandedStyle, { paddingTop: 10 }]}>
        <Text style={[styles.title, { color: colors.textTitle }]}>Select Address</Text>
        
        <View style={styles.distanceRow}>
          <Text style={[styles.distanceLabel, { color: colors.textTitle }]}>Distance</Text>
          <Text style={[styles.distanceValue, { color: colors.textTitle }]}>{distance}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.routeSection}>
          <View style={styles.iconColumn}>
            { fromLocation ? (
              <View style={[ styles.outerCircle, {backgroundColor: colors.backgroundLight} ]}>
                <View style={styles.innerCircle}>
                  <FontAwesomeIcon icon={faCrosshairs} size={20} color="black" />
                </View>
              </View>
            ) : (
              <View style={[ styles.outerCircle, {backgroundColor: colors.inputBg} ]}>
                <FontAwesomeIcon icon={faCrosshairs} size={20} color={colors.iconDisable} />
              </View>
            )}

            <View style={[styles.dashedLine, { borderColor: colors.textBody }]} />

            { destinationLocation ? (
              <View style={[ styles.outerCircle, {backgroundColor: colors.backgroundLight} ]}>
                <View style={styles.innerCircle}>
                  <FontAwesomeIcon icon={faLocationDot} size={20} color="black" />
                </View>
              </View>
            ) : (
              <View style={[ styles.outerCircle, {backgroundColor: colors.inputBg} ]}>
                <FontAwesomeIcon icon={faLocationDot} size={20} color={colors.iconDisable} />
              </View>
            )}
          </View>

          <View style={styles.contentColumn}>
            
            {/* Ô ĐIỂM ĐÓN (FROM) */}
            <View style={styles.locationItem}>
              <TouchableOpacity 
                style={styles.textContainerWrapper} 
                activeOpacity={0.7} 
                onPress={() => handleNavigateToSearch('from')}
              >
                <View style={styles.textContainer}>
                  <Text style={[styles.locName, { color: colors.textTitle }]} numberOfLines={1}>
                    {fromLocation ? fromLocation.name : 'My Current Location'}
                  </Text>
                  {fromLocation ? (
                    <Text style={[styles.locAddress, { color: colors.textBody }]} numberOfLines={1}>
                      {fromLocation.address}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              
              {fromLocation ? (
                <TouchableOpacity onPress={() => setFromLocation(null)} style={styles.actionIconCell}>
                  <FontAwesomeIcon icon={faTimes} size={16} color={colors.textBody} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleNavigateToSearch('from')} style={styles.actionIconCell}>
                  <FontAwesomeIcon icon={faPenToSquare} size={16} color={theme.COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.locationItem}>
              <TouchableOpacity 
                style={styles.textContainerWrapper} 
                activeOpacity={0.7} 
                onPress={() => handleNavigateToSearch('destination')}
              >
                <View style={styles.textContainer}>
                  <Text style={[styles.locName, { color: colors.textTitle }]} numberOfLines={1}>
                    {destinationLocation ? destinationLocation.name : 'Select Destination'}
                  </Text>
                  {destinationLocation ? (
                    <Text style={[styles.locAddress, { color: colors.textBody }]} numberOfLines={1}>
                      {destinationLocation.address}
                    </Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              
              {destinationLocation ? (
                <TouchableOpacity onPress={() => setDestinationLocation(null)} style={styles.actionIconCell}>
                  <FontAwesomeIcon icon={faTimes} size={16} color={colors.textBody} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => handleNavigateToSearch('destination')} style={styles.actionIconCell}>
                  <FontAwesomeIcon icon={faPenToSquare} size={16} color={theme.COLORS.primary} />
                </TouchableOpacity>
              )}
            </View>

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

interface BottomSearchBoardProps {
  animatedIndex: any; 
  distance: string;
}

const BottomSearchBoard: React.FC<BottomSearchBoardProps> = ({ animatedIndex, distance }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const { fromLocation, setFromLocation, destinationLocation, setDestinationLocation } = useLocation();
  const sheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['15%', '85%'], []);

  const isOrderReady = 
    fromLocation !== null && 
    destinationLocation !== null && 
    (fromLocation.latitude !== destinationLocation.latitude || 
     fromLocation.longitude !== destinationLocation.longitude);

  useEffect(() => {
    if (fromLocation || destinationLocation) {
      sheetRef.current?.expand(); 
    }
  }, [fromLocation, destinationLocation]);

  const handleNavigateToSearch = (type: 'from' | 'destination' | 'checkout') => {
    if (type === 'checkout') {
      navigation.navigate('SelectCar', { distance: parseFloat(distance) });
    } else {
      navigation.navigate('Search', { type });
    }
  };

  return (
    <BottomSheet
      ref={sheetRef}
      index={0} 
      snapPoints={snapPoints}
      animatedIndex={animatedIndex}
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
          setFromLocation={setFromLocation}                  
          setDestinationLocation={setDestinationLocation}
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
    paddingVertical: theme.SIZES.padding,
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
    gap: 5,
  },
  outerCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
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
    paddingVertical: 8,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10
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
  },
  textContainerWrapper: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
  },
  actionIconCell: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default BottomSearchBoard;