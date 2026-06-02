import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { faLock } from '@fortawesome/free-solid-svg-icons';

import { RootStackParamList } from '../../../App';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import SuccessPopup from '../../components/common/SuccessPopup';
import apiClient from '../../utils/apiClient';


const NewPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  const route = useRoute<RouteProp<RootStackParamList, 'NewPassword'>>();

  const { phoneNumber, otpCode } = route.params;

  const [showPopup, setShowPopup] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [confirmError, setConfirmError] = useState('');

  const validatePasswords = () => {
    const trimmedNew = newPassword.trim();
    const trimmedConfirm = confirmPassword.trim();

    if (trimmedNew.length < 6) {
      setConfirmError('Password must be at least 6 characters long!');
      return false;
    }

    if (trimmedNew !== trimmedConfirm) {
      setConfirmError('Confirmation password does not match!'); 
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePasswords()) return;

    setIsLoading(true);
    try {
      await apiClient.post('/auth/customer/reset', {
        phone_number: phoneNumber,
        otp_code: otpCode,
        new_password: newPassword.trim() 
      });

      setShowPopup(true);
    
      setTimeout(() => {
        setShowPopup(false);
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }], 
        });
      }, 3000);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Unable to reset password at the moment.');
    } finally {
      setIsLoading(false);
    }
  };

  const { colors } = useTheme();

  return (
    <View style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <SuccessPopup 
        visible={showPopup} 
        text="Your account is ready to use. Please log in with your new password." 
      />

      <KeyboardAvoidingView 
        // eslint-disable-next-line react-native/no-inline-styles
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={[
            styles.scrollContainer, 
            { paddingBottom: Math.max(insets.bottom, 30) }
          ]} 
          showsVerticalScrollIndicator={false}
        >
          
          <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
              <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Password</Text>
          </View>

          <View style={styles.content}>
            <Image 
              source={require('../../assets/images/create_new_password.png')} 
              style={styles.illustration}
              resizeMode="contain"
            />

            <Text style={[ styles.description, {color: colors.textTitle} ]}>
              Create Your New Password
            </Text>

            <CustomInput
              placeholder="New Password"
              iconName={faLock}
              isPassword={true}
              value={newPassword}
              onChangeText={(text) => {
                setNewPassword(text);
                if (confirmError) setConfirmError(''); 
              }}
            />

            <CustomInput
              placeholder="Confirm New Password"
              iconName={faLock}
              isPassword={true}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmError) setConfirmError('');
              }}
              errorText={confirmError} 
              // eslint-disable-next-line react-native/no-inline-styles
              style={{ marginBottom: confirmError ? 10 : 30 }}
            />

            <PrimaryButton 
              title={isLoading ? "Loading..." : "Continue"} 
              onPress={handleResetPassword} 
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 30,
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
    alignItems: 'center',
  },
  illustration: {
    width: theme.SIZES.width,
    height: 250,
    marginBottom: 40,
  },
  description: {
    fontFamily: theme.FONTS.medium,
    fontSize: theme.SIZES.body1,
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
  continueButton: {
    marginTop: 'auto',
    marginBottom: 20,
  }
});

export default NewPasswordScreen;