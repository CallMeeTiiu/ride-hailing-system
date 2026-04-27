import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity, 
  TextInputProps 
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { COLORS, SIZES, FONTS } from '../../constants/theme';

interface CustomInputProps extends TextInputProps {
  label?: string;
  iconName?: any; 
  isPassword?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, iconName, isPassword = false, style, ...props }) => {
  const [isSecure, setIsSecure] = useState(isPassword);

  return (
    <View style={styles.container}>
      {/* Chỉ hiển thị Label nếu có truyền vào */}
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[styles.inputContainer, style]}>
        {/* Icon bên trái (Ví dụ: faEnvelope, faLock) */}
        {iconName && (
          <View style={styles.leftIcon}>
            <FontAwesomeIcon 
              icon={iconName} 
              size={20} 
              style={{ color: COLORS.textIcon }} 
            />
          </View>
        )}
        
        {/* Ô nhập liệu */}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textBody}
          secureTextEntry={isSecure}
          {...props}
        />

        {/* Nút ẩn/hiện mật khẩu bên phải */}
        {isPassword && (
          <TouchableOpacity 
            onPress={() => setIsSecure(!isSecure)} 
            style={styles.rightIcon}
            activeOpacity={0.7}
          >
            <FontAwesomeIcon 
              icon={isSecure ? faEye : faEyeSlash} 
              size={20} 
              style={{ color: COLORS.textIcon }} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SIZES.padding,
    width: '100%',
  },
  label: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textTitle,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: '#FAFAFA', 
    borderRadius: SIZES.radiusInput || 12,
    paddingHorizontal: 15,
  },
  leftIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.black,
    height: '100%', 
  },
  rightIcon: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CustomInput;