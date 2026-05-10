import React from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Marker } from 'react-native-maps';
import AppMap from '../../components/booking/AppMap'; 

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext'
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faCar } from '@fortawesome/free-solid-svg-icons';

const SearchingDriverScreen = ({ navigation }: any) => {
  const userLocation = {
    latitude: 10.762622,
    longitude: 106.660172,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  };

  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <AppMap initialRegion={userLocation}>
        {/* Điểm này sẽ đánh dấu chính xác giữa bản đồ trống */}
        <Marker coordinate={userLocation} anchor={{ x: 0.5, y: 0.5 }}>
          <View style={styles.userMarkerWrapper}>
            <Image 
              source={{ uri: 'https://i.pravatar.cc/150?u=user' }}
              style={styles.userAvatar} 
            />
          </View>
        </Marker>
      </AppMap>

      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
        </TouchableOpacity>
        <View style={styles.headerTextWrapper}>
          <Text style={styles.title}>Searching for Driver</Text>
        </View>
      </View>

      <View style={styles.searchingStatusWrapper}>
         <View style={styles.taxiIconBubble}>
           <FontAwesomeIcon icon={faCar} size={20} color='black'/>
         </View>
         <Text style={styles.statusTitle}>Searching Ride...</Text>
         <Text style={[ styles.statusSubTitle, {color: colors.textTitle} ]}>This may take a few seconds...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'white' 
  },
  header: { 
    position: 'absolute', 
    top: 50, 
    left: 20, 
    right: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    zIndex: 10 
  },
  backButton: { 
    padding: 8 
  },
  headerTextWrapper: { 
    flex: 1, 
    marginLeft: 10 
  },
  title: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: 'black' 
  },
  searchingStatusWrapper: { 
    position: 'absolute', 
    top: 120, 
    width: '100%', 
    alignItems: 'center' 
  },
  taxiIconBubble: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    backgroundColor: theme.COLORS.primary, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 10 
  },
  statusTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    marginBottom: 5 
  },
  statusSubTitle: { 
    fontSize: 14, 
  },
  userMarkerWrapper: { 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    borderWidth: 4, 
    borderColor: 'rgba(251, 191, 36, 0.3)', 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'white' 
  },
  userAvatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25 
  },
});

export default SearchingDriverScreen;