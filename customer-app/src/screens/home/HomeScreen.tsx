import React, { useState } from 'react';
// import { View, StyleSheet } from 'react-native';
import { View, StyleSheet, TouchableOpacity, Text, SafeAreaView } from 'react-native'; // Thêm một vài thẻ cơ bản

import MapBackground from '../../components/home/MapBackground';
import BottomSearchBoard from '../../components/home/BottomSearchBoard';

import EnableLocationPopup from '../../components/common/EnableLocationPopup';
import MessagePopup from '../../components/common/MessagePopup';

// const HomeScreen = () => {
//   return (
//     <View style={styles.container}>
//       <MapBackground />
//       <BottomSearchBoard />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'flex-end', 
//   }
// });

const HomeScreen = () => {
  // 1. Khai báo 2 state để bật/tắt popup
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMessagePopup, setShowMessagePopup] = useState(false);

  return (
    <View style={styles.container}>
      <MapBackground />

      {/* --- ĐOẠN NÚT TEST TẠM THỜI (SAU NÀY SẼ XÓA) --- */}
      <SafeAreaView style={styles.testButtonsContainer}>
        <TouchableOpacity style={styles.testButton} onPress={() => setShowLocationPopup(true)}>
          <Text style={styles.testButtonText}>Test Location Popup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.testButton} onPress={() => setShowMessagePopup(true)}>
          <Text style={styles.testButtonText}>Test Message Popup</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {/* --------------------------------------------- */}

      <BottomSearchBoard />

      {/* --- NHÚNG 2 POPUP VÀO ĐÂY --- */}
      <EnableLocationPopup 
        visible={showLocationPopup}
        onEnable={() => {
          console.log("Đã bấm Enable Location");
          setShowLocationPopup(false);
        }}
        onCancel={() => setShowLocationPopup(false)}
      />

      <MessagePopup 
        visible={showMessagePopup}
        title="You have arrived at your destination!"
        context="See you on the next trip :)"
        onClose={() => setShowMessagePopup(false)}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', 
  },
  // Style cho 2 nút test tạm thời
  testButtonsContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 999, // Đẩy lên lớp trên cùng để không bị che
    gap: 10,
  },
  testButton: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  testButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});

export default HomeScreen;