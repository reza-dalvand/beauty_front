// src/screens/CreatePostScreen.js
// ══════════════════════════════════════════════════════════════
// ✅ کاملاً کامپوننت‌بندی شده — ۴ مرحله
// مراحل: ۱-اطلاعات پایه | ۲-موقعیت | ۳-اعضای تیم | ۴-نمونه کارها
// ══════════════════════════════════════════════════════════════
import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, StatusBar,
  Platform, KeyboardAvoidingView, StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';

import { R, C, STEPS, toFa } from '../components/createPost/createPostConstants';
import StepIndicator from '../components/createPost/StepIndicator';
import SubmitSuccessModal from '../components/createPost/SubmitSuccessModal';
import Step1 from '../components/createPost/steps/Step1';
import Step2 from '../components/createPost/steps/Step2';
import Step3 from '../components/createPost/steps/Step3'; // اعضای تیم
import Step4 from '../components/createPost/steps/Step4'; // نمونه کارها

// مقدار اولیه state — جدا تعریف شده تا reset راحت باشه
const INITIAL_DATA = {
  profilePhoto: null,
  bizName: '',
  ownerName: '',
  phone: '',
  description: '',
  bizType: '',
  province: '',
  city: '',
  district: '',
  team: [],
  portfolio: [],
};

const CreateBusinessScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [data, setData] = useState(INITIAL_DATA);

  const canNext = () => {
    if (step === 1) return !!(data.bizName && data.ownerName && data.phone);
    if (step === 2) return !!(data.province && data.city);
    return true;
  };

  const handleSubmit = () => {
    setShowSuccessModal(true);
  };

  // بعد از تایید مدال: reset کامل + برگشت به خانه
  const handleModalConfirm = () => {
    setShowSuccessModal(false);
    setStep(1);
    setData(INITIAL_DATA);
    navigation?.navigate('خانه');
  };

  const navProps = {
    step,
    canNext: canNext(),
    onNext: () => setStep(p => p + 1),
    onBack: () => setStep(p => p - 1),
    onSubmit: handleSubmit,
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 data={data} setData={setData} navProps={navProps} />;
      case 2: return <Step2 data={data} setData={setData} navProps={navProps} />;
      case 3: return <Step3 data={data} setData={setData} navProps={navProps} />;
      case 4: return <Step4 data={data} setData={setData} navProps={navProps} />;
    }
  };

  return (
    <SafeAreaView edges={['top']} style={s.container}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" translucent={false} />

      <SubmitSuccessModal
        visible={showSuccessModal}
        onConfirm={handleModalConfirm}
      />

      {/* هدر */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={step === 1 ? () => navigation?.goBack() : () => setStep(p => p - 1)}
          style={s.backBtn}>
          <Icon name="arrow-forward" size={R(22)} color={C.gold} />
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-start' }}>
          <Text style={s.headerTitle}>ثبت آگهی کسب‌وکار</Text>
          <Text style={s.headerSub}>
            مرحله {toFa(step)} از {toFa(STEPS.length)} — {STEPS[step - 1].title}
          </Text>
        </View>
        <View style={s.headerIcon}>
          <Icon name={STEPS[step - 1].icon} size={R(24)} color={C.gold} />
        </View>
      </View>

      {/* نوار مراحل */}
      <StepIndicator currentStep={step} />

      {/* محتوا */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={R(80)}>
        <View style={{ flex: 1, paddingHorizontal: R(16) }}>
          {renderStep()}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: R(16),
    paddingTop: R(10), paddingBottom: R(14),
  },
  backBtn: {
    width: R(40), height: R(40), borderRadius: R(12),
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: C.gold, fontFamily: 'vazir', fontSize: R(18), fontWeight: 'bold' },
  headerSub: { color: C.sub, fontFamily: 'vazir', fontSize: R(12), marginTop: R(2) },
  headerIcon: {
    width: R(44), height: R(44), borderRadius: R(14),
    backgroundColor: C.goldSoft, borderWidth: 1, borderColor: C.goldBorder,
    justifyContent: 'center', alignItems: 'center',
  },
});

export default CreateBusinessScreen;