// src/screens/LoginScreen.js
// ====================================================
// ✅ لاگین با شماره تماس — بدون ایمیل/پسورد
//
// کامپوننت‌های shared استفاده‌شده:
//   ← PhoneInput  (وارد کردن شماره)
//   ← OtpInput    (کد تایید ۵ رقمی)
//
// مرحله ۱: شماره تلفن → validate → ارسال کد
// مرحله ۲: کد OTP → تایید → navigate به MainTabs
// ====================================================
import React, { useState, useRef } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated,
  StatusBar,
} from 'react-native';
import LottieView from 'lottie-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS, FONTS, RADII, SHADOWS } from '../theme/appTheme';
import PhoneInput from '../components/shared/PhoneInput';
import OtpInput   from '../components/shared/OtpInput';

// ─── اعتبارسنجی شماره ایران ──────────────────────────
const isValidPhone = (phone) => /^09\d{9}$/.test(phone.trim());

// ═══════════════════════════════════════════════════
//  MAIN SCREEN
// ═══════════════════════════════════════════════════
const LoginScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [step, setStep]           = useState(1); // 1: شماره | 2: کد OTP
  const [phone, setPhone]         = useState('');
  const [otp, setOtp]             = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError]   = useState('');

  // ── انیمیشن Floating Alert ──
  const slideAnim = useRef(new Animated.Value(-100)).current;

  const showAlert = (msg) => {
    Animated.sequence([
      Animated.spring(slideAnim, {
        toValue: Platform.OS === 'ios' ? 60 : 30,
        useNativeDriver: true,
        bounciness: 10,
      }),
      Animated.delay(2800),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ── مرحله اول: ارسال کد ──
  const handleSendOtp = () => {
    if (!isValidPhone(phone)) {
      setPhoneError('شماره موبایل وارد شده صحیح نیست');
      showAlert('شماره موبایل وارد شده صحیح نیست');
      return;
    }
    setPhoneError('');
    setStep(2);
  };

  // ── مرحله دوم: تایید کد ──
  const handleVerifyOtp = () => {
    if (otp.length < 4) {
      setOtpError('کد تایید باید ۴ رقم باشد');
      return;
    }
    setOtpError('');
    navigation.replace('MainTabs');
  };

  const handleAction = () => step === 1 ? handleSendOtp() : handleVerifyOtp();

  const handleEditPhone = () => {
    setStep(1);
    setOtp('');
    setOtpError('');
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { paddingTop: insets.top }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      {/* ── انیمیشن Lottie ── */}
      <View style={styles.lottieWrap}>
        <LottieView
          source={step === 1
            ? require('../assets/images/Login.json')
            : require('../assets/images/otp.json')}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* ── فرم ── */}
      <View style={styles.formCard}>

        {/* عنوان */}
        <Text style={styles.title}>
          {step === 1 ? 'ورود به روکه' : 'کد تایید'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 1
            ? 'شماره موبایل خود را وارد کنید'
            : `کد ارسال شده به ${phone} را وارد کنید`}
        </Text>

        {/* ── مرحله ۱: اینپوت شماره ── */}
        {step === 1 && (
          <PhoneInput
            value={phone}
            onChangeText={(t) => { setPhone(t); setPhoneError(''); }}
            error={phoneError}
            style={styles.input}
          />
        )}

        {/* ── مرحله ۲: اینپوت OTP ── */}
        {step === 2 && (
          <>
            <OtpInput
              value={otp}
              onChangeValue={(v) => { setOtp(v); setOtpError(''); }}
              error={otpError}
            />

            {/* ویرایش شماره */}
            <TouchableOpacity style={styles.editPhoneBtn} onPress={handleEditPhone} activeOpacity={0.7}>
              <Text style={styles.editPhoneText}>ویرایش شماره  {phone}</Text>
            </TouchableOpacity>
          </>
        )}

        {/* ── دکمه اصلی ── */}
        <TouchableOpacity
          style={[
            styles.actionBtn,
            step === 2 && otp.length === 4 && styles.actionBtnReady,
          ]}
          onPress={handleAction}
          activeOpacity={0.85}>
          <Text style={styles.actionBtnText}>
            {step === 1 ? 'ارسال کد تایید' : 'ورود به برنامه'}
          </Text>
        </TouchableOpacity>

        {/* ── شرایط استفاده ── */}
        {step === 1 && (
          <Text style={styles.terms}>
            با ورود، <Text style={styles.termsLink}>شرایط استفاده</Text> را می‌پذیرید
          </Text>
        )}

        {/* ── ارسال مجدد (مرحله ۲) ── */}
        {step === 2 && (
          <TouchableOpacity style={styles.resendBtn} activeOpacity={0.7}>
            <Text style={styles.resendText}>ارسال مجدد کد</Text>
          </TouchableOpacity>
        )}

      </View>

    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    justifyContent: 'flex-end',
  },
  // ── Lottie ──
  lottieWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lottie: {
    width: '62%',
    aspectRatio: 1,
  },
  // ── فرم ──
  formCard: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderColor: 'rgba(212,175,55,0.2)',
    gap: 16,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 22,
    fontFamily: FONTS.bold,
    textAlign: 'right',
  },
  subtitle: {
    color: COLORS.textSub,
    fontSize: 13,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    marginTop: -8,
  },
  input: {
    marginTop: 4,
  },
  // ── ویرایش شماره ──
  editPhoneBtn: {
    alignSelf: 'center',
    marginTop: 4,
  },
  editPhoneText: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.regular,
    textDecorationLine: 'underline',
    textAlign: 'center',
  },
  // ── دکمه اصلی ──
  actionBtn: {
    height: 54,
    borderRadius: RADII.lg,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0.9,
    ...SHADOWS.goldButton,
    marginTop: 4,
  },
  actionBtnReady: {
    opacity: 1,
  },
  actionBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  // ── شرایط ──
  terms: {
    color: COLORS.textSub,
    fontSize: 11,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  termsLink: {
    color: COLORS.gold,
    textDecorationLine: 'underline',
  },
  // ── ارسال مجدد ──
  resendBtn: {
    alignSelf: 'center',
  },
  resendText: {
    color: COLORS.textSub,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;