export const lightColors = {
  primary: '#FFBB1C',       
  primaryLight: '#FFF8E8',  
  
  background: '#FFFFFF',   
  backgroundLight: '#FDEECC',
  surface: '#FFFFFF',   

  inputBg: '#f6f3f2', 
  border: '#e0e0e0',
  
  textTitle: '#616161',   
  textIcon: '#837560',
  textBody: '#83756099',      
  textLight: '#9E9E9E',     

  textBtn: '#271900',
  
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

export const darkColors = {
  primary: '#FFBB1C',       
  primaryLight: '#35383F',  
  
  background: '#181A20',   
  backgroundLight: '#1F222A',
  surface: '#000000',       
  inputBg: '#1F222A',       

  border: '#e0e0e0',
  
  textTitle: '#E0E0E0',   
  textIcon: '#757575',
  textBody: '#83756099',      
  textLight: '#9E9E9E',   
  
  textBtn: '#35383F',
  
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
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