import React, { useState } from 'react';
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
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

const LoginScreen = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Nút Back */}
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Tiêu đề */}
          <Text style={styles.title}>Login to your{"\n"}Account</Text>

          {/* Form nhập liệu */}
          <CustomInput 
            label="Email"
            iconName={faEnvelope}
            placeholder="andrew_ainsley@yourdomain.com"
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <CustomInput 
            label="Password"
            iconName={faLock}
            placeholder="••••••••••••"
            isPassword={true}
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
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
          </View>

          {/* Nút Sign In */}
          <PrimaryButton 
            title="Sign in" 
            onPress={() => navigation.replace('Home')} 
          />

          {/* Quên mật khẩu */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot the password?</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login (Đã bỏ Apple theo yêu cầu) */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialSquareButton}>
              <Image 
                source={require('../../assets/images/facebook_icon.png')} 
                style={styles.socialIcon} 
              />
            </TouchableOpacity>

            <TouchableOpacity style={styles.socialSquareButton}>
              <Image 
                source={require('../../assets/images/google_icon.png')} 
                style={styles.socialIcon} 
              />
            </TouchableOpacity>
          </View>

          {/* Footer Sign up */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
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
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  backButton: {
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: 10,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textTitle,
  },
  content: {
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 32, 
    color: COLORS.black,
    marginBottom: SIZES.padding * 1.5,
    lineHeight: 40,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.padding,
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
    borderColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  checkboxChecked: {
    backgroundColor: COLORS.primary,
  },
  checkMark: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.textTitle,
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 20,
  },
  forgotPasswordText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.primary,
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
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textBody,
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
    backgroundColor: COLORS.background,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    ...SHADOWS.light, 
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
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textBody,
  }
});

export default LoginScreen;