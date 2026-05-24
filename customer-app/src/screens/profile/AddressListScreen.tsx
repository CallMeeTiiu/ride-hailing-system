import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faPen, faHome, faBriefcase, faCoffee, faGraduationCap, faMapMarkerAlt,
  faShoppingCart, faUtensils, faHospital, faDumbbell, faPlane, 
  faTrain, faHeart, faGamepad, faMusic, faTree, faStore,
  faArrowLeft,
  faTrash
} from '@fortawesome/free-solid-svg-icons';

import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';
import { useAddress } from '../../contexts/AddressContext';
import PrimaryButton from '../../components/common/PrimaryButton';

export const getIconObject = (iconName: string) => {
  switch (iconName) {
    case 'home': return faHome;
    case 'briefcase': return faBriefcase;
    case 'coffee': return faCoffee;
    case 'graduation-cap': return faGraduationCap;
    case 'shopping-cart': return faShoppingCart; 
    case 'utensils': return faUtensils;         
    case 'hospital': return faHospital;         
    case 'dumbbell': return faDumbbell;        
    case 'plane': return faPlane;             
    case 'train': return faTrain;             
    case 'heart': return faHeart;               
    case 'gamepad': return faGamepad;           
    case 'music': return faMusic;               
    case 'tree': return faTree;              
    case 'store': return faStore;             
    default: return faMapMarkerAlt;
  }
};

const AddressListScreen = ({ navigation }: any) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { addresses, removeAddress } = useAddress();

  const renderItem = ({ item }: any) => (
    <View style={[styles.itemContainer, { borderBottomColor: colors.border }]}>
      <View style={[styles.iconWrapper, { backgroundColor: theme.COLORS.primaryLight }]}>
        <FontAwesomeIcon icon={getIconObject(item.icon)} size={20} color={theme.COLORS.primary} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={[styles.itemName, { color: colors.textTitle }]}>{item.name}</Text>
        <Text style={[styles.itemDetails, { color: colors.textBody }]} numberOfLines={2}>
          {item.details}
        </Text>
      </View>
      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('EditAddress', { addressId: item.id })}
        >
          <FontAwesomeIcon icon={faPen} size={16} color={theme.COLORS.primary} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => removeAddress(item.id)}
        >
          <FontAwesomeIcon icon={faTrash} size={16} color={theme.COLORS.red} /> 
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={[ styles.header ]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesomeIcon icon={faArrowLeft} size={20} color={colors.textTitle} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.textTitle }]}>Address</Text>
        {/* eslint-disable-next-line react-native/no-inline-styles */}
        <View style={{ width: 20 }} /> 
    </View>

      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom + 20, 20) }]}>
        <PrimaryButton 
          title="Add New Address" 
          onPress={() => navigation.navigate('EditAddress')} 
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: { 
    fontSize: 22, 
    fontFamily: theme.FONTS.bold 
  },
  listContent: { 
    paddingHorizontal: 20 
  },
  itemContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingVertical: 15, 
    borderBottomWidth: 1,
  },
  iconWrapper: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    justifyContent: 'center', 
    alignItems: 'center',
    marginRight: 15,
  },
  textWrapper: { 
    flex: 1, 
    paddingRight: 10 
  },
  itemName: { 
    fontSize: 16, 
    fontFamily: theme.FONTS.bold, 
    marginBottom: 4 
  },
  itemDetails: { 
    fontSize: 14, 
    fontFamily: theme.FONTS.regular 
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionButton: {
    padding: 8, 
  },
  editButton: { 
    padding: 10 
  },
  footer: { 
    paddingHorizontal: 20, 
    paddingTop: 10 
  },
});

export default AddressListScreen;