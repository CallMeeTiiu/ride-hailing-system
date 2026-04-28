import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { RootStackParamList } from '../../../App';
import { COLORS, SIZES, FONTS } from '../../constants/theme';
import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import SuccessPopup from '../../components/common/SuccessPopup';

const NewPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();

  const [rememberMe, setRememberMe] = useState(false);

  const [showPopup, setShowPopup] = useState(false);
  
  const handleContinue = () => {
    setShowPopup(true);
    
    setTimeout(() => {
      setShowPopup(false);
      navigation.replace('Home');
    }, 3000);
  };

  return (
    <View style={styles.safeArea}>
      <SuccessPopup 
        visible={showPopup} 
        text="Your account is ready to use. You will be redirected to the Home page in a few seconds." 
      />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContainer, 
          { paddingBottom: Math.max(insets.bottom, 30) }
        ]} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header */}
        <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Password</Text>
        </View>

        <View style={styles.content}>
          {/* Hình ảnh minh họa */}
          <Image 
            source={require('../../assets/images/create_new_password.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            Create Your New Password
          </Text>

          {/* Ô nhập Mật khẩu mới */}
          <CustomInput 
            iconName={faLock} 
            placeholder="••••••••••••"
            isPassword={true}
          />

          {/* Ô Xác nhận Mật khẩu mới */}
          <CustomInput 
            iconName={faLock} 
            placeholder="••••••••••••"
            isPassword={true}
          />

          {/* Checkbox Remember me */}
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

          {/* Nút Continue */}
          <PrimaryButton 
            title="Continue" 
            onPress={handleContinue}
            style={styles.continueButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: SIZES.padding,
    marginBottom: 30,
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
    alignItems: 'center',
  },
  illustration: {
    width: SIZES.width,
    height: 250,
    marginBottom: 40,
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body1,
    color: COLORS.textTitle,
    textAlign: 'left',
    width: '100%',
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 30,
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
  continueButton: {
    marginTop: 'auto',
    marginBottom: 20,
  }
});

export default NewPasswordScreen;