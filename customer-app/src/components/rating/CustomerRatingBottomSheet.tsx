import React, { useCallback, useMemo, useRef, useEffect } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import BottomSheet, {
    BottomSheetBackdrop,
    BottomSheetView,
} from '@gorhom/bottom-sheet';
import Animated, {
    FadeIn,
    FadeOut,
    SlideInRight,
    SlideOutLeft,
} from 'react-native-reanimated';
import { MoodStepView } from './MoodStepView';
import { StarStepView } from './StarStepView';
import { useTripStore } from '../../store/tripStore';
import { colors, radius } from '../../theme';

interface CustomerRatingBottomSheetProps {
    visible: boolean;
    onClose: () => void;
}

export const CustomerRatingBottomSheet = ({
    visible,
    onClose,
}: CustomerRatingBottomSheetProps) => {
    const bottomSheetRef = useRef<BottomSheet>(null);
    const { ratingStep } = useTripStore();
    const { height } = useWindowDimensions();

    const snapPoints = useMemo(() => {
        return ratingStep === 'mood' ? [height * 0.78] : [height * 0.58];
    }, [ratingStep, height]);

    useEffect(() => {
        if (visible) {
            bottomSheetRef.current?.expand();
        } else {
            bottomSheetRef.current?.close();
        }
    }, [visible]);

    const renderBackdrop = useCallback(
        (props: any) => (
            <BottomSheetBackdrop
                {...props}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
                opacity={0.5}
                pressBehavior="none"
            />
        ),
        [],
    );

    const handleSheetChange = useCallback(
        (index: number) => {
            if (index === -1) {
                onClose();
            }
        },
        [onClose],
    );

    if (!visible) {
        return null;
    }

    return (
        <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            enablePanDownToClose={false}
            enableDynamicSizing={false}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChange}
            backgroundStyle={styles.sheetBackground}
            handleIndicatorStyle={styles.handleIndicator}>
            <BottomSheetView style={styles.contentContainer}>
                {ratingStep === 'mood' ? (
                    <Animated.View
                        key="mood"
                        entering={FadeIn.duration(300)}
                        exiting={SlideOutLeft.duration(250)}>
                        <MoodStepView />
                    </Animated.View>
                ) : (
                    <Animated.View
                        key="star"
                        entering={SlideInRight.duration(300)}
                        exiting={FadeOut.duration(200)}>
                        <StarStepView />
                    </Animated.View>
                )}
            </BottomSheetView>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    sheetBackground: {
        backgroundColor: colors.background,
        borderTopLeftRadius: radius.lg,
        borderTopRightRadius: radius.lg,
    },
    handleIndicator: {
        backgroundColor: colors.border,
        width: 40,
    },
    contentContainer: {
        flex: 1,
        overflow: 'hidden',
    },
});
