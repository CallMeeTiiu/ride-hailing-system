import React, { useState, useRef, useEffect, useMemo } from 'react';
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
    StatusBar, 
    DeviceEventEmitter
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';

import { useTheme } from '../../contexts/ThemeContext'; 
import theme from '../../constants/theme';
import { useChat } from '../../contexts/ChatContext';

export default function ChatScreen() {
    const navigation = useNavigation();
    const route = useRoute<any>();
    
    const { colors } = useTheme();
    const styles = useMemo(() => getStyles(colors), [colors]);

    const { driverData, tripId } = route.params || {};
    const { messages, addMessage, setUnread } = useChat();
    
    const [inputText, setInputText] = useState('');
    const flatListRef = useRef<FlatList>(null);

    useEffect(() => {
        setUnread(false);
    }, [setUnread]);

    useEffect(() => {
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const textToSend = inputText.trim();
        const newMsg = {
            text: textToSend,
            sender: 'CUSTOMER' as const,
            timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        };

        addMessage(newMsg);
        setInputText('');

        DeviceEventEmitter.emit('emit_send_message', {
            trip_id: tripId,
            text: textToSend,
            sender: 'CUSTOMER',
        });
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCustomer = item.sender === 'CUSTOMER';

        return (
            <View style={[styles.messageRow, isCustomer ? styles.rowCustomer : styles.rowDriver]}>
                {!isCustomer && driverData && (
                    <Image source={{ uri: driverData.avatar }} style={styles.chatAvatar} />
                )}
                <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleDriver]}>
                    {item.text ? (
                        <Text style={[styles.messageText, isCustomer ? styles.textCustomer : styles.textDriver]}>
                            {item.text}
                        </Text>
                    ) : null}
                    <Text style={[styles.timeText, isCustomer ? styles.timeCustomer : styles.timeDriver]}>
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
                    <Icon name="arrow-left" size={24} color={colors.textTitle} />
                </TouchableOpacity>

                {driverData && (
                    <>
                        <Image source={{ uri: driverData.avatar }} style={styles.headerAvatar} />
                        <View style={styles.headerTitleContainer}>
                            <Text style={styles.headerTitle}>Bác tài {driverData.name}</Text>
                            <Text style={styles.headerStatus}>Biển số: {driverData.plateNumber}</Text>
                        </View>
                    </>
                )}
            </View>

            {/* Body */}
            <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={renderItem}
                keyExtractor={(_, index) => index.toString()}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
            />

            {/* Footer */}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nhập tin nhắn..."
                        placeholderTextColor={colors.textBody}
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
                        <Icon name="send" size={18} color={colors.textBtn} />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.backgroundLight,
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        paddingHorizontal: theme.SIZES.padding,
    },
    backBtn: {
        padding: theme.SIZES.base,
        marginRight: theme.SIZES.base,
    },
    headerAvatar: {
        width: 38,
        height: 38,
        borderRadius: 19,
        marginRight: theme.SIZES.base,
    },
    headerTitleContainer: {
        flex: 1,
    },
    headerTitle: {
        color: colors.textTitle,
        fontFamily: theme.FONTS.bold,
        fontSize: theme.SIZES.h3,
    },
    headerStatus: {
        color: colors.textBody,
        fontFamily: theme.FONTS.regular,
        fontSize: theme.SIZES.small,
    },
    listContent: {
        paddingHorizontal: theme.SIZES.padding,
        paddingVertical: theme.SIZES.padding,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: theme.SIZES.padding,
        maxWidth: '80%',
    },
    rowCustomer: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    rowDriver: {
        alignSelf: 'flex-start',
        alignItems: 'flex-end',
    },
    chatAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: theme.SIZES.base,
    },
    bubble: {
        borderRadius: theme.SIZES.radiusCard,
        paddingHorizontal: theme.SIZES.padding,
        paddingVertical: theme.SIZES.base,
        shadowColor: colors.black,
        shadowOffset: { 
            width: 0, 
            height: 1 
        },
        shadowOpacity: 0.05,
        shadowRadius: 1,
    },
    bubbleCustomer: {
        backgroundColor: colors.primary,
        borderTopRightRadius: 4,
    },
    bubbleDriver: {
        backgroundColor: colors.surface,
        borderTopLeftRadius: 4,
        borderWidth: 1,
        borderColor: colors.border,
    },
    messageText: {
        lineHeight: 20,
        fontFamily: theme.FONTS.medium,
        fontSize: theme.SIZES.body2,
    },
    textCustomer: {
        color: colors.textBtn,
    },
    textDriver: {
        color: colors.textTitle,
    },
    timeText: {
        fontSize: 10,
        marginTop: 4,
        alignSelf: 'flex-end',
        fontFamily: theme.FONTS.regular,
    },
    timeCustomer: {
        color: colors.textBtn,
        opacity: 0.8,
    },
    timeDriver: {
        color: colors.textBody,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.SIZES.base,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        minHeight: 40,
        maxHeight: 100,
        backgroundColor: colors.inputBg,
        borderRadius: theme.SIZES.radiusInput,
        paddingHorizontal: theme.SIZES.padding,
        paddingTop: 8,
        paddingBottom: 8,
        color: colors.textTitle,
        fontSize: theme.SIZES.body1,
        fontFamily: theme.FONTS.regular,
        marginRight: theme.SIZES.base,
    },
    sendBtn: {
        width: 40,
        height: 40,
        borderRadius: theme.SIZES.radiusButton,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: colors.iconDisable,
    },
});