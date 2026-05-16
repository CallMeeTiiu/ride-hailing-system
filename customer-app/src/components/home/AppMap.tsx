import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MapBackground from './MapBackground';

interface AppMapProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

const AppMap = ({ children, style }: AppMapProps) => {

  return (
    <View style={[styles.container, style]}>
      <MapBackground />
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