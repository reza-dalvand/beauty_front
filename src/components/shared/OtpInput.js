// src/components/shared/OtpInput.js
import React, { useRef } from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * OtpInput - ۴ باکس مجزا، هرکدام یک TextInput مستقل
 * @param {string} value       - رشته ۴ رقمی
 * @param {function} onChangeValue
 * @param {string} error
 */
const OtpInput = ({ value = '', onChangeValue, error }) => {
  const LENGTH = 4;
  const refs   = Array.from({ length: LENGTH }, () => useRef(null));
  const digits = value.split('').concat(Array(LENGTH).fill('')).slice(0, LENGTH);

  const handleKeyPress = (idx, key) => {
    if (key === 'Backspace') {
      // پاک کردن رقم فعلی
      const next = value.slice(0, idx) + value.slice(idx + 1);
      onChangeValue?.(next);
      // برگشت به باکس قبلی
      if (idx > 0) refs[idx - 1].current?.focus();
    }
  };

  const handleChange = (idx, text) => {
    // فقط آخرین رقم تایپ شده رو بگیر
    const digit = text.replace(/\D/g, '').slice(-1);
    if (!digit) return;

    const arr = value.split('').concat(Array(LENGTH).fill('')).slice(0, LENGTH);
    arr[idx]  = digit;
    const next = arr.join('').slice(0, LENGTH);
    onChangeValue?.(next);

    // برو به باکس بعدی
    if (idx < LENGTH - 1) refs[idx + 1].current?.focus();
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.boxes}>
        {digits.map((digit, idx) => {
          const isFilled  = !!digit;
          const isCurrent = idx === value.length && value.length < LENGTH;

          return (
            <TextInput
              key={idx}
              ref={refs[idx]}
              style={[
                styles.box,
                isFilled  && styles.boxFilled,
                isCurrent && styles.boxActive,
                !!error   && styles.boxError,
              ]}
              value={digit}
              onChangeText={(t) => handleChange(idx, t)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(idx, nativeEvent.key)}
              keyboardType="number-pad"
              maxLength={1}
              autoFocus={idx === 0}
              caretHidden
              selectTextOnFocus
              textAlign="center"
            />
          );
        })}
      </View>

      {!!error && (
        <Text style={styles.errorText}>{error}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    gap: 0,
  },
  boxes: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 68,
    borderRadius: RADII.md,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    color: COLORS.textMain,
    fontSize: 26,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
  boxFilled: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(212,175,55,0.08)',
  },
  boxActive: {
    borderColor: COLORS.gold,
    borderWidth: 2,
  },
  boxError: {
    borderColor: COLORS.red,
    backgroundColor: 'rgba(229,57,53,0.05)',
  },
  errorText: {
    color: COLORS.red,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginTop: 12,
    textAlign: 'center',
  },
});

export default OtpInput;