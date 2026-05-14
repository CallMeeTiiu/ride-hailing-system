import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faEnvelope, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useUser } from '../../contexts/UserContext';
import PrimaryButton from '../../components/common/PrimaryButton';
import CalendarPicker from '../../components/profile/CalendarPicker';

const EditProfileScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, updateUser } = useUser();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    dob: user?.dob || '',
    email: user?.email || '',
    country: 'United States',
    phoneNumber: user?.phoneNumber || '',
    gender: user?.gender || '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const genderOptions = ['Male', 'Female', 'Other', 'Secret'];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdate = () => {
    updateUser({
      name: formData.name,
      dob: formData.dob,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      gender: formData.gender,
    });
    navigation.goBack();
  };

  const renderInput = (
    placeholder: string, 
    field: keyof typeof formData, 
    icon?: any, 
    keyboardType: any = 'default',
    editable: boolean = true
  ) => (
    // eslint-disable-next-line react-native/no-inline-styles
    <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, opacity: editable ? 1 : 0.6 }]}>
      {editable ? (
        <TextInput
          style={[styles.input, { color: colors.textTitle }]}
          placeholder={placeholder}
          placeholderTextColor={colors.textBody}
          value={formData[field]}
          onChangeText={(text) => handleChange(field, text)}
          keyboardType={keyboardType}
        />
      ) : (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text 
            style={[ styles.inputTail, {color: colors.textTitle} ]} 
            numberOfLines={1} 
            ellipsizeMode="tail"
          >
            {formData[field] || placeholder}
          </Text>
        </View>
      )}

      {icon && (
        <FontAwesomeIcon icon={icon} size={20} color={colors.textTitle} style={styles.inputIcon} />
      )}
    </View>
  );

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
            
          {renderInput('Email', 'email', faEnvelope, 'email-address', false)}
          {renderInput('Full Name', 'name')}

          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: colors.inputBg }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputLabel}>{formData.dob || 'Select Date of Birth'}</Text>
            <FontAwesomeIcon icon={faCalendar} size={20} color={colors.textTitle} />
          </TouchableOpacity>

          {renderInput('Country', 'country')}
          {renderInput('Phone Number', 'phoneNumber', undefined, 'phone-pad')}
          
          {/* GENDER COMBOBOX */}
          {/* eslint-disable-next-line react-native/no-inline-styles */}
          <View style={{ zIndex: 10 }}>
            <TouchableOpacity 
              // eslint-disable-next-line react-native/no-inline-styles
              style={[styles.inputContainer, { backgroundColor: colors.inputBg, marginBottom: showGenderPicker ? 10 : 20 }]}
              activeOpacity={0.7}
              onPress={() => setShowGenderPicker(!showGenderPicker)} 
            >
              <Text style={[styles.inputLabel, { color: formData.gender ? colors.textTitle : colors.textBody }]}>
                {formData.gender || 'Select Gender'}
              </Text>
              <FontAwesomeIcon icon={showGenderPicker ? faChevronUp : faChevronDown} size={16} color={colors.textTitle} style={styles.inputIcon} />
            </TouchableOpacity>

            {/* List Dropdown sổ xuống ngay bên dưới */}
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
  inputContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    borderRadius: theme.SIZES.radiusInput || 16,
    paddingHorizontal: 20, 
    height: 60, 
    marginBottom: 20,
  },
  input: { 
    flex: 1, 
    fontFamily: theme.FONTS.semiBold, 
    fontSize: 16, 
    height: '100%' 
  },
  inputTail: {
    fontFamily: theme.FONTS.semiBold, 
    fontSize: 16, 
    textAlignVertical: 'center' 
  },
  inputLabel: { 
    flex: 1, 
    fontFamily: theme.FONTS.semiBold, 
    fontSize: 16 
  },
  inputIcon: { 
    marginLeft: 10 
  },
  footer: { 
    paddingHorizontal: theme.SIZES.padding, 
    paddingTop: 10 
  },
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  sheetContainer: {
    position: 'absolute', bottom: 0, width: '100%',
    borderTopLeftRadius: 32, borderTopRightRadius: 32,
    paddingHorizontal: theme.SIZES.padding, paddingTop: 12,
    alignItems: 'center', ...theme.SHADOWS.light,
  },
  handleIndicator: { 
    width: 40, 
    height: 4, 
    backgroundColor: '#EEEEEE', 
    borderRadius: 2, 
    marginBottom: 20 
  },
  sheetTitle: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 20, 
    marginBottom: 20 
  },
  optionItem: {
    width: '100%', paddingVertical: 18, borderRadius: 16,
    alignItems: 'center', marginBottom: 8,
  },
  optionText: { 
    fontFamily: theme.FONTS.semiBold, 
    fontSize: 18 
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