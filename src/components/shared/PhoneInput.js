// src/components/shared/PhoneInput.js
// ✅ اینپوت شماره تلفن — قابل استفاده در LoginScreen و هر جای دیگر
import React, { useState, forwardRef } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * PhoneInput
 * @param {string} value
 * @param {function} onChangeText
 * @param {string} placeholder
 * @param {string} error - پیام خطا (اختیاری)
 * @param {boolean} autoFocus
 * @param {object} style - استایل container
 */
const PhoneInput = forwardRef(({
  value,
  onChangeText,
  placeholder = '09XXXXXXXXX',
  error,
  autoFocus = false,
  style,
}, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.wrapper, style]}>
      <View style={[
        styles.inputRow,
        isFocused && styles.focused,
        !!error && styles.hasError,
      ]}>
        {/* پرچم ایران + پیش‌شماره */}
        <View style={styles.prefixBlock}>
          <Text style={styles.flag}>🇮🇷</Text>
          <Text style={styles.prefix}>+۹۸</Text>
        </View>

        <View style={styles.divider} />

        {/* اینپوت */}
        <TextInput
          ref={ref}
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSub}
          keyboardType="phone-pad"
          maxLength={11}
          textAlign="left"
          autoFocus={autoFocus}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="done"
        />

        {/* آیکون تلفن */}
        <Icon
          name={isFocused ? 'call' : 'call-outline'}
          size={18}
          color={isFocused ? COLORS.gold : COLORS.textSub}
          style={styles.phoneIcon}
        />
      </View>

      {/* پیام خطا */}
      {!!error && (
        <View style={styles.errorRow}>
          <Text style={styles.errorText}>{error}</Text>
          <Icon name="alert-circle-outline" size={14} color={COLORS.red} />
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  inputRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 56,
    paddingHorizontal: 14,
    gap: 10,
  },
  focused: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(212,175,55,0.04)',
  },
  hasError: {
    borderColor: COLORS.red,
  },
  prefixBlock: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 4,
  },
  flag: {
    fontSize: 18,
  },
  prefix: {
    color: COLORS.textSub,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.border,
  },
  input: {
    flex: 1,
    color: COLORS.textMain,
    fontFamily: FONTS.regular,
    fontSize: 16,
    letterSpacing: 1,
  },
  phoneIcon: {
    marginLeft: 4,
  },
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 5,
    marginTop: 7,
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
});

export default PhoneInput;