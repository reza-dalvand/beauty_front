import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');

export const COLORS = {
  black: '#000000',
  darkGray: '#121212', // برای پس‌زمینه کارت‌ها
  gold: '#D4AF37',     // طلایی اصلی
  lightGold: '#F1D382',
  white: '#FFFFFF',
  gray: '#A0A0A0',
  error: '#FF5252',
};

export const SIZES = {
  base: 8,
  font: 14,
  radius: 12,
  padding: 24,
  width,
  height,
};

export const FONTS = {
  // فرض بر این است که فونت Vazir را نصب کرده‌ای
  regular: 'Vazir-Regular',
  bold: 'Vazir-Bold',
  medium: 'Vazir-Medium',
};

export const SHADOWS = {
  goldGlow: {
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  innerCard: {
    backgroundColor: '#1A1A1A',
    borderRadius: 15,
    borderWidth: 0.5,
    borderColor: '#333',
  }
};