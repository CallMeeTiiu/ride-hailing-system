import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faLocationDot, 
  faCrosshairs, 
  faBookmark, 
  faChevronRight, 
  faClock 
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocation } from '../../contexts/LocationContext';
import { RootStackParamList } from '../../../App';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface SelectAddressSheetProps {
  visible: boolean;
  onClose: () => void;
}

const SelectAddressSheet: React.FC<SelectAddressSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const { allLocations, recentLocations } = useLocation();
  const displayData = recentLocations.length > 0 ? recentLocations : allLocations;

  const handleNavigateToSearch = () => {
    onClose();
    navigation.navigate('Search'); 
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableWithoutFeedback onPress={onClose}>
          <View style={styles.backgroundTouchable} />
        </TouchableWithoutFeedback>

        <View style={[styles.sheetContainer, { backgroundColor: colors.background }]}>
          
          <View style={styles.dragHandle} />

          <Text style={[styles.title, { color: colors.textTitle }]}>Select Address</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* --- KHU VỰC NHẬP TỪ ĐÂU - ĐẾN ĐÂU --- */}
          <View style={styles.routeSection}>
            {/* Cột chứa Icon và Đường nét đứt */}
            <View style={styles.iconColumn}>
              {/* Icon From tự custom (Vòng tròn kép) */}
              <View style={[styles.fromIconOuter, { borderColor: theme.COLORS.primary }]}>
                <View style={[styles.fromIconInner, { backgroundColor: theme.COLORS.primary }]} />
              </View>

              {/* Đường nét đứt nối 2 icon */}
              <View style={[styles.dashedLine, { borderColor: colors.textBody }]} />

              {/* Icon Destination */}
              <FontAwesomeIcon icon={faLocationDot} size={20} color={theme.COLORS.primary} />
            </View>

            {/* Cột chứa 2 ô Input giả */}
            <View style={styles.inputColumn}>
              <TouchableOpacity 
                style={[styles.inputBox, { backgroundColor: colors.inputBg }]}
                activeOpacity={0.8}
                onPress={handleNavigateToSearch}
              >
                <Text style={[styles.inputText, { color: colors.textBody }]}>From</Text>
                <FontAwesomeIcon icon={faCrosshairs} size={18} color={colors.textBody} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.inputBox, { backgroundColor: colors.inputBg }]}
                activeOpacity={0.8}
                onPress={handleNavigateToSearch}
              >
                <Text style={[styles.inputText, { color: colors.textBody }]}>Destination</Text>
                <FontAwesomeIcon icon={faLocationDot} size={18} color={colors.textBody} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* --- KHU VỰC SAVED PLACES --- */}
          <TouchableOpacity style={styles.savedPlacesRow} activeOpacity={0.7}>
            <View style={styles.savedPlacesLeft}>
              <FontAwesomeIcon icon={faBookmark} size={20} color={theme.COLORS.primary} />
              <Text style={[styles.savedPlacesText, { color: colors.textTitle }]}>Saved Places</Text>
            </View>
            <FontAwesomeIcon icon={faChevronRight} size={16} color={theme.COLORS.primary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* --- DANH SÁCH RECENT / SUGGESTED PLACES --- */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.listContainer}>
            {displayData.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.locationItem}
                activeOpacity={0.7}
              >
                <FontAwesomeIcon icon={faClock} size={18} color={colors.textBody} style={styles.clockIcon} />
                <View style={styles.locationTextContainer}>
                  <Text style={[styles.locationName, { color: colors.textTitle }]}>{item.name}</Text>
                  <Text style={[styles.locationAddress, { color: colors.textBody }]} numberOfLines={1}>
                    {item.address}
                  </Text>
                </View>
                <Text style={[styles.distanceText, { color: colors.textTitle }]}>{item.distance}</Text>
              </TouchableOpacity>
            ))}
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
  backgroundTouchable: {
    flex: 1,
  },
  sheetContainer: {
    width: '100%',
    height: SCREEN_HEIGHT * 0.85,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E0E0E0',
    alignSelf: 'center',
    marginBottom: 15,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 15,
  },
  divider: {
    height: 1,
    width: '100%',
  },
  routeSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  iconColumn: {
    width: 30,
    alignItems: 'center',
    marginRight: 10,
    paddingVertical: 12, 
  },
  fromIconOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fromIconInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dashedLine: {
    flex: 1,
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    marginVertical: 5,
    opacity: 0.5,
  },
  inputColumn: {
    flex: 1,
    gap: 15, 
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 15,
  },
  inputText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 15,
  },
  savedPlacesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  savedPlacesLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savedPlacesText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
    marginLeft: 15,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingBottom: 30,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  clockIcon: {
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
  distanceText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 14,
    marginLeft: 10,
  },
});

export default SelectAddressSheet;