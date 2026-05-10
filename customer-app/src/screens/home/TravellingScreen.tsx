import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import AppMap from '../../components/home/AppMap';
import UserMarker from '../../components/booking/UserMarker';
import DriverBottomCard, { DriverData } from '../../components/booking/DriverBottomCard';
import MessagePopup from '../../components/common/MessagePopup';
import { useTheme } from '../../contexts/ThemeContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const mockDriverData: DriverData = {
  name: "Daniel Austin",
  carModel: "Mercedes-Benz E-Class",
  plateNumber: "HSW 4736 XK",
  rating: 4.8,
  avatar: "https://i.pravatar.cc/150?u=daniel",
};

const TravellingScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  
  // Quản lý trạng thái chuyến đi
  const [tripStatus, setTripStatus] = useState<'waiting' | 'traveling'>('waiting');
  const [showArrivalPopup, setShowArrivalPopup] = useState(false);

  // Giả lập sự kiện tài xế đến nơi sau 5 giây
  useEffect(() => {
    if (tripStatus === 'waiting') {
      const timer = setTimeout(() => {
        setShowArrivalPopup(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [tripStatus]);

  // Xử lý khi khách hàng bấm OK trên popup
  const handleAcknowledgeArrival = () => {
    setShowArrivalPopup(false);
    setTripStatus('traveling'); // Chuyển trạng thái UI sang Traveling
  };

  return (
    <View style={styles.container}>
      <AppMap>
        {/* Nút Back Floating (Nằm trên bản đồ, theo đúng design của bạn) */}
        <TouchableOpacity 
          style={[
            styles.floatingBackButton, 
            { backgroundColor: colors.circleButtonBg, top: insets.top + 20 }
          ]}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faChevronLeft} size={20} color={colors.textTitle} />
        </TouchableOpacity>

        {/* Marker Tài xế (Sau này sẽ truyền tọa độ động vào đây) */}
        <UserMarker 
          avatar={mockDriverData.avatar} 
          rotation="135deg" 
          style={{ transform: [{ translateX: 0 }, { translateY: -60 }] }} 
        />
        
        {/* Marker Điểm đến/Điểm đi giả lập (Chờ ghép API Route) */}
        <View style={[styles.locationPin, { transform: [{ translateX: 80 }, { translateY: 40 }] }]} /> 
      </AppMap>

      {/* Card thông tin ở dưới cùng tự động thay đổi theo tripStatus */}
      <View style={[ styles.bottomContainer, { paddingBottom: Math.max(insets.bottom, 20) } ]}>
        <DriverBottomCard 
          tripStatus={tripStatus}
          driverData={mockDriverData}
          distance="4.5"
          arrivalTime="2 mins"
          onCancel={() => navigation.goBack()}
          onChat={() => console.log("Chat with driver")}
          onCall={() => console.log("Call driver")}
        />
      </View>

      {/* Popup thông báo tài xế đã đến đón */}
      <MessagePopup 
        visible={showArrivalPopup}
        title="Driver is Arriving!"
        context="Your driver is almost at your pickup location. Please be ready!"
        onClose={handleAcknowledgeArrival}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  floatingBackButton: {
    position: 'absolute',
    left: theme.SIZES.padding,
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    ...theme.SHADOWS.light,
  },
  locationPin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.COLORS.primary, 
    borderWidth: 3,
    borderColor: '#fff',
    ...theme.SHADOWS.light,
  }
});

export default TravellingScreen;