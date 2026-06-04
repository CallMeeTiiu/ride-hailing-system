import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

import { faUser, faPhone, faLock } from '@fortawesome/free-solid-svg-icons'; 

const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [userName, setUserName] = React.useState('');
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [nameError, setNameError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmError, setConfirmError] = React.useState('');

  const { colors } = useTheme();

  const handleSignUp = () => {
    setNameError('');
    setPhoneError('');
    setPasswordError('');
    setConfirmError('');
    
    let isValid = true;

    if (!userName) { setNameError('Please enter your name'); isValid = false; }
    if (!phoneNumber) { setPhoneError('Please enter your phone number'); isValid = false; }
    if (!password) { setPasswordError('Please enter your password'); isValid = false; }

    if (password !== confirmPassword) {
      setConfirmError('Confirm password does not match!');
      isValid = false;
    }

    if (!isValid) return;

    navigation.navigate('InfoInput', { 
      userName: userName,
      phoneNumber: phoneNumber,
      password: password
    });
  }

  return (
    <SafeAreaView style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          
          {/* Nút Back */}
          <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
            <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
          </TouchableOpacity>

          <View style={styles.content}>
            {/* Tiêu đề */}
            <Text style={styles.title}>Create your{"\n"}Account</Text>

            {/* Form nhập liệu */}
            <CustomInput
              label="User Name"
              iconName={faUser}
              placeholder="yourname"
              autoCapitalize="none"
              value={userName}
              onChangeText={(text) => {
                setUserName(text);
                if (nameError) setNameError('');
              }}
              errorText={nameError}
            />

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

            <CustomInput
              label="Confirm Password"
              iconName={faLock}
              placeholder="••••••••••••"
              isPassword={true}
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (confirmError) setConfirmError('');
              }}
              errorText={confirmError}
            />

            {/* Nút Đăng ký */}
            <PrimaryButton
            title="Create"
            onPress={handleSignUp}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ marginTop: 15 }}
          />

            {/* Footer chuyển về Login */}
            <View style={styles.footerContainer}>
              <Text style={[ styles.footerText, {color: colors.textBody} ]}>You have already an account? </Text>
              <Hyperlink 
                title="Sign in" 
                onPress={() => navigation.navigate('Login')} 
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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

export default SignupScreen;