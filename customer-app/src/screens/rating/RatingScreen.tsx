import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBookingHistory } from '../../contexts/BookingHistoryContext';
import { CommonActions } from '@react-navigation/native';
import { useLocation } from '../../contexts/LocationContext';
import Hyperlink from '../../components/common/Hyperlink';
import PrimaryButton from '../../components/common/PrimaryButton';
import CustomSwipeRating from '../../components/rating/CustomSwipeRating';

const RatingScreen = ({ navigation, route }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { trips, updateTripRating } = useBookingHistory();
  const { setFromLocation, setDestinationLocation } = useLocation();
  
  const { tripId } = route.params || {};
  const tripData = trips.find(t => t.id === tripId);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  if (!tripData) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background,  }]}>
        <Text style={{ color: colors.textTitle }}>Trip not found</Text>
        <TouchableOpacity onPress={() => navigation.navigate('MainTabs')}>
          { /* eslint-disable-next-line react-native/no-inline-styles */ }
          <Text style={{ color: theme.COLORS.primary, marginTop: 10 }}>Go Back Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleSubmit = () => {
    if (rating > 0) {
      updateTripRating(tripId, rating, comment);
      finishAndGoHome();
    }
  };

  const handleMaybeLater = () => {
    finishAndGoHome();
  };

  const finishAndGoHome = () => {
    setFromLocation(null);
    setDestinationLocation(null);
    
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'MainTabs' }],
      })
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.headerWrapper}>
          <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Rate your Trip</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 1. Card thông tin chuyến đi & Tài xế */}
        <View style={[styles.tripCard, { backgroundColor: colors.background }]}>
          <Image source={{ uri: tripData.driver.avatar }} style={styles.driverAvatar} />
          <Text style={[styles.driverName, { color: colors.textTitle }]}>{tripData.driver.name}</Text>
          <Text style={[styles.carInfo, { color: colors.textBody }]}>
            {/* eslint-disable-next-line react-native/no-inline-styles */}
            {tripData.driver.carModel} • <Text style={{fontWeight: 'bold'}}>{tripData.driver.plateNumber}</Text>
          </Text>
          
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          
          <View style={styles.locationRow}>
            <Text style={[styles.timeText, { color: colors.textBody }]}>{tripData.completionTime}</Text>
            <Text style={[styles.locationText, { color: colors.textTitle }]} numberOfLines={2}>
               {tripData.fromLocation.name} {"\n"}→ {tripData.destinationLocation.name}
            </Text>
          </View>
        </View>

        {/* 2. Phần chọn Sao */}
        <View style={styles.ratingSection}>
          <Text style={[styles.sectionLabel, { color: colors.textTitle }]}>How was your driver?</Text>
          <CustomSwipeRating 
            rating={rating} 
            onRatingChange={setRating} 
            starSize={42} 
          />
        </View>

        {/* 3. Ô nhập Feedback */}
        <View style={styles.feedbackSection}>
          <Text style={[styles.sectionLabel, { color: colors.textTitle }]}>Write a comment (optional)</Text>
          <TextInput
            style={[styles.input, { 
              backgroundColor: colors.inputBg, 
              color: colors.textTitle, 
              borderColor: colors.border 
            }]}
            placeholder="Tell us about your experience..."
            placeholderTextColor={colors.textBody}
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />
        </View>

        <PrimaryButton 
          title="Submit Rating" 
          onPress={handleSubmit}
          disabled={rating === 0}
          style={styles.submitButton}
        />
        
        <Hyperlink 
          title="Maybe Later" 
          onPress={handleMaybeLater}
          style={styles.maybeLaterLink}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center'
  },
  headerWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
    paddingVertical: 15,
  },
  headerTitle: { 
    fontSize: 22, 
    fontFamily: theme.FONTS.bold 
  },
  maybeLaterText: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 15 
  },
  scrollContent: { 
    paddingHorizontal: theme.SIZES.padding, 
    paddingBottom: 60
  },
  tripCard: {
    width: '100%',
    padding: 20,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: 30,
    borderColor: theme.COLORS.primary,
    borderWidth: 2,
    ...theme.SHADOWS.light,
  },
  driverAvatar: { 
    width: 90, 
    height: 90, 
    borderRadius: 45, 
    marginBottom: 15 
  },
  driverName: { 
    fontSize: 20, 
    fontFamily: theme.FONTS.bold, 
    marginBottom: 5 
  },
  carInfo: { 
    fontSize: 14, 
    fontFamily: theme.FONTS.medium, 
    marginBottom: 10 
  },
  divider: { 
    height: 1, 
    width: '100%',
     marginVertical: 15 
    },
  locationRow: { 
    width: '100%', 
    alignItems: 'center' 
  },
  timeText: { 
    fontSize: 12, 
    fontFamily: theme.FONTS.regular, 
    marginBottom: 8 
  },
  locationText: { 
    fontSize: 14, 
    fontFamily: theme.FONTS.semiBold, 
    textAlign: 'center', 
    lineHeight: 20 
  },
  ratingSection: { 
    width: '100%', 
    alignItems: 'center', 
    marginBottom: 30 
  },
  sectionLabel: { 
    fontSize: 16, 
    fontFamily: theme.FONTS.bold, 
    marginBottom: 15 
  },
  ratingText: { 
    marginTop: 10, 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: theme.COLORS.primary 
  },
  feedbackSection: { 
    width: '100%', 
    marginBottom: 20 
  },
  input: {
    width: '100%',
    borderRadius: 16,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    fontFamily: theme.FONTS.regular,
  },
  footer: { 
    paddingHorizontal: theme.SIZES.padding,
  },
  submitButton: {
    paddingHorizontal: theme.SIZES.padding
  },
  maybeLaterLink: {
    marginTop: 20, 
    alignSelf: 'center', 
  },
});

export default RatingScreen;