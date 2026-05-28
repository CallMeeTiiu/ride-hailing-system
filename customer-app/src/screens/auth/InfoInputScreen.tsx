import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform, 
  Alert
} from 'react-native';
import theme from '../../constants/theme';
import apiClient from '../../utils/apiClient';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useAddress } from '../../contexts/AddressContext';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import { useRoute, RouteProp } from '@react-navigation/native';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';

import { faUser, faPhone, faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const InfoInputScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'InfoInput'>>();
  const receivedName = route.params?.userName || "Friend";
  const receivedPhone = route.params?.phoneNumber || "";
  const receivedPassword = route.params?.password || "";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    userName: receivedName,
    email: '', 
    phoneNumber: receivedPhone, 
    address: '',
    lat: null as number | null, 
    lng: null as number | null
  });

  const { colors }= useTheme();
  const { addAddress } = useAddress();
  const { login } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');

  useEffect(() => {
    if (route.params?.selectedPlace) {
      const { name, latitude, longitude } = route.params.selectedPlace;
      
      setFormData(prev => ({
        ...prev,
        address: name,
        lat: latitude,
        lng: longitude
      }));
      
      if (addressError) setAddressError('');

      navigation.setParams({ selectedPlace: undefined });
    }
  }, [route.params.selectedPlace, navigation, addressError]);
  
  const handleInputChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleConfirm = async () => {
    setEmailError('');
    setAddressError('');
    let isValid = true;

    if (!formData.email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!formData.email.includes('@')) {
      setEmailError('Invalid email format (missing @)');
      isValid = false;
    }

    if (!formData.address) {
      setAddressError('Please enter your address');
      isValid = false;
    }

    if (!isValid) return;
    setIsLoading(true);

    try {
      const response = await apiClient.post('/auth/customer/register', {
        username: formData.userName,       
        phone_number: formData.phoneNumber, 
        password: receivedPassword,    
        email: formData.email,        
      });

      const { access_token, user } = response.data;

      addAddress({
        id: Date.now().toString(), 
        name: 'Default Address', 
        details: formData.address,
        lat: formData.lat, 
        lng: formData.lng, 
        icon: 'home' 
      });
      console.log("Added default address to AddressContext:", formData.address);

      await login(access_token, user);

    } catch (error: any) {
      console.log('API Register Error:', error.response?.data || error);
      Alert.alert(
        "Đăng ký thất bại",
        error.response?.data?.message || "Không thể kết nối đến máy chủ hoặc số điện thoại đã tồn tại."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
          <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[ styles.title, {color: colors.textTitle} ]}>
            Hello{"\n"}{formData.userName || "Friend"}!
          </Text>

          <Text style={[ styles.subtitle, {color: colors.textTitle} ]}>
            Please tell us more about you!
          </Text>

          <CustomInput 
            label="Phone Number"
            iconName={faPhone}
            value={formData.phoneNumber}
            editable={false}
            placeholder="+123456789"
            keyboardType="phone-pad"
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
          />

          <CustomInput 
            label="User Name"
            iconName={faUser}
            value={formData.userName}
            placeholder="Enter your name"
            onChangeText={(text) => handleInputChange('userName', text)}
          />

          <CustomInput
            label="Email"
            iconName={faEnvelope}
            value={formData.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(text) => {
              handleInputChange('email', text);
              if (emailError) setEmailError('');
            }}
            errorText={emailError} 
          />

          <TouchableOpacity 
          activeOpacity={0.8} 
          onPress={() => navigation.navigate('Search', { 
            onSelect: (place: any) => {
              setFormData(prev => ({
                ...prev,
                address: place.name,
                lat: place.latitude,
                lng: place.longitude
              }));
              if (addressError) setAddressError('');
            } 
          })}
        >
          <View pointerEvents="none">
            <CustomInput
              label="Address"
              iconName={faLocationDot}
              placeholder="Tap to search your default address..."
              value={formData.address}
              onChangeText={() => {}}
              errorText={addressError}
            />
          </View>
        </TouchableOpacity>

          <PrimaryButton 
            title="Confirm" 
            onPress={handleConfirm}
            isLoading={isLoading}
            style={styles.confirmButton}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backButton: {
    paddingHorizontal: theme.SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: 10,
  },
  backIcon: {
    fontSize: 28,
  },
  content: {
    flex: 1,
    paddingHorizontal: theme.SIZES.padding,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 40,
    lineHeight: 48,
  },
  subtitle: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    marginBottom: theme.SIZES.padding * 2,
  },
  confirmButton: {
    marginTop: theme.SIZES.padding,
    marginBottom: 10,
  }
});

export default InfoInputScreen;
