import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAddress } from '../../contexts/AddressContext';
import MapBackground, { MapBackgroundRef } from '../../components/home/MapBackground';
import PrimaryButton from '../../components/common/PrimaryButton';
import { getIconObject } from './AddressListScreen';

const ICONS_LIST = [
  'map-pin', 'home', 'briefcase', 'heart', 'coffee', 'utensils', 
  'shopping-cart', 'store', 'graduation-cap', 'dumbbell', 
  'hospital', 'plane', 'train', 'tree', 'music', 'gamepad'
];

const EditAddressScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapBackgroundRef>(null);
  const { addresses, addAddress, updateAddress } = useAddress();

  const addressId = route.params?.addressId;
  const isEditMode = !!addressId;
  const existingAddress = addresses.find(a => a.id === addressId);

  const [name, setName] = useState(existingAddress?.name || '');
  const [details, setDetails] = useState(existingAddress?.details || '');
  const [lat, setLat] = useState<number | null>(existingAddress?.lat || null);
  const [lng, setLng] = useState<number | null>(existingAddress?.lng || null);
  const [selectedIcon, setSelectedIcon] = useState(existingAddress?.icon || 'map-pin');
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const initLat = existingAddress?.lat || 10.8700;
    const initLng = existingAddress?.lng || 106.8031;
    
    setTimeout(() => {
      mapRef.current?.jumpToLocation(initLat, initLng);
    }, 500);
  }, [existingAddress]);

  useEffect(() => {
    if (route.params?.selectedPlace) {
      const { name, latitude, longitude } = route.params.selectedPlace;
      setDetails(name);
      setLat(latitude);
      setLng(longitude);
      
      mapRef.current?.jumpToLocation(latitude, longitude);
    }
  }, [route.params?.selectedPlace]);

  const handleMapMove = async (newLat: number, newLng: number) => {
    setLat(newLat);
    setLng(newLng);
    setIsFetching(true);
    
    try {
      const response = await fetch(`https://photon.komoot.io/reverse?lon=${newLng}&lat=${newLat}`);
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const props = data.features[0].properties;
        const addressParts = [props.housenumber, props.street, props.district, props.city, props.state].filter(Boolean);
        if (addressParts.length > 0) {
          setDetails(addressParts.join(', '));
        } else {
          setDetails(`${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
        }
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setDetails(`${newLat.toFixed(5)}, ${newLng.toFixed(5)}`);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSave = () => {
    const payload = {
      id: isEditMode ? addressId : Date.now().toString(),
      name: name || 'Custom Place',
      details,
      lat,
      lng,
      icon: selectedIcon
    };

    if (isEditMode) {
      updateAddress(addressId, payload);
    } else {
      addAddress(payload);
    }
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* KHU VỰC BẢN ĐỒ TRÊN CÙNG */}
      <View style={styles.mapSection}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
        </TouchableOpacity>

        <MapBackground ref={mapRef} onMapMove={handleMapMove} />
        
        {/* CÁI GHIM CỐ ĐỊNH Ở TÂM MÀN HÌNH (Giao diện UI) */}
        <View style={styles.centerPinWrapper} pointerEvents="none">
          <View style={styles.pinCircle}>
            <FontAwesomeIcon icon={getIconObject(selectedIcon)} size={20} color={theme.COLORS.white} />
          </View>
          <View style={styles.pinTriangle} />
        </View>
      </View>

      {/* BOTTOM SHEET ĐIỀN THÔNG TIN */}
      <View style={[styles.bottomSheet, { backgroundColor: colors.background, paddingBottom: Math.max(insets.bottom + 20, 40) }]}>
        <View style={styles.dragIndicator} />
        <Text style={[styles.sheetTitle, { color: colors.textTitle }]}>Address Details</Text>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* CHỌN ICON */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.iconSelector}>
            {ICONS_LIST.map((icon) => {
              const isSelected = selectedIcon === icon;
              return (
                <TouchableOpacity 
                  key={icon} 
                  onPress={() => setSelectedIcon(icon)}
                  style={[styles.iconOption, isSelected && { backgroundColor: theme.COLORS.primary }]}
                >
                  <FontAwesomeIcon 
                    icon={getIconObject(icon)} 
                    size={20} 
                    color={isSelected ? theme.COLORS.white : colors.textBody} 
                  />
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* INPUT NAME */}
          <Text style={[styles.label, { color: colors.textTitle }]}>Name Address</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.inputBg, color: colors.textTitle }]}
            placeholder="e.g. Apartment, Gym..."
            placeholderTextColor={colors.textBody}
            value={name}
            onChangeText={setName}
          />

          {/* INPUT DETAILS - ĐÃ CHUYỂN THÀNH TẤM BẤM ĐỂ MỞ SEARCHSCREEN */}
          <Text style={[styles.label, { color: colors.textTitle }]}>Address Details</Text>
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: colors.inputBg }]}
            onPress={() => navigation.navigate('SearchScreen', { mode: 'address_search' })}
            activeOpacity={0.8}
          >
            <Text 
              style={[
                styles.inputFlex, 
                { color: isFetching ? colors.primary : (details ? colors.textTitle : colors.textBody) }
              ]} 
              numberOfLines={2}
            >
              {isFetching ? "Locating..." : (details || "Tap to search address...")}
            </Text>
            <FontAwesomeIcon icon={faMapMarkerAlt} size={18} color={theme.COLORS.primary} />
          </TouchableOpacity>

          <PrimaryButton 
            title={isEditMode ? "Save Changes" : "Add Address"} 
            onPress={handleSave} 
            disabled={!lat || !lng || !name}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ marginTop: 20 }}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  backButton: {
    padding: 5,
    position: 'absolute',
    top: 30,
    left: 15,
    zIndex: 10,
  },
  mapSection: { 
    flex: 1, 
    position: 'relative' 
  },
  centerPinWrapper: {
    position: 'absolute',
    top: '50%', 
    left: '50%',
    marginLeft: -20, 
    marginTop: -40, 
    alignItems: 'center', 
    justifyContent: 'center',
    zIndex: 10,
  },
  pinCircle: {
    width: 40, 
    height: 40, 
    borderRadius: 20,
    backgroundColor: theme.COLORS.primary,
    borderWidth: 3, 
    borderColor: theme.COLORS.white,
    justifyContent: 'center', 
    alignItems: 'center',
    ...theme.SHADOWS.light,
  },
  pinTriangle: {
    width: 0, 
    height: 0,
    borderLeftWidth: 6, 
    borderRightWidth: 6, 
    borderTopWidth: 10,
    borderStyle: 'solid', 
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent', 
    borderRightColor: 'transparent',
    borderTopColor: theme.COLORS.primary,
    marginTop: -2,
  },
  bottomSheet: {
    height: '55%', 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30,
    paddingHorizontal: 20, 
    paddingTop: 10,
    ...theme.SHADOWS.light,
  },
  dragIndicator: {
    width: 40, 
    height: 5, 
    borderRadius: 3,
    backgroundColor: '#E0E0E0', 
    alignSelf: 'center', 
    marginBottom: 15,
  },
  sheetTitle: { 
    fontSize: 20, 
    fontFamily: theme.FONTS.bold, 
    alignSelf: 'center', 
    marginBottom: 20 
  },
  iconSelector: { 
    flexDirection: 'row', 
    marginBottom: 20 

  },
  iconOption: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#F0F0F0',
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 15,
  },
  label: { 
    fontSize: 14, 
    fontFamily: theme.FONTS.bold, 
    marginBottom: 8, 
    marginTop: 10 
  },
  input: {
    height: 52, 
    borderRadius: 16, 
    paddingHorizontal: 15,
    fontFamily: theme.FONTS.regular, 
    fontSize: 15,
  },
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderRadius: 16, 
    paddingHorizontal: 15, 
    minHeight: 52,
  },
  inputFlex: { 
    flex: 1, 
    fontFamily: theme.FONTS.regular, 
    fontSize: 15, 
    paddingVertical: 15 
  },
});

export default EditAddressScreen;