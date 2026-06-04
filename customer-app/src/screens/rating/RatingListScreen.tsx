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

  const realUnratedTrips = trips.filter(trip => trip.rating === null);

  // const MOCK_UNRATED_TRIPS = [
  //   {
  //     id: 'mock_trip_1',
  //     driver: {
  //       name: 'Nguyễn Văn A',
  //       carModel: 'Honda Winner X',
  //       plateNumber: '59-S1 123.45',
  //       rating: 4.9,
  //       // Dùng ảnh chân dung thật để chắc chắn load được
  //       avatar: 'https://randomuser.me/api/portraits/men/32.jpg', 
  //       phone_number: '0901234567',
  //     },
  //     fromLocation: {
  //       name: 'Ký túc xá Khu A',
  //       address: 'ĐHQG TP.HCM, Phường Linh Trung, Thủ Đức',
  //       latitude: 10.8782,
  //       longitude: 106.8063,
  //     },
  //     destinationLocation: {
  //       name: 'Trường Đại học Công nghệ Thông tin (UIT)',
  //       address: 'Khu phố 6, Phường Linh Trung, Thủ Đức',
  //       latitude: 10.8700,
  //       longitude: 106.8031,
  //     },
  //     completionTime: 'Jun 4, 10:30 AM', 
  //     rating: null,
  //   },
  //   {
  //     id: 'mock_trip_2',
  //     driver: {
  //       name: 'Trần Thị B',
  //       carModel: 'Toyota Vios 4 Chỗ',
  //       plateNumber: '51G-987.65',
  //       rating: 4.8,
  //       // Dùng ảnh chân dung nữ
  //       avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  //       phone_number: '0987654321',
  //     },
  //     fromLocation: {
  //       name: 'Gigamall Phạm Văn Đồng',
  //       address: '240-242 Phạm Văn Đồng, Hiệp Bình Chánh, Thủ Đức',
  //       latitude: 10.8276,
  //       longitude: 106.7216,
  //     },
  //     destinationLocation: {
  //       name: 'Landmark 81',
  //       address: '720A Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh',
  //       latitude: 10.7946,
  //       longitude: 106.7226,
  //     },
  //     completionTime: 'Jun 3, 08:15 PM',
  //     rating: null,
  //   },
  //   {
  //     id: 'mock_trip_3',
  //     driver: {
  //       name: 'Lê Hoàng C',
  //       carModel: 'Kia Morning',
  //       plateNumber: '51H-112.33',
  //       rating: 5.0,
  //       // Dùng ảnh chân dung nam khác
  //       avatar: 'https://randomuser.me/api/portraits/men/46.jpg',
  //       phone_number: '0911223344',
  //     },
  //     fromLocation: {
  //       name: 'Sân bay Tân Sơn Nhất',
  //       address: 'Trường Sơn, Phường 2, Tân Bình',
  //       latitude: 10.8149,
  //       longitude: 106.6634,
  //     },
  //     destinationLocation: {
  //       name: 'Chợ Bến Thành',
  //       address: 'Lê Lợi, Phường Bến Thành, Quận 1',
  //       latitude: 10.7725,
  //       longitude: 106.6980,
  //     },
  //     completionTime: 'Jun 2, 02:45 PM',
  //     rating: null,
  //   }
  // ];

  // // 3. Nối mảng thật và mảng giả lại với nhau (đưa mock lên đầu để dễ thấy)
  // const unratedTrips = [...MOCK_UNRATED_TRIPS, ...realUnratedTrips];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 10 }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Pending Ratings</Text>
      </View>

      {realUnratedTrips.length > 0 ? (
        <FlatList
          data={realUnratedTrips}
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
            source={require('../../assets/images/welcome.png')} 
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