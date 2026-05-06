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
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext'

interface CustomInputProps extends TextInputProps {
  label?: string;
  iconName?: any; 
  isPassword?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ label, iconName, isPassword = false, style, ...props }) => {
  const [isSecure, setIsSecure] = useState(isPassword);
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      {/* Chỉ hiển thị Label nếu có truyền vào */}
      {label && <Text style={[ styles.label, {color: colors.textTitle} ]}>{label}</Text>}
      
      <View style={[styles.inputContainer, style]}>
        {/* Icon bên trái (Ví dụ: faEnvelope, faLock) */}
        {iconName && (
          <View style={styles.leftIcon}>
            <FontAwesomeIcon 
              icon={iconName} 
              size={20} 
              style={{ color: colors.textIcon }} 
            />
          </View>
        )}
        
        {/* Ô nhập liệu */}
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textBody}
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
              style={{ color: colors.textIcon }} 
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.SIZES.padding,
    width: '100%',
  },
  label: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 56,
    backgroundColor: '#FAFAFA', 
    borderRadius: theme.SIZES.radiusInput || 12,
    paddingHorizontal: 15,
  },
  leftIcon: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
    color: 'black',
    height: '100%', 
  },
  rightIcon: {
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default CustomInput;