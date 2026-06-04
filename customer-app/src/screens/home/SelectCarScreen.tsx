import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
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
import PrimaryButton from '../../components/common/PrimaryButton';
import MethodCard from '../../components/booking/MethodCard'; 
import apiClient from '../../utils/apiClient';

import { useLocation } from '../../contexts/LocationContext';
import { useTheme } from '../../contexts/ThemeContext';
import { RootStackParamList } from '../../../App';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface VehicleQuote {
  fare_quote_id: any;
  id: string; 
  name: string; 
  price: number;
  estimated_time: string; 
  nearbies?: number; 
  vehicle_type: string;
}

const getVehicleIcon = (type: string) => {
  const lowerType = type.toLowerCase();
  if (lowerType.includes('bike') || lowerType.includes('motor')) return faMotorcycle;
  if (lowerType.includes('premium') || lowerType.includes('lux')) return faCarOn;
  return faCar; 
};

const SelectCarScreen = () => {
  const insets = useSafeAreaInsets();

  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const route = useRoute<RouteProp<RootStackParamList, 'SelectCar'>>();
  const { distance } = route.params;

  const { fromLocation, destinationLocation } = useLocation();

  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
  
  const [vehicles, setVehicles] = useState<VehicleQuote[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const selectedVehicle = vehicles.find(v => v.id === selectedMethodId);

  useEffect(() => {
    const fetchQuote = async () => {
      if (!fromLocation || !destinationLocation) {
        Alert.alert("Lỗi", "Không tìm thấy tọa độ đón hoặc trả!");
        navigation.goBack();
        return;
      }

      setIsLoading(true);
      try {
        const payload = {
          pickup_latitude: fromLocation.latitude,
          pickup_longitude: fromLocation.longitude,
          dropoff_latitude: destinationLocation.latitude,
          dropoff_longitude: destinationLocation.longitude,
        };

        const response = await apiClient.post('/rides/quote', payload); 
        
        const quoteData = Array.isArray(response.data) ? response.data : response.data?.data || [];
        setVehicles(quoteData);

        if (quoteData.length > 0) {
          setSelectedMethodId(quoteData[0].id);
        }
      } catch (error: any) {
        console.log("Lỗi gọi API Quote:", error.response?.data || error);
        Alert.alert("Lỗi Báo Giá", "Không thể lấy giá chuyến đi lúc này.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [fromLocation, destinationLocation, navigation]);

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
          {isLoading ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 50 }} />
          ) : vehicles.length === 0 ? (
            // eslint-disable-next-line react-native/no-inline-styles
            <Text style={{ textAlign: 'center', color: colors.textBody, marginTop: 20 }}>
              There are no available vehicles for this route at the moment. Please try again later.
            </Text>
          ) : (
            vehicles.map((vehicle) => (
              <MethodCard
                key={vehicle.id}
                id={vehicle.id}
                name={vehicle.name}
                nearbies={vehicle.nearbies || Math.floor(Math.random() * 10) + 1}
                price={vehicle.price}
                icon={getVehicleIcon(vehicle.vehicle_type || vehicle.name)}
                isSelected={selectedMethodId === vehicle.id}
                onSelect={setSelectedMethodId}
              />
            ))
          )}
        </View>

      </ScrollView>

      {/* --- BOTTOM SECTION --- */}
      <View style={[styles.bottomSection, { backgroundColor: colors.background }]}>
        
        <View style={[styles.statsPill, { backgroundColor: colors.white }]}>
          {/* Distance */}
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faLocationDot} size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textTitle }]}>{distance} km</Text>
          </View>
          
          {/* Time */}
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faClock} size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textTitle }]}>
              {selectedVehicle ? selectedVehicle.estimated_time || '--' : '--'}
            </Text>
          </View>
          
          {/* Costs  */}
          <View style={styles.statItem}>
            <FontAwesomeIcon icon={faWallet} size={16} color={colors.primary} />
            <Text style={[styles.statText, { color: colors.textTitle }]}>
              {selectedVehicle ? `${selectedVehicle.price} VND` : '--'}
            </Text>
          </View>
        </View>

        <PrimaryButton
          title="Confirm"
          disabled={!selectedMethodId || isLoading}
          onPress={() => {
            if (selectedMethodId && selectedVehicle) {
              navigation.navigate('SearchingDriver', { 
                selectedVehicleId: selectedVehicle.vehicle_type,
                fare_quote_id: selectedVehicle.fare_quote_id 
              });
            }
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