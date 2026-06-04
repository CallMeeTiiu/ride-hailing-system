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
    StatusBar,
    DeviceEventEmitter,
    Alert,
    Linking
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';

import { useTheme } from '../../contexts/ThemeContext';
import theme from '../../constants/theme';
import { useChat } from '../../contexts/ChatContext';
import { faArrowLeft, faPaperPlane, faPhone } from '@fortawesome/free-solid-svg-icons';

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

    const handleCall = async () => {
        if (!driverData?.phone_number) {
            Alert.alert('Lỗi', 'Không tìm thấy số điện thoại của tài xế.');
            return;
        }

        const url = `tel:${driverData.phone_number}`;
        
        try {
            const supported = await Linking.canOpenURL(url);
            if (supported) {
                await Linking.openURL(url);
            } else {
                Alert.alert('Lỗi', 'Thiết bị của bạn không hỗ trợ gọi điện.');
            }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            Alert.alert('Lỗi', 'Đã có lỗi xảy ra khi cố gắng mở trình gọi điện.');
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isCustomer = item.sender === 'CUSTOMER';

        return (
            <View style={[styles.messageRow, isCustomer ? styles.rowCustomer : styles.rowDriver]}>
                <View style={[styles.bubble, isCustomer ? styles.bubbleCustomer : styles.bubbleDriver]}>
                    <Text style={[styles.messageText, isCustomer ? styles.textCustomer : styles.textDriver]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.timeText, isCustomer ? styles.timeCustomer : styles.timeDriver]}>
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.safeArea} >
            <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

            <KeyboardAvoidingView 
                style={styles.keyboardContainer}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
            >

                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
                    </TouchableOpacity>

                    <View style={styles.headerTitleContainer}>
                        <Text style={styles.headerTitle}>
                            {driverData?.name ? `${driverData.name}` : 'Bác tài'}
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.phoneBtn} activeOpacity={0.8} onPress={handleCall}>
                        <FontAwesomeIcon icon={faPhone} size={20} color={colors.textTitle} />
                    </TouchableOpacity>
                </View>

                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderItem}
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={styles.listContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.footer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Send a message..."
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
                        <View style={styles.iconOffset}>
                            <FontAwesomeIcon icon={faPaperPlane} size={20} color={colors.textTitle} />
                        </View>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const getStyles = (colors: any) => StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.COLORS.primary,
        paddingHorizontal: theme.SIZES.padding,
        ...theme.SHADOWS.light, 
        zIndex: 10,
    },
    backButton: {
        padding: theme.SIZES.base,
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
    phoneBtn: {
        padding: theme.SIZES.base,
    },
    keyboardContainer: {
        flex: 1,
    },
    listContent: {
        paddingHorizontal: theme.SIZES.padding,
        paddingVertical: theme.SIZES.padding,
        flexGrow: 1,
        justifyContent: 'flex-end',
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: theme.SIZES.padding,
        maxWidth: '80%',
    },
    rowCustomer: {
        alignSelf: 'flex-end',
    },
    rowDriver: {
        alignSelf: 'flex-start',
    },
    bubble: {
        borderRadius: theme.SIZES.radiusCard,
        paddingHorizontal: theme.SIZES.padding,
        paddingVertical: 12,
        ...theme.SHADOWS.light,
    },
    bubbleCustomer: {
        backgroundColor: colors.primary, 
        borderBottomRightRadius: 4,
    },
    bubbleDriver: {
        backgroundColor: colors.background,
        borderBottomLeftRadius: 4,
    },
    messageText: {
        fontFamily: theme.FONTS.medium,
        fontSize: theme.SIZES.body2,
        lineHeight: 22,
    },
    textCustomer: {
        color: colors.textBtn,
    },
    textDriver: {
        color: colors.textTitle,
    },
    timeText: {
        fontSize: 10,
        marginTop: 6,
        fontFamily: theme.FONTS.regular,
    },
    timeCustomer: {
        alignSelf: 'flex-end',
        color: colors.textBtn,
        opacity: 0.7,
    },
    timeDriver: {
        alignSelf: 'flex-start',
        color: colors.textBody,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.SIZES.padding,
        paddingVertical: theme.SIZES.base,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        minHeight: 45,
        maxHeight: 100,
        backgroundColor: colors.inputBg,
        borderRadius: theme.SIZES.radiusInput,
        paddingHorizontal: theme.SIZES.padding,
        paddingTop: 12,
        paddingBottom: 12,
        color: colors.textTitle,
        fontSize: theme.SIZES.body2,
        fontFamily: theme.FONTS.medium,
        marginRight: theme.SIZES.base,
    },
    sendBtn: {
        width: 45,
        height: 45,
        borderRadius: 22.5,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendBtnDisabled: {
        backgroundColor: colors.circleButtonBg,
    },
    iconOffset: {
        paddingRight: 3,
        paddingTop: 1,
    }
});