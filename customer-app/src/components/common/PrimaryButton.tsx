import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, style, disabled, ...props }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.button, {backgroundColor: disabled ? colors.border : [theme.COLORS.primary, theme.SHADOWS.primaryGlow]}, style]} 
      activeOpacity={disabled ? 1 : 0.3}
      onPress={disabled ? undefined : onPress}
      {...props}
    >
      <Text style={[ styles.buttonText, { color: disabled ? colors.textTitle : colors.textBtn } ]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    borderRadius: theme.SIZES.radiusButton,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: theme.SIZES.body1,
  }
});

export default PrimaryButton;