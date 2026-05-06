import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface MethodCardProps {
  id: string;
  name: string;
  nearbies: number;
  price: number;
  icon: any;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

const MethodCard: React.FC<MethodCardProps> = ({ 
  id, name, nearbies, price, icon, isSelected, onSelect 
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={[
        styles.cardContainer, 
        { backgroundColor: colors.background },
        isSelected && styles.cardSelected,
      ]}
      activeOpacity={0.8}
      onPress={() => onSelect(id)}
    >
      <View style={styles.iconWrapper}>
        <FontAwesomeIcon icon={icon} size={24} color={colors.textTitle} />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.nameText, { color: colors.textTitle }]}>{name}</Text>
        <Text style={[styles.nearbiesText, { color: colors.textBody }]}>
          {nearbies} nearbies
        </Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={[styles.priceText, { color: colors.textTitle }]}>
          ${price.toFixed(2)}
        </Text>
        
        <View style={[
          styles.radioOuter, 
          { borderColor: isSelected ? theme.COLORS.primary : colors.textBody }
        ]}>
          {isSelected && <View style={[styles.radioInner, { backgroundColor: theme.COLORS.primary }]} />}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,

    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cardSelected: {
    borderColor: theme.COLORS.primary, 
    borderWidth: 1
  },
  iconWrapper: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: theme.COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  nameText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
    marginBottom: 4,
  },
  nearbiesText: {
    fontFamily: theme.FONTS.regular,
    fontSize: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceText: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
    marginRight: 15,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});

export default MethodCard;