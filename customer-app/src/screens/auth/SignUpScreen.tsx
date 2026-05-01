import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Platform,
} from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../constants/ThemeContext';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';
import Hyperlink from '../../components/common/Hyperlink';

import { faUser, faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'; 

const SignupScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const [userName, setUserName] = React.useState('');

  const handleCreateAccount = () => {
    navigation.navigate('InfoInput', { userName: userName });
  };

  const { colors } = useTheme();

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
          <Text style={styles.title}>Create your{"\n"}Account</Text>

          {/* Form nhập liệu */}
          <CustomInput 
            label="User Name"
            iconName={faUser} 
            onChangeText={(text) => setUserName(text)}
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
            onPress={handleCreateAccount} 
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