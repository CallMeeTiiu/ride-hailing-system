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
import { COLORS, SIZES, FONTS } from '../../constants/theme';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../App';

import { useRoute, RouteProp } from '@react-navigation/native';

import CustomInput from '../../components/common/CustomInput';
import PrimaryButton from '../../components/common/PrimaryButton';

import { faUser, faEnvelope, faPhone, faLocationDot } from '@fortawesome/free-solid-svg-icons';

const InfoInputScreen = () => {
  const route = useRoute<RouteProp<RootStackParamList, 'InfoInput'>>();
  const receivedName = route.params?.userName || "Friend";

  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  const [formData, setFormData] = useState({
    userName: receivedName, 
    email: 'andrew_ainsley@yourdomain.com',
    phoneNumber: '',
    address: ''
  });

  const handleInputChange = (key: string, value: string) => {
    setFormData({
      ...formData,
      [key]: value
    });
  };

  const handleConfirm = () => {
    console.log("Data is ready to send to BackEnd:", formData);
    navigation.replace('Home')
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>
            Hello{"\n"}{formData.userName || "Friend"}!
          </Text>

          <Text style={styles.subtitle}>
            Please tell us more about you!
          </Text>

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
            onChangeText={(text) => handleInputChange('email', text)}
          />

          <CustomInput 
            label="Phone Number"
            iconName={faPhone}
            placeholder="+123456789"
            keyboardType="phone-pad"
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
          />

          <CustomInput 
            label="Address"
            iconName={faLocationDot}
            placeholder="1A Queen, New York, USA"
            onChangeText={(text) => handleInputChange('address', text)}
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
    flex: 1,
    paddingHorizontal: SIZES.padding,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 40, 
    color: COLORS.textTitle,
    lineHeight: 48,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 16,
    color: COLORS.textTitle,
    marginBottom: SIZES.padding * 2,
  },
  confirmButton: {
    marginTop: SIZES.padding,
    marginBottom: 10,
  }
});

export default InfoInputScreen;
