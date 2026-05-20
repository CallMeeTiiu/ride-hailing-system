import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Image,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import { useTripStore } from '../store/tripStore';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';
import { MOCK_CHAT_HISTORY } from '../data/mockData';
import { ChatMessage } from '../types';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

export default function ChatScreen() {
    const navigation = useNavigation();
    const currentTrip = useTripStore((state) => state.currentTrip);
    const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_HISTORY);
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    // Auto scroll to bottom when opening/sending
    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMsg: ChatMessage = {
            id: `msg_drv_${Date.now()}`,
            senderId: 'drv_001',
            text: inputText.trim(),
            timestamp: new Date().toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
            }),
            isDriver: true,
        };

        setMessages((prev) => [...prev, newMsg]);
        setInputText('');

        // Simulated quick customer auto-reply after 2.5s for cool demo!
        setTimeout(() => {
            const autoReply: ChatMessage = {
                id: `msg_cust_${Date.now()}`,
                senderId: currentTrip?.customer.id || 'cust_987',
                text: 'Ok anh, tôi thấy anh rồi.',
                timestamp: new Date().toLocaleTimeString('vi-VN', {
                    hour: '2-digit',
                    minute: '2-digit',
                }),
                isDriver: false,
            };
            setMessages((prev) => [...prev, autoReply]);
        }, 2500);
    };

    const renderItem = ({ item }: { item: ChatMessage }) => {
        const isDriver = item.isDriver;

        return (
            <View
                style={[
                    styles.messageRow,
                    isDriver ? styles.rowDriver : styles.rowCustomer,
                ]}
            >
                {!isDriver && currentTrip && (
                    <Image
                        source={{ uri: currentTrip.customer.avatarUrl }}
                        style={styles.chatAvatar}
                    />
                )}
                <View
                    style={[
                        styles.bubble,
                        isDriver ? styles.bubbleDriver : styles.bubbleCustomer,
                    ]}
                >
                    {item.text ? (
                        <Text
                            style={[
                                styles.messageText,
                                TYPOGRAPHY.body,
                                isDriver ? styles.textDriver : styles.textCustomer,
                            ]}
                        >
                            {item.text}
                        </Text>
                    ) : null}
                    <Text
                        style={[
                            styles.timeText,
                            TYPOGRAPHY.small,
                            isDriver ? styles.timeDriver : styles.timeCustomer,
                        ]}
                    >
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header Block Section */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.8}
                >
                    <Icon name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>

                {currentTrip && (
                    <>
                        <Image
                            source={{ uri: currentTrip.customer.avatarUrl }}
                            style={styles.headerAvatar}
                        />
                        <View style={styles.headerTitleContainer}>
                            <Text style={[styles.headerTitle, TYPOGRAPHY.h3]}>
                                Cán bộ {currentTrip.customer.name}
                            </Text>
                            <Text style={[styles.headerStatus, TYPOGRAPHY.caption]}>
                                Rating: {currentTrip.customer.rating} ★
                            </Text>
                        </View>
                    </>
                )}
            </View>

            {/* Messages FlatList Body */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
            />

            {/* Typing Footer Action */}
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        placeholderTextColor={COLORS.textTertiary}
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        maxLength={250}
                    />
                    <TouchableOpacity
                        style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
                        disabled={!inputText.trim()}
                        onPress={handleSend}
                        activeOpacity={0.8}
                    >
                        <Icon name="send" size={18} color={COLORS.white} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F7',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.background,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
        paddingHorizontal: SPACING.md,
    },
    backBtn: {
        padding: SPACING.xs,
        marginRight: SPACING.sm,
    },
    headerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginRight: SPACING.sm,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        color: COLORS.textPrimary,
        fontWeight: '700',
    },
    headerStatus: {
        color: COLORS.textSecondary,
        fontSize: 12,
    },
    listContent: {
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.lg,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: SPACING.md,
        maxWidth: '80%',
    },
    rowCustomer: {
        alignSelf: 'flex-start',
        alignItems: 'flex-end',
    },
    rowDriver: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    chatAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: SPACING.sm,
    },
    bubble: {
        borderRadius: RADIUS.lg,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    bubbleCustomer: {
        backgroundColor: COLORS.background,
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: '#EEEEEE',
    },
    bubbleDriver: {
        backgroundColor: COLORS.primary,
        borderTopRightRadius: 4,
    },
    messageText: {
        lineHeight: 20,
    },
    textCustomer: {
        color: COLORS.textPrimary,
    },
    textDriver: {
        color: COLORS.white,
        fontWeight: '500',
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    timeCustomer: {
        color: COLORS.textSecondary,
    },
    timeDriver: {
        color: COLORS.white,
        opacity: 0.8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.sm,
        backgroundColor: COLORS.background,
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: COLORS.surface,
        borderRadius: RADIUS.md,
        paddingHorizontal: SPACING.md,
        paddingTop: 8,
        paddingBottom: 8,
        color: COLORS.textPrimary,
        fontSize: 16,
        marginRight: SPACING.sm,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.primaryDark,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: COLORS.textTertiary,
    },
});
