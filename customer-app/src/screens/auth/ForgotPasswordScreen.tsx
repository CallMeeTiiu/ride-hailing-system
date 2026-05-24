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
import theme from '../../constants/theme';
import { useTheme } from '../../contexts/ThemeContext' 
import PrimaryButton from '../../components/common/PrimaryButton';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const insets = useSafeAreaInsets();
  
  const [selectedMethod, setSelectedMethod] = useState<'sms' | 'email'>('sms');

  const { colors } = useTheme();

  return (
    <View style={[ styles.safeArea, {backgroundColor: colors.background} ]}>
      <ScrollView contentContainerStyle={[styles.scrollContainer, { paddingBottom: Math.max(insets.bottom, 30) }]} showsVerticalScrollIndicator={false}>
        
        {/* Header với nút Back và Tiêu đề */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Text style={[ styles.backIcon, {color: colors.textTitle} ]}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Forgot Password</Text>
        </View>

        <View style={styles.content}>
          {/* Hình ảnh minh họa */}
          <Image 
            source={require('../../assets/images/forgot_password.png')} 
            style={styles.illustration}
            resizeMode="contain"
          />

          <Text style={[ styles.description, {color: colors.textTitle} ]}>
            Select which contact details should we use to reset your password
          </Text>

          {/* Option 1: via SMS */}
          <TouchableOpacity 
            style={[
              styles.methodCard, 
              selectedMethod === 'sms' && styles.methodCardSelected,
              {backgroundColor: colors.background}
            ]}
            onPress={() => setSelectedMethod('sms')}
            activeOpacity={0.7}
          >
            <View style={[ styles.iconCircle, {backgroundColor: colors.backgroundLight} ]}>
              <FontAwesomeIcon icon={faCommentDots} size={22} color={theme.COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[ styles.methodLabel, {color: colors.textBody} ]}>via SMS:</Text>
              <Text style={[ styles.methodValue, {color: colors.textTitle} ]}>+1 111 ******99</Text>
            </View>
          </TouchableOpacity>

          {/* Option 2: via Email */}
          <TouchableOpacity 
            style={[
              styles.methodCard, 
              selectedMethod === 'email' && styles.methodCardSelected,
              {backgroundColor: colors.background}
            ]}
            onPress={() => setSelectedMethod('email')}
            activeOpacity={0.7}
          >
            <View style={[ styles.iconCircle, {backgroundColor: colors.backgroundLight} ]}>
              <FontAwesomeIcon icon={faEnvelope} size={22} color={theme.COLORS.primary} />
            </View>
            <View style={styles.methodInfo}>
              <Text style={[ styles.methodLabel, {color: colors.textBody} ]}>via Email:</Text>
              <Text style={[ styles.methodValue, {color: colors.textTitle} ]}>and***ley@yourdomain.com</Text>
            </View>
          </TouchableOpacity>

          {/* Nút Continue */}
          <PrimaryButton 
            title="Continue" 
            onPress={() => { // mock
              const value = selectedMethod === 'sms' ? '+1 111 ******99' : 'and***ley@yourdomain.com';
              
              navigation.navigate('FillOTP', { 
                contactMethod: selectedMethod, 
                contactValue: value 
              });
            }}
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
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  headerRow: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: theme.SIZES.padding,
    paddingTop: Platform.OS === 'android' ? 20 : 10,
    marginBottom: 20,
  },
  backButton: {
    marginRight: 15,
  },
  backIcon: {
    fontSize: 28,
  },
  headerTitle: {
    fontFamily: theme.FONTS.bold,
    fontSize: 24,
    color: 'black',
  },
  content: {
    paddingHorizontal: theme.SIZES.padding,
    paddingBottom: 40,
    alignItems: 'center',
  },
  illustration: {
    width: theme.SIZES.width,
    height: 250,
    marginBottom: 20,
  },
  description: {
    fontFamily: theme.FONTS.medium,
    fontSize: theme.SIZES.body2,
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
    marginBottom: 20,
  },
  methodCardSelected: {
    borderColor: theme.COLORS.primary,
    ...theme.SHADOWS.light,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  methodInfo: {
    flex: 1,
  },
  methodLabel: {
    fontFamily: theme.FONTS.medium,
    fontSize: 14,
    marginBottom: 5,
  },
  methodValue: {
    fontFamily: theme.FONTS.bold,
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;