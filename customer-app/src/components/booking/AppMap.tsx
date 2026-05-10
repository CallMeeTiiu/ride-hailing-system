import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface AppMapProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

const AppMap = ({ children, style }: AppMapProps) => {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, style, { backgroundColor: colors.inputBg }]}>
      {/*  Markers (User, Driver, Radar)*/}
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default memo(AppMap);