import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faEnvelope, faChevronDown, faChevronUp, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import CalendarPicker from '../../components/profile/CalendarPicker';
import CustomInput from '../../components/common/CustomInput';

const EditProfileScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { profile, updateProfile } = useUser();

  const [formData, setFormData] = useState({
    name: profile?.name || '',
    dob: profile?.dob || '',
    email: profile?.email || '',
    phoneNumber: profile?.phone_number || '',
    gender: profile?.gender || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [emailError, setEmailError] = useState<string>('');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const genderOptions = ['Male', 'Female', 'Other', 'Secret'];

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        dob: profile.dob || '',
        email: profile.email || '',
        phoneNumber: profile.phone_number || '',
        gender: profile.gender || '',
      });
    }
  }, [profile]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'email' && emailError) {
      setEmailError('');
    }
  };

  const handleUpdate = async () => {
    if (formData.email && !emailRegex.test(formData.email)) {
      setEmailError('Invalid email format (e.g., user@domain.com)');
      return;
    }
    try {
      const payload: any = {
        name: formData.name,
        dob: formData.dob === '' ? null : formData.dob,
        email: formData.email,
        gender: formData.gender,
      };

      await updateProfile(payload);

      Alert.alert("Success", "Your information has been updated!");
      navigation.goBack();
    } catch (error) {
      console.log("Error updating profile:", error);
      Alert.alert("Failed", "An error occurred while saving information. Please try again!");
    }
  };

  return (
    <KeyboardAvoidingView 
      // eslint-disable-next-line react-native/no-inline-styles
      style={{ flex: 1 }} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 10 }]}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Edit Profile</Text>
          {/* eslint-disable-next-line react-native/no-inline-styles */} 
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
            
          <CustomInput 
            placeholder="Phone Number"
            iconName={faPhone}
            keyboardType="phone-pad"
            value={formData.phoneNumber}
            editable={false}
          />
          
          <CustomInput 
            placeholder="Full Name"
            iconName={faUser}
            value={formData.name}
            onChangeText={(text) => handleChange('name', text)}
            style={{ backgroundColor: colors.inputBg }}
          />

          <CustomInput 
            placeholder="Email"
            iconName={faEnvelope}
            keyboardType="email-address"
            value={formData.email}
            onChangeText={(text) => handleChange('email', text)}
            style={{ backgroundColor: colors.inputBg }}
            errorText={emailError}
          />

          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowDatePicker(true)}>
            <View pointerEvents="none">
              <CustomInput 
                placeholder="Select Date of Birth"
                iconName={faCalendar}
                value={formData.dob}
                editable={false}
                style={{ backgroundColor: colors.inputBg }}
              />
            </View>
          </TouchableOpacity>
          
          <View style={styles.floating}>
            <TouchableOpacity activeOpacity={0.7} onPress={() => setShowGenderPicker(!showGenderPicker)}>
              <View pointerEvents="none">
                <CustomInput 
                  placeholder="Select Gender"
                  iconName={showGenderPicker ? faChevronUp : faChevronDown}
                  value={formData.gender}
                  editable={false}
                  // eslint-disable-next-line react-native/no-inline-styles
                  style={{ 
                    backgroundColor: colors.inputBg, 
                    marginBottom: showGenderPicker ? 10 : 20 
                  }}
                />
              </View>
            </TouchableOpacity>

            {showGenderPicker && (
              <View style={[styles.dropdownContainer, { backgroundColor: colors.white, borderColor: colors.primary }]}>
                {genderOptions.map((option, index) => (
                  <TouchableOpacity 
                    key={index}
                    style={styles.dropdownItem}
                    onPress={() => {
                      handleChange('gender', option);
                      setShowGenderPicker(false); 
                    }}
                  >
                    <Text style={[styles.dropdownText, { color: formData.gender === option ? theme.COLORS.primary : colors.textTitle }]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

        </ScrollView>

        <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}>
          <PrimaryButton title="Update" onPress={handleUpdate} />
        </View>

        <CalendarPicker 
            visible={showDatePicker}
            selectedDate={formData.dob}
            onClose={() => setShowDatePicker(false)}
            onSelectDate={(date: string) => handleChange('dob', date)}
        />
      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    paddingHorizontal: theme.SIZES.padding, 
    marginBottom: 20,
  },
  backButton: { 
    padding: 10, 
    marginLeft: -10 
  },
  headerTitle: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 22 
  },
  formContainer: { 
    paddingHorizontal: theme.SIZES.padding, 
    paddingTop: 20,
    paddingBottom: 20 
  },
  floating: {
    zIndex: 10,
  },
  footer: { 
    paddingHorizontal: theme.SIZES.padding, 
    paddingTop: 10,
    marginBottom: 20,
  },
  dropdownContainer: {
    marginTop: -10, 
    marginBottom: 20,
    borderRadius: 16, 
    borderWidth: 1,
    overflow: 'hidden', 
    ...theme.SHADOWS.light,
  },
  dropdownItem: { 
    paddingVertical: 15, 
    paddingHorizontal: 20, 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#E0E0E0' 
  },
  dropdownText: { 
    fontFamily: theme.FONTS.semiBold, 
    fontSize: 16 
  },
});

export default EditProfileScreen;