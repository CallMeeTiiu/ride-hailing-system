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
import { COLORS, SIZES, FONTS } from '../../constants/theme';

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
            <Text style={styles.footerText}>You have already an account? </Text>
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