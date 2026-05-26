import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext' 

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import { useRoute, RouteProp } from '@react-navigation/native';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';

import { faUser, faPhone, faLocationDot, faEnvelope } from '@fortawesome/free-solid-svg-icons';

const InfoInputScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'InfoInput'>>();
  const receivedName = route.params?.userName || "Friend";

  const receivedPhone = route.params?.phoneNumber || "";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    userName: receivedName,
    email: '', 
    phoneNumber: receivedPhone, 
    address: ''
  });

  const [emailError, setEmailError] = useState('');
  const [addressError, setAddressError] = useState('');

  const handleInputChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleConfirm = () => {
    setEmailError('');
    setAddressError('');
    let isValid = true;

    if (!formData.email) {
      setEmailError('Please enter your email');
      isValid = false;
    } else if (!formData.email.includes('@')) {
      setEmailError('Invalid email format (missing @)');
      isValid = false;
    }

    if (!formData.address) {
      setAddressError('Please enter your address');
      isValid = false;
    }

    if (!isValid) return;
    
    navigation.replace('MainTabs');
  };

  const { colors }= useTheme();

  return (
    <SafeAreaView style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
          <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={[ styles.title, {color: colors.textTitle} ]}>
            Hello{"\n"}{formData.userName || "Friend"}!
          </Text>

          <Text style={[ styles.subtitle, {color: colors.textTitle} ]}>
            Please tell us more about you!
          </Text>

          <CustomInput 
            label="Phone Number"
            iconName={faPhone}
            value={formData.phoneNumber}
            editable={false}
            placeholder="+123456789"
            keyboardType="phone-pad"
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
          />

          <CustomInput 
            label="User Name"
            iconName={faUser}
            value={formData.userName}
            placeholder="Enter your name"
            onChangeText={(text) => handleInputChange('userName', text)}
          />

          <CustomInput
            label="Email"
            iconName={faEnvelope}
            value={formData.email}
            placeholder="Enter your email"
            keyboardType="email-address"
            onChangeText={(text) => {
              handleInputChange('email', text);
              if (emailError) setEmailError('');
            }}
            errorText={emailError} 
          />

          <CustomInput
            label="Address"
            iconName={faLocationDot}
            placeholder="1A Queen, New York, USA"
            value={formData.address}
            onChangeText={(text) => {
              handleInputChange('address', text);
              if (addressError) setAddressError('');
            }}
            errorText={addressError} 
          />

          <PrimaryButton 
            title="Confirm" 
            onPress={handleConfirm}
            style={styles.confirmButton}
          />
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
    flex: 1,
    paddingHorizontal: theme.SIZES.padding,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 40,
    lineHeight: 48,
  },
  subtitle: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    marginBottom: theme.SIZES.padding * 2,
  },
  confirmButton: {
    marginTop: theme.SIZES.padding,
    marginBottom: 10,
  }
});

export default InfoInputScreen;
