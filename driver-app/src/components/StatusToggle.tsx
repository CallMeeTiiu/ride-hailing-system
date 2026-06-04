import React, { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, LayoutAnimation } from 'react-native';
import { COLORS } from '../theme';
import Icon from 'react-native-vector-icons/Feather';

interface StatusToggleProps {
    isOnline: boolean;
    onToggle: () => void;
}

export default function StatusToggle({ isOnline, onToggle }: StatusToggleProps) {
    useEffect(() => {
        // Tự động chạy animation khi isOnline thay đổi
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }, [isOnline]);

    return (
        <TouchableOpacity
            activeOpacity={0.85}
            style={[
                styles.container,
                { flexDirection: isOnline ? 'row-reverse' : 'row' },
                isOnline ? styles.onlineBg : styles.offlineBg,
            ]}
            onPress={onToggle}
        >
            {/* Nút tròn (Thumb) */}
            <View style={styles.thumb}>
                <Icon
                    name="power"
                    size={16}
                    color={isOnline ? COLORS.success : COLORS.textSecondary}
                />
            </View>

            {/* Khung Text co giãn chiếm trọn phần còn lại và căn giữa */}
            <Text style={styles.text}>
                {isOnline ? 'ONLINE' : 'OFFLINE'}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: 150,
        height: 52,
        borderRadius: 26,
        paddingHorizontal: 6,
        alignItems: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 3,
    },
    onlineBg: {
        backgroundColor: COLORS.success,
    },
    offlineBg: {
        backgroundColor: COLORS.textSecondary,
    },
    thumb: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    text: {
        flex: 1,
        textAlign: 'center',
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 15,
        letterSpacing: 0.5,
    },
});
