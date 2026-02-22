import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import LottieView from 'lottie-react-native';
import { globalStyles } from '../theme/globalStyles';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import WarningFloatingAlert from '../components/FloatingAlert';
const LoginScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  
  const slideAnim = useRef(new Animated.Value(-120)).current;

  const showAlert = (message) => {
    setError(message);
    Animated.spring(slideAnim, {
      toValue: Platform.OS === 'ios' ? 60 : 30,
      useNativeDriver: true,
      bounciness: 10,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 500,
        useNativeDriver: true,
      }).start(() => setError(''));
    }, 3000);
  };

  const validatePhone = (phone) => {
    const regex = /^09\d{9}$/;
    return regex.test(phone);
  };

  const handleAction = () => {
    if (step === 1) {
      if (validatePhone(phoneNumber)) {
        setError('');
        setStep(2);
      } else {
        showAlert('⚠️ شماره موبایل وارد شده صحیح نیست');
      }
    } else {
      if (otpCode.length === 5) {
        console.log("ورود موفق");
        navigation.replace('Explore'); 
      } else {
        showAlert('کد تایید باید ۵ رقم باشد 🔢');
      }
    }
  };
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={globalStyles.container} 
    >
      <WarningFloatingAlert message={error} slideAnim={slideAnim} />

      <View style={styles.logoContainer}>
        <LottieView
          source={
            step === 1 
              ? require('../assets/images/Login.json') 
              : require('../assets/images/otp.json')
          }
          autoPlay
          loop
          style={styles.lottieAnimation}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.welcomeText}>
          {step === 1 ? 'شماره موبایل خود را وارد کنید' : 'کد تایید را وارد کنید'}
        </Text>
        
        <CustomInput 
          placeholder={step === 1 ? "0912XXXXXXX" : "- - - - -"} 
          keyboardType="numeric"
          maxLength={step === 1 ? 11 : 5}
          value={step === 1 ? phoneNumber : otpCode}
          onChangeText={(text) => {
            setError(''); // با تایپ مجدد، ارور پاک شود
            step === 1 ? setPhoneNumber(text) : setOtpCode(text);
          }}
          autoFocus={step === 2}
          isOtp={step === 2} // با این پراپ به اینپوت می‌فهمونیم که استایل طلایی و فاصله دار (کد تایید) بگیره
        />

        {step === 2 && (
          <TouchableOpacity onPress={() => setStep(1)} style={{ marginBottom: 10 }}>
            <Text style={styles.changeNumberText}>ویرایش شماره {phoneNumber}</Text>
          </TouchableOpacity>
        )}
        <CustomButton 
          title={step === 1 ? 'ارسال کد تایید' : 'تایید و ورود'} 
          onPress={handleAction} 
        />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({  
  logoContainer: { alignItems: 'center', marginBottom: 15 },
  lottieAnimation: { width: '60%', aspectRatio: 1, alignSelf: 'center', marginBottom:10 },
  welcomeText: { color: '#fff', fontSize: 16, fontFamily: 'vazir', textAlign: 'center', marginBottom: 30, opacity: 0.8 },
  changeNumberText: { color: '#D4AF37', textAlign: 'center', fontSize: 13, textDecorationLine: 'underline' },
  buttonText: { color: '#000', fontSize: 18, fontFamily: 'vazir_bold', fontWeight: 'bold' },
});

export default LoginScreen;