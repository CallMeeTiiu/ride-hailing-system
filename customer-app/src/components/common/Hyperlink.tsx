import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext'

interface HyperlinkProps extends TouchableOpacityProps {
  title: string;
}

const Hyperlink: React.FC<HyperlinkProps> = ({ title, style, ...props }) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity {...props}>
      <Text style={[styles.linkText, { color: colors.primary }, style]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  linkText: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: theme.SIZES.body2,
  }
});

export default Hyperlink;