// src/components/CustomButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { COLORS } from '../theme/colors';

const CustomButton = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity activeOpacity={0.8} style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#D4AF37',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
    elevation: 10,
    shadowColor: '#D4AF37',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  text: {
    color: '#000',
    fontSize: 18,
    fontFamily: 'vazir_bold',
  },
});

export default CustomButton;