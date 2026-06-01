import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
} from 'react-native';
import { useAuthStore } from '../store/authStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { formatPhoneNumber } from '../utils/formatPhone';
import Icon from 'react-native-vector-icons/Feather';

export default function LoginScreen() {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState('');
    const login = useAuthStore((state) => state.login);
    const loading = useAuthStore((state) => state.isLoading);

    const handlePhoneChange = (text: string) => {
        // Dynamic phone formatting
        const formatted = formatPhoneNumber(text);
        setPhone(formatted);
        setErrorText('');
    };

    const handleLogin = async () => {
        // Basic verification
        const rawDigitLength = phone.replace(/\D/g, '').length;
        if (rawDigitLength < 11) { // includes 84 + 9 digits: e.g. 84 987 654 321 (11 digits)
            setErrorText('Số điện thoại không hợp lệ');
            return;
        }
        if (password.length < 4) {
            setErrorText('Mật khẩu tối thiểu 4 ký tự');
            return;
        }

        setErrorText('');
        const success = await login(phone, password);
        if (!success) {
            const apiError = useAuthStore.getState().error;
            setErrorText(apiError || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
    };


    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header Block */}
                <View style={styles.header}>
                    <View style={styles.logoCircle}>
                        <Icon name="truck" size={40} color={COLORS.white} />
                    </View>
                    <Text style={[styles.title, TYPOGRAPHY.h1]}>Hello Driver!</Text>
                    <Text style={[styles.subtitle, TYPOGRAPHY.body]}>
                        Đăng nhập tài khoản điều hành cấp để bắt đầu hoạt động.
                    </Text>
                </View>

                {/* Form Fields Section */}
                <View style={styles.form}>
                    <Text style={[styles.inputLabel, TYPOGRAPHY.small]}>SỐ ĐIỆN THOẠI</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="phone" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="+84 000 000 000"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="phone-pad"
                            value={phone}
                            onChangeText={handlePhoneChange}
                            maxLength={17}
                            editable={!loading}
                        />
                    </View>

                    <Text style={[styles.inputLabel, TYPOGRAPHY.small]}>MẬT KHẨU</Text>
                    <View style={styles.inputContainer}>
                        <Icon name="lock" size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
                        <TextInput
                            style={styles.input}
                            placeholder="••••••••"
                            placeholderTextColor={COLORS.textTertiary}
                            secureTextEntry
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                setErrorText('');
                            }}
                            editable={!loading}
                        />
                    </View>

                    {errorText ? (
                        <Text style={styles.errorText}>{errorText}</Text>
                    ) : null}

                    {/* Login Action Trigger */}
                    <TouchableOpacity
                        style={[styles.loginBtn, loading && styles.disabledBtn]}
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color={COLORS.white} />
                        ) : (
                            <Text style={styles.loginBtnText}>Sign in</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Footer info text */}
                <View style={styles.footer}>
                    <Text style={[styles.footerText, TYPOGRAPHY.small]}>
                        Gặp sự cố đăng nhập? Liên hệ Điều hành tại Trụ sở hoặc qua Hotline CSKH.
                    </Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.xl,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    logoCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        marginBottom: SPACING.md,
    },
    title: {
        color: COLORS.textPrimary,
        marginBottom: SPACING.xs,
    },
    subtitle: {
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: SPACING.md,
    },
    form: {
        marginBottom: SPACING.xl,
    },
    inputLabel: {
        color: COLORS.textSecondary,
        fontWeight: '700',
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        height: 52,
        marginBottom: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    inputIcon: {
        marginRight: SPACING.sm,
    },
    input: {
        flex: 1,
        color: COLORS.textPrimary,
        fontSize: 16,
        paddingVertical: 0,
    },
    errorText: {
        color: COLORS.error,
        fontSize: 14,
        fontWeight: '500',
        marginBottom: SPACING.md,
        marginLeft: SPACING.xs,
    },
    loginBtn: {
        backgroundColor: COLORS.primary,
        height: 54,
        borderRadius: RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.sm,
        shadowColor: COLORS.primaryDark,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
        minHeight: 48, // ensure minimum touch target
    },
    disabledBtn: {
        backgroundColor: COLORS.primaryLight,
    },
    loginBtnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: '700',
    },
    footer: {
        alignItems: 'center',
        marginTop: 'auto',
    },
    footerText: {
        color: COLORS.textTertiary,
        textAlign: 'center',
        lineHeight: 18,
    },
});
