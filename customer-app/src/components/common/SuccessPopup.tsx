import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHandsClapping } from '@fortawesome/free-solid-svg-icons';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';

interface SuccessPopupProps {
  visible: boolean;
  text: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ visible, text }) => {
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      {/* Lớp phủ màu đen mờ */}
      <View style={styles.overlay}>
        {/* Khối nội dung màu trắng */}
        <View style={styles.popupContainer}>
          
          {/* Vòng tròn vàng chứa Icon */}
          <View style={styles.iconCircle}>
            <FontAwesomeIcon icon={faHandsClapping} size={40} color={COLORS.background} />
          </View>

          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.description}>{text}</Text>

          {/* Vòng xoay Loading */}
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />

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
    paddingHorizontal: SIZES.padding,
  },
  popupContainer: {
    width: '100%',
    backgroundColor: COLORS.background,
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    ...SHADOWS.primaryGlow,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textTitle,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.body2,
    color: COLORS.textTitle,
    textAlign: 'center',
    lineHeight: 24,
  },
  loader: {
    marginTop: 30,
  }
});

export default SuccessPopup;