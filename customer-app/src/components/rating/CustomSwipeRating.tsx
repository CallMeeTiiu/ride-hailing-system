import React, { useRef } from 'react';
import { View, StyleSheet, PanResponder, GestureResponderEvent, LayoutChangeEvent } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faStar as faStarSolid, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons'; 
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import theme from '../../constants/theme';

interface CustomSwipeRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  starSize?: number;
}

const CustomSwipeRating: React.FC<CustomSwipeRatingProps> = ({ 
  rating, 
  onRatingChange, 
  starSize = 42 
}) => {
  const widthRef = useRef<number>(0);
  const startXRef = useRef<number>(0);

  const calculateRating = (x: number) => {
    if (widthRef.current === 0) return;
    
    let exactRating = (x / widthRef.current) * 5;
    if (exactRating < 0) exactRating = 0;
    if (exactRating > 5) exactRating = 5;

    let snappedRating = Math.ceil(exactRating * 2) / 2;
    onRatingChange(snappedRating);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,

      onPanResponderGrant: (evt: GestureResponderEvent) => {
        const x = evt.nativeEvent.locationX;
        startXRef.current = x;
        calculateRating(x);
      },

      onPanResponderMove: (evt: GestureResponderEvent, gestureState: any) => {
        const currentX = startXRef.current + gestureState.dx;
        calculateRating(currentX);
      },
    })
  ).current;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarSolid} size={starSize} color={theme.COLORS.primary} />);
      } else if (rating >= i - 0.5) {
        stars.push(<FontAwesomeIcon key={i} icon={faStarHalfStroke} size={starSize} color={theme.COLORS.primary} />);
      } else {
        stars.push(<FontAwesomeIcon key={i} icon={faStarRegular} size={starSize} color={theme.COLORS.primary} />);
      }
    }
    return stars;
  };

  return (
    <View 
      {...panResponder.panHandlers}
      onLayout={(e: LayoutChangeEvent) => {
        widthRef.current = e.nativeEvent.layout.width;
      }}
      style={styles.container}
    >
      <View pointerEvents="none" style={styles.starsRow}>
        {renderStars()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 260, 
  }
});

export default CustomSwipeRating;