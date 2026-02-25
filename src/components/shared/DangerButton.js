// src/components/DangerButton.js
import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * DangerButton - دکمه قرمز برای اقدامات خطرناک (خروج، لغو و ...)
 * @param {string} title - متن دکمه
 * @param {string} iconName - آیکون سمت چپ (اختیاری)
 * @param {function} onPress
 * @param {object} style - استایل اضافی
 */
const DangerButton = ({ title, iconName, onPress, style }) => {
  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      onPress={onPress}
      activeOpacity={0.8}>
      <Text style={styles.text}>{title}</Text>
      {iconName && (
        <Icon name={iconName} size={20} color="#FFF" style={styles.icon} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  btn: {
    alignSelf: 'center',
    backgroundColor: COLORS.red,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: RADII.round,
    gap: 8,
    elevation: 4,
    shadowColor: COLORS.red,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  text: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  icon: {
    marginRight: 2,
  },
});

export default DangerButton;
