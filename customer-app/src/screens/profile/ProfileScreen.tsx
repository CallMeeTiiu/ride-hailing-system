import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView, 
  Switch, 
  Alert,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback
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
  faPen,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext';

import ConfirmBottomSheet from '../../components/profile/ConfirmBottomSheet';
import MenuItem from '../../components/profile/MenuItem';
import { useAuth } from '../../contexts/AuthContext';
import { useUser } from '../../contexts/UserContext';
import { useNavigation } from '@react-navigation/native';
import { launchImageLibrary, ImageLibraryOptions } from 'react-native-image-picker';

const ProfileScreen = () => {
  const [isLogoutModalVisible, setIsLogoutModalVisible] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English (US)');
  const [isLangModalVisible, setLangModalVisible] = useState(false);

  const { colors, isDarkMode, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  const { logout } = useAuth();
  const { profile, uploadAvatar } = useUser();
  const navigation = useNavigation<any>();

  const BACKEND_URL = 'https://ride-hailing-system-nuf0.onrender.com';

  const LANGUAGES = [
    { code: 'en', label: 'English (US)' },
    { code: 'vi', label: 'Tiếng Việt' },
  ];

  const handleSelectLanguage = (langLabel: string) => {
    setCurrentLanguage(langLabel);
    setLangModalVisible(false);
  };

  const getAvatarUri = () => {
    if (!profile?.avatar_url) {
      return 'https://cdn-icons-png.flaticon.com/512/219/219988.png';
    }
    if (profile.avatar_url.startsWith('http')) {
      return profile.avatar_url;
    }
    return `${BACKEND_URL}${profile.avatar_url}`;
  };

  const handleLogoutAction = async () => {
    try {
      await logout();
      
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  const handleUpdateAvatar = () => {
    const options: ImageLibraryOptions = {
      mediaType: 'photo' as const,
      quality: 0.8,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Unable to open image library');
      } else if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        
        if (asset.uri) {
          try {
            setIsUploading(true);
            const mimeType = asset.type || 'image/jpeg';
            const fileName = asset.fileName || `avatar_${Date.now()}.jpg`;
            await uploadAvatar(asset.uri, mimeType, fileName);
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            Alert.alert('Failed', 'Unable to upload image. Please try again!');
          } finally {
            setIsUploading(false);
          }
        }
      }
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.userInfoSection}>
          <View style={styles.avatarContainer}>
            <Image 
              source={{ uri: getAvatarUri() }} 
              style={styles.avatar} 
            />

            <TouchableOpacity 
              style={[styles.editAvatarButton, { backgroundColor: theme.COLORS.primary }]} 
              activeOpacity={0.8}
              onPress={handleUpdateAvatar}
              disabled={isUploading}
            >
              <FontAwesomeIcon icon={faPen} size={12} color={colors.white} />
            </TouchableOpacity>

            {isUploading && (
              <View style={[
                StyleSheet.absoluteFill,
                // eslint-disable-next-line react-native/no-inline-styles
                { 
                  backgroundColor: 'rgba(0, 0, 0, 0.4)', 
                  borderRadius: 100,
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }
              ]}>
                <ActivityIndicator size="small" color={colors.white} />
              </View>
            )}
          </View>
          
          <Text style={[styles.userName, { color: colors.textTitle }]}>{profile?.name || "New User"}</Text>
          <Text style={[styles.userPhone, { color: colors.textBody }]}>{profile?.phone_number || ""}</Text>
          <Text style={[styles.userPhone, { color: colors.textBody }]}>{profile?.email || ""}</Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

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
          {/* <MenuItem 
            icon={faBell} 
            title="Notification" 
            onPress={() => console.log('Go to Notification')} 
          /> */}
          <MenuItem 
            icon={faGlobe} 
            title="Language" 
            value={currentLanguage}
            onPress={() => setLangModalVisible(true)} 
          />

          <Modal
            visible={isLangModalVisible}
            transparent={true}
            animationType="fade"
            onRequestClose={() => setLangModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setLangModalVisible(false)}>
              <View style={styles.modalOverlay}>
                <TouchableWithoutFeedback>
                  <View style={[styles.modalContent, { backgroundColor: colors.background }]}>
                    <Text style={[styles.modalTitle, { color: colors.textTitle }]}>
                      Select Language
                    </Text>
                    
                    {LANGUAGES.map((lang) => (
                      <TouchableOpacity 
                        key={lang.code}
                        style={styles.langOption}
                        onPress={() => handleSelectLanguage(lang.label)}
                      >
                        <Text style={[
                          styles.langText, 
                          { color: currentLanguage === lang.label ? colors.primary : colors.textTitle }
                        ]}>
                          {lang.label}
                        </Text>
                        
                        {currentLanguage === lang.label && (
                          <FontAwesomeIcon icon={faCheck} size={20} color={colors.primary} />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  modalTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  langOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE', 
  },
  langText: {
    fontFamily: theme.FONTS.medium,
    fontSize: 16,
  },
});

export default ProfileScreen;