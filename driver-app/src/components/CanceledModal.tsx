import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

interface CanceledModalProps {
    visible: boolean;
    onDismiss: () => void;
}

export default function CanceledModal({ visible, onDismiss }: CanceledModalProps) {
    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            onRequestClose={onDismiss}
        >
            <View style={styles.overlay}>
                <View style={styles.dialog}>
                    <View style={styles.iconCircle}>
                        <Icon name="alert-triangle" size={32} color={COLORS.error} />
                    </View>

                    <Text style={[styles.title, TYPOGRAPHY.h2]}>Cuốc Xe Bị Huỷ!</Text>
                    <Text style={[styles.desc, TYPOGRAPHY.body]}>
                        Khách hàng đã hủy cuốc xe này. Hệ thống sẽ tự động đưa bạn về lại trạng thái Online để tiếp tục nhận cuốc mới.
                    </Text>

                    <TouchableOpacity style={styles.btn} onPress={onDismiss} activeOpacity={0.8}>
                        <Text style={styles.btnText}>OK</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: COLORS.overlay,
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    dialog: {
        width: '100%',
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.lg,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 8,
    },
    iconCircle: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: '#FFF0F0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        color: COLORS.error,
        fontWeight: '700',
        marginBottom: SPACING.sm,
    },
    desc: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: SPACING.lg,
    },
    btn: {
        backgroundColor: COLORS.primary,
        height: 48,
        borderRadius: RADIUS.full,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 2,
        minHeight: 48, // Minimum touch target
    },
    btnText: {
        color: COLORS.white,
        fontSize: 16,
        fontWeight: '700',
    },
});
