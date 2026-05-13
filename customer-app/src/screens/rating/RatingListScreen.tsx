import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useBookingHistory } from '../../contexts/BookingHistoryContext';
import RatingCard from '../../components/rating/RatingCard';

const RatingListScreen = () => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { trips } = useBookingHistory();

  const unratedTrips = trips.filter(trip => trip.rating === null);

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Pending Ratings</Text>
      </View>

      {unratedTrips.length > 0 ? (
        <FlatList
          data={unratedTrips}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: Math.max(insets.bottom, 20) }]}
          renderItem={({ item }) => (
            <RatingCard 
              trip={item} 
              onPress={() => navigation.navigate('Rating', { tripId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Image 
            source={require('../../assets/images/no_locations_found.png')} 
            style={styles.emptyImage}
            resizeMode="contain"
          />
          <Text style={[styles.emptyTitle, { color: colors.textTitle }]}>All Caught Up!</Text>
          <Text style={[styles.emptyText, { color: colors.textBody }]}>
            You have no pending trips to rate.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 15,
  },
  backButton: { 
    padding: 5 
  },
  headerTitle: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 20 
  },
  listContent: { 
    paddingHorizontal: theme.SIZES.padding, 
    paddingTop: 10 
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
    marginTop: -50,
  },
  emptyImage: { 
    width: 200, 
    height: 200, 
    marginBottom: 20 
  },
  emptyTitle: { 
    fontFamily: theme.FONTS.bold, 
    fontSize: 22, 
    marginBottom: 10 
  },
  emptyText: { 
    fontFamily: theme.FONTS.regular, 
    fontSize: 16, 
    textAlign: 'center' 
  },
});

export default RatingListScreen;