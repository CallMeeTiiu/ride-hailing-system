import React, { useEffect, useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView
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
    { id: '1', name: 'Grand Indonesia Mall', address: 'Jl. M.H. Thamrin No.1' },
    { id: '2', name: 'Soekarno-Hatta Airport', address: 'Tangerang City, Banten' },
    { id: '3', name: 'Central Park', address: 'Letjen S. Parman St' },
    { id: '4', name: 'Times Square', address: 'Manhattan, NY 10036, USA' },
    { id: '5', name: 'Empire State Building', address: '20 W 34th St., New York' },
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
            {searchText.length > 0 ? (
              <Text style={[styles.sectionTitle, { color: colors.textTitle }]}>
                {/*eslint-disable-next-line react-native/no-inline-styles*/}
                Result for <Text style={{ color: theme.COLORS.primary, fontWeight: 'bold' }}>"{searchText}"</Text>
              </Text>
            ) : (
              <Text style={[styles.sectionTitle, { color: colors.textBody }]}>Recent Places</Text>
            )}

            {filteredLocations.map((item) => (
              <TouchableOpacity key={item.id} style={[styles.locationItem, { borderBottomColor: colors.border }]}>
                <View style={styles.iconCircle}>
                  <FontAwesomeIcon 
                    icon={searchText.length > 0 ? faMapMarkerAlt : faClock} 
                    size={16} 
                    color={colors.textBody} 
                  />
                </View>
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationName, { color: colors.textTitle }]}>{item.name}</Text>
                  <Text style={[styles.locationAddress, { color: colors.textBody }]} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}

            {filteredLocations.length === 0 && (
              <View style={styles.notFoundBox}>
                 <Text style={{ fontFamily: theme.FONTS.regular, color: colors.textBody }}>No locations found.</Text>
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
    backgroundColor: 'rgba(0,0,0,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  notFoundBox: {
    alignItems: 'center', 
    marginTop: 30
  }
});

export default SearchBottomSheet;