import React, { useEffect, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image,
  Animated,         
  PanResponder,    
  Dimensions,
  ActivityIndicator
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faClock, faMagnifyingGlass, faMapMarkerAlt, faTrash } from '@fortawesome/free-solid-svg-icons';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocation } from '../../contexts/LocationContext';
import { RootStackParamList } from '../../../App';

const SCREEN_WIDTH = Dimensions.get('window').width;

const SwipeableItem = ({ item, onDelete, swipeEnabled = true, children }: { item: any, onDelete: (id: string) => void, swipeEnabled?: boolean, children: React.ReactNode }) => {
  const translateX = React.useRef(new Animated.Value(0)).current;

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        if (!swipeEnabled) return false;
        return Math.abs(gestureState.dx) > 15 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy);
      },
      onPanResponderMove: (evt, gestureState) => {
        if (gestureState.dx < 0) {
          translateX.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx < -SCREEN_WIDTH * 0.3) {
          Animated.timing(translateX, {
            toValue: -SCREEN_WIDTH,
            duration: 200,
            useNativeDriver: true,
          }).start(() => onDelete(item.id));
        } else {
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
          }).start();
        }
      }
    })
  ).current;

  return (
    <View style={styles.swipeContainer}>
      <View style={styles.deleteBackground}>
        <Text style={styles.deleteText}>Delete</Text>
        <FontAwesomeIcon icon={faTrash} size={20} color="white" />
      </View>
      <Animated.View style={{ transform: [{ translateX }] }} {...panResponder.panHandlers}>
        {children}
      </Animated.View>
    </View>
  );
};

const SearchScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const route = useRoute<RouteProp<RootStackParamList, 'Search'>>();
  const searchType = route.params?.type;

  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [standaloneLocation, setStandaloneLocation] = useState<any>(null);

  const { allLocations, recentLocations, addRecentLocation, removeRecentLocation, setFromLocation, setDestinationLocation, fromLocation } = useLocation();

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance.toFixed(1) + ' km'; 
  };

  const handleDeleteRecent = (id: string) => {
    removeRecentLocation(id);
  };

  const handleSelectLocation = (selectedItem: any) => {
    const cleanItem = { ...selectedItem, distance: '' };
    addRecentLocation(cleanItem); 

    const currentParams = route.params as any;

    if (currentParams?.mode === 'address_search') {
      (navigation as any).navigate({
        name: 'EditAddressScreen',
        params: { selectedPlace: cleanItem },
        merge: true, 
      });
      return;
    }
    
    if (searchType === 'from') {
      setFromLocation(cleanItem);
      navigation.goBack();
    } else if (searchType === 'destination') {
      setDestinationLocation(cleanItem);
      navigation.goBack();
    } else {
      setSearchText(cleanItem.name);
      setStandaloneLocation(cleanItem);
    }
  };

  useEffect(() => {
    if (searchText.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const UIT_LAT = 10.8700;
        const UIT_LNG = 106.8031;
        
        const response = await fetch(
          `https://photon.komoot.io/api/?q=${encodeURIComponent(searchText)}&limit=5&lat=${UIT_LAT}&lon=${UIT_LNG}`
        );
        const data = await response.json();

        const formattedResults = data.features.map((feature: any, index: number) => {
          const props = feature.properties;
          const coords = feature.geometry.coordinates; 

          const fullAddress = [props.housenumber, props.street, props.city, props.state, props.country]
                              .filter(Boolean)
                              .join(', ');

          return {
            id: `photon_${index}_${Date.now()}`,
            name: props.name || props.street || "Unknown Place",
            address: fullAddress,
            distance: '', 
            latitude: coords[1], 
            longitude: coords[0] 
          };
        });

        setSearchResults(formattedResults);
      } catch (error) {
        console.error("Lỗi khi gọi API Photon:", error);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchText]);

  const isSearching = searchText.length > 0;
  const isSuggesting = recentLocations.length === 0;
  
  const baseData = isSearching 
    ? searchResults 
    : (recentLocations.length > 0 ? recentLocations : allLocations);

  const displayData = baseData.map(item => {
    if (fromLocation && item.latitude && item.longitude) {
      return {
        ...item,
        distance: calculateDistance(
          fromLocation.latitude, 
          fromLocation.longitude, 
          item.latitude, 
          item.longitude
        )
      };
    }
    return { ...item, distance: '' }; 
  }).filter(item => {
    if (searchType === 'destination' && item.distance === '0.0 km') {
      return false;
    }
    return true;
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 10, paddingBottom: insets.bottom + 10 }]}>
          <View style={[styles.header]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Select Destination</Text>
            {/*eslint-disable-next-line react-native/no-inline-styles*/}
            <View style={{ width: 20 }} /> 
          </View>

          <View style={styles.inputContainer}>
            <View style={[
                styles.searchBox, 
                // eslint-disable-next-line react-native/no-inline-styles
                { 
                    backgroundColor: isFocused ? colors.backgroundLight : colors.inputBg,
                    borderColor: isFocused ? theme.COLORS.primary : 'transparent',
                }]}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size={18} color={theme.COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textTitle }]}
                placeholder="Where would you go?"
                placeholderTextColor={colors.textBody}
                autoFocus={true}
                value={searchText}
                onChangeText={setSearchText} 
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)} 
              />
            </View>
          </View>

          <View style={styles.sectionHeaderRow}>
            {searchText.length > 0 ? (
              <Text style={[styles.sectionTitle, { color: colors.textTitle }]}>
                {/*eslint-disable-next-line react-native/no-inline-styles*/}
                Result for <Text style={{ color: theme.COLORS.primary, fontWeight: 'bold' }}>"{searchText}"</Text>
              </Text>
            ) : (
              <Text style={[styles.sectionTitle, { color: colors.textBody }]}>
                {recentLocations.length > 0 ? "Recent Places" : "Suggested Places"}
              </Text>
            )}

            {searchText.length > 0 ? (
              isLoading ? (
                <ActivityIndicator size="small" color={theme.COLORS.primary} />
              ) : (
                <Text style={[styles.resultCount, { color: theme.COLORS.primary }]}>
                  {displayData.length} {displayData.length > 1 ? "founds" : "found"}
                </Text>
              )
            ) : ("")}
          </View>

          <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={styles.listContainer}
            style={styles.container}>

            {displayData.map((item) => (
              <SwipeableItem 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteRecent} 
                swipeEnabled={!isSearching}
              >
                <TouchableOpacity 
                    key={item.id} 
                    activeOpacity={1} 
                    style={[styles.locationItem, { borderBottomColor: colors.border, backgroundColor: colors.background }]}
                    onPress={() => handleSelectLocation(item)}
                >
                    {isSearching || isSuggesting? (
                    <View style={[styles.outerCircle, {backgroundColor: colors.backgroundLight}]}>
                        <View style={styles.innerCircle}>
                        <FontAwesomeIcon icon={faMapMarkerAlt} size={14} color={colors.textTitle} />
                        </View>
                    </View>
                    ) : (
                    <View style={styles.iconCircle}>
                        <FontAwesomeIcon icon={faClock} size={16} color={colors.textBody} />
                    </View>
                    )}

                    <View style={styles.locationTextContainer}>
                    <Text style={[styles.locationName, { color: colors.textTitle }]}>{item.name}</Text>
                    <Text style={[styles.locationAddress, { color: colors.textBody }]} numberOfLines={1}>
                        {item.address}
                    </Text>
                    </View>

                    <Text style={[styles.locationDistance, { color: colors.textTitle }]}>{item.distance}</Text>
                </TouchableOpacity>
              </SwipeableItem>
            ))}

            {displayData.length === 0 && (
              <View style={styles.notFoundContainer}>
                <Image 
                  source={require('../../assets/images/no_locations_found.png')} 
                  style={styles.notFoundImage}
                  resizeMode="contain"
                />
                <Text style={[styles.notFoundTitle, { color: colors.textTitle }]}>Not Found</Text>
                <Text style={[styles.notFoundText, { color: colors.textBody }]}>
                  Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
                </Text>
              </View>
            )}
          </ScrollView>

          {/* KHỐI NÚT BẤM DÀNH RIÊNG CHO SEARCH ĐỘC LẬP */}
          {(!searchType && standaloneLocation) && (
            <View style={styles.actionButtonsWrapper}>
              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.COLORS.primary }]}
                onPress={() => {
                  setFromLocation(standaloneLocation);
                  navigation.goBack();
                }}
              >
                <Text style={styles.actionButtonText}>Set as Pick Up</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.COLORS.iconDisable }]}
                onPress={() => {
                  setDestinationLocation(standaloneLocation);
                  navigation.goBack();
                }}
              >
                <Text style={styles.actionButtonText}>Set as Destination</Text>
              </TouchableOpacity>
            </View>
          )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  dismissArea: {
    flex: 1, 
  },
  sheetContainer: {
    height: '85%', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    ...theme.SHADOWS.primaryGlow,
  },
  header: {
    flexDirection: 'row',
    width: '100%', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 18,
  },
  spacer: {
    width: 20,
  },
  inputContainer: {
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontFamily: theme.FONTS.medium,
    fontSize: 14,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    paddingHorizontal: theme.SIZES.padding,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultCount: {
    fontFamily: theme.FONTS.bold,
    fontSize: 14,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  outerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 176, 32, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: theme.FONTS.regular,
    fontSize: 13,
  },
  locationDistance: {
    fontFamily: theme.FONTS.bold,
    fontSize: 14,
    marginLeft: 10,
  },
  notFoundContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  notFoundImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  notFoundTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 24,
    marginBottom: 15,
  },
  notFoundText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  swipeContainer: {
    position: 'relative',
    marginBottom: 0, 
  },
  deleteBackground: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    backgroundColor: '#FF4D4D', 
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 10,
    paddingRight: 25,
    borderRadius: 16, 
    marginVertical: 5,
  },
  deleteText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    lineHeight: 24,
  },

  actionButtonsWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 60, 
    
    backgroundColor: theme.COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    ...theme.SHADOWS.light, 
    shadowOffset: { width: 0, height: -4 }, 
  },
  actionButton: {
    flex: 1, 
    height: 52,
    borderRadius: 16, 
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8, 
  },
  actionButtonText: {
    color: theme.COLORS.white,
    fontSize: 15,
    fontFamily: theme.FONTS.bold, 
  },
});

export default SearchScreen;