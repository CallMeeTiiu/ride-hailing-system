import React from 'react';
import { View, Text, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHandsClapping } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext'

interface SuccessPopupProps {
  visible: boolean;
  text: string;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ visible, text }) => {
  const { colors } = useTheme();

  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
    >
      {/* Lớp phủ màu đen mờ */}
      <View style={styles.overlay}>
        {/* Khối nội dung màu trắng */}
        <View style={[ styles.popupContainer, {backgroundColor: colors.background} ]}>
          
          {/* Vòng tròn vàng chứa Icon */}
          <View style={[ styles.iconCircle, {backgroundColor: colors.primary} ]}>
            <FontAwesomeIcon icon={faHandsClapping} size={40} color={colors.background} />
          </View>

          <Text style={[ styles.title, {color: colors.textTitle} ]}>Congratulations!</Text>
          <Text style={[ styles.description, {color: colors.textTitle} ]}>{text}</Text>

          {/* Vòng xoay Loading */}
          <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />

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
    paddingVertical: 40,
    paddingHorizontal: 20,
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
  title: {
    fontFamily: theme.FONTS.bold,
    fontSize: 28,
    marginBottom: 15,
    textAlign: 'center',
  },
  description: {
    fontFamily: theme.FONTS.regular,
    fontSize: theme.SIZES.body2,
    textAlign: 'center',
    lineHeight: 24,
  },
  loader: {
    marginTop: 30,
  }
});

export default SuccessPopup;