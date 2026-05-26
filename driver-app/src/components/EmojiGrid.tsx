import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS, SPACING, RADIUS, TYPOGRAPHY } from '../theme';

export interface EmojiItem {
    id: string;
    type: 'emoji' | 'skip';
    label: string;
    emoji: string;
}

export const MOOD_EMOJIS: EmojiItem[] = [
    { id: 'cool', type: 'emoji', label: 'Cool', emoji: '😎' },
    { id: 'love', type: 'emoji', label: 'Love it', emoji: '😍' },
    { id: 'happy', type: 'emoji', label: 'Happy', emoji: '😄' },
    { id: 'laughing', type: 'emoji', label: 'Laughing', emoji: '🤣' },
    { id: 'annoyed', type: 'emoji', label: 'Annoyed', emoji: '😣' },
    { id: 'neutral', type: 'emoji', label: 'Neutral', emoji: '😐' },
    { id: 'worried', type: 'emoji', label: 'Worried', emoji: '😟' },
    { id: 'dizzy', type: 'emoji', label: 'Dizzy', emoji: '😵' },
    { id: 'crying', type: 'emoji', label: 'Crying', emoji: '😢' },
    // Option 10: Empty/Skip block
    { id: 'skip', type: 'skip', label: 'No Emoji', emoji: '' },
];

interface EmojiGridProps {
    selectedId: string | null;
    hasSelected: boolean;
    onSelect: (id: string | null) => void;
}

const EmojiGridItem = React.memo(({
    item,
    isSelected,
    onPress
}: {
    item: EmojiItem;
    isSelected: boolean;
    onPress: () => void;
}) => {
    const isSkip = item.type === 'skip';

    return (
        <TouchableOpacity
            style={[
                styles.itemContainer,
                isSelected && styles.selectedItem,
                isSkip && styles.skipItem,
            ]}
            onPress={onPress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={item.label}
        >
            {isSkip ? (
                <View style={styles.skipContent}>
                    <Icon name="block" size={28} color={COLORS.textTertiary} />
                    <Text style={styles.skipText}>Không chọn</Text>
                </View>
            ) : (
                <Text style={styles.emojiText}>{item.emoji}</Text>
            )}
        </TouchableOpacity>
    );
});

export default function EmojiGrid({ selectedId, hasSelected, onSelect }: EmojiGridProps) {
    const renderItem = useCallback(({ item }: { item: EmojiItem }) => {
        const isSelected = item.type === 'skip'
            ? hasSelected && selectedId === null
            : selectedId === item.id;

        return (
            <EmojiGridItem
                item={item}
                isSelected={isSelected}
                onPress={() => onSelect(item.type === 'skip' ? null : item.id)}
            />
        );
    }, [selectedId, hasSelected, onSelect]);

    const keyExtractor = useCallback((item: EmojiItem) => item.id, []);

    return (
        <FlatList
            data={MOOD_EMOJIS}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            numColumns={3}
            scrollEnabled={false}
            contentContainerStyle={styles.listContainer}
            columnWrapperStyle={styles.row}
        />
    );
}

const styles = StyleSheet.create({
    listContainer: {
        paddingHorizontal: SPACING.md,
        alignItems: 'center',
    },
    row: {
        justifyContent: 'center',
    },
    itemContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: RADIUS.md,
        borderWidth: 2,
        borderColor: 'transparent',
        margin: SPACING.sm - 2,
        backgroundColor: COLORS.surface,
    },
    selectedItem: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryLight,
    },
    skipItem: {
        borderStyle: 'dashed',
        borderColor: COLORS.textTertiary,
    },
    skipContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    skipText: {
        fontSize: 10,
        fontWeight: '500',
        color: COLORS.textTertiary,
        marginTop: 2,
    },
    emojiText: {
        fontSize: 36,
    },
});
