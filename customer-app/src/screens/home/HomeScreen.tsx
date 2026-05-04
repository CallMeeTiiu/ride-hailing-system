import React from 'react';
import { View, StyleSheet } from 'react-native'; 

import MapBackground from '../../components/home/MapBackground';
import BottomSearchBoard from '../../components/home/BottomSearchBoard';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <MapBackground />
      <BottomSearchBoard />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
  }
});

export default HomeScreen;