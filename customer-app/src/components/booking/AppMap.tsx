import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import MapView, { Region } from 'react-native-maps'; 

interface AppMapProps {
  initialRegion: Region;
  children?: React.ReactNode;
  style?: ViewStyle;
  onRegionChangeComplete?: (region: Region) => void;
}

const AppMap = ({ initialRegion, children, style, onRegionChangeComplete }: AppMapProps) => {
  return (
    <View style={[styles.container, style]}>
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={false} 
        onRegionChangeComplete={onRegionChangeComplete}
      >
        {children}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default memo(AppMap);