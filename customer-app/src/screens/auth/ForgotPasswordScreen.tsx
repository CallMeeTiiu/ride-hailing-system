import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  ScrollView,
  Platform 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faCommentDots, faEnvelope } from '@fortawesome/free-solid-svg-icons';

import { RootStackParamList } from '../../../App';
import { COLORS, SIZES, FONTS, SHADOWS } from '../../constants/theme';
import PrimaryButton from '../../components/common/PrimaryButton';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email'>('sms');

  return (
    <View style={styles.safeArea}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 30) }]} showsVerticalScrollIndicator={false}>
        
        {/* Header với nút Back và Tiêu đề */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Text style={styles.headerTitle}>Forgot Password</Text>

          {/* Hình ảnh minh họa */}
          <Image 
            source={require('../../assets/images/forgot_password.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={styles.description}>
            Select which contact details should we use to reset your password
          </Text>

          {/* Option 1: via SMS */}
          <TouchableOpacity 
            style={[
              styles.methodCard, 
              selectedMethod === 'sms' && styles.methodCardSelected
            ]}
            onPress={() => setSelectedMethod('sms')}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <FontAwesomeIcon icon={faCommentDots} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>via SMS:</Text>
              <Text style={styles.methodValue}>+1 111 ******99</Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: via Email */}
          <TouchableOpacity 
            style={[
              styles.methodCard, 
              selectedMethod === 'email' && styles.methodCardSelected
            ]}
            onPress={() => setSelectedMethod('email')}
            activeOpacity={0.7}
          >
            <View style={styles.iconCircle}>
              <FontAwesomeIcon icon={faEnvelope} size={22} color={COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={styles.methodLabel}>via Email:</Text>
              <Text style={styles.methodValue}>and***ley@yourdomain.com</Text>
            </View>
          </TouchableOpacity>

          {/* Nút Continue */}
          <PrimaryButton 
            title="Continue" 
            onPress={() => console.log("Tiếp tục với phương thức:", selectedMethod)}
            // eslint-disable-next-line react-native/no-inline-styles
            style={{ marginTop: 30 }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 28,
    color: COLORS.textTitle,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.textTitle,
  },
  content: {
    paddingHorizontal: SIZES.padding,
    paddingBottom: 40,
    alignItems: 'center',
  },
  illustration: {
    width: SIZES.width,
    height: 250,
    marginBottom: 20,
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.body2,
    color: COLORS.textTitle,
    textAlign: 'left',
    width: '100%',
    marginBottom: 25,
    lineHeight: 24,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 20,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#EEEEEE',
    backgroundColor: COLORS.background,
    marginBottom: 20,
  },
  methodCardSelected: {
    borderColor: COLORS.primary,
    ...SHADOWS.light,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textBody,
    marginBottom: 5,
  },
  methodValue: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textTitle,
  },
});

export default ForgotPasswordScreen;