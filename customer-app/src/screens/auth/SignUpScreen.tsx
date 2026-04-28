import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  Image
} from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'; 

const SignupScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Nút Back */}
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          {/* Tiêu đề */}
          <Text style={styles.title}>Create your{"\n"}Account</Text>

          {/* Form nhập liệu */}
          <CustomInput 
            label="User Name"
            iconName={faUser} 
            placeholder="andrew_ainsley"
            autoCapitalize="none"
          />

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

          <CustomInput 
            label="Confirm Password"
            iconName={faLock} 
            placeholder="••••••••••••"
            isPassword={true}
          />

          {/* Nút Đăng ký */}
          <PrimaryButton 
            title="Create" 
            onPress={() => console.log("Sign up Triggered")} 
            style={{ marginTop: 15 }}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login 
              (Trong ảnh của bạn bị trống chỗ này, có thể do lỗi xuất ảnh Figma. 
              Tôi cứ thêm vào cho đồng bộ với trang Login nhé, nếu bạn không thích thì cứ xóa khối này đi) 
          */}
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

          {/* Footer chuyển về Login */}
          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>You have already an account? </Text>
            <Hyperlink 
              title="Sign in" 
              onPress={() => console.log("Chuyển sang Sign In")} 
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
    color: COLORS.textTitle,
    marginBottom: SIZES.padding * 1.5,
    lineHeight: 40,
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

export default SignupScreen;