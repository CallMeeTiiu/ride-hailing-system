import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  onPress: () => void;
  style?: any;
  disabled?: boolean;
  isLoading?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, onPress, style, disabled = false, isLoading = false, ...props }) => {
  const { colors } = useTheme();
  const buttonBgColor = disabled ? colors.border : theme.COLORS.primary;
  const isInteractionDisabled = disabled || isLoading;
  return (
    <TouchableOpacity 
      style={[styles.button, 
        !isInteractionDisabled && styles.glow, 
        { backgroundColor: buttonBgColor }, 
        style
      ]} 
      activeOpacity={disabled ? 1 : 0.2}
      onPress={disabled ? undefined : onPress}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={colors.textBtn} size="small" />
      ) : (
        <Text style={[ styles.buttonText, { color: disabled ? colors.textTitle : colors.textBtn } ]}>
          {title}
        </Text>
      )}
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
  },
  glow: {
    ...theme.SHADOWS.primaryGlow
  }
});

export default PrimaryButton;