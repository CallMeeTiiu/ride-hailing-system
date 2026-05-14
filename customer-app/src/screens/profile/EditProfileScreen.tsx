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
  Modal,
  TouchableWithoutFeedback
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCalendar, faEnvelope, faChevronDown } from '@fortawesome/free-solid-svg-icons';
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

  const renderInput = (placeholder: string, field: keyof typeof formData, icon?: any, keyboardType: any = 'default') => (
    <View style={[styles.inputContainer, { backgroundColor: colors.inputBg }]}>
      <TextInput
        style={[styles.input, { color: colors.textTitle }]}
        placeholder={placeholder}
        placeholderTextColor={colors.textBody}
        value={formData[field]}
        onChangeText={(text) => handleChange(field, text)}
        keyboardType={keyboardType}
      />
      {icon && (
        <FontAwesomeIcon icon={icon} size={20} color={colors.textTitle} style={styles.inputIcon} />
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView 
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
          <View style={{ width: 40 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.formContainer}>
          
          {renderInput('Full Name', 'name')}

          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: colors.inputBg }]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.inputLabel}>{formData.dob || 'Select Date of Birth'}</Text>
            <FontAwesomeIcon icon={faCalendar} size={20} color={colors.textTitle} />
          </TouchableOpacity>

          {renderInput('Email', 'email', faEnvelope, 'email-address')}
          {renderInput('Country', 'country')}
          {renderInput('Phone Number', 'phoneNumber', undefined, 'phone-pad')}
          
          {/* GENDER COMBOBOX (Nút bấm mở Modal) */}
          <TouchableOpacity 
            style={[styles.inputContainer, { backgroundColor: colors.inputBg }]}
            activeOpacity={0.7}
            onPress={() => setShowGenderPicker(true)}
          >
            <Text style={[styles.inputLabel, { color: formData.gender ? colors.textTitle : colors.textBody }]}>
              {formData.gender || 'Select Gender'}
            </Text>
            <FontAwesomeIcon icon={faChevronDown} size={16} color={colors.textTitle} style={styles.inputIcon} />
          </TouchableOpacity>

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

      {/* --- MODAL CHỌN GIỚI TÍNH --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showGenderPicker}
        onRequestClose={() => setShowGenderPicker(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowGenderPicker(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={[styles.sheetContainer, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
          <View style={styles.handleIndicator} />
          <Text style={[styles.sheetTitle, { color: colors.textTitle }]}>Select Gender</Text>
          
          {genderOptions.map((option, index) => {
            const isSelected = formData.gender === option;
            return (
              <TouchableOpacity 
                key={index}
                style={[styles.optionItem, isSelected && { backgroundColor: colors.primaryLight }]}
                onPress={() => {
                  handleChange('gender', option);
                  setShowGenderPicker(false);
                }}
              >
                <Text style={[
                  styles.optionText, 
                  { color: isSelected ? theme.COLORS.primary : colors.textTitle },
                  isSelected && { fontFamily: theme.FONTS.bold }
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            )
          })}
        </View>
      </Modal>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
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
});

export default EditProfileScreen;