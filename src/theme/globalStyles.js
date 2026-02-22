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