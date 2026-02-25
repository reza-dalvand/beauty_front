/**
 * CreateBusinessScreen.js
 * ✓ فرم چند مرحله‌ای (Wizard) ساخت آگهی کسب‌وکار
 * ✓ تم طلایی-مشکی، کاملاً RTL و ریسپانسیو
 * ✓ تقویم شمسی هفتگی با ساعت برای نوبت‌دهی
 * ✓ نمایش آگهی پس از ثبت + امکان ویرایش
 * ✓ انتخاب تصویر از دوربین یا گالری
 *
 * نصب پکیج مورد نیاز:
 *   npm install react-native-image-picker
 *   cd ios && pod install
 *
 * دسترسی‌های لازم:
 *  iOS  → Info.plist:
 *    NSCameraUsageDescription
 *    NSPhotoLibraryUsageDescription
 *  Android → AndroidManifest.xml:
 *    <uses-permission android:name="android.permission.CAMERA"/>
 *    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES"/>
 */

import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Alert,
  ActionSheetIOS,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

// ─────────────────────────────────────────────────────────
// Helper: باز کردن پیکر تصویر (دوربین یا گالری)
// ─────────────────────────────────────────────────────────
const openImagePicker = (onSelect, { multiple = false } = {}) => {
  const options = {
    mediaType: 'photo',
    quality: 0.85,
    selectionLimit: multiple ? 10 : 1,
    includeBase64: false,
  };

  const handleResult = response => {
    if (response.didCancel || response.errorCode) return;
    const assets = response.assets || [];
    if (!assets.length) return;
    if (multiple) {
      onSelect(assets.map(a => a.uri));
    } else {
      onSelect(assets[0].uri);
    }
  };

  const showSheet = (title, actions) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...actions.map(a => a.label), 'انصراف'],
          cancelButtonIndex: actions.length,
          title,
        },
        idx => {
          if (idx < actions.length) actions[idx].fn();
        },
      );
    } else {
      // Android — نمایش Alert با گزینه‌ها
      Alert.alert(title, '', [
        ...actions.map(a => ({ text: a.label, onPress: a.fn })),
        { text: 'انصراف', style: 'cancel' },
      ]);
    }
  };

  showSheet('انتخاب تصویر', [
    { label: '📷  دوربین', fn: () => launchCamera(options, handleResult) },
    {
      label: '🖼  گالری',
      fn: () => launchImageLibrary({ ...options }, handleResult),
    },
  ]);
};

// ─────────────────────────────────────────────────────────
// ریسپانسیو
// ─────────────────────────────────────────────────────────
const BASE = 390;
const { width: SW, height: SH } = Dimensions.get('window');
const R = n => Math.round((n / BASE) * SW);

// ─────────────────────────────────────────────────────────
// رنگ‌ها — دقیقاً مطابق تم موجود
// ─────────────────────────────────────────────────────────
const C = {
  bg: '#0B0B0B',
  surface: '#1A1A1A',
  surface2: '#222222',
  surface3: '#2A2A2A',
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.12)',
  goldBorder: 'rgba(212,175,55,0.35)',
  white: '#FFFFFF',
  sub: '#909090',
  border: '#2E2E2E',
  red: '#E53935',
  green: '#43A047',
  cardBg: '#141414',
};

// ─────────────────────────────────────────────────────────
// داده‌های ثابت
// ─────────────────────────────────────────────────────────
const BUSINESS_TYPES = [
  { key: 'آرایشگاه', icon: 'cut-outline' },
  { key: 'کلینیک', icon: 'medkit-outline' },
  { key: 'ناخن', icon: 'color-palette-outline' },
  { key: 'اسپا', icon: 'leaf-outline' },
  { key: 'تتو', icon: 'brush-outline' },
  { key: 'آرایش عروس', icon: 'rose-outline' },
  { key: 'مو', icon: 'sparkles-outline' },
  { key: 'پوست', icon: 'body-outline' },
];

const PROVINCES = [
  'تهران',
  'اصفهان',
  'فارس',
  'خراسان رضوی',
  'آذربایجان شرقی',
  'البرز',
  'مازندران',
  'گیلان',
  'خوزستان',
  'قم',
  'کرمانشاه',
  'همدان',
];

const MONTHS_FA = [
  'فروردین',
  'اردیبهشت',
  'خرداد',
  'تیر',
  'مرداد',
  'شهریور',
  'مهر',
  'آبان',
  'آذر',
  'دی',
  'بهمن',
  'اسفند',
];
const DAYS_FA = ['ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'];
const DAYS_FULL = [
  'شنبه',
  'یکشنبه',
  'دوشنبه',
  'سه‌شنبه',
  'چهارشنبه',
  'پنج‌شنبه',
  'جمعه',
];

// ساعت‌های نوبت — هر نیم ساعت
const SLOT_HOURS = [];
for (let h = 8; h <= 21; h++) {
  SLOT_HOURS.push(`${String(h).padStart(2, '0')}:00`);
  if (h < 21) SLOT_HOURS.push(`${String(h).padStart(2, '0')}:30`);
}

const STEPS = [
  { id: 1, title: 'اطلاعات پایه', icon: 'storefront-outline' },
  { id: 2, title: 'موقعیت مکانی', icon: 'location-outline' },
  { id: 3, title: 'اعضای تیم', icon: 'people-outline' },
  { id: 4, title: 'خدمات', icon: 'pricetag-outline' },
  { id: 5, title: 'نمونه کارها', icon: 'images-outline' },
];

// ─────────────────────────────────────────────────────────
// Helpers شمسی
// ─────────────────────────────────────────────────────────
const toFa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

const getDaysInMonth = month => (month <= 6 ? 31 : month <= 11 ? 30 : 29);

// تبدیل میلادی به شمسی (ساده)
const toShamsi = date => {
  const g = [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  let jy = g[0] - 1600,
    jm = g[1] - 1,
    jd = g[2] - 1;
  let gDays =
    365 * g[0] +
    Math.floor((g[0] + 3) / 4) -
    Math.floor((g[0] + 99) / 100) +
    Math.floor((g[0] + 399) / 400);
  gDays +=
    [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][g[1] - 1] + g[2];
  if (g[0] % 4 === 0 && (g[0] % 100 !== 0 || g[0] % 400 === 0))
    if (g[1] > 2) gDays++;
  let jDays = gDays - 79;
  let jNP = Math.floor(jDays / 12053);
  jDays %= 12053;
  let jy2 = 979 + 33 * jNP + 4 * Math.floor(jDays / 1461);
  jDays %= 1461;
  if (jDays >= 366) {
    jy2 += Math.floor((jDays - 1) / 365);
    jDays = (jDays - 1) % 365;
  }
  const jM = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];
  let jm2 = 0;
  for (let i = 11; i >= 0; i--) {
    if (jDays >= jM[i]) {
      jm2 = i;
      break;
    }
  }
  return [jy2, jm2 + 1, jDays - jM[jm2] + 1];
};

// تبدیل شمسی به میلادی (برای محاسبه روز هفته)
const fromShamsi = (jy, jm, jd) => {
  let jy2 = jy - 979,
    jm2 = jm - 1,
    jd2 = jd - 1;
  let jDays =
    365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor(((jy2 % 33) + 3) / 4);
  jDays += [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334][jm2] + jd2;
  let gDays = jDays + 79;
  let gy = 1600 + 400 * Math.floor(gDays / 146097);
  gDays %= 146097;
  let leap = true;
  if (gDays >= 36525) {
    gDays--;
    gy += 100 * Math.floor(gDays / 36524);
    gDays %= 36524;
    if (gDays >= 365) gDays++;
    else leap = false;
  }
  gy += 4 * Math.floor(gDays / 1461);
  gDays %= 1461;
  if (gDays >= 366) {
    leap = false;
    gDays--;
    gy += Math.floor(gDays / 365);
    gDays %= 365;
  }
  const gMD = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (let i = 0; i < 12; i++) {
    if (gDays < gMD[i]) {
      gm = i;
      break;
    }
    gDays -= gMD[i];
  }
  return new Date(gy, gm, gDays + 1);
};

// گرفتن هفته جاری شمسی (از شنبه تا جمعه)
const getCurrentShamsiWeek = (offsetWeeks = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + offsetWeeks * 7);
  const dow = (today.getDay() + 1) % 7; // 0=شنبه
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dow + i);
    const s = toShamsi(d);
    weekDays.push({
      shamsi: s,
      gregorian: d,
      label: `${s[2]} ${MONTHS_FA[s[1] - 1]}`,
    });
  }
  return weekDays;
};

// ─────────────────────────────────────────────────────────
// کامپوننت‌های کوچک مشترک
// ─────────────────────────────────────────────────────────
const Label = ({ text, required }) => (
  <View
    style={{
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: R(6),
      gap: R(4),
    }}>
    {required && <Text style={{ color: C.red, fontSize: R(12) }}>*</Text>}
    <Text
      style={{
        color: C.sub,
        fontFamily: 'vazir',
        fontSize: R(13),
        textAlign: 'left',
      }}>
      {text}
    </Text>
  </View>
);

const Field = ({
  label,
  required,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  multiline,
}) => (
  <View style={{ marginBottom: R(14) }}>
    {label && <Label text={label} required={required} />}
    <TextInput
      style={{
        backgroundColor: C.surface2,
        borderRadius: R(12),
        borderWidth: 1,
        borderColor: C.border,
        paddingHorizontal: R(14),
        paddingVertical: R(12),
        color: C.white,
        fontFamily: 'vazir',
        fontSize: R(14),
        textAlign: 'right',
        minHeight: multiline ? R(80) : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
      placeholder={placeholder}
      placeholderTextColor={C.sub}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const SectionCard = ({ children, style }) => (
  <View
    style={[
      {
        backgroundColor: C.surface,
        borderRadius: R(18),
        borderWidth: 1,
        borderColor: C.border,
        padding: R(16),
        marginBottom: R(14),
      },
      style,
    ]}>
    {children}
  </View>
);

const GoldBtn = ({ title, icon, onPress, outline, style, disabled }) => (
  <TouchableOpacity
    onPress={disabled ? undefined : onPress}
    activeOpacity={disabled ? 1 : 0.85}
    style={[
      {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center',
        gap: R(8),
        height: R(48),
        borderRadius: R(14),
        padding: 5,
        backgroundColor: outline
          ? 'transparent'
          : disabled
          ? '#5a4a15'
          : C.gold,
        borderWidth: outline ? 1 : 0,
        borderColor: outline ? (disabled ? C.border : C.gold) : 'transparent',
      },
      style,
    ]}>
    {icon && (
      <Icon
        name={icon}
        size={R(18)}
        color={
          outline ? (disabled ? C.border : C.gold) : disabled ? '#888' : C.bg
        }
      />
    )}
    <Text
      style={{
        color: outline
          ? disabled
            ? C.border
            : C.gold
          : disabled
          ? '#888'
          : C.bg,
        fontFamily: 'vazir',
        fontSize: R(15),
        fontWeight: 'bold',
      }}>
      {title}
    </Text>
  </TouchableOpacity>
);

const PhotoCircle = ({ size = R(90), onSelect, uri, label }) => (
  <TouchableOpacity
    onPress={() => openImagePicker(onSelect)}
    activeOpacity={0.8}
    style={{
      width: size,
      height: size,
      borderRadius: size / 2,
      backgroundColor: C.surface2,
      borderWidth: 1.5,
      borderColor: uri ? C.gold : C.border,
      borderStyle: uri ? 'solid' : 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    }}>
    {uri ? (
      <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
    ) : (
      <>
        <Icon name="camera-outline" size={R(22)} color={C.sub} />
        {label && (
          <Text
            style={{
              color: C.sub,
              fontFamily: 'vazir',
              fontSize: R(10),
              marginTop: R(4),
            }}>
            {label}
          </Text>
        )}
      </>
    )}
  </TouchableOpacity>
);

// ─────────────────────────────────────────────────────────
// StepIndicator
// ─────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => (
  <View
    style={{
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingHorizontal: R(16),
      marginBottom: R(20),
    }}>
    {STEPS.map((s, idx) => {
      const done = s.id < currentStep;
      const active = s.id === currentStep;
      return (
        <React.Fragment key={s.id}>
          <View style={{ alignItems: 'center', gap: R(4) }}>
            <View
              style={[
                {
                  width: R(34),
                  height: R(34),
                  borderRadius: R(17),
                  backgroundColor: C.surface2,
                  borderWidth: 1,
                  borderColor: C.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                (done || active) && {
                  backgroundColor: C.gold,
                  borderColor: C.gold,
                },
                active && {
                  shadowColor: C.gold,
                  shadowOffset: { width: 0, height: R(4) },
                  shadowOpacity: 0.6,
                  shadowRadius: R(8),
                  elevation: 8,
                },
              ]}>
              {done ? (
                <Icon name="checkmark" size={R(14)} color={C.bg} />
              ) : (
                <Icon
                  name={s.icon}
                  size={R(14)}
                  color={active ? C.bg : C.sub}
                />
              )}
            </View>
            {active && (
              <Text
                style={{
                  color: C.gold,
                  fontFamily: 'vazir',
                  fontSize: R(9),
                  maxWidth: R(56),
                  textAlign: 'center',
                }}>
                {s.title}
              </Text>
            )}
          </View>
          {idx < STEPS.length - 1 && (
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: done ? C.gold : C.border,
                marginHorizontal: R(3),
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

// ─────────────────────────────────────────────────────────
// تقویم شمسی هفتگی با ساعت
// ─────────────────────────────────────────────────────────
const WeeklyCalendar = ({ slots, onSlotsChange }) => {
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(null);
  const weekDays = getCurrentShamsiWeek(weekOffset);

  const toggleSlot = (dayKey, hour) => {
    const key = `${dayKey}__${hour}`;
    const next = { ...slots };
    if (next[key]) delete next[key];
    else next[key] = true;
    onSlotsChange(next);
  };

  const daySlotCount = dayKey =>
    Object.keys(slots || {}).filter(k => k.startsWith(`${dayKey}__`)).length;

  const weekTitle = `${weekDays[0].shamsi[0]}/${String(
    weekDays[0].shamsi[1],
  ).padStart(2, '0')}/${String(weekDays[0].shamsi[2]).padStart(2, '0')} — ${
    weekDays[6].label
  }`;

  return (
    <View style={{ marginTop: R(12) }}>
      {/* ناوبری هفته */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: R(10),
        }}>
        <TouchableOpacity
          onPress={() => setWeekOffset(w => w + 1)}
          style={wc.navBtn}>
          <Icon name="chevron-back" size={R(16)} color={C.gold} />
          <Text style={wc.navTxt}>بعد</Text>
        </TouchableOpacity>
        <Text style={wc.weekTitle}>{weekTitle}</Text>
        <TouchableOpacity
          onPress={() => setWeekOffset(w => w - 1)}
          style={wc.navBtn}
          disabled={weekOffset <= 0}>
          <Text style={[wc.navTxt, weekOffset <= 0 && { color: C.border }]}>
            قبل
          </Text>
          <Icon
            name="chevron-forward"
            size={R(16)}
            color={weekOffset <= 0 ? C.border : C.gold}
          />
        </TouchableOpacity>
      </View>

      {/* نام روزها */}
      <View style={{ flexDirection: 'row-reverse', marginBottom: R(8) }}>
        {weekDays.map((d, i) => {
          const dayKey = `${d.shamsi[0]}-${d.shamsi[1]}-${d.shamsi[2]}`;
          const cnt = daySlotCount(dayKey);
          const isSelected = selectedDay === dayKey;
          return (
            <TouchableOpacity
              key={i}
              onPress={() => setSelectedDay(isSelected ? null : dayKey)}
              style={[wc.dayBtn, isSelected && wc.dayBtnOn]}>
              <Text style={[wc.dayName, isSelected && wc.dayNameOn]}>
                {DAYS_FA[i]}
              </Text>
              <Text style={[wc.dayNum, isSelected && wc.dayNumOn]}>
                {toFa(d.shamsi[2])}
              </Text>
              {cnt > 0 && (
                <View style={wc.badge}>
                  <Text style={wc.badgeTxt}>{toFa(cnt)}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ساعت‌های نوبت */}
      {selectedDay && (
        <View style={wc.hoursWrap}>
          <Text style={wc.dayLabel}>
            نوبت‌های{' '}
            {
              DAYS_FULL[
                weekDays.findIndex(
                  d =>
                    `${d.shamsi[0]}-${d.shamsi[1]}-${d.shamsi[2]}` ===
                    selectedDay,
                )
              ]
            }{' '}
            —{' '}
            {
              weekDays.find(
                d =>
                  `${d.shamsi[0]}-${d.shamsi[1]}-${d.shamsi[2]}` ===
                  selectedDay,
              )?.label
            }
          </Text>
          <View
            style={{
              flexDirection: 'row-reverse',
              flexWrap: 'wrap',
              gap: R(6),
              justifyContent: 'flex-end',
            }}>
            {SLOT_HOURS.map(h => {
              const key = `${selectedDay}__${h}`;
              const active = !!(slots && slots[key]);
              return (
                <TouchableOpacity
                  key={h}
                  onPress={() => toggleSlot(selectedDay, h)}
                  style={[wc.slot, active && wc.slotOn]}>
                  <Text style={[wc.slotTxt, active && wc.slotTxtOn]}>{h}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text
            style={{
              color: C.sub,
              fontFamily: 'vazir',
              fontSize: R(10),
              textAlign: 'left',
              marginTop: R(6),
            }}>
            روی ساعت‌ها ضربه بزنید تا نوبت‌های موجود را مشخص کنید
          </Text>
        </View>
      )}
      {!selectedDay && (
        <Text
          style={{
            color: C.sub,
            fontFamily: 'vazir',
            fontSize: R(12),
            textAlign: 'center',
            paddingVertical: R(10),
          }}>
          یک روز را انتخاب کنید تا ساعت‌های نوبت را تنظیم کنید
        </Text>
      )}
    </View>
  );
};

const DAY_W = Math.floor((SW - R(32) - R(2) * 6) / 7);
const wc = StyleSheet.create({
  navBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(2),
    padding: R(6),
  },
  navTxt: { color: C.gold, fontFamily: 'vazir', fontSize: R(12) },
  weekTitle: {
    color: C.sub,
    fontFamily: 'vazir',
    fontSize: R(11),
    textAlign: 'center',
    flex: 1,
  },
  dayBtn: {
    width: DAY_W,
    alignItems: 'center',
    paddingVertical: R(8),
    borderRadius: R(10),
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  dayBtnOn: { backgroundColor: C.gold, borderColor: C.gold },
  dayName: { color: C.sub, fontFamily: 'vazir', fontSize: R(10) },
  dayNameOn: { color: C.bg },
  dayNum: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(13),
    fontWeight: 'bold',
    marginTop: R(2),
  },
  dayNumOn: { color: C.bg },
  badge: {
    position: 'absolute',
    top: -R(4),
    left: -R(4),
    backgroundColor: C.red,
    borderRadius: R(8),
    minWidth: R(16),
    height: R(16),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: R(2),
  },
  badgeTxt: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(8),
    fontWeight: 'bold',
  },
  hoursWrap: {
    backgroundColor: C.surface2,
    borderRadius: R(12),
    padding: R(12),
    borderWidth: 1,
    borderColor: C.border,
  },
  dayLabel: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(12),
    textAlign: 'left',
    marginBottom: R(10),
  },
  slot: {
    paddingHorizontal: R(10),
    paddingVertical: R(6),
    borderRadius: R(8),
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface3,
  },
  slotOn: { backgroundColor: C.goldSoft, borderColor: C.gold },
  slotTxt: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  slotTxtOn: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(11),
    fontWeight: 'bold',
  },
});

// ─────────────────────────────────────────────────────────
// دکمه‌های ناوبری که داخل ScrollView هر مرحله قرار می‌گیرد
// ─────────────────────────────────────────────────────────
const NavButtons = ({ step, canNext, onNext, onBack, onSubmit }) => {
  const insets = useSafeAreaInsets();
  // bottom = safe area گوشی + فضای تب‌بار (۶۰) + کمی margin
  const bottomSpace = insets.bottom + R(60) + R(16);
  return (
    <View style={[nb.wrap, { paddingBottom: bottomSpace }]}>
      {step < STEPS.length ? (
        <GoldBtn
          title="مرحله بعد"
          icon="arrow-back-outline"
          onPress={onNext}
          disabled={!canNext}
          style={{ flex: 1 }}
        />
      ) : (
        <GoldBtn
          title="ثبت نهایی آگهی"
          icon="checkmark-circle-outline"
          onPress={onSubmit}
          style={{ flex: 1 }}
        />
      )}
      {step > 1 && (
        <TouchableOpacity onPress={onBack} style={nb.backBtn}>
          <Icon name="arrow-forward" size={R(18)} color={C.sub} />
          <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
            قبلی
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const nb = StyleSheet.create({
  wrap: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(10),
    paddingTop: R(16),
    marginTop: R(4),
    borderTopWidth: 1,
    borderTopColor: C.border,
    // paddingBottom داینامیک از insets داده میشه
  },
  backBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(4),
    paddingHorizontal: R(14),
    height: R(48),
    borderRadius: R(14),
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
});

// ─────────────────────────────────────────────────────────
// مرحله ۱ — اطلاعات پایه
// ─────────────────────────────────────────────────────────
const Step1 = ({ data, setData, navProps }) => (
  <ScrollView
    showsVerticalScrollIndicator={false}
    keyboardShouldPersistTaps="handled"
    contentContainerStyle={{ paddingBottom: R(8) }}>
    <SectionCard>
      <View style={{ alignItems: 'center', marginBottom: R(16) }}>
        <PhotoCircle
          size={R(100)}
          uri={data.profilePhoto}
          onSelect={uri => setData(p => ({ ...p, profilePhoto: uri }))}
          label="عکس پروفایل"
        />
        <Text
          style={{
            color: C.sub,
            fontFamily: 'vazir',
            fontSize: R(11),
            marginTop: R(8),
          }}>
          عکس پروفایل کسب‌وکار
        </Text>
      </View>
      <Field
        label="نام کسب‌وکار"
        required
        placeholder="مثال: سالن زیبایی رخ"
        value={data.bizName}
        onChangeText={v => setData(p => ({ ...p, bizName: v }))}
      />
      <Field
        label="نام و نام خانوادگی"
        required
        placeholder="نام کامل"
        value={data.ownerName}
        onChangeText={v => setData(p => ({ ...p, ownerName: v }))}
      />
      <Field
        label="شماره تماس"
        required
        placeholder="۰۹۱۲XXXXXXX"
        value={data.phone}
        onChangeText={v => setData(p => ({ ...p, phone: v }))}
        keyboardType="phone-pad"
      />
      <Field
        label="توضیحات"
        required
        placeholder="درباره کسب‌وکار خود بنویسید..."
        value={data.description}
        onChangeText={v => setData(p => ({ ...p, description: v }))}
        multiline
      />
    </SectionCard>

    <SectionCard>
      <Label text="نوع کسب‌وکار" required />
      <View
        style={{
          flexDirection: 'row-reverse',
          flexWrap: 'wrap',
          gap: R(8),
          justifyContent: 'flex-end',
        }}>
        {BUSINESS_TYPES.map(t => {
          const active = data.bizType === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              activeOpacity={0.8}
              onPress={() => setData(p => ({ ...p, bizType: t.key }))}
              style={{
                flexDirection: 'row-reverse',
                alignItems: 'center',
                gap: R(6),
                paddingHorizontal: R(12),
                paddingVertical: R(8),
                borderRadius: R(20),
                borderWidth: 1,
                borderColor: active ? C.gold : C.border,
                backgroundColor: active ? C.goldSoft : C.surface2,
              }}>
              <Icon
                name={t.icon}
                size={R(14)}
                color={active ? C.gold : C.sub}
              />
              <Text
                style={{
                  color: active ? C.gold : C.sub,
                  fontFamily: 'vazir',
                  fontSize: R(12),
                }}>
                {t.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SectionCard>

    <NavButtons {...navProps} />
  </ScrollView>
);

// ─────────────────────────────────────────────────────────
// مرحله ۲ — موقعیت مکانی
// ─────────────────────────────────────────────────────────
const Step2 = ({ data, setData, navProps }) => {
  const [provOpen, setProvOpen] = useState(false);
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: R(8) }}>
      <SectionCard>
        <View style={{ marginBottom: R(14) }}>
          <Label text="استان" required />
          <TouchableOpacity
            onPress={() => setProvOpen(p => !p)}
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: C.surface2,
              borderRadius: R(12),
              borderWidth: 1,
              borderColor: provOpen ? C.gold : C.border,
              paddingHorizontal: R(14),
              height: R(48),
            }}>
            <Icon
              name="chevron-down"
              size={R(16)}
              color={C.sub}
              style={{ transform: [{ rotate: provOpen ? '180deg' : '0deg' }] }}
            />
            <Text
              style={{
                color: data.province ? C.white : C.sub,
                fontFamily: 'vazir',
                fontSize: R(14),
              }}>
              {data.province || 'انتخاب استان'}
            </Text>
            <Icon
              name="location-outline"
              size={R(18)}
              color={data.province ? C.gold : C.sub}
            />
          </TouchableOpacity>
          {provOpen && (
            <View
              style={{
                backgroundColor: C.surface2,
                borderRadius: R(12),
                borderWidth: 1,
                borderColor: C.gold,
                marginTop: R(4),
                maxHeight: R(200),
              }}>
              <ScrollView
                nestedScrollEnabled
                showsVerticalScrollIndicator={false}>
                {PROVINCES.map((prov, idx) => (
                  <TouchableOpacity
                    key={prov}
                    onPress={() => {
                      setData(p => ({ ...p, province: prov }));
                      setProvOpen(false);
                    }}
                    style={{
                      paddingHorizontal: R(16),
                      paddingVertical: R(12),
                      borderBottomWidth: idx < PROVINCES.length - 1 ? 1 : 0,
                      borderBottomColor: C.border,
                      backgroundColor:
                        data.province === prov ? C.goldSoft : 'transparent',
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'flex-end',
                      gap: R(8),
                    }}>
                    {data.province === prov && (
                      <Icon name="checkmark" size={R(14)} color={C.gold} />
                    )}
                    <Text
                      style={{
                        color: data.province === prov ? C.gold : C.white,
                        fontFamily: 'vazir',
                        fontSize: R(14),
                      }}>
                      {prov}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>
        <Field
          label="شهر"
          required
          placeholder="نام شهر"
          value={data.city}
          onChangeText={v => setData(p => ({ ...p, city: v }))}
        />
        <Field
          label="منطقه / محله"
          placeholder="مثال: منطقه ۳، ونک"
          value={data.district}
          onChangeText={v => setData(p => ({ ...p, district: v }))}
        />
        <Field
          label="آدرس کامل"
          placeholder="خیابان، کوچه، پلاک..."
          value={data.address}
          onChangeText={v => setData(p => ({ ...p, address: v }))}
          multiline
        />
      </SectionCard>
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// مرحله ۳ — اعضای تیم
// ─────────────────────────────────────────────────────────
const Step3 = ({ data, setData, navProps }) => {
  const addMember = () =>
    setData(p => ({
      ...p,
      team: [...p.team, { id: Date.now(), name: '', role: '', photo: null }],
    }));
  const removeMember = id =>
    setData(p => ({ ...p, team: p.team.filter(m => m.id !== id) }));
  const updateMember = (id, field, val) =>
    setData(p => ({
      ...p,
      team: p.team.map(m => (m.id === id ? { ...m, [field]: val } : m)),
    }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: R(8) }}>
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: R(14),
        }}>
        <GoldBtn
          title="افزودن عضو"
          icon="add-outline"
          onPress={addMember}
          outline
          style={{ height: R(40), paddingHorizontal: R(16) }}
        />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
          اعضای تیم (اختیاری)
        </Text>
      </View>

      {data.team.length === 0 && (
        <SectionCard>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: R(24),
              gap: R(10),
            }}>
            <Icon name="people-outline" size={R(40)} color={C.border} />
            <Text
              style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              اگر تیمی ندارید این مرحله را رد کنید
            </Text>
          </View>
        </SectionCard>
      )}

      {data.team.map((member, idx) => (
        <View
          key={member.id}
          style={{
            backgroundColor: C.surface,
            borderRadius: R(16),
            borderWidth: 1,
            borderColor: C.border,
            padding: R(14),
            marginBottom: R(12),
          }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: R(12),
            }}>
            <TouchableOpacity
              onPress={() => removeMember(member.id)}
              style={{ padding: R(4) }}>
              <Icon name="trash-outline" size={R(18)} color={C.red} />
            </TouchableOpacity>
            <Text
              style={{
                color: C.gold,
                fontFamily: 'vazir',
                fontSize: R(13),
                fontWeight: 'bold',
              }}>
              عضو {toFa(idx + 1)}
            </Text>
          </View>
          <View style={{ alignItems: 'center', marginBottom: R(12) }}>
            <PhotoCircle
              size={R(72)}
              uri={member.photo}
              onSelect={uri => updateMember(member.id, 'photo', uri)}
              label="عکس"
            />
          </View>
          <TextInput
            style={{
              backgroundColor: C.surface2,
              borderRadius: R(10),
              borderWidth: 1,
              borderColor: C.border,
              paddingHorizontal: R(12),
              height: R(44),
              color: C.white,
              fontFamily: 'vazir',
              fontSize: R(13),
              textAlign: 'left',
              marginBottom: R(8),
            }}
            placeholder="نام و نام خانوادگی"
            placeholderTextColor={C.sub}
            value={member.name}
            onChangeText={v => updateMember(member.id, 'name', v)}
          />
          <TextInput
            style={{
              backgroundColor: C.surface2,
              borderRadius: R(10),
              borderWidth: 1,
              borderColor: C.border,
              paddingHorizontal: R(12),
              height: R(44),
              color: C.white,
              fontFamily: 'vazir',
              fontSize: R(13),
              textAlign: 'left',
            }}
            placeholder="سمت / تخصص"
            placeholderTextColor={C.sub}
            value={member.role}
            onChangeText={v => updateMember(member.id, 'role', v)}
          />
        </View>
      ))}
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// مرحله ۴ — خدمات + تقویم هفتگی
// ─────────────────────────────────────────────────────────
const ServiceItem = ({ service, phone, onUpdate, onRemove }) => {
  const [calOpen, setCalOpen] = useState(false);
  const slotCount = Object.keys(service.slots || {}).length;

  return (
    <View
      style={{
        backgroundColor: C.surface,
        borderRadius: R(16),
        borderWidth: 1,
        borderColor: C.border,
        marginBottom: R(14),
        overflow: 'hidden',
      }}>
      {/* هدر */}
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: C.surface2,
          paddingHorizontal: R(14),
          paddingVertical: R(10),
        }}>
        <TouchableOpacity onPress={onRemove} style={{ padding: R(4) }}>
          <Icon name="trash-outline" size={R(18)} color={C.red} />
        </TouchableOpacity>
        <View
          style={{
            backgroundColor: C.goldSoft,
            borderRadius: R(8),
            paddingHorizontal: R(10),
            paddingVertical: R(4),
            borderWidth: 1,
            borderColor: C.goldBorder,
          }}>
          <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(12) }}>
            {service.name || 'خدمت جدید'}
          </Text>
        </View>
      </View>
      <View style={{ padding: R(14) }}>
        <TextInput
          style={{
            backgroundColor: C.surface2,
            borderRadius: R(10),
            borderWidth: 1,
            borderColor: C.border,
            paddingHorizontal: R(12),
            height: R(44),
            color: C.white,
            fontFamily: 'vazir',
            fontSize: R(13),
            textAlign: 'left',
            marginBottom: R(10),
          }}
          placeholder="نام خدمت (مثال: رنگ مو)"
          placeholderTextColor={C.sub}
          value={service.name}
          onChangeText={v => onUpdate('name', v)}
        />

        {/* قیمت */}
        <View
          style={{
            flexDirection: 'row-reverse',
            gap: R(8),
            marginBottom: R(12),
            alignItems: 'center',
          }}>
          <TextInput
            style={{
              flex: 1,
              backgroundColor: C.surface2,
              borderRadius: R(10),
              borderWidth: 1,
              borderColor: C.border,
              paddingHorizontal: R(12),
              height: R(44),
              color: C.white,
              fontFamily: 'vazir',
              fontSize: R(13),
              textAlign: 'left',
            }}
            placeholder={
              service.price
                ? 'قیمت (تومان)'
                : phone || 'برای هماهنگی تماس بگیرید'
            }
            placeholderTextColor={C.sub}
            value={service.price}
            onChangeText={v => onUpdate('price', v)}
            keyboardType="numeric"
          />
          <View
            style={{
              backgroundColor: service.price ? C.goldSoft : C.surface2,
              borderRadius: R(10),
              borderWidth: 1,
              borderColor: service.price ? C.gold : C.border,
              paddingHorizontal: R(10),
              height: R(44),
              justifyContent: 'center',
            }}>
            <Text
              style={{
                color: service.price ? C.gold : C.sub,
                fontFamily: 'vazir',
                fontSize: R(11),
              }}>
              {service.price ? 'تومان' : 'تماس'}
            </Text>
          </View>
        </View>

        {/* دکمه تقویم */}
        <TouchableOpacity
          onPress={() => setCalOpen(p => !p)}
          style={{
            flexDirection: 'row-reverse',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: C.surface2,
            borderRadius: R(10),
            paddingHorizontal: R(12),
            paddingVertical: R(10),
            borderWidth: 1,
            borderColor: calOpen ? C.gold : C.border,
          }}>
          <View
            style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: R(6) }}>
            <Icon
              name="chevron-down"
              size={R(15)}
              color={C.sub}
              style={{ transform: [{ rotate: calOpen ? '180deg' : '0deg' }] }}
            />
            {slotCount > 0 && (
              <View
                style={{
                  backgroundColor: C.gold,
                  borderRadius: R(8),
                  paddingHorizontal: R(6),
                  paddingVertical: R(2),
                }}>
                <Text
                  style={{
                    color: C.bg,
                    fontFamily: 'vazir',
                    fontSize: R(10),
                    fontWeight: 'bold',
                  }}>
                  {toFa(slotCount)} نوبت
                </Text>
              </View>
            )}
          </View>
          <View
            style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: R(6) }}>
            <Text
              style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(12) }}>
              تقویم نوبت‌دهی شمسی
            </Text>
            <Icon name="calendar-outline" size={R(16)} color={C.gold} />
          </View>
        </TouchableOpacity>

        {calOpen && (
          <WeeklyCalendar
            slots={service.slots}
            onSlotsChange={s => onUpdate('slots', s)}
          />
        )}
      </View>
    </View>
  );
};

const Step4 = ({ data, setData, navProps }) => {
  const addService = () =>
    setData(p => ({
      ...p,
      services: [
        ...p.services,
        { id: Date.now(), name: '', price: '', slots: {} },
      ],
    }));
  const removeService = id =>
    setData(p => ({ ...p, services: p.services.filter(s => s.id !== id) }));
  const updateService = (id, field, val) =>
    setData(p => ({
      ...p,
      services: p.services.map(s => (s.id === id ? { ...s, [field]: val } : s)),
    }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: R(8) }}>
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: R(14),
        }}>
        <GoldBtn
          title="افزودن خدمت"
          icon="add-circle-outline"
          onPress={addService}
          outline
          style={{ height: R(42) }}
        />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
          خدمات کسب‌وکار
        </Text>
      </View>

      {data.services.length === 0 && (
        <SectionCard>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: R(24),
              gap: R(10),
            }}>
            <Icon name="pricetag-outline" size={R(44)} color={C.border} />
            <Text
              style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              هنوز خدمتی اضافه نشده
            </Text>
            <Text
              style={{
                color: C.border,
                fontFamily: 'vazir',
                fontSize: R(11),
                textAlign: 'center',
              }}>
              خدمات خود را با قیمت و تقویم نوبت‌دهی وارد کنید
            </Text>
          </View>
        </SectionCard>
      )}

      {data.services.map(s => (
        <ServiceItem
          key={s.id}
          service={s}
          phone={data.phone}
          onUpdate={(field, val) => updateService(s.id, field, val)}
          onRemove={() => removeService(s.id)}
        />
      ))}
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// مرحله ۵ — نمونه کارها
// ─────────────────────────────────────────────────────────
const Step5 = ({ data, setData, navProps }) => {
  const addPortfolio = () =>
    setData(p => ({
      ...p,
      portfolio: [
        ...p.portfolio,
        {
          id: Date.now(),
          title: '',
          serviceType: '',
          description: '',
          photos: [],
        },
      ],
    }));
  const removePortfolio = id =>
    setData(p => ({
      ...p,
      portfolio: p.portfolio.filter(item => item.id !== id),
    }));
  const updatePortfolio = (id, field, val) =>
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item =>
        item.id === id ? { ...item, [field]: val } : item,
      ),
    }));
  const addPhoto = id => {
    openImagePicker(
      uris => {
        const arr = Array.isArray(uris) ? uris : [uris];
        setData(p => ({
          ...p,
          portfolio: p.portfolio.map(item =>
            item.id === id
              ? { ...item, photos: [...item.photos, ...arr] }
              : item,
          ),
        }));
      },
      { multiple: true },
    );
  };
  const removePhoto = (itemId, photoIdx) =>
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item =>
        item.id === itemId
          ? { ...item, photos: item.photos.filter((_, i) => i !== photoIdx) }
          : item,
      ),
    }));

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: R(8) }}>
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: R(14),
        }}>
        <GoldBtn
          title="افزودن نمونه کار"
          icon="images-outline"
          onPress={addPortfolio}
          outline
          style={{ height: R(42) }}
        />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
          نمونه کارها
        </Text>
      </View>

      {data.portfolio.length === 0 && (
        <SectionCard>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: R(24),
              gap: R(10),
            }}>
            <Icon name="images-outline" size={R(45)} color={C.border} />
            <Text
              style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              هنوز نمونه کاری اضافه نشده
            </Text>
          </View>
        </SectionCard>
      )}

      {data.portfolio.map((item, idx) => (
        <SectionCard key={item.id}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: R(12),
            }}>
            <TouchableOpacity
              onPress={() => removePortfolio(item.id)}
              style={{ padding: R(4) }}>
              <Icon name="trash-outline" size={R(18)} color={C.red} />
            </TouchableOpacity>
            <Text
              style={{
                color: C.gold,
                fontFamily: 'vazir',
                fontSize: R(14),
                fontWeight: 'bold',
              }}>
              نمونه کار {toFa(idx + 1)}
            </Text>
          </View>
          <TextInput
            style={pf.input}
            placeholder="عنوان نمونه کار"
            placeholderTextColor={C.sub}
            value={item.title}
            onChangeText={v => updatePortfolio(item.id, 'title', v)}
            textAlign="left"
          />
          <TextInput
            style={pf.input}
            placeholder="نوع خدمت (مثال: رنگ مو)"
            placeholderTextColor={C.sub}
            value={item.serviceType}
            onChangeText={v => updatePortfolio(item.id, 'serviceType', v)}
            textAlign="left"
          />
          <TextInput
            style={[
              pf.input,
              {
                minHeight: R(70),
                textAlignVertical: 'top',
                paddingTop: R(10),
                marginBottom: R(14),
              },
            ]}
            placeholder="توضیحات این نمونه کار..."
            placeholderTextColor={C.sub}
            value={item.description}
            onChangeText={v => updatePortfolio(item.id, 'description', v)}
            multiline
            textAlign="left"
          />
          <Text
            style={{
              color: C.sub,
              fontFamily: 'vazir',
              fontSize: R(12),
              textAlign: 'left',
              marginBottom: R(8),
            }}>
            عکس‌های نمونه کار
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: R(8) }}>
            {item.photos.map((uri, pi) => (
              <View key={pi} style={{ position: 'relative' }}>
                <Image
                  source={{ uri }}
                  style={{
                    width: R(80),
                    height: R(80),
                    borderRadius: R(10),
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                />
                <TouchableOpacity
                  onPress={() => removePhoto(item.id, pi)}
                  style={{
                    position: 'absolute',
                    top: -R(6),
                    left: -R(6),
                    width: R(20),
                    height: R(20),
                    borderRadius: R(10),
                    backgroundColor: C.red,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="close" size={R(11)} color={C.white} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addPhoto(item.id)}
              style={{
                width: R(80),
                height: R(80),
                borderRadius: R(10),
                backgroundColor: C.surface2,
                borderWidth: 1.5,
                borderColor: C.border,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                gap: R(4),
              }}>
              <Icon name="add" size={R(22)} color={C.sub} />
              <Text
                style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(9) }}>
                افزودن عکس
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SectionCard>
      ))}
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

const pf = StyleSheet.create({
  input: {
    backgroundColor: C.surface2,
    borderRadius: R(10),
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: R(12),
    height: R(44),
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
    marginBottom: R(10),
  },
});

// ─────────────────────────────────────────────────────────
// نمایش آگهی — Business Card
// ─────────────────────────────────────────────────────────
const BusinessCard = ({ data, onEdit }) => {
  const [activeTab, setActiveTab] = useState('services');
  const insets = useSafeAreaInsets();
  const totalSlots = data.services.reduce(
    (acc, s) => acc + Object.keys(s.slots || {}).length,
    0,
  );
  // ارتفاع دکمه ویرایش + padding بالا و پایینش
  const FLOAT_H = R(52) + R(12) + R(12) + insets.bottom + R(60);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar
        backgroundColor={C.bg}
        barStyle="light-content"
        translucent={false}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: R(8), paddingBottom: FLOAT_H }}>
        {/* هدر آگهی */}
        <View style={bc.hero}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: R(14),
            }}>
            <View>
              {data.profilePhoto ? (
                <Image source={{ uri: data.profilePhoto }} style={bc.avatar} />
              ) : (
                <View
                  style={[
                    bc.avatar,
                    {
                      backgroundColor: C.surface2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Icon name="storefront-outline" size={R(32)} color={C.gold} />
                </View>
              )}
              <View style={bc.verifiedBadge}>
                <Icon name="checkmark" size={R(9)} color={C.bg} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={bc.bizName}>{data.bizName || 'نام کسب‌وکار'}</Text>
              <Text style={bc.bizType}>{data.bizType}</Text>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: R(4),
                  marginTop: R(4),
                }}>
                <Icon name="location-outline" size={R(12)} color={C.sub} />
                <Text style={bc.location}>
                  {[data.district, data.city, data.province]
                    .filter(Boolean)
                    .join('، ')}
                </Text>
              </View>
            </View>
          </View>

          {/* آمار */}
          <View style={bc.statsRow}>
            <View style={bc.statItem}>
              <Text style={bc.statNum}>{toFa(data.services.length)}</Text>
              <Text style={bc.statLabel}>خدمت</Text>
            </View>
            <View style={bc.statDivider} />
            <View style={bc.statItem}>
              <Text style={bc.statNum}>{toFa(totalSlots)}</Text>
              <Text style={bc.statLabel}>نوبت</Text>
            </View>
            <View style={bc.statDivider} />
            <View style={bc.statItem}>
              <Text style={bc.statNum}>{toFa(data.team.length)}</Text>
              <Text style={bc.statLabel}>عضو تیم</Text>
            </View>
            <View style={bc.statDivider} />
            <View style={bc.statItem}>
              <Text style={bc.statNum}>{toFa(data.portfolio.length)}</Text>
              <Text style={bc.statLabel}>نمونه کار</Text>
            </View>
          </View>
        </View>

        {/* اطلاعات مالک */}
        <View style={bc.infoCard}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={bc.phoneRow}>
              <Icon name="call-outline" size={R(14)} color={C.gold} />
              <Text style={bc.phoneNum}>{data.phone}</Text>
            </View>
            <View style={{ alignItems: 'flex-start' }}>
              <Text
                style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(11) }}>
                صاحب کسب‌وکار
              </Text>
              <Text
                style={{
                  color: C.white,
                  fontFamily: 'vazir',
                  fontSize: R(14),
                  fontWeight: 'bold',
                }}>
                {data.ownerName}
              </Text>
            </View>
          </View>
          {data.description ? (
            <Text
              style={{
                color: C.sub,
                fontFamily: 'vazir',
                fontSize: R(13),
                textAlign: 'left',
                marginTop: R(12),
                lineHeight: R(22),
              }}>
              {data.description}
            </Text>
          ) : null}
        </View>

        {/* تب‌ها */}
        <View style={bc.tabs}>
          {[
            { key: 'services', label: 'خدمات', icon: 'pricetag-outline' },
            { key: 'team', label: 'تیم', icon: 'people-outline' },
            { key: 'portfolio', label: 'نمونه کار', icon: 'images-outline' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[bc.tab, activeTab === tab.key && bc.tabActive]}>
              <Icon
                name={tab.icon}
                size={R(14)}
                color={activeTab === tab.key ? C.gold : C.sub}
              />
              <Text
                style={[bc.tabTxt, activeTab === tab.key && bc.tabTxtActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* محتوای تب */}
        <View style={{ paddingHorizontal: R(16), marginTop: R(8) }}>
          {activeTab === 'services' &&
            (data.services.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: R(30) }}>
                <Icon name="pricetag-outline" size={R(40)} color={C.border} />
                <Text
                  style={{
                    color: C.sub,
                    fontFamily: 'vazir',
                    fontSize: R(13),
                    marginTop: R(10),
                  }}>
                  خدمتی ثبت نشده
                </Text>
              </View>
            ) : (
              data.services.map(s => {
                const cnt = Object.keys(s.slots || {}).length;
                return (
                  <View key={s.id} style={bc.serviceItem}>
                    <View
                      style={{
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        gap: R(8),
                      }}>
                      <View
                        style={{
                          backgroundColor: C.goldSoft,
                          borderRadius: R(8),
                          padding: R(6),
                        }}>
                        <Icon name="pricetag" size={R(14)} color={C.gold} />
                      </View>
                      <View style={{ flex: 1, alignItems: 'flex-start' }}>
                        <Text
                          style={{
                            color: C.white,
                            fontFamily: 'vazir',
                            fontSize: R(14),
                            fontWeight: 'bold',
                          }}>
                          {s.name}
                        </Text>
                        {cnt > 0 && (
                          <View
                            style={{
                              flexDirection: 'row-reverse',
                              alignItems: 'center',
                              gap: R(4),
                              marginTop: R(2),
                            }}>
                            <Icon
                              name="calendar-outline"
                              size={R(11)}
                              color={C.sub}
                            />
                            <Text
                              style={{
                                color: C.sub,
                                fontFamily: 'vazir',
                                fontSize: R(11),
                              }}>
                              {toFa(cnt)} نوبت موجود
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View
                      style={{
                        backgroundColor: s.price ? C.goldSoft : C.surface2,
                        borderRadius: R(8),
                        paddingHorizontal: R(10),
                        paddingVertical: R(4),
                        borderWidth: 1,
                        borderColor: s.price ? C.gold : C.border,
                      }}>
                      <Text
                        style={{
                          color: s.price ? C.gold : C.sub,
                          fontFamily: 'vazir',
                          fontSize: R(12),
                          fontWeight: 'bold',
                        }}>
                        {s.price
                          ? `${s.price} تومان`
                          : data.phone || 'تماس بگیرید'}
                      </Text>
                    </View>
                  </View>
                );
              })
            ))}

          {activeTab === 'team' &&
            (data.team.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: R(30) }}>
                <Icon name="people-outline" size={R(40)} color={C.border} />
                <Text
                  style={{
                    color: C.sub,
                    fontFamily: 'vazir',
                    fontSize: R(13),
                    marginTop: R(10),
                  }}>
                  عضو تیمی ثبت نشده
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  flexWrap: 'wrap',
                  gap: R(12),
                  justifyContent: 'flex-end',
                }}>
                {data.team.map(m => (
                  <View key={m.id} style={bc.memberCard}>
                    <PhotoCircle size={R(64)} uri={m.photo} />
                    <Text
                      style={{
                        color: C.white,
                        fontFamily: 'vazir',
                        fontSize: R(12),
                        textAlign: 'center',
                        marginTop: R(6),
                      }}>
                      {m.name || '—'}
                    </Text>
                    <Text
                      style={{
                        color: C.sub,
                        fontFamily: 'vazir',
                        fontSize: R(10),
                        textAlign: 'center',
                      }}>
                      {m.role || ''}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

          {activeTab === 'portfolio' &&
            (data.portfolio.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: R(30) }}>
                <Icon name="images-outline" size={R(40)} color={C.border} />
                <Text
                  style={{
                    color: C.sub,
                    fontFamily: 'vazir',
                    fontSize: R(13),
                    marginTop: R(10),
                  }}>
                  نمونه کاری ثبت نشده
                </Text>
              </View>
            ) : (
              data.portfolio.map(item => (
                <View key={item.id} style={bc.portfolioItem}>
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: R(10),
                    }}>
                    <View
                      style={{
                        backgroundColor: C.goldSoft,
                        borderRadius: R(8),
                        paddingHorizontal: R(8),
                        paddingVertical: R(3),
                        borderWidth: 1,
                        borderColor: C.goldBorder,
                      }}>
                      <Text
                        style={{
                          color: C.gold,
                          fontFamily: 'vazir',
                          fontSize: R(11),
                        }}>
                        {item.serviceType || 'خدمت'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: C.white,
                        fontFamily: 'vazir',
                        fontSize: R(14),
                        fontWeight: 'bold',
                      }}>
                      {item.title}
                    </Text>
                  </View>
                  {item.description ? (
                    <Text
                      style={{
                        color: C.sub,
                        fontFamily: 'vazir',
                        fontSize: R(12),
                        textAlign: 'left',
                        lineHeight: R(20),
                        marginBottom: R(10),
                      }}>
                      {item.description}
                    </Text>
                  ) : null}
                  {item.photos.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: R(8) }}>
                      {item.photos.map((uri, i) => (
                        <Image
                          key={i}
                          source={{ uri }}
                          style={{
                            width: R(100),
                            height: R(100),
                            borderRadius: R(10),
                            borderWidth: 1,
                            borderColor: C.border,
                          }}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              ))
            ))}
        </View>
      </ScrollView>

      {/* دکمه ویرایش شناور — بالای تب‌بار */}
      <View
        style={[bc.floatWrap, { paddingBottom: insets.bottom + R(60) + R(8) }]}>
        <TouchableOpacity
          onPress={onEdit}
          style={bc.editBtn}
          activeOpacity={0.88}>
          <Icon name="create-outline" size={R(20)} color={C.bg} />
          <Text
            style={{
              color: C.bg,
              fontFamily: 'vazir',
              fontSize: R(15),
              fontWeight: 'bold',
            }}>
            ویرایش آگهی
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const bc = StyleSheet.create({
  hero: {
    backgroundColor: C.surface,
    margin: R(16),
    marginTop: R(12),
    borderRadius: R(20),
    padding: R(18),
    borderWidth: 1,
    borderColor: C.border,
  },
  avatar: {
    width: R(80),
    height: R(80),
    borderRadius: R(40),
    borderWidth: 2,
    borderColor: C.gold,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -R(2),
    width: R(20),
    height: R(20),
    borderRadius: R(10),
    backgroundColor: C.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.surface,
  },
  bizName: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(20),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  bizType: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
    marginTop: R(2),
  },
  location: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: R(18),
    paddingTop: R(14),
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  statItem: { alignItems: 'center', gap: R(2) },
  statNum: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(20),
    fontWeight: 'bold',
  },
  statLabel: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  statDivider: { width: 1, height: R(32), backgroundColor: C.border },
  infoCard: {
    backgroundColor: C.surface,
    marginHorizontal: R(16),
    borderRadius: R(16),
    padding: R(16),
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: R(16),
  },
  phoneRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(6),
    backgroundColor: C.goldSoft,
    borderRadius: R(10),
    paddingHorizontal: R(10),
    paddingVertical: R(6),
    borderWidth: 1,
    borderColor: C.goldBorder,
  },
  phoneNum: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(13),
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row-reverse',
    marginHorizontal: R(16),
    backgroundColor: C.surface,
    borderRadius: R(14),
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(5),
    paddingVertical: R(12),
  },
  tabActive: { backgroundColor: C.goldSoft },
  tabTxt: { color: C.sub, fontFamily: 'vazir', fontSize: R(12) },
  tabTxtActive: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(12),
    fontWeight: 'bold',
  },
  serviceItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.surface,
    borderRadius: R(14),
    padding: R(14),
    marginBottom: R(10),
    borderWidth: 1,
    borderColor: C.border,
  },
  memberCard: { alignItems: 'center', width: R(90) },
  portfolioItem: {
    backgroundColor: C.surface,
    borderRadius: R(16),
    padding: R(16),
    marginBottom: R(12),
    borderWidth: 1,
    borderColor: C.border,
  },
  // bottom رو داینامیک می‌دیم از داخل کامپوننت
  floatWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: R(16),
    paddingTop: R(12),
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  editBtn: {
    backgroundColor: C.gold,
    height: R(52),
    borderRadius: R(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(8),
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: R(4) },
    shadowOpacity: 0.4,
    shadowRadius: R(10),
    elevation: 8,
  },
});

// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────
// صفحه اصلی Wizard
// ─────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────

const CreateBusinessScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [data, setData] = useState({
    profilePhoto: null,
    bizName: '',
    ownerName: '',
    phone: '',
    description: '',
    bizType: '',
    province: '',
    city: '',
    district: '',
    address: '',
    team: [],
    services: [],
    portfolio: [],
  });

  const canNext = () => {
    if (step === 1) return !!(data.bizName && data.ownerName && data.phone);
    if (step === 2) return !!(data.province && data.city);
    return true;
  };

  const navProps = {
    step,
    canNext: canNext(),
    onNext: () => setStep(p => p + 1),
    onBack: () => setStep(p => p - 1),
    onSubmit: () => setSubmitted(true),
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 data={data} setData={setData} navProps={navProps} />;
      case 2:
        return <Step2 data={data} setData={setData} navProps={navProps} />;
      case 3:
        return <Step3 data={data} setData={setData} navProps={navProps} />;
      case 4:
        return <Step4 data={data} setData={setData} navProps={navProps} />;
      case 5:
        return <Step5 data={data} setData={setData} navProps={navProps} />;
    }
  };

  // نمایش آگهی پس از ثبت
  if (submitted) {
    return <BusinessCard data={data} onEdit={() => setSubmitted(false)} />;
  }

  return (
    <SafeAreaView edges={['top']} style={s.container}>
      <StatusBar
        backgroundColor={C.bg}
        barStyle="light-content"
        translucent={false}
      />

      {/* هدر */}
      <View style={s.header}>
        <TouchableOpacity
          onPress={
            step === 1 ? () => navigation?.goBack() : () => setStep(p => p - 1)
          }
          style={s.backBtn}>
          <Icon name="arrow-forward" size={R(22)} color={C.gold} />
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
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

      {/* محتوا — دکمه ناوبری داخل ScrollView هر مرحله قرار دارد */}
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
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: R(16),
    paddingTop: R(10),
    paddingBottom: R(14),
  },
  backBtn: {
    width: R(40),
    height: R(40),
    borderRadius: R(12),
    backgroundColor: C.surface,
    borderWidth: 1,
    borderColor: C.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(18),
    fontWeight: 'bold',
  },
  headerSub: {
    color: C.sub,
    fontFamily: 'vazir',
    fontSize: R(12),
    marginTop: R(2),
  },
  headerIcon: {
    width: R(44),
    height: R(44),
    borderRadius: R(14),
    backgroundColor: C.goldSoft,
    borderWidth: 1,
    borderColor: C.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateBusinessScreen;
