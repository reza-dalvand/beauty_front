import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', 
    // paddingHorizontal: width * 0.06,
    justifyContent: 'center',
  },
  
  titleText: {
    fontSize: width * 0.07,
    color: '#D4AF37',
    fontFamily: 'vazir_bold',
    textAlign: 'center',
  },

  formGroup: {
    width: '100%',
    marginTop: 20,
  },

  centerAll: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export const COLORS = {
    background: '#0B0B0B',
    surface: '#1A1A1A',
    surfaceDeep: '#121212',
    gold: '#D4AF37',
    goldLight: '#F1D382',
    textMain: '#FFFFFF',
    textSub: '#A0A0A0',
    border: '#333333',
    borderLight: '#222222',
    red: '#E53935',
    redFaint: 'rgba(229, 57, 53, 0.05)',
    redBorder: 'rgba(229, 57, 53, 0.3)',
    switchOff: '#444444',
  };
  
  export const FONTS = {
    regular: 'vazir',
    bold: 'vazir_bold',
  };
  
  export const RADII = {
    sm: 8,
    md: 12,
    lg: 15,
    xl: 20,
    round: 999,
  };
  
  export const SHADOWS = {
    gold: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.5,
      shadowRadius: 15,
      elevation: 10,
    },
    goldButton: {
      shadowColor: '#D4AF37',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 5,
    },
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 4,
    },
  };