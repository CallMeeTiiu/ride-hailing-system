import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import apiClient from '../services/apiClient';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

const DOC_TYPES = [
    { key: 'CCCD', label: 'Căn cước công dân (CCCD)', description: 'Chụp rõ 2 mặt của CCCD chính chủ' },
    { key: 'GPLX', label: 'Giấy phép lái xe (GPLX)', description: 'Giấy phép lái xe hạng A1/A2 trở lên' },
    { key: 'CAVET', label: 'Đăng ký xe (Cavet xe)', description: 'Chứng nhận đăng ký xe máy chính chủ' },
];

export default function DocumentScreen() {
    const navigation = useNavigation();
    const [documents, setDocuments] = useState<Record<string, { url: string; status: string }>>({});
    const [loading, setLoading] = useState(true);
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);

    // Lấy danh sách các tài liệu hiện có từ backend
    const fetchDocuments = async () => {
        try {
            // Note: endpoint GET /drivers/documents có thể không hiển thị trực tiếp 
            // hoặc trả về mảng. Vì vậy chúng ta load profile/hoặc vehicles để hiển thị
            // Hãy gọi API GET /drivers/me để đọc profile tài liệu của tài xế.
            const res = await apiClient.get('/drivers/me');
            const profile = res.data.profile;
            if (profile && profile.documents) {
                const docMap: Record<string, { url: string; status: string }> = {};
                profile.documents.forEach((doc: any) => {
                    docMap[doc.doc_type] = {
                        url: doc.file_url,
                        status: doc.verification_status || 'PENDING',
                    };
                });
                setDocuments(docMap);
            }
        } catch (err) {
            console.log('[DocumentScreen] Fetch documents failed:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, []);

    // Giả lập chụp & upload giấy tờ lên Server qua POST /drivers/documents
    const handleUpload = (docType: string) => {
        setUploadingKey(docType);
        setTimeout(async () => {
            try {
                // Tạo mock image url
                const mockUrl = 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?w=500';
                
                const formData = new FormData();
                formData.append('doc_type', docType);
                formData.append('verification_status', 'PENDING');
                formData.append('file', {
                    uri: Platform.OS === 'android' ? mockUrl : mockUrl.replace('file://', ''),
                    type: 'image/jpeg',
                    name: `${docType}_document.jpg`,
                } as any);

                const res = await apiClient.post('/drivers/documents', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (res.data) {
                    setDocuments((prev) => ({
                        ...prev,
                        [docType]: {
                            url: res.data.file_url || mockUrl,
                            status: res.data.verification_status || 'PENDING',
                        },
                    }));
                    Alert.alert('Thành công', `Ảnh ${docType} đã tải lên server để chờ duyệt.`);
                }
            } catch (err: any) {
                console.error('[DocumentScreen] Upload document failed:', err);
                Alert.alert('Thất bại', 'Không thể gửi ảnh tài liệu lên server.');
            } finally {
                setUploadingKey(null);
            }
        }, 1500);
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'Đã liên kết';
            case 'REJECTED': return 'Bị từ chối';
            default: return 'Đang xử lý';
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'APPROVED': return styles.statusApproved;
            case 'REJECTED': return styles.statusRejected;
            default: return styles.statusPending;
        }
    };

    const getStatusTextStyle = (status: string) => {
        switch (status) {
            case 'APPROVED': return styles.statusTextApproved;
            case 'REJECTED': return styles.statusTextRejected;
            default: return styles.statusTextPending;
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, TYPOGRAPHY.h2]}>Chứng Chỉ & Giấy Tờ</Text>
                <View style={styles.headerRightPlaceholder} />
            </View>

            {loading ? (
                <View style={styles.centerLoader}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.infoBanner}>
                        <Icon name="shield-off" size={20} color="#059669" />
                        <Text style={styles.infoBannerText}>
                            Hệ thống tự động kích hoạt nhanh tài khoản của bạn. Vui lòng cập nhật hình ảnh rõ nét để bảo vệ quyền lợi sau này.
                        </Text>
                    </View>

                    {DOC_TYPES.map((doc) => {
                        const existingDoc = documents[doc.key];
                        const isUploading = uploadingKey === doc.key;

                        return (
                            <View key={doc.key} style={styles.docCard}>
                                <View style={styles.docHeader}>
                                    <View style={styles.docHeaderLeft}>
                                        <Text style={[styles.docTitle, TYPOGRAPHY.h3]}>{doc.label}</Text>
                                        <Text style={styles.docDesc}>{doc.description}</Text>
                                    </View>
                                    {existingDoc && (
                                        <View style={[styles.statusWrapper, getStatusStyle(existingDoc.status)]}>
                                            <Text style={[styles.statusText, getStatusTextStyle(existingDoc.status)]}>
                                                {getStatusText(existingDoc.status)}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                {existingDoc ? (
                                    <View style={styles.imageContainer}>
                                        <Image source={{ uri: existingDoc.url }} style={styles.previewImage} />
                                        <TouchableOpacity
                                            style={styles.btnChange}
                                            onPress={() => handleUpload(doc.key)}
                                            disabled={isUploading}
                                        >
                                            {isUploading ? (
                                                <ActivityIndicator size="small" color={COLORS.white} />
                                            ) : (
                                                <>
                                                    <Icon name="camera" size={14} color={COLORS.white} />
                                                    <Text style={styles.btnChangeText}>Chụp lại</Text>
                                                </>
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                ) : (
                                    <TouchableOpacity
                                        style={styles.uploadPlaceholder}
                                        onPress={() => handleUpload(doc.key)}
                                        disabled={isUploading}
                                    >
                                        {isUploading ? (
                                            <ActivityIndicator size="large" color={COLORS.primary} />
                                        ) : (
                                            <>
                                                <Icon name="plus" size={32} color={COLORS.textTertiary} />
                                                <Text style={styles.uploadPlaceholderText}>Chụp ảnh nộp hồ sơ</Text>
                                            </>
                                        )}
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    })}
                </ScrollView>
            )}
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
    centerLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    scrollContent: {
        padding: SPACING.md,
    },
    infoBanner: {
        flexDirection: 'row',
        backgroundColor: '#E8F5E9',
        borderWidth: 1,
        borderColor: '#C8E6C9',
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    infoBannerText: {
        flex: 1,
        fontSize: 13,
        color: '#2E7D32',
        marginLeft: SPACING.sm,
        lineHeight: 18,
    },
    docCard: {
        backgroundColor: COLORS.background,
        borderRadius: RADIUS.lg,
        padding: SPACING.md,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: SPACING.md,
    },
    docHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.md,
    },
    docHeaderLeft: {
        flex: 1,
    },
    docTitle: {
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    docDesc: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    statusWrapper: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: RADIUS.sm,
    },
    statusPending: {
        backgroundColor: '#FFF9C4',
    },
    statusApproved: {
        backgroundColor: '#C8E6C9',
    },
    statusRejected: {
        backgroundColor: '#FFCDD2',
    },
    statusText: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    statusTextPending: {
        color: '#F57F17',
    },
    statusTextApproved: {
        color: '#2E7D32',
    },
    statusTextRejected: {
        color: '#C62828',
    },
    imageContainer: {
        height: 180,
        borderRadius: RADIUS.md,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    btnChange: {
        position: 'absolute',
        bottom: SPACING.sm,
        right: SPACING.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.65)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: RADIUS.full,
    },
    btnChangeText: {
        color: COLORS.white,
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    uploadPlaceholder: {
        height: 140,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: COLORS.textTertiary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    uploadPlaceholderText: {
        color: COLORS.textSecondary,
        fontSize: 14,
        fontWeight: '600',
        marginTop: 6,
    },
});
