import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({ title, style, ...props }) => {
  return (
    <TouchableOpacity 
      style={[styles.button, style]} 
      {...props}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 56,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusButton,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.primaryGlow, 
  },
  buttonText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body1,
    color: COLORS.textTitle, 
  }
});

export default PrimaryButton;