const commonColors = {
  primary: '#FFBB1C',
  border: '#e0e0e0',
  textBody: '#83756099',
  circleButtonBg: '#ffe4a3',
  iconDisable: '#9e9e9e',
  white: '#FFFFFF',
  black: '#000000',
  red: '#FF4D4D',
  transparent: 'transparent',
};

export const lightColors = {
  ...commonColors,
  primaryLight: '#FFF8E8',
  background: '#FFFFFF',
  backgroundLight: '#FDEECC',
  surface: '#FFFFFF',
  inputBg: '#f6f3f2',
  textTitle: '#616161',
  textIcon: '#837560',
  textBtn: '#271900',
};

export const darkColors = {
  ...commonColors,
  primaryLight: '#35383F',
  background: '#181A20',
  backgroundLight: '#1F222A',
  surface: '#000000',
  inputBg: '#1F222A',
  textTitle: '#E0E0E0',
  textIcon: '#757575',
  textBtn: '#35383F',
};

export const COLORS = lightColors;

export const SIZES = {
  base: 8,
  padding: 20,       
  margin: 20,
  radiusButton: 100,       
  radiusCard: 16,    
  radiusInput: 16,   
  h1: 32,            
  h2: 24,            
  h3: 18,            
  body1: 16,        
  body2: 14,         
  small: 12,
  width: 200,
};

export const FONTS = {
  regular: 'Montserrat-Regular',
  medium: 'Montserrat-Medium',
  semiBold: 'Montserrat-SemiBold',
  bold: 'Montserrat-Bold',
};

export const SHADOWS = {
  light: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3, 
  },
  primaryGlow: {
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8, 
  }
};

const theme = { COLORS, SIZES, FONTS, SHADOWS, lightColors, darkColors };
export default theme;