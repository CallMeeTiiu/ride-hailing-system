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
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../store/authStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const BRANDS = ['Honda', 'Yamaha', 'Suzuki', 'Piaggio', 'VinFast', 'Khác'];

export default function EditProfileScreen() {
    const navigation = useNavigation();
    const { driver, isLoading, error, updateDriverProfile, uploadAvatar } = useAuthStore();

    const [name, setName] = useState(driver?.name === 'Tài xế mới' ? '' : driver?.name || '');
    const [vehiclePlate, setVehiclePlate] = useState(
        driver?.vehiclePlate === 'Chưa cập nhật' ? '' : driver?.vehiclePlate || ''
    );
    const [licenseNumber, setLicenseNumber] = useState(driver?.licenseNumber || '');

    // Cập nhật chi tiết xe mới
    const [brand, setBrand] = useState(driver?.brand || 'Honda');
    const [model, setModel] = useState(driver?.model || '');
    const [color, setColor] = useState(driver?.color || '');

    // Avatar state
    const [avatarUri, setAvatarUri] = useState(
        driver?.avatarUrl || 'https://ui-avatars.com/api/?name=TX&background=F5A623&color=fff'
    );
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Chụp & upload avatar lên server
    const handleAvatarChange = () => {
        setIsUploadingAvatar(true);
        setTimeout(async () => {
            try {
                const initials = encodeURIComponent(name || 'TX');
                const mockupUrl = `https://ui-avatars.com/api/?name=${initials}&background=F5A623&color=fff&size=200`;
                const serverUrl = await uploadAvatar({ uri: mockupUrl });
                if (serverUrl) {
                    setAvatarUri(serverUrl);
                    Alert.alert('Thành công', 'Đã cập nhật ảnh đại diện mới trên máy chủ.');
                } else {
                    Alert.alert('Cảnh báo', 'Tải ảnh đại diện lên server thất bại, đang dùng cache.');
                }
            } catch (err) {
                console.log('Upload avatar error:', err);
            } finally {
                setIsUploadingAvatar(false);
            }
        }, 1200);
    };

    const handleSave = async () => {
        const nameTrim = name.trim();
        const plateTrim = vehiclePlate.trim();
        const licenseTrim = licenseNumber.trim();
        const modelTrim = model.trim();
        const colorTrim = color.trim();

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
        if (!modelTrim) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền dòng xe.');
            return;
        }
        if (!colorTrim) {
            Alert.alert('Thiếu thông tin', 'Vui lòng điền màu xe.');
            return;
        }

        const success = await updateDriverProfile(
            nameTrim,
            plateTrim,
            licenseTrim,
            brand,
            modelTrim,
            colorTrim
        );
        if (success) {
            Alert.alert('Thành công', 'Hồ sơ tài xế và thông tin phương tiện đã cập nhật.', [
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
                    {/* Hộp cập nhật Avatar ở đầu trang */}
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatarWrapper}>
                            <Image source={{ uri: avatarUri }} style={styles.avatarImg} />
                            {isUploadingAvatar ? (
                                <View style={styles.avatarLoader}>
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                </View>
                            ) : (
                                <TouchableOpacity style={styles.avatarEditBtn} onPress={handleAvatarChange}>
                                    <Icon name="camera" size={14} color={COLORS.white} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <Text style={styles.avatarTitleText}>Ảnh Chân Dung</Text>
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

                        {/* GPLX */}
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

                        <View style={styles.divider} />
                        <Text style={[styles.sectionTitle, TYPOGRAPHY.h3]}>Chi tiết phương tiện</Text>

                        {/* Chip chọn Hãng xe */}
                        <Text style={styles.label}>Hãng sản xuất xe *</Text>
                        <View style={styles.brandRow}>
                            {BRANDS.map((item) => (
                                <TouchableOpacity
                                    key={item}
                                    style={[styles.brandChip, brand === item && styles.brandChipActive]}
                                    onPress={() => setBrand(item)}
                                    disabled={isLoading}
                                >
                                    <Text style={[styles.brandChipText, brand === item && styles.brandChipTextActive]}>
                                        {item}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Dòng xe / Model */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Dòng / Mẫu xe máy *</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="tag" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: Wave Alpha, Air Blade"
                                    value={model}
                                    onChangeText={setModel}
                                    placeholderTextColor={COLORS.textTertiary}
                                    editable={!isLoading}
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

                        {/* Màu xe */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Màu sơn xe *</Text>
                            <View style={styles.inputWrapper}>
                                <Icon name="aperture" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Ví dụ: Đen, Đỏ Đen"
                                    value={color}
                                    onChangeText={setColor}
                                    placeholderTextColor={COLORS.textTertiary}
                                    editable={!isLoading}
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
    avatarContainer: {
        alignItems: 'center',
        marginVertical: SPACING.md,
    },
    avatarWrapper: {
        width: 84,
        height: 84,
        position: 'relative',
    },
    avatarImg: {
        width: 84,
        height: 84,
        borderRadius: 42,
        borderWidth: 2,
        borderColor: COLORS.primaryLight,
    },
    avatarLoader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        borderRadius: 42,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEditBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: COLORS.white,
    },
    avatarTitleText: {
        fontSize: 13,
        fontWeight: '700',
        color: COLORS.textSecondary,
        marginTop: 6,
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
    divider: {
        height: 1,
        backgroundColor: '#EEEEEE',
        marginVertical: SPACING.md,
    },
    sectionTitle: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.md,
    },
    brandRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: SPACING.md,
    },
    brandChip: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: RADIUS.md,
        marginRight: 6,
        marginBottom: 8,
        backgroundColor: COLORS.background,
    },
    brandChipActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    brandChipText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    brandChipTextActive: {
        color: COLORS.primaryDark,
        fontWeight: '600',
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
        marginBottom: SPACING.xl,
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
