import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.contentContainer}>
        {/* Hình ảnh minh họa */}
        <Image 
          source={require('../../assets/images/welcome.png')} 
          style={styles.illustration}
          resizeMode="contain"
        />

        {/* Tiêu đề */}
        <Text style={styles.title}>Let's you in</Text>

        {/* Nút đăng nhập Facebook */}
        <TouchableOpacity style={styles.socialButton}>
          <Image 
            source={require('../../assets/images/facebook_icon.png')} 
            style={styles.socialIcon} 
          />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* Nút đăng nhập Google */}
        <TouchableOpacity style={styles.socialButton}>
          <Image 
            source={require('../../assets/images/google_icon.png')} 
            style={styles.socialIcon} 
          />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Thanh ngăn cách "or" */}
        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Nút đăng nhập chính */}
        <PrimaryButton
            title="Sign in with password"
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.2}
            style={{ marginTop: SIZES.padding }} 
        />

        {/* Chuyển sang trang Đăng ký */}
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Hyperlink 
          title="Sign up" 
          activeOpacity={0.2} 
          onPress={() => navigation.navigate('SignUp')} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: SIZES.padding,
    alignItems: 'center',
  },
  illustration: {
    width: SIZES.width, 
    height: 200,
    padding: SIZES.padding,
    marginTop: 75,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.h1,
    color: COLORS.black,
    marginVertical: SIZES.padding * 1.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: SIZES.radiusInput,
    borderWidth: 1,
    borderColor: COLORS.inputBg,
    marginBottom: SIZES.padding,
  },
  socialIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 30, 
  },
  socialButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.textTitle,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: SIZES.padding,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.inputBg,
  },
  dividerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textBody,
    marginHorizontal: 15,
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: SIZES.padding * 1.5,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textBody,
  },
});

export default WelcomeScreen;