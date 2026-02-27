// src/components/business/AddServiceModal.js
import React, { useState } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  TextInput, ScrollView, TouchableWithoutFeedback, KeyboardAvoidingView, Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

const DURATIONS = [15, 30, 45, 60, 90, 120];

const AddServiceModal = ({ visible, onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [name,     setName]     = useState('');
  const [price,    setPrice]    = useState('');
  const [callOnly, setCallOnly] = useState(false);
  const [duration, setDuration] = useState(60);
  const [error,    setError]    = useState('');

  const reset = () => { setName(''); setPrice(''); setCallOnly(false); setDuration(60); setError(''); };
  const handleClose = () => { reset(); onClose(); };

  const handleSave = () => {
    if (!name.trim()) { setError('نام خدمت را وارد کنید'); return; }
    if (!callOnly && !price.trim()) { setError('قیمت را وارد کنید یا گزینه تماس را انتخاب کنید'); return; }
    setError('');
    onSave?.({
      id: `s_${Date.now()}`,
      name: name.trim(),
      price: callOnly ? 0 : Number(price.replace(/,/g, '')),
      callOnly,
      duration,
      image: `https://picsum.photos/seed/${Date.now()}/200/200`,
      score: 0,
      bookingCount: 0,
      isActive: true,
      schedule: {},
    });
    reset();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={handleClose}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
          <View style={s.handle} />
          <View style={s.header}>
            <TouchableOpacity onPress={handleClose} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
              <Icon name="close" size={22} color={COLORS.textSub} />
            </TouchableOpacity>
            <Text style={s.title}>افزودن خدمت جدید</Text>
            <Icon name="add-circle-outline" size={22} color={COLORS.gold} />
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">
            {/* نام */}
            <Text style={s.label}>نام خدمت <Text style={{ color: COLORS.red }}>*</Text></Text>
            <TextInput
              style={[s.input, error && !name.trim() && s.inputError]}
              placeholder="مثال: کاشت ناخن ژل"
              placeholderTextColor={COLORS.textSub}
              value={name}
              onChangeText={v => { setName(v); setError(''); }}
              textAlign="right"
            />

            {/* قیمت */}
            <Text style={s.label}>
              قیمت (تومان){!callOnly && <Text style={{ color: COLORS.red }}> *</Text>}
            </Text>

            {/* چک‌باکس تماس */}
            <TouchableOpacity
              style={s.callOnlyRow}
              onPress={() => { setCallOnly(v => !v); setPrice(''); setError(''); }}
              activeOpacity={0.8}>
              <Icon
                name={callOnly ? 'checkbox' : 'checkbox-outline'}
                size={20}
                color={callOnly ? COLORS.gold : COLORS.textSub}
              />
              <Text style={[s.callOnlyTxt, callOnly && s.callOnlyTxtOn]}>
                برای قیمت تماس بگیرید
              </Text>
            </TouchableOpacity>

            {!callOnly && (
              <TextInput
                style={[s.input, error && !price.trim() && s.inputError]}
                placeholder="مثال: 350000"
                placeholderTextColor={COLORS.textSub}
                value={price}
                onChangeText={v => { setPrice(v); setError(''); }}
                keyboardType="numeric"
                textAlign="right"
              />
            )}

            {callOnly && (
              <View style={s.callBadge}>
                <Icon name="call-outline" size={14} color={COLORS.gold} />
                <Text style={s.callBadgeTxt}>مشتری می‌تواند برای قیمت تماس بگیرد</Text>
              </View>
            )}

            {/* مدت */}
            <Text style={s.label}>مدت زمان</Text>
            <View style={s.durationRow}>
              {DURATIONS.map(d => (
                <TouchableOpacity key={d} onPress={() => setDuration(d)} style={[s.durChip, duration===d && s.durChipOn]}>
                  <Text style={[s.durTxt, duration===d && s.durTxtOn]}>{d} دقیقه</Text>
                </TouchableOpacity>
              ))}
            </View>

            {!!error && (
              <View style={s.errorRow}>
                <Icon name="alert-circle-outline" size={14} color={COLORS.red} />
                <Text style={s.errorTxt}>{error}</Text>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity style={s.saveBtn} onPress={handleSave} activeOpacity={0.85}>
            <Icon name="checkmark-circle" size={20} color={COLORS.background} />
            <Text style={s.saveTxt}>ذخیره خدمت</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const s = StyleSheet.create({
  overlay:       { flex: 1, backgroundColor: 'rgba(0,0,0,0.65)' },
  sheet:         { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingHorizontal: 20, maxHeight: '85%' },
  handle:        { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header:        { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, marginBottom: 16 },
  title:         { color: COLORS.textMain, fontSize: 15, fontFamily: FONTS.bold },
  label:         { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular, textAlign: 'right', marginBottom: 8 },
  input:         { backgroundColor: COLORS.background, borderRadius: RADII.md, borderWidth: 1, borderColor: COLORS.border, height: 50, paddingHorizontal: 14, color: COLORS.textMain, fontFamily: FONTS.regular, fontSize: 14, marginBottom: 16 },
  inputError:    { borderColor: COLORS.red },
  callOnlyRow:   { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, marginBottom: 12 },
  callOnlyTxt:   { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular },
  callOnlyTxtOn: { color: COLORS.gold, fontFamily: FONTS.bold },
  callBadge:     { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, backgroundColor: 'rgba(212,175,55,0.1)', borderRadius: RADII.md, borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)', paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
  callBadgeTxt:  { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.regular, flex: 1, textAlign: 'right' },
  durationRow:   { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start', marginBottom: 16 },
  durChip:       { paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADII.round, borderWidth: 1, borderColor: COLORS.border },
  durChipOn:     { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  durTxt:        { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  durTxtOn:      { color: COLORS.background, fontFamily: FONTS.bold },
  errorRow:      { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, marginBottom: 8 },
  errorTxt:      { color: COLORS.red, fontSize: 12, fontFamily: FONTS.regular },
  saveBtn:       { backgroundColor: COLORS.gold, height: 52, borderRadius: RADII.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 8, ...SHADOWS.goldButton },
  saveTxt:       { color: COLORS.background, fontSize: 15, fontFamily: FONTS.bold },
});

export default AddServiceModal;