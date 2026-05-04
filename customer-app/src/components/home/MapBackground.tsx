import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../constants/ThemeContext';
import theme from '../../constants/theme';

const MapBackground = () => {
  const { colors } = useTheme();

  return (
    <View style={[StyleSheet.absoluteFillObject, styles.container, {backgroundColor: colors.background}]}>
      <Text style={{ fontFamily: theme.FONTS.bold, color: colors.textTitle, fontSize: theme.SIZES.h2 }}>
        Map Placeholder
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default MapBackground;