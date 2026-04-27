export const COLORS = {
  primary: '#FFBB1C',       
  primaryLight: '#FFF8E8',  
  
  background: '#FFFFFF',   
  surface: '#FFFFFF',       
  inputBg: '#f6f3f2',       
  
  textTitle: '#616161',   
  textIcon: '#837560',
  textBody: '#83756099',      
  textLight: '#9E9E9E',     
  
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

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

const theme = { COLORS, SIZES, FONTS, SHADOWS };
export default theme;