import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { driver, isLoading, error, updateDriverProfile } = useAuthStore();

    const [name, setName] = useState(driver?.name === 'Tài xế mới' ? '' : driver?.name || '');
    const [vehiclePlate, setVehiclePlate] = useState(
        driver?.vehiclePlate === 'Chưa cập nhật' ? '' : driver?.vehiclePlate || ''
    );
    const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber || '');

    const handleSave = async () => {
        const nameTrim = name.trim();
        const plateTrim = vehiclePlate.trim();
        const licenseTrim = licenseNumber.trim();

        if (!nameTrim) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập họ và tên của bạn.');
            return;
        }
        if (nameTrim === 'Tài xế mới') {
            Alert.alert('Họ tên không hợp lệ', 'Vui lòng nhập họ tên thật của bạn.');
            return;
        }
        if (!plateTrim) {
            Alert.alert('Thiếu thông tin', 'Vui lòng nhập biển số xe.');
            return;
        }

        const success = await updateDriverProfile(nameTrim, plateTrim, licenseTrim);
        if (success) {
            Alert.alert('Thành công', 'Thông tin đăng ký hồ sơ đã được đồng bộ lên hệ thống.', [
                { text: 'OK', onPress: () => navigation.goBack() },
            ]);
        } else {
            Alert.alert('Lỗi', error || 'Không thể cập nhật thông tin lên máy chủ.');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    disabled={isLoading}
                >
                    <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, TYPOGRAPHY.h2]}>Cấu Hình Hồ Sơ</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.alertBanner}>
                        <Icon name="info" size={20} color={COLORS.primaryDark} />
                        <Text style={styles.alertText}>
                            Vui lòng cập nhật thông tin tài xế chính xác để khách hàng nhận diện và bắt đầu chạy chuyến.
                        </Text>
                    </View>

                    {/* Form Group */}
                    <View style={styles.form}>
                        {/* Tên */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Họ và Tên tài xế *</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="user" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: Nguyễn Văn A"
                                    value={name}
                                    onChangeText={setName}
                                    placeholderTextColor={COLORS.textTertiary}
                                    editable={!isLoading}
                                />
                            </View>
                        </View>

                        {/* Số điện thoại (Hiển thị tĩnh để xác thực) */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số điện thoại đăng ký (Không thể sửa)</Text>
                            <View style={[styles.inputWrapper, styles.disabledWrapper]}>
                                <Icon name="phone" size={20} color={COLORS.textTertiary} style={styles.inputIcon} />
                                <TextInput
                                    style={[styles.input, styles.disabledInput]}
                                    value={driver?.phone || ''}
                                    editable={false}
                                    placeholderTextColor={COLORS.textTertiary}
                                />
                            </View>
                        </View>

                        {/* Biển số xe */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Biển kiểm soát xe *</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="list" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: 29A-123.45"
                                    value={vehiclePlate}
                                    onChangeText={setVehiclePlate}
                                    placeholderTextColor={COLORS.textTertiary}
                                    editable={!isLoading}
                                    autoCapitalize="characters"
                                />
                            </View>
                        </View>

                        {/* Giấy phép lái xe */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Số Giấy phép lái xe (GPLX)</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="credit-card" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Nhập số bằng lái xe của bạn"
                                    value={licenseNumber}
                                    onChangeText={setLicenseNumber}
                                    placeholderTextColor={COLORS.textTertiary}
                                    editable={!isLoading}
                                    keyboardType="numeric"
                                />
                            </View>
                        </View>
                    </View>

                    {/* Save Button */}
                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={handleSave}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color={COLORS.white} />
                        ) : (
                            <>
                                <Icon name="check" size={20} color={COLORS.white} style={styles.btnIcon} />
                                <Text style={styles.saveBtnText}>Lưu & Cập nhật</Text>
                            </>
                        )}
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.surface,
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingHorizontal: SPACING.sm,
    },
    backBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
    },
    headerRightPlaceholder: {
        width: 44,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    alertBanner: {
        flexDirection: 'row',
        backgroundColor: COLORS.primaryLight,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.lg,
        borderWidth: 1,
        borderColor: 'rgba(245, 166, 35, 0.2)',
    },
    alertText: {
        flex: 1,
        fontSize: 14,
        color: COLORS.textPrimary,
        marginLeft: SPACING.sm,
        lineHeight: 20,
    },
    form: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: SPACING.xl,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.sm,
        height: 48,
        backgroundColor: COLORS.background,
    },
    disabledWrapper: {
        borderColor: '#F0F0F0',
        backgroundColor: '#F5F5F5',
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        padding: 0,
    },
    disabledInput: {
        color: COLORS.textSecondary,
    },
    saveBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primaryDark,
        height: 52,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 4,
    },
    btnIcon: {
        marginRight: SPACING.sm,
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
});
