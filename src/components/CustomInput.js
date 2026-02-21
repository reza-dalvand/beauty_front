import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

const CustomInput = ({ isOtp, ...props }) => {
  return (
    <TextInput
      {...props}
      style={[styles.input, isOtp && styles.otpInput]}
      placeholderTextColor="#666"
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#111',
    borderRadius: 15,
    padding: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'vazir',
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 20,
  },
  otpInput: {
    borderColor: '#D4AF37',
    color: '#D4AF37',
    fontSize: 26,
    letterSpacing: 10, // ایجاد فاصله بین اعداد کد تایید
  },
});

export default CustomInput;