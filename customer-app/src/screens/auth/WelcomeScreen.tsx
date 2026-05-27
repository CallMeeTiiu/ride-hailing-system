import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  SafeAreaView, 
} from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId: '504462941265-g53eeqguu4t2774mv57cann02tl99ruf.apps.googleusercontent.com', 
});

const WelcomeScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const { colors } = useTheme();

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      const idToken = response.data?.idToken || (response as any).idToken;
      if (!idToken) {
        throw new Error('Cannot obtain idToken from Google Sign-In response');
      }

      const googleCredential = auth.GoogleAuthProvider.credential(idToken);
      const userCredential = await auth().signInWithCredential(googleCredential);
      
      console.log('🎉 Login with Google success:', userCredential.user);

      navigation.replace('MainTabs');

    } catch (error: any) {
      console.log('🚨 Error while login with Google:', error);
    }
  };

  return (
    <SafeAreaView style={[ styles.container, {backgroundColor: colors.background} ]}>
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
        <TouchableOpacity style={[ styles.socialButton, {backgroundColor: colors.inputBg} ]}>
          <Image 
            source={require('../../assets/images/facebook_icon.png')} 
            style={styles.socialIcon} 
          />
          <Text style={[ styles.socialButtonText, {color: colors.textTitle} ]}>Continue with Facebook</Text>
        </TouchableOpacity>

        {/* Nút đăng nhập Google */}
        <TouchableOpacity style={[ styles.socialButton, {backgroundColor: colors.inputBg} ]} onPress={handleGoogleLogin}>
          <Image 
            source={require('../../assets/images/google_icon.png')} 
            style={styles.socialIcon} 
          />
          <Text style={[ styles.socialButtonText, {color: colors.textTitle} ]}>Continue with Google</Text>
        </TouchableOpacity>

        {/* Thanh ngăn cách "or" */}
        <View style={styles.dividerContainer}>
          <View style={[ styles.dividerLine, { backgroundColor: colors.inputBg} ]} />
          <Text style={[ styles.dividerText, { color: colors.textBody} ]}>or</Text>
          <View style={[ styles.dividerLine, { backgroundColor: colors.inputBg} ]} />
        </View>

        {/* Nút đăng nhập chính */}
        <PrimaryButton
            title="Sign in with password"
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.2}
            style={{ marginTop: theme.SIZES.padding }} 
        />

        {/* Chuyển sang trang Đăng ký */}
        <View style={styles.footerContainer}>
          <Text style={[ styles.footerText, {color: colors.textBody} ]}>Don't have an account? </Text>
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
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: theme.SIZES.padding,
    alignItems: 'center',
  },
  illustration: {
    width: theme.SIZES.width, 
    height: 200,
    padding: theme.SIZES.padding,
    marginTop: 75,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: theme.SIZES.h1,
    color: 'black',
    marginVertical: theme.SIZES.padding * 1.5,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 56,
    borderRadius: theme.SIZES.radiusInput,
    borderWidth: 1,
    marginBottom: theme.SIZES.padding,
  },
  socialIcon: {
    width: 24,
    height: 24,
    position: 'absolute',
    left: 30, 
  },
  socialButtonText: {
    fontFamily: theme.FONTS.medium,
    fontSize: theme.SIZES.body1,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: theme.SIZES.padding,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
    marginHorizontal: 15,
  },
  footerContainer: {
    flexDirection: 'row',
    marginTop: theme.SIZES.padding * 1.5,
  },
  footerText: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
  },
});

export default WelcomeScreen;