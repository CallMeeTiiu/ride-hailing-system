import React, { useState, useEffect } from 'react';
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuthStore } from '../store/authStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

const BRANDS = ['Honda', 'Yamaha', 'Suzuki', 'Piaggio', 'VinFast', 'Khác'];
const DOC_TYPES = [
    { label: 'Căn cước công dân (CCCD)', value: 'CCCD' },
    { label: 'Giấy phép lái xe (GPLX)', value: 'GPLX' },
    { label: 'Đăng ký xe (Cavet xe)', value: 'CAVET' },
];

export default function SetupScreen() {
    const { driver, isLoading, updateDriverProfile, logout } = useAuthStore();
    const [step, setStep] = useState(0); // 0: Cá nhân, 1: Phương tiện, 2: Giấy tờ & Kích hoạt

    // Step 1: Cá nhân
    const [name, setName] = useState('');
    const [licenseNumber, setLicenseNumber] = useState('');
    const [avatarUri, setAvatarUri] = useState('https://ui-avatars.com/api/?name=TX&background=F5A623&color=fff');
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);

    // Step 2: Phương tiện
    const [brand, setBrand] = useState('Honda');
    const [model, setModel] = useState('');
    const [plateNumber, setPlateNumber] = useState('');
    const [color, setColor] = useState('');

    // Step 3: Giấy tờ
    const [selectedDocType, setSelectedDocType] = useState('CCCD');
    const [docImageUri, setDocImageUri] = useState<string | null>(null);
    const [isUploadingDoc, setIsUploadingDoc] = useState(false);

    // Submitting global loader
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Khôi phục trạng thái dở dang từ AsyncStorage (Edge Case)
    useEffect(() => {
        const loadDraft = async () => {
            try {
                const saved = await AsyncStorage.getItem('SETUP_DRAFT_STATE');
                if (saved) {
                    const parsed = JSON.parse(saved);
                    if (parsed.step) setStep(parsed.step);
                    if (parsed.name) setName(parsed.name);
                    if (parsed.licenseNumber) setLicenseNumber(parsed.licenseNumber);
                    if (parsed.brand) setBrand(parsed.brand);
                    if (parsed.model) setModel(parsed.model);
                    if (parsed.plateNumber) setPlateNumber(parsed.plateNumber);
                    if (parsed.color) setColor(parsed.color);
                    if (parsed.selectedDocType) setSelectedDocType(parsed.selectedDocType);
                    if (parsed.docImageUri) setDocImageUri(parsed.docImageUri);
                    if (parsed.avatarUri) setAvatarUri(parsed.avatarUri);
                } else if (driver) {
                    // Nếu không có bản nháp, lấy từ profile đang load
                    if (driver.name && driver.name !== 'Tài xế mới') setName(driver.name);
                    if (driver.licenseNumber) setLicenseNumber(driver.licenseNumber);
                    if (driver.avatarUrl) setAvatarUri(driver.avatarUrl);
                }
            } catch (err) {
                console.log('Không thể khôi phục bản nháp đăng ký:', err);
            }
        };
        loadDraft();
    }, [driver]);

    // Lưu bản nháp khi thay đổi thông tin
    const saveDraftState = async (nextStep: number) => {
        try {
            const draft = {
                step: nextStep,
                name,
                licenseNumber,
                brand,
                model,
                plateNumber,
                color,
                selectedDocType,
                docImageUri,
                avatarUri,
            };
            await AsyncStorage.setItem('SETUP_DRAFT_STATE', JSON.stringify(draft));
        } catch (err) {
            console.log('Lưu bản nháp thất bại:', err);
        }
    };

    // Đi sang bước tiếp theo
    const handleNext = async () => {
        if (step === 0) {
            const nameTrim = name.trim();
            const licenseTrim = licenseNumber.trim();
            if (!nameTrim || nameTrim === 'Tài xế mới') {
                Alert.alert('Họ tên không hợp lệ', 'Vui lòng nhập họ và tên thật.');
                return;
            }
            if (!licenseTrim || licenseTrim.length < 8) {
                Alert.alert('Giấy phép lái xe', 'Vui lòng nhập số GPLX hợp lệ (tối thiểu 8 ký tự số).');
                return;
            }
            setStep(1);
            saveDraftState(1);
        } else if (step === 1) {
            const modelTrim = model.trim();
            const plateTrim = plateNumber.trim();
            const colorTrim = color.trim();
            if (!modelTrim) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập dòng xe (model).');
                return;
            }
            if (!plateTrim) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập biển số xe.');
                return;
            }
            if (!colorTrim) {
                Alert.alert('Thiếu thông tin', 'Vui lòng nhập màu xe.');
                return;
            }
            setStep(2);
            saveDraftState(2);
        }
    };

    // Quay lại bước trước đó
    const handleBack = () => {
        if (step > 0) {
            const prevStep = step - 1;
            setStep(prevStep);
            saveDraftState(prevStep);
        }
    };

    // Giả lập chụp ảnh chân dung & upload lên Server
    const handleMockAvatarCapture = () => {
        setIsUploadingAvatar(true);
        setTimeout(() => {
            const randomAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'TX')}&background=F5A623&color=fff&size=200`;
            setAvatarUri(randomAvatar);
            setIsUploadingAvatar(false);
            Alert.alert('Ảnh hồ sơ', 'Đã chụp & đồng bộ ảnh đại diện thành công.');
        }, 1500);
    };

    // Giả lập tải ảnh giấy tờ tùy thân mẫu
    const handleMockDocCapture = () => {
        setIsUploadingDoc(true);
        setTimeout(() => {
            setDocImageUri('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500&auto=format&fit=crop');
            setIsUploadingDoc(false);
            Alert.alert('Tải giấy tờ', `Tải ảnh ${selectedDocType} thành công.`);
        }, 1500);
    };

    // Hoàn thành đăng ký & Kích hoạt hồ sơ
    const handleActivate = async () => {
        if (!docImageUri) {
            Alert.alert('Thiếu giấy tờ', 'Vui lòng tải ảnh giấy tờ xác thực lên hệ thống.');
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Đồng bộ profile và Vehicle qua AuthStore
            // backend cập nhật brand, model, color trong DB thông qua API PUT/POST
            const plateClean = plateNumber.trim().toUpperCase();
            const success = await updateDriverProfile(
                name.trim(),
                plateClean,
                licenseNumber.trim(),
                brand,
                model.trim(),
                color.trim()
            );

            if (success) {
                // Xóa bản nháp hoàn tất
                await AsyncStorage.removeItem('SETUP_DRAFT_STATE');
                Alert.alert('Thành công', 'Hồ sơ đã được kích hoạt trực tiếp. Bắt đầu nhận chuyến!', [
                    { text: 'Bắt đầu' }
                ]);
            } else {
                Alert.alert('Thất bại', 'Không thể cấu hình hồ sơ lên server.');
            }
        } catch (err: any) {
            Alert.alert('Lỗi', err.message || 'Lỗi bất ngờ xảy ra.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Hủy đăng ký / Đăng xuất về Login
    const handleLogout = () => {
        Alert.alert('Xác nhận', 'Bạn có muốn đăng xuất và bổ sung hồ sơ sau không?', [
            { text: 'Hủy', style: 'cancel' },
            { text: 'Đăng xuất', style: 'destructive', onPress: () => logout() },
        ]);
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Header */}
            <View style={styles.header}>
                {step > 0 ? (
                    <TouchableOpacity style={styles.headerBtn} onPress={handleBack}>
                        <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
                    </TouchableOpacity>
                ) : (
                    <View style={styles.headerBtn} />
                )}
                <Text style={[styles.headerTitle, TYPOGRAPHY.h2]}>Hoàn Tất Hồ Sơ</Text>
                <TouchableOpacity style={styles.headerBtn} onPress={handleLogout}>
                    <Icon name="log-out" size={22} color={COLORS.error} />
                </TouchableOpacity>
            </View>

            {/* Stepper Indicator */}
            <View style={styles.stepperContainer}>
                {['CÁ NHÂN', 'PHƯƠNG TIỆN', 'GIẤY TỜ'].map((label, idx) => {
                    const isActive = idx === step;
                    const isDone = idx < step;
                    return (
                        <React.Fragment key={idx}>
                            <View style={styles.stepDotWrapper}>
                                <View style={[
                                    styles.stepDot,
                                    isActive && styles.stepDotActive,
                                    isDone && styles.stepDotDone
                                ]}>
                                    {isDone ? (
                                        <Icon name="check" size={12} color={COLORS.white} />
                                    ) : (
                                        <Text style={[styles.stepDotText, isActive && styles.stepDotTextActive]}>
                                            {idx + 1}
                                        </Text>
                                    )}
                                </View>
                                <Text style={[styles.stepDotLabel, TYPOGRAPHY.small, isActive && styles.stepDotLabelActive]}>
                                    {label}
                                </Text>
                            </View>
                            {idx < 2 && (
                                <View style={[styles.stepLine, idx < step ? styles.stepLineDone : styles.stepLineTodo]} />
                            )}
                        </React.Fragment>
                    );
                })}
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    {/* STEP 1: THÔNG TIN CÁ NHÂN */}
                    {step === 0 && (
                        <View style={styles.stepCard}>
                            <Text style={[styles.stepTitle, TYPOGRAPHY.h3]}>Thông tin tài xế</Text>
                            <Text style={styles.stepDesc}>Cung cấp họ tên và giấy phép lái xe để định danh tài khoản.</Text>

                            {/* Avatar Picker Mock */}
                            <View style={styles.avatarSection}>
                                <View style={styles.avatarWrapper}>
                                    <Image source={{ uri: avatarUri }} style={styles.avatar} />
                                    <TouchableOpacity
                                        style={styles.avatarEditBtn}
                                        onPress={handleMockAvatarCapture}
                                        disabled={isUploadingAvatar}
                                    >
                                        {isUploadingAvatar ? (
                                            <ActivityIndicator size="small" color={COLORS.white} />
                                        ) : (
                                            <Icon name="camera" size={16} color={COLORS.white} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                                <Text style={styles.avatarLabel}>Ảnh chân dung tài xế</Text>
                            </View>

                            {/* Form Inputs */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Họ và tên thật *</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="user" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập họ và tên đầy đủ"
                                        value={name}
                                        onChangeText={setName}
                                        placeholderTextColor={COLORS.textTertiary}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Số Giấy phép lái xe (GPLX) *</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="credit-card" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Nhập số bằng lái xe của bạn"
                                        value={licenseNumber}
                                        onChangeText={setLicenseNumber}
                                        keyboardType="numeric"
                                        placeholderTextColor={COLORS.textTertiary}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* STEP 2: THÔNG TIN PHƯƠNG TIỆN */}
                    {step === 1 && (
                        <View style={styles.stepCard}>
                            <Text style={[styles.stepTitle, TYPOGRAPHY.h3]}>Thông tin phương tiện</Text>
                            <Text style={styles.stepDesc}>Đăng ký thông tin xe máy để hành khách dễ dàng nhận diện.</Text>

                            {/* Hãng xe */}
                            <Text style={styles.inputLabel}>Hãng sản xuất xe *</Text>
                            <View style={styles.brandContainer}>
                                {BRANDS.map((item) => (
                                    <TouchableOpacity
                                        key={item}
                                        style={[styles.brandChip, brand === item && styles.brandChipActive]}
                                        onPress={() => setBrand(item)}
                                    >
                                        <Text style={[styles.brandText, brand === item && styles.brandTextActive]}>
                                            {item}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* Dòng xe */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Dòng xe (Dòng/Mẫu) *</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="tag" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: Wave Alpha, Air Blade"
                                        value={model}
                                        onChangeText={setModel}
                                        placeholderTextColor={COLORS.textTertiary}
                                    />
                                </View>
                            </View>

                            {/* Biển số xe */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Biển số xe *</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="hash" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: 29A-12345"
                                        value={plateNumber}
                                        onChangeText={setPlateNumber}
                                        autoCapitalize="characters"
                                        placeholderTextColor={COLORS.textTertiary}
                                    />
                                </View>
                            </View>

                            {/* Màu sơn xe */}
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Màu sắc của xe *</Text>
                                <View style={styles.inputWrapper}>
                                    <Icon name="aperture" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                                    <TextInput
                                        style={styles.input}
                                        placeholder="Ví dụ: Đỏ Đen, Xanh Dương"
                                        value={color}
                                        onChangeText={setColor}
                                        placeholderTextColor={COLORS.textTertiary}
                                    />
                                </View>
                            </View>
                        </View>
                    )}

                    {/* STEP 3: GIẤY TỜ KHỞI TẠO */}
                    {step === 2 && (
                        <View style={styles.stepCard}>
                            <Text style={[styles.stepTitle, TYPOGRAPHY.h3]}>Giấy tờ & Chứng chỉ pháp lý</Text>
                            <Text style={styles.stepDesc}>Tải lên tài liệu cơ bản để hoàn tất thủ tục đăng ký.</Text>

                            {/* Khung tài liệu */}
                            <Text style={styles.inputLabel}>Chọn loại giấy tờ nộp *</Text>
                            <View style={styles.docTypeRow}>
                                {DOC_TYPES.map((doc) => (
                                    <TouchableOpacity
                                        key={doc.value}
                                        style={[styles.docTypeBtn, selectedDocType === doc.value && styles.docTypeBtnActive]}
                                        onPress={() => {
                                            setSelectedDocType(doc.value);
                                            setDocImageUri(null); // Reset ảnh cũ khi đổi loại giấy tờ
                                        }}
                                    >
                                        <Text style={[styles.docTypeBtnText, selectedDocType === doc.value && styles.docTypeBtnTextActive]}>
                                            {doc.value}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.uploaderBox}>
                                {docImageUri ? (
                                    <View style={styles.previewContainer}>
                                        <Image source={{ uri: docImageUri }} style={styles.docPreview} />
                                        <TouchableOpacity
                                            style={styles.reUploadBtn}
                                            onPress={handleMockDocCapture}
                                            disabled={isUploadingDoc}
                                        >
                                            <Icon name="refresh-cw" size={16} color={COLORS.white} />
                                            <Text style={styles.reUploadText}>Thay đổi ảnh</Text>
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.uploadTrigger}
                                        onPress={handleMockDocCapture}
                                        disabled={isUploadingDoc}
                                    >
                                        {isUploadingDoc ? (
                                            <ActivityIndicator size="large" color={COLORS.primary} />
                                        ) : (
                                            <>
                                                <Icon name="file-text" size={38} color={COLORS.textTertiary} />
                                                <Text style={styles.uploadText}>Nhấp vào để chụp ảnh giấy tờ</Text>
                                                <Text style={styles.uploadHint}>Chấp nhận ảnh chụp rõ nét, không mờ góc</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>

                            <View style={styles.termsBox}>
                                <Icon name="shield" size={18} color={COLORS.success} />
                                <Text style={styles.termsText}>
                                    Hồ sơ của bạn sẽ được kích hoạt ngay lập tức. Chúng tôi cam kết bảo mật thông tin tài xế theo đúng điều khoản chính sách.
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Navigation Buttons */}
                    <View style={styles.btnRow}>
                        {step < 2 ? (
                            <TouchableOpacity
                                style={styles.nextBtn}
                                onPress={handleNext}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.nextBtnText}>Tiếp tục</Text>
                                <Icon name="chevron-right" size={20} color={COLORS.white} />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={[styles.activateBtn, isSubmitting && styles.disabledBtn]}
                                onPress={handleActivate}
                                disabled={isSubmitting}
                                activeOpacity={0.8}
                            >
                                {isSubmitting ? (
                                    <ActivityIndicator size="small" color={COLORS.white} />
                                ) : (
                                    <>
                                        <Icon name="check" size={20} color={COLORS.white} style={styles.btnIcon} />
                                        <Text style={styles.activateBtnText}>Kích hoạt & Bắt đầu</Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        )}
                    </View>
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
    headerBtn: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        color: COLORS.textPrimary,
    },
    stepperContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    stepDotWrapper: {
        alignItems: 'center',
    },
    stepDot: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#E0E0E0',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    stepDotActive: {
        backgroundColor: COLORS.primary,
    },
    stepDotDone: {
        backgroundColor: COLORS.success,
    },
    stepDotText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
    },
    stepDotTextActive: {
        color: COLORS.white,
    },
    stepDotLabel: {
        color: COLORS.textTertiary,
        fontWeight: '600',
    },
    stepDotLabelActive: {
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    stepLine: {
        flex: 1,
        height: 2,
        marginHorizontal: SPACING.xs,
        transform: [{ translateY: -10 }],
    },
    stepLineDone: {
        backgroundColor: COLORS.success,
    },
    stepLineTodo: {
        backgroundColor: '#E0E0E0',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        padding: SPACING.md,
    },
    stepCard: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: SPACING.lg,
    },
    stepTitle: {
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    stepDesc: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: SPACING.md,
        lineHeight: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    avatarWrapper: {
        position: 'relative',
        width: 100,
        height: 100,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        borderColor: COLORS.primaryLight,
    },
    avatarEditBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: COLORS.white,
    },
    avatarLabel: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginTop: SPACING.xs,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
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
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: COLORS.textPrimary,
        padding: 0,
    },
    brandContainer: {
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
        marginRight: 8,
        marginBottom: 8,
        backgroundColor: COLORS.background,
    },
    brandChipActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    brandText: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    brandTextActive: {
        color: COLORS.primaryDark,
        fontWeight: '600',
    },
    docTypeRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    docTypeBtn: {
        flex: 1,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: RADIUS.md,
        marginHorizontal: 4,
        backgroundColor: COLORS.background,
    },
    docTypeBtnActive: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    docTypeBtnText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    docTypeBtnTextActive: {
        color: COLORS.primaryDark,
    },
    uploaderBox: {
        height: 200,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.textTertiary,
        borderRadius: RADIUS.lg,
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
        overflow: 'hidden',
    },
    uploadTrigger: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.md,
    },
    uploadText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginTop: SPACING.sm,
    },
    uploadHint: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    previewContainer: {
        flex: 1,
        width: '100%',
        position: 'relative',
    },
    docPreview: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    reUploadBtn: {
        position: 'absolute',
        bottom: SPACING.sm,
        alignSelf: 'center',
        flexDirection: 'row',
        backgroundColor: COLORS.primaryDark,
        paddingHorizontal: SPACING.md,
        paddingVertical: 8,
        borderRadius: RADIUS.full,
        alignItems: 'center',
    },
    reUploadText: {
        fontSize: 13,
        fontWeight: 'bold',
        color: COLORS.white,
        marginLeft: 6,
    },
    termsBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        borderWidth: 1,
        borderColor: '#E8F5E9',
        backgroundColor: '#F1F8E9',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
    },
    termsText: {
        flex: 1,
        fontSize: 12,
        color: '#2E7D32',
        marginLeft: SPACING.xs,
        lineHeight: 18,
    },
    btnRow: {
        marginBottom: SPACING.xl,
    },
    nextBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.primary,
        height: 52,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
        marginRight: 6,
    },
    activateBtn: {
        flexDirection: 'row',
        backgroundColor: COLORS.success,
        height: 52,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 4,
    },
    activateBtnText: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.white,
    },
    btnIcon: {
        marginRight: SPACING.sm,
    },
    disabledBtn: {
        opacity: 0.7,
    },
});
