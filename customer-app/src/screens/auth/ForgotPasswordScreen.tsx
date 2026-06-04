import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Platform, 
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

import { RootStackParamList } from '../../../App';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext' 
import PrimaryButton from '../../components/common/PrimaryButton';
import CustomInput from '../../components/common/CustomInput';
import apiClient from '../../utils/apiClient';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number!');
      return;
    }

    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/customer/forgot', { phone_number: phoneNumber });
      const receivedOtp = response.data?.otp;

      if (response.data && response.data.otp) {
        Alert.alert(
          'Demo OTP', 
          `Phone number: ${phoneNumber} - OTP: ${response.data.otp}`,
          [
            { 
              text: 'OK', 
              onPress: () => navigation.navigate('FillOTP', { phoneNumber: phoneNumber, expectedOtp: receivedOtp }) 
            }
          ]
        );
      } else {
        navigation.navigate('FillOTP', { phoneNumber: phoneNumber });
      }

    } catch (error: any) {
      console.log('❌ Lỗi API Forgot Password:', error.response?.data || error.message);
      Alert.alert('Error', error.response?.data?.message || 'Unable to send OTP, please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 30) }]} showsVerticalScrollIndicator={false}>
        
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          <Image 
            source={require('../../assets/images/forgot_password.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <CustomInput 
            placeholder="Enter your phone number"
            iconName={faPhone}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ backgroundColor: colors.inputBg, marginBottom: 30 }}
          />

          <PrimaryButton 
            title={isLoading ? "Đang gửi..." : "Continue"} 
            onPress={handleContinue} 
            disabled={isLoading}
          />
        </View>
      </ScrollView>
    </View>
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
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: theme.SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 24,
    color: 'black',
  },
  content: {
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 40,
    alignItems: 'center',
  },
  illustration: {
    width: theme.SIZES.width,
    height: 250,
    marginBottom: 20,
  },
});

export default ForgotPasswordScreen;