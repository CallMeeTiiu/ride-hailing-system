import React, { forwardRef, memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MapBackground, { MapBackgroundRef } from './MapBackground';
interface AppMapProps {
  children?: React.ReactNode;
  style?: ViewStyle;
}

const AppMap = forwardRef<MapBackgroundRef, AppMapProps>(({ children, style }, ref) => {
  return (
    <View style={[styles.container, style]}>
      <MapBackground ref={ref} />
      {children}
    </View>
  );
});
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center', 
  },
});

export default memo(AppMap);