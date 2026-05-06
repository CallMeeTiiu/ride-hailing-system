import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faArrowLeft, 
  faMotorcycle, 
  faCar, 
  faLocationDot,
  faClock,
  faWallet,
  faCarOn
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../../App';
import PrimaryButton from '../../components/common/PrimaryButton';
import MethodCard from '../../components/booking/MethodCard'; 
import { useLocation } from '../../contexts/LocationContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VEHICLE_METHODS = [
  { id: 'bike', name: 'Bike', nearbies: 7, price: 10.00, time: '8 mins', icon: faMotorcycle },
  { id: 'standard', name: 'Standard', nearbies: 9, price: 20.00, time: '4 mins', icon: faCar },
  { id: 'premium', name: 'Premium', nearbies: 4, price: 30.00, time: '4 mins', icon: faCarOn },
];

const SelectCarScreen = () => {
  const insets = useSafeAreaInsets();

  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'SelectCar'>>();
  const { distance } = route.params;

  const { fromLocation, destinationLocation } = useLocation();

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  const selectedVehicle = VEHICLE_METHODS.find(v => v.id === selectedMethodId);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, top: insets.top + 10 }]}>
      
      {/* --- HEADER --- */}
      <View style={[ styles.header ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Select Car</Text>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ width: 20 }} /> 
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* --- SUBTITLE --- */}
        <Text style={[styles.subtitle, { color: colors.textTitle }]}>
          Select the vehicle category you want to ride.
        </Text>

        {/* --- DANH SÁCH CARDS --- */}
        <View style={styles.cardsContainer}>
          {VEHICLE_METHODS.map((vehicle) => (
            <MethodCard
              key={vehicle.id}
              id={vehicle.id}
              name={vehicle.name}
              nearbies={vehicle.nearbies}
              price={vehicle.price}
              icon={vehicle.icon}
              isSelected={selectedMethodId === vehicle.id}
              onSelect={setSelectedMethodId}
            />
          ))}
        </View>

      </ScrollView>

      {/* --- BOTTOM SECTION --- */}
      <View style={[styles.bottomSection, { backgroundColor: colors.background }]}>
        
        {/* Khung chứa 3 thông số (Pill) */}
        <View style={[styles.statsPill, { backgroundColor: colors.white }]}>
          {/* Distance */}
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faLocationDot} size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textTitle }]}>{distance} km</Text>
          </View>
          
          {/* Time (Cập nhật theo selectedVehicle) */}
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faClock} size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textTitle }]}>
              {selectedVehicle ? selectedVehicle.time : '--'}
            </Text>
          </View>
          
          {/* Costs (Cập nhật theo selectedVehicle) */}
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faWallet} size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textTitle }]}>
              {selectedVehicle ? `$${selectedVehicle.price.toFixed(2)}` : '--'}
            </Text>
          </View>
        </View>

        {/* Nút Confirm với logic disabled gọn gàng nhờ nâng cấp lần trước */}
        <PrimaryButton 
          title="Confirm"
          disabled={!selectedMethodId} 
          onPress={() => {
            console.log("=== THÔNG TIN CUỐC XE ===");
            console.log("Từ:", fromLocation?.name);
            console.log("Đến:", destinationLocation?.name);
            console.log("Khoảng cách:", distance);
            console.log("Loại xe:", selectedVehicle?.name, "- Giá:", selectedVehicle?.price);
          }}
        />
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 20,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  subtitle: {
    fontFamily: theme.FONTS.regular,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 20,
  },
  cardsContainer: {
    marginTop: 10,
  },

  bottomSection: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 100,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 10,
  },
  statsPill: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 20,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 14,
    marginLeft: 8,
  },
});

export default SelectCarScreen;