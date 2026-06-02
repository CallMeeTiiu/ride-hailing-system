import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp, useIsFocused } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../App';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import apiClient from '../../utils/apiClient';

const FillOTPScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FillOTP'>>();
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const isFocused = useIsFocused();

  const phoneNumber = route.params?.phoneNumber || '';

  const [timeLeft, setTimeLeft] = useState(60);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const inputs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (!isFocused) return;

    if (timeLeft === 0) {
      Alert.alert(
        "OTP Resent",
        `The OTP has been resent to ${phoneNumber}`,
        [{ text: "OK", onPress: () => setTimeLeft(60) }]
      );
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
    
  }, [timeLeft, phoneNumber, isFocused]);

  const handleChangeText = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    
    if (text !== '') {
      if (index < 5) {
        inputs.current[index + 1]?.focus();
      }
    } 
    else {
      if (index > 0) {
        inputs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpCode = otp.join('');
    if (otpCode.length < 6) {
      Alert.alert('Error', 'Please enter the complete 6-digit OTP!');
      return;
    }

    setIsLoading(true);
    try {
      await apiClient.post('/auth/customer/verify', { 
        phone_number: phoneNumber, 
        otp_code: otpCode 
      });

      navigation.navigate('NewPassword', { phoneNumber, otpCode });
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'The OTP is invalid or has expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 30) }]}>
        
        <View style={[styles.headerRow, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          <Text style={[ styles.description, {color: colors.textTitle} ]}>
            The OTP has been sent to {phoneNumber}. Please check and enter below.
          </Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                style={[styles.otpInput, { color: colors.textTitle, backgroundColor: colors.inputBg }]}
                keyboardType="number-pad"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleChangeText(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                ref={(ref) => {inputs.current[index] = ref}}
              />
            ))}
          </View>

          <Text style={[ styles.timerText, {color: colors.textBody} ]}>
            Resend code in <Text style={styles.timerCount}>{timeLeft} s</Text>
          </Text>
        </View>

        <View style={styles.footer}>
          <PrimaryButton 
            title={isLoading ? "Loading..." : "Verify"} 
            onPress={handleVerify} 
            disabled={isLoading} 
          />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 40,
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
    flex: 1,
    paddingHorizontal: theme.SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body1,
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10, 
    marginBottom: 50,
  },
  otpInput: {
    width: 50,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: theme.FONTS.bold,
  },
  otpInputActive: {
    borderColor: theme.COLORS.primary, 
    backgroundColor: '#FFF9E5',
  },
  timerText: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
  },
  timerCount: {
    fontFamily: theme.FONTS.medium,
    color: theme.COLORS.primary,
  },
  footer: {
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 30,
  }
});

export default FillOTPScreen;