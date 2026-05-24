import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TouchableWithoutFeedback, 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import PrimaryButton from '../common/PrimaryButton'; 

interface ConfirmBottomSheetProps {
  visible: boolean;
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  isTitleDanger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

const ConfirmBottomSheet: React.FC<ConfirmBottomSheetProps> = ({
  visible,
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Yes",
  isTitleDanger = false,
  onCancel,
  onConfirm
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      {/* 1. Lớp phủ nền mờ */}
      <TouchableWithoutFeedback onPress={onCancel}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      {/* 2. Nội dung Bottom Sheet */}
      <View style={[styles.sheetContainer, { backgroundColor: colors.background, paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.handleIndicator} />
        
        <Text style={[
          styles.titleText, 
          { color: isTitleDanger ? colors.red : colors.textTitle }
        ]}>
          {title}
        </Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* Nội dung tin nhắn */}
        <Text style={[styles.messageText, { color: colors.textBody }]}>
          {message}
        </Text>

        {/* Các nút hành động (Row) */}
        <View style={styles.buttonContainer}>
          <PrimaryButton 
            title={cancelText} 
            onPress={onCancel} 
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1, backgroundColor: colors.backgroundLight }}
          />

          <PrimaryButton 
            title={confirmText} 
            onPress={onConfirm} 
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ flex: 1 }} 
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
  },
  sheetContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: theme.SIZES.radiusCard * 2, 
    borderTopRightRadius: theme.SIZES.radiusCard * 2, 
    paddingHorizontal: theme.SIZES.padding,
    paddingTop: 12,
    alignItems: 'center',
    ...theme.SHADOWS.light,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#EEEEEE',
    borderRadius: 2,
    marginBottom: 20,
  },
  titleText: {
    fontFamily: theme.FONTS.bold,
    fontSize: theme.SIZES.h2,
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    marginBottom: 20,
    opacity: 0.5,
  },
  messageText: {
    fontFamily: theme.FONTS.medium,
    fontSize: theme.SIZES.body1, 
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
});

export default ConfirmBottomSheet;