import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { 
  faUser, 
  faLocationDot, 
  faBell, 
  faGlobe, 
  faEye, 
  faRightFromBracket,
  faPen
} from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

import ConfirmBottomSheet from '../../components/profile/ConfirmBottomSheet';
import MenuItem from '../../components/profile/MenuItem';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);

  const { colors, isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const { user, logout } = useAuth();
  const { profile } = useUser();
  const navigation = useNavigation<any>();

  const handleLogoutAction = async () => {
    try {
      await logout();
      
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* 1. Phần Thông tin User */}
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: profile?.avatar || 'https://cdn-icons-png.flaticon.com/512/219/219988.png' }} 
              style={styles.avatar} 
            />
            <TouchableOpacity style={[styles.editAvatarButton, { backgroundColor: theme.COLORS.primary }]} activeOpacity={0.8}>
              <FontAwesomeIcon icon={faPen} size={12} color={colors.white} />
            </TouchableOpacity>
          </View>
          
          <Text style={[styles.userName, { color: colors.textTitle }]}>{profile?.name || "New User"}</Text>
          <Text style={[styles.userPhone, { color: colors.textBody }]}>{user?.phone_number || ""}</Text>
          <Text style={[styles.userPhone, { color: colors.textBody }]}>{profile?.email || ""}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        {/* 2. Phần Các chức năng Menu */}
        <View style={styles.menuSection}>
          <MenuItem 
            icon={faUser} 
            title="Edit Profile" 
            onPress={() => navigation.navigate('EditProfile')} 
          />
          <MenuItem 
            icon={faLocationDot} 
            title="Address" 
            onPress={() => navigation.navigate('AddressList')} 
          />
          <MenuItem 
            icon={faBell} 
            title="Notification" 
            onPress={() => console.log('Go to Notification')} 
          />
          <MenuItem 
            icon={faGlobe} 
            title="Language" 
            value="English (US)"
            onPress={() => console.log('Change Language')} 
          />
          
          <MenuItem 
            icon={faEye} 
            title="Dark Mode" 
            hasArrow={false}
            onPress={toggleTheme}
            rightComponent={
              <Switch
                trackColor={{ false: '#E0E0E0', true: theme.COLORS.primary }}
                thumbColor={'white'}
                ios_backgroundColor="#3e3e3e"
                onValueChange={toggleTheme}
                value={isDarkMode}
              />
            }
          />

          <MenuItem 
            icon={faRightFromBracket} 
            title="Logout" 
            isDanger={true}
            hasArrow={false}
            onPress={() => {
                setIsLogoutModalVisible(true);
            }} 
          />
        </View>
        
      </ScrollView>

      <ConfirmBottomSheet 
        visible={isLogoutModalVisible}
        title="Logout"
        message="Are you sure you want to log out?" 
        cancelText="Cancel"
        confirmText="Yes, Logout"
        isTitleDanger={true}
        onCancel={() => setIsLogoutModalVisible(false)} 
        onConfirm={handleLogoutAction} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  userInfoSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 15,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'white', 
    ...theme.SHADOWS.light,
  },
  userName: {
    fontFamily: theme.FONTS.bold,
    fontSize: 24,
    marginBottom: 5,
  },
  userPhone: {
    fontFamily: theme.FONTS.medium,
    fontSize: 16,
  },
  divider: {
    height: 1,
    width: '100%',
    opacity: 0.5,
  },
  menuSection: {
    paddingHorizontal: theme.SIZES.padding,
    paddingTop: 20,
  },
});

export default ProfileScreen;