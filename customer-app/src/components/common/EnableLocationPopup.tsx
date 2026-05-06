import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity,
} from 'react-native';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from './PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface EnableLocationPopupProps {
  visible: boolean;
  onEnable: () => void;
  onCancel: () => void;
}

const EnableLocationPopup: React.FC<EnableLocationPopupProps> = ({ 
  visible, 
  onEnable, 
  onCancel 
}) => {
  const { colors } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={[styles.popupContainer, { backgroundColor: colors.background }]}>
          
          <View style={[ styles.iconCircle, {backgroundColor: colors.primary} ]}>
            <FontAwesomeIcon icon={faLocationDot} size={40} color={colors.background} />
          </View>

          <Text style={[styles.title, { color: colors.textTitle }]}>
            Enable Location
          </Text>
          <Text style={[styles.subtitle, { color: colors.textBody }]}>
            We need access to your location to be able to use this service.
          </Text>

          <PrimaryButton 
            title="Enable Location" 
            onPress={onEnable} 
            style={styles.enableButton}
          />

          <TouchableOpacity 
            style={[styles.cancelButton, { backgroundColor: colors.backgroundLight }]} 
            onPress={onCancel}
            activeOpacity={0.7}
          >
            <Text style={[styles.cancelButtonText, { color: colors.textTitle }]}>
              Not Now
            </Text>
          </TouchableOpacity>

        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.SIZES.padding,
  },
  popupContainer: {
    width: '100%',
    borderRadius: 30, 
    padding: theme.SIZES.padding,
    alignItems: 'center',
    ...theme.SHADOWS.primaryGlow,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  image: {
    width: 160,
    height: 160,
  },
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 24,
    marginBottom: 15,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  enableButton: {
    marginBottom: 15,
  },
  cancelButton: {
    width: '100%',
    height: 56,
    borderRadius: theme.SIZES.radiusButton || 16, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
  }
});

export default EnableLocationPopup;