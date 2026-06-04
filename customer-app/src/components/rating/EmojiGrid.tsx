import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { EmojiGridItem } from './EmojiGridItem';
import type { EmojiItem } from '../../types';
import { spacing } from '../../theme';

interface EmojiGridProps {
    emojis: EmojiItem[];
    selectedId: string | null;
    hasSelected: boolean;
    onSelect: (id: string | null) => void;
}

export const EmojiGrid = React.memo(
    ({ emojis, selectedId, hasSelected, onSelect }: EmojiGridProps) => {
        const keyExtractor = useCallback((item: EmojiItem) => item.id, []);

        const renderItem = useCallback(
            ({ item }: { item: EmojiItem }) => {
                const isSelected =
                    item.type === 'skip'
                        ? hasSelected && selectedId === null
                        : selectedId === item.id;

                return (
                    <EmojiGridItem
                        item={item}
                        isSelected={isSelected}
                        onPress={() =>
                            onSelect(item.type === 'skip' ? null : item.id)
                        }
                    />
                );
            },
            [selectedId, hasSelected, onSelect],
        );

        return (
            <View style={styles.container}>
                <FlatList
                    data={emojis}
                    renderItem={renderItem}
                    keyExtractor={keyExtractor}
                    numColumns={3}
                    scrollEnabled={false}
                    contentContainerStyle={styles.grid}
                    columnWrapperStyle={styles.row}
                />
            </View>
        );
    },
);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacing.md,
    },
    grid: {
        alignItems: 'center',
    },
    row: {
        justifyContent: 'center',
    },
});
