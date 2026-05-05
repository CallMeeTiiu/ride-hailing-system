import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, style, ...props }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: colors.primary}, style]} 
      {...props}
    >
      <Text style={[ styles.buttonText, { color: colors.textBtn } ]}>{title}</Text>
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
    ...theme.SHADOWS.primaryGlow, 
  },
  buttonText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: theme.SIZES.body1,
  }
});

export default PrimaryButton;