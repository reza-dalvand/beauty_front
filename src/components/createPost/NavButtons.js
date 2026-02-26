// src/components/createPost/NavButtons.js
import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { R, STEPS } from './createPostConstants';
import GoldBtn from './GoldBtn';

const TAB_BAR_HEIGHT = R(65); // ارتفاع bottom tab navigator

const NavButtons = ({ step, canNext, onNext, onBack, onSubmit }) => {
  const isLast = step === STEPS.length;
  const insets = useSafeAreaInsets();
  const bottomSpacing = TAB_BAR_HEIGHT + insets.bottom + R(16);

  return (
    <View
      style={{
        flexDirection: 'row-reverse',
        gap: R(10),
        marginTop: R(8),
        marginBottom: bottomSpacing,
      }}>
      {/* دکمه بعدی یا ثبت */}
      <GoldBtn
        title={isLast ? 'ثبت آگهی' : 'بعدی'}
        icon={isLast ? 'checkmark-circle-outline' : 'arrow-back-outline'}
        onPress={isLast ? onSubmit : onNext}
        disabled={!canNext}
        style={{ flex: 1 }}
      />
      {/* دکمه قبلی — فقط از مرحله ۲ به بعد */}
      {step > 1 && (
        <GoldBtn
          title="قبلی"
          icon="arrow-forward-outline"
          onPress={onBack}
          outline
          style={{ flex: 0.6 }}
        />
      )}
    </View>
  );
};

export default NavButtons;