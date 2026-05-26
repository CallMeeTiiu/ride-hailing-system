import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  Image,
  ScrollView,
  Platform
} from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext'
import { useAuth } from '../../contexts/AuthContext';
import { faPhone, faLock } from '@fortawesome/free-solid-svg-icons';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import AsyncStorage from '@react-native-async-storage/async-storage';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

const LoginScreen = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const { login } = useAuth();

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();

  useEffect(() => {
    const loadRememberedCredentials = async () => {
      try {
        const savedPhone = await AsyncStorage.getItem('@remembered_phone');
        const savedPassword = await AsyncStorage.getItem('@remembered_password');
        
        if (savedPhone && savedPassword) {
          setPhoneNumber(savedPhone);
          setPassword(savedPassword);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Error while loading remembered credentials:', error);
      }
    };
    loadRememberedCredentials();
  }, []);

  const handleLogin = async () => {
    setPhoneError('');
    setPasswordError('');
    let isValid = true;

    if (!phoneNumber) {
      setPhoneError('Please enter your phone number');
      isValid = false;
    }
    if (!password) {
      setPasswordError('Please enter your password');
      isValid = false;
    }

    if (!isValid) return;

    const isSuccess = await login(phoneNumber, password);
    if (isSuccess) {
      try {
        if (rememberMe) {
          await AsyncStorage.setItem('@remembered_phone', phoneNumber);
          await AsyncStorage.setItem('@remembered_password', password);
        } else {
          await AsyncStorage.removeItem('@remembered_phone');
          await AsyncStorage.removeItem('@remembered_password');
        }
      } catch (error) {
        console.log('Error while saving credentials:', error);
      }

      navigation.replace('MainTabs');
    } else {
      setPhoneError('Invalid phone number or password');
    }
  };

  return (
    <SafeAreaView style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Nút Back */}
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
          <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Tiêu đề */}
          <Text style={styles.title}>Login to your{"\n"}Account</Text>

          {/* Form nhập liệu */}
          <CustomInput
            label="Phone Number"
            iconName={faPhone}
            placeholder="090xxxx123"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={(text) => {
              setPhoneNumber(text);
              if (phoneError) setPhoneError(''); 
            }}
            autoCapitalize="none"
            errorText={phoneError}
          />

          <CustomInput
            label="Password"
            iconName={faLock}
            placeholder="••••••••••••"
            isPassword={true}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              if (passwordError) setPasswordError('');
            }}
            errorText={passwordError}
          />

          {/* Remember me & Forgot Password Row */}
          <View style={styles.rememberContainer}>
            <TouchableOpacity 
              style={styles.checkboxRow} 
              activeOpacity={0.7}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={[ styles.rememberText, {color: colors.textTitle} ]}>Remember me</Text>
            </TouchableOpacity>
          </View>

          {/* Nút Sign In */}
          <PrimaryButton
          title="Sign in"
          onPress={handleLogin}
        />

          {/* Quên mật khẩu */}
          <Hyperlink 
            title="Forgot Password?" 
            onPress={() => navigation.navigate('ForgotPassword')} 
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={[ styles.dividerText, {color: colors.textBody} ]}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login (Đã bỏ Apple theo yêu cầu) */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={[ styles.socialSquareButton, {backgroundColor: colors.background} ]}>
              <Image 
                source={require('../../assets/images/facebook_icon.png')} 
                style={styles.socialIcon} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={[ styles.socialSquareButton, {backgroundColor: colors.background} ]}>
              <Image 
                source={require('../../assets/images/google_icon.png')} 
                style={styles.socialIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* Footer Sign up */}
          <View style={styles.footerContainer}>
            <Text style={[ styles.footerText, {color: colors.textBody} ]}>Don't have an account? </Text>
            <Hyperlink 
              title="Sign up" 
              onPress={() => navigation.navigate('SignUp')} 
            />
          </View>

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
    paddingHorizontal: theme.SIZES.padding,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 32, 
    color: 'black',
    marginBottom: theme.SIZES.padding * 1.5,
    lineHeight: 40,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.SIZES.padding,
    marginTop: -5,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: theme.COLORS.primary,
  },
  checkMark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontFamily: theme.FONTS.medium,
    fontSize: theme.SIZES.body2,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 30,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#EEEEEE',
  },
  dividerText: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
    marginHorizontal: 15,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center', 
    gap: 20, 
  },
  socialSquareButton: {
    width: 80,
    height: 60,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...theme.SHADOWS.light, 
  },
  socialIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
  }
});

export default LoginScreen;