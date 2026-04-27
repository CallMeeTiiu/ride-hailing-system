import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import { COLORS, FONTS, SIZES } from '../../constants/theme';

interface HyperlinkProps extends TouchableOpacityProps {
  title: string;
}

const Hyperlink: React.FC<HyperlinkProps> = ({ title, style, ...props }) => {
  return (
    <TouchableOpacity {...props}>
      <Text style={[styles.linkText, style]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    fontFamily: FONTS.semiBold,
    fontSize: SIZES.body2,
    color: COLORS.primary, 
  }
});

export default Hyperlink;