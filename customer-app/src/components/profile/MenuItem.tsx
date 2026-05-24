import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

interface MenuItemProps {
  icon: any;
  title: string;
  value?: string;
  hasArrow?: boolean;
  rightComponent?: React.ReactNode;
  isDanger?: boolean;
  onPress?: () => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  icon, 
  title, 
  value, 
  hasArrow = true, 
  rightComponent, 
  isDanger = false, 
  onPress 
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity 
      style={styles.menuItem} 
      activeOpacity={0.7} 
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.iconWrapper}>
          <FontAwesomeIcon icon={icon} size={20} color={isDanger ? colors.red : colors.textTitle} />
        </View>
        <Text style={[styles.menuItemTitle, { color: isDanger ? colors.red : colors.textTitle }]}>
          {title}
        </Text>
      </View>
      
      <View style={styles.menuItemRight}>
        {value && <Text style={[styles.menuItemValue, { color: colors.textTitle }]}>{value}</Text>}
        {rightComponent}
        {hasArrow && !rightComponent && (
          <FontAwesomeIcon icon={faChevronRight} size={14} color={colors.textBody} />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrapper: {
    width: 30,
    alignItems: 'flex-start',
  },
  menuItemTitle: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 18,
    marginLeft: 10,
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemValue: {
    fontFamily: theme.FONTS.semiBold,
    fontSize: 16,
    marginRight: 10,
  },
});

export default MenuItem;