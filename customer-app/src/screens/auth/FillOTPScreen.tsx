import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RootStackParamList } from '../../../App';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

const FillOTPScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'FillOTP'>>();
  const insets = useSafeAreaInsets();

  const { contactValue } = route.params;

  const [timeLeft, setTimeLeft] = useState(60);

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<Array<TextInput | null>>([]);

  useEffect(() => {
    if (timeLeft === 0) {
      Alert.alert(
        "OTP Resent",
        `Your OTP has been resent, please check your ${contactValue}`,
        [{ text: "OK", onPress: () => setTimeLeft(60) }]
      );
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft, contactValue]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];

    if (text.length > 0) {
      newOtp[index] = text[text.length - 1]; 
      setOtp(newOtp);
      
      if (index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    } else {
      newOtp[index] = '';
      setOtp(newOtp);
      
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.safeArea}>
      <View style={[styles.container, { paddingBottom: Math.max(insets.bottom, 30) }]}>
        
        {/* Header */}
        <View style={[styles.headerRow, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          {/* Thông báo gửi mã tới đâu */}
          <Text style={styles.description}>
            Code has been sent to {contactValue}
          </Text>

          {/* Cụm 4 ô nhập OTP */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={[styles.otpInput, digit !== '' && styles.otpInputActive]}
                keyboardType="numeric"
                maxLength={1}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                selectTextOnFocus 
              />
            ))}
          </View>

          {/* Bộ đếm thời gian */}
          <Text style={styles.timerText}>
            Resend code in <Text style={styles.timerCount}>{timeLeft} s</Text>
          </Text>
        </View>

        {/* Nút Verify đẩy xuống cuối màn hình */}
        <View style={styles.footer}>
          <PrimaryButton 
            title="Verify" 
            onPress={() => console.log("OTP đang nhập là:", otp.join(''))} 
          />
        </View>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.padding,
    marginBottom: 40,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textTitle,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.black,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    justifyContent: 'center',
    alignItems: 'center',
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body1,
    color: COLORS.textTitle,
    textAlign: 'center',
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 15, 
    marginBottom: 50,
  },
  otpInput: {
    width: 65,
    height: 60,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    backgroundColor: '#FAFAFA',
    textAlign: 'center',
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.textTitle,
  },
  otpInputActive: {
    borderColor: COLORS.primary, 
    backgroundColor: '#FFF9E5',
  },
  timerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textBody,
  },
  timerCount: {
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  footer: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 30,
  }
});

export default FillOTPScreen;