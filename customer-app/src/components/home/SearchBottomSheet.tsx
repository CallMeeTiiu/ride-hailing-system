import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Image
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faArrowLeft, faClock, faMagnifyingGlass, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import theme from '../../constants/theme';
import { useTheme } from '../../constants/ThemeContext';

interface SearchBottomSheetProps {
  visible: boolean;
  onClose: () => void;
}

const SearchBottomSheet: React.FC<SearchBottomSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!visible) {
      setSearchText('');
      setIsFocused(false);
    }
  }, [visible]);

  const locationsData = [
    { id: '1', name: 'Grand Indonesia Mall', address: 'Jl. M.H. Thamrin No.1', distance: '1.2 km' },
    { id: '2', name: 'Soekarno-Hatta Airport', address: 'Tangerang City, Banten', distance: '15.5 km' },
    { id: '3', name: 'Central Park', address: 'Letjen S. Parman St', distance: '4.8 km' },
    { id: '4', name: 'Times Square', address: 'Manhattan, NY 10036, USA', distance: '8.3 km' },
    { id: '5', name: 'Empire State Building', address: '20 W 34th St., New York', distance: '9.1 km' },
  ];

  const filteredLocations = locationsData.filter(loc => 
    loc.name.toLowerCase().includes(searchText.toLowerCase()) || 
    loc.address.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true} 
      onRequestClose={onClose} 
    >
      <View style={styles.overlay}>
        <TouchableOpacity style={styles.dismissArea} activeOpacity={1} onPress={onClose} />

        <View style={[styles.sheetContainer, { backgroundColor: colors.background, paddingBottom: insets.bottom }]}>
          <View style={styles.header}>
            <View style={styles.handleBar} />
            <View style={styles.headerRow}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
              </TouchableOpacity>
              <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Select Destination</Text>
              <View style={styles.spacer} />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <View style={[
                styles.searchBox, 
                // eslint-disable-next-line react-native/no-inline-styles
                { 
                    backgroundColor: isFocused ? colors.backgroundLight : colors.inputBg,
                    borderColor: isFocused ? theme.COLORS.primary : 'transparent',
                }]}>
              <FontAwesomeIcon icon={faMagnifyingGlass} size={18} color={theme.COLORS.primary} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: colors.textTitle }]}
                placeholder="Where would you go?"
                placeholderTextColor={colors.textBody}
                autoFocus={true}
                value={searchText}
                onChangeText={setSearchText} 
                onFocus={() => setIsFocused(true)} 
                onBlur={() => setIsFocused(false)} 
              />
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
            <View style={styles.sectionHeaderRow}>
              {searchText.length > 0 ? (
                <Text style={[styles.sectionTitle, { color: colors.textTitle }]}>
                  {/*eslint-disable-next-line react-native/no-inline-styles*/}
                  Result for <Text style={{ color: theme.COLORS.primary, fontWeight: 'bold' }}>"{searchText}"</Text>
                </Text>
              ) : (
                <Text style={[styles.sectionTitle, { color: colors.textBody }]}>Recent Places</Text>
              )}

              {searchText.length > 0 ? (
                <Text style={[styles.resultCount, { color: theme.COLORS.primary }]}>
                    {filteredLocations.length} {filteredLocations.length > 1 ? "founds" : "found"}
                </Text>
              ) : ("")}
            </View>

            {filteredLocations.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.locationItem, { borderBottomColor: colors.border }]}>
                {searchText.length > 0 ? (
                  <View style={[styles.outerCircle, {backgroundColor: colors.backgroundLight}]}>
                    <View style={styles.innerCircle}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} size={14} color={colors.textTitle} />
                    </View>
                  </View>
                ) : (
                  <View style={styles.iconCircle}>
                    <FontAwesomeIcon icon={faClock} size={16} color={colors.textBody} />
                  </View>
                )}

                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationName, { color: colors.textTitle }]}>{item.name}</Text>
                  <Text style={[styles.locationAddress, { color: colors.textBody }]} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>

                <Text style={[styles.locationDistance, { color: colors.textTitle }]}>{item.distance}</Text>
              </TouchableOpacity>
            ))}

            {filteredLocations.length === 0 && (
              <View style={styles.notFoundContainer}>
                <Image 
                  source={require('../../assets/images/no_locations_found.png')} 
                  style={styles.notFoundImage}
                  resizeMode="contain"
                />
                <Text style={[styles.notFoundTitle, { color: colors.textTitle }]}>Not Found</Text>
                <Text style={[styles.notFoundText, { color: colors.textBody }]}>
                  Sorry, the keyword you entered cannot be found, please check again or search with another keyword.
                </Text>
              </View>
            )}
          </ScrollView>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)', 
    justifyContent: 'flex-end', 
  },
  dismissArea: {
    flex: 1, 
  },
  sheetContainer: {
    height: '85%', 
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    ...theme.SHADOWS.primaryGlow,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 20,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    marginBottom: 15,
  },
  headerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 18,
  },
  spacer: {
    width: 20,
  },
  inputContainer: {
    paddingHorizontal: theme.SIZES.padding,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    height: '100%',
  },
  listContainer: {
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontFamily: theme.FONTS.medium,
    fontSize: 14,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  resultCount: {
    fontFamily: theme.FONTS.bold,
    fontSize: 14,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  outerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 176, 32, 0.2)', 
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  innerCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationTextContainer: {
    flex: 1,
  },
  locationName: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 16,
    marginBottom: 4,
  },
  locationAddress: {
    fontFamily: theme.FONTS.regular,
    fontSize: 13,
  },
  locationDistance: {
    fontFamily: theme.FONTS.bold,
    fontSize: 14,
    marginLeft: 10,
  },
  notFoundContainer: {
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
  },
  notFoundImage: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  notFoundTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 24,
    marginBottom: 15,
  },
  notFoundText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default SearchBottomSheet;