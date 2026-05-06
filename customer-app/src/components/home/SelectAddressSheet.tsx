import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TouchableWithoutFeedback
} from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faLocationDot, 
  faCrosshairs, 
  faPenToSquare
} from '@fortawesome/free-solid-svg-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useLocation } from '../../contexts/LocationContext';
import { RootStackParamList } from '../../../App';

import PrimaryButton from '../common/PrimaryButton'; 

interface SelectAddressSheetProps {
  visible: boolean;
  onClose: () => void;
}

const SelectAddressSheet: React.FC<SelectAddressSheetProps> = ({ visible, onClose }) => {
  const { colors } = useTheme();
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  
  const { fromLocation, destinationLocation } = useLocation();

  const [distance] = useState(4.5);

  const isOrderReady = 
    fromLocation !== null && 
    destinationLocation !== null && 
    fromLocation.id !== destinationLocation.id;

  const handleNavigateToSearch = (type: 'from' | 'destination') => {
    onClose(); 
    navigation.navigate('Search', { type });
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
          
          <View style={styles.distanceRow}>
            <Text style={[styles.distanceLabel, { color: colors.textTitle }]}>Distance</Text>
            <Text style={[styles.distanceValue, { color: colors.textTitle }]}>{distance} km</Text>
          </View>

          <View style={[styles.divider, { backgroundColor: colors.border }]} />

          {/* --- KHU VỰC ĐỊA ĐIỂM --- */}
          <View style={styles.routeSection}>
            <View style={styles.iconColumn}>
              { fromLocation ? (
                <View style={[ styles.outerCircle, {backgroundColor: colors.backgroundLight} ]}>
                    <View style={styles.innerCircle}>
                    <FontAwesomeIcon icon={faCrosshairs} size={12} color="black" />
                    </View>
                </View>
              ) : (
                <View style={[ styles.outerCircle, {backgroundColor: colors.inputBg} ]}>
                    <FontAwesomeIcon icon={faCrosshairs} size={12} color={colors.iconDisable} />
                </View>
              )}

              <View style={[styles.dashedLine, { borderColor: colors.textBody }]} />

              { destinationLocation ? (
                <View style={[ styles.outerCircle, {backgroundColor: colors.backgroundLight} ]}>
                    <View style={styles.innerCircle}>
                    <FontAwesomeIcon icon={faLocationDot} size={12} color="black" />
                    </View>
                </View>
              ) : (
                <View style={[ styles.outerCircle, {backgroundColor: colors.inputBg} ]}>
                    <FontAwesomeIcon icon={faLocationDot} size={12} color={colors.iconDisable} />
                </View>
              )}
            </View>

            {/* Cột phải: Chứa thông tin Text và Nút Edit */}
            <View style={styles.contentColumn}>
              <TouchableOpacity 
                style={styles.locationItem} 
                activeOpacity={0.7}
                onPress={() => handleNavigateToSearch('from')}
              >
                <View style={styles.textContainer}>
                  <Text style={[styles.locName, { color: colors.textTitle }]}>
                    {fromLocation ? fromLocation.name : 'My Current Location'}
                  </Text>
                  {fromLocation ? (
                    <Text style={[styles.locAddress, { color: colors.textBody }]} numberOfLines={1}>
                        {fromLocation.address}
                    </Text>
                  ) : ("")}
                  
                </View>
                <FontAwesomeIcon icon={faPenToSquare} size={16} color={theme.COLORS.primary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.locationItem} 
                activeOpacity={0.7}
                onPress={() => handleNavigateToSearch('destination')}
              >
                <View style={styles.textContainer}>
                  <Text style={[styles.locName, { color: colors.textTitle }]}>
                    {destinationLocation ? destinationLocation.name : 'Select Destination'}
                  </Text>
                  {destinationLocation ? (
                    <Text style={[styles.locAddress, { color: colors.textBody }]} numberOfLines={1}>
                        {destinationLocation.address}
                    </Text>
                  ) : ("")}
                </View>
                <FontAwesomeIcon icon={faPenToSquare} size={16} color={theme.COLORS.primary} />
              </TouchableOpacity>

            </View>
          </View>

          <View style={styles.buttonContainer} >
             <PrimaryButton
               title="Continue to Order" 
               disabled={!isOrderReady} 
               onPress={() => {
                  console.log("Tiến hành đặt xe!");
               }}
             />
          </View>

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
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 10,
    paddingBottom: 30, 
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
  distanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  distanceLabel: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
  },
  distanceValue: {
    fontFamily: theme.FONTS.regular,
    fontSize: 14,
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
    width: 40,
    alignItems: 'center',
    marginRight: 15,
  },
  outerCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dashedLine: {
    height: 30, 
    borderLeftWidth: 1.5,
    borderStyle: 'dashed',
    marginVertical: 4,
    opacity: 0.4,
  },
  contentColumn: {
    flex: 1,
    justifyContent: 'space-between',
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 36, 
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  locName: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 16,
    marginBottom: 2,
  },
  locAddress: {
    fontFamily: theme.FONTS.regular,
    fontSize: 13,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  }
});

export default SelectAddressSheet;