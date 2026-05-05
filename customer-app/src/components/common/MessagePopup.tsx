import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
} from 'react-native';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from './PrimaryButton';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

interface MessagePopupProps {
  visible: boolean;
  title: string;
  context: string;
  onClose: () => void;
}

const MessagePopup: React.FC<MessagePopupProps> = ({ 
  visible, 
  title, 
  context, 
  onClose,
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

          {/* Render title truyền từ ngoài vào */}
          <Text style={[styles.title, { color: colors.textTitle }]}>
            {title}
          </Text>
          
          {/* Render context truyền từ ngoài vào */}
          <Text style={[styles.contextText, { color: colors.textBody }]}>
            {context}
          </Text>

          <PrimaryButton 
            title="OK" 
            onPress={onClose} 
            style={styles.button}
          />

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
    paddingHorizontal: 10,
  },
  contextText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    marginBottom: 10,
  }
});

export default MessagePopup;