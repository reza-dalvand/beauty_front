/**
 * CreateBusinessScreen.js
 * ✓ فرم چند مرحله‌ای (Wizard) ساخت آگهی کسب‌وکار
 * ✓ تم طلایی-مشکی، کاملاً RTL و ریسپانسیو
 * ✓ تقویم شمسی برای نوبت‌دهی
 * ✓ بدون پکیج اضافه
 */

import React, { useState, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Image, FlatList, Dimensions, StatusBar,
  Platform, Animated, Modal, Pressable, KeyboardAvoidingView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// ─────────────────────────────────────────────────────────
// ریسپانسیو
// ─────────────────────────────────────────────────────────
const BASE = 390;
const { width: SW, height: SH } = Dimensions.get('window');
const R = n => Math.round((n / BASE) * SW);

// ─────────────────────────────────────────────────────────
// رنگ‌ها
// ─────────────────────────────────────────────────────────
const C = {
  bg:       '#0B0B0B',
  surface:  '#1A1A1A',
  surface2: '#222222',
  surface3: '#2A2A2A',
  gold:     '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.12)',
  goldBorder:'rgba(212,175,55,0.35)',
  white:    '#FFFFFF',
  sub:      '#909090',
  border:   '#2E2E2E',
  red:      '#E53935',
  green:    '#43A047',
  cardBg:   '#141414',
};

// ─────────────────────────────────────────────────────────
// داده‌های ثابت
// ─────────────────────────────────────────────────────────
const BUSINESS_TYPES = [
  { key: 'آرایشگاه',   icon: 'cut-outline'            },
  { key: 'کلینیک',     icon: 'medkit-outline'          },
  { key: 'ناخن',       icon: 'color-palette-outline'   },
  { key: 'اسپا',       icon: 'leaf-outline'            },
  { key: 'تتو',        icon: 'brush-outline'           },
  { key: 'آرایش عروس', icon: 'rose-outline'            },
  { key: 'مو',         icon: 'sparkles-outline'        },
  { key: 'پوست',       icon: 'body-outline'            },
];

const PROVINCES = ['تهران','اصفهان','فارس','خراسان رضوی','آذربایجان شرقی','البرز','مازندران','گیلان'];
const DAYS_FA = ['ش','ی','د','س','چ','پ','ج'];
const MONTHS_FA = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const SLOT_TIMES = ['۸:۰۰','۹:۰۰','۱۰:۰۰','۱۱:۰۰','۱۲:۰۰','۱۳:۰۰','۱۴:۰۰','۱۵:۰۰','۱۶:۰۰','۱۷:۰۰','۱۸:۰۰','۱۹:۰۰','۲۰:۰۰'];

// مراحل wizard
const STEPS = [
  { id: 1, title: 'اطلاعات پایه',   icon: 'storefront-outline'   },
  { id: 2, title: 'موقعیت مکانی',   icon: 'location-outline'     },
  { id: 3, title: 'اعضای تیم',      icon: 'people-outline'       },
  { id: 4, title: 'خدمات و نوبت',   icon: 'calendar-outline'     },
  { id: 5, title: 'نمونه کارها',    icon: 'images-outline'       },
];

// ─────────────────────────────────────────────────────────
// helpers شمسی ساده
// ─────────────────────────────────────────────────────────
const toFarsiNum = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

const getDaysInMonth = (month) => {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return 29;
};

// ─────────────────────────────────────────────────────────
// کامپوننت‌های کوچک مشترک
// ─────────────────────────────────────────────────────────

const Label = ({ text, required }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: R(6), gap: R(4) }}>
    {required && <Text style={{ color: C.red, fontSize: R(12) }}>*</Text>}
    <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13), textAlign: 'right' }}>{text}</Text>
  </View>
);

const Field = ({ label, required, placeholder, value, onChangeText, keyboardType, multiline, style }) => (
  <View style={{ marginBottom: R(16) }}>
    <Label text={label} required={required} />
    <TextInput
      style={[{
        backgroundColor: C.surface2,
        borderRadius: R(12), borderWidth: 1, borderColor: C.border,
        paddingHorizontal: R(14), paddingVertical: R(12),
        color: C.white, fontFamily: 'vazir', fontSize: R(14),
        textAlign: 'right',
        minHeight: multiline ? R(80) : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
      }, style]}
      placeholder={placeholder}
      placeholderTextColor={C.sub}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

const PhotoPlaceholder = ({ size = R(90), onPress, uri, icon = 'camera-outline', label }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}
    style={{
      width: size, height: size, borderRadius: size / 2,
      backgroundColor: C.surface2, borderWidth: 1.5,
      borderColor: uri ? C.gold : C.border, borderStyle: uri ? 'solid' : 'dashed',
      justifyContent: 'center', alignItems: 'center', overflow: 'hidden',
    }}>
    {uri
      ? <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
      : <>
          <Icon name={icon} size={R(22)} color={C.sub} />
          {label && <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(10), marginTop: R(4) }}>{label}</Text>}
        </>
    }
  </TouchableOpacity>
);

const SectionCard = ({ children, style }) => (
  <View style={[{
    backgroundColor: C.surface, borderRadius: R(18),
    borderWidth: 1, borderColor: C.border,
    padding: R(16), marginBottom: R(14),
  }, style]}>
    {children}
  </View>
);

const GoldBtn = ({ title, icon, onPress, outline, style }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85}
    style={[{
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
      gap: R(8), height: R(48), borderRadius: R(14),
      backgroundColor: outline ? 'transparent' : C.gold,
      borderWidth: outline ? 1 : 0,
      borderColor: outline ? C.gold : 'transparent',
    }, style]}>
    {icon && <Icon name={icon} size={R(18)} color={outline ? C.gold : C.bg} />}
    <Text style={{
      color: outline ? C.gold : C.bg,
      fontFamily: 'vazir', fontSize: R(15), fontWeight: 'bold',
    }}>{title}</Text>
  </TouchableOpacity>
);

// ─────────────────────────────────────────────────────────
// StepIndicator
// ─────────────────────────────────────────────────────────
const StepIndicator = ({ currentStep }) => (
  <View style={si.wrap}>
    {STEPS.map((s, idx) => {
      const done    = s.id < currentStep;
      const active  = s.id === currentStep;
      return (
        <React.Fragment key={s.id}>
          <View style={si.item}>
            <View style={[si.circle,
              done   && si.circleDone,
              active && si.circleActive]}>
              {done
                ? <Icon name="checkmark" size={R(13)} color={C.bg} />
                : <Icon name={s.icon}   size={R(13)} color={active ? C.bg : C.sub} />
              }
            </View>
            {active && (
              <Text style={si.label} numberOfLines={1}>{s.title}</Text>
            )}
          </View>
          {idx < STEPS.length - 1 && (
            <View style={[si.line, done && si.lineDone]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const si = StyleSheet.create({
  wrap:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: R(16), marginBottom: R(20) },
  item:   { alignItems: 'center', gap: R(4) },
  circle: {
    width: R(34), height: R(34), borderRadius: R(17),
    backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  circleDone:   { backgroundColor: C.gold, borderColor: C.gold },
  circleActive: { backgroundColor: C.gold, borderColor: C.gold, shadowColor: C.gold, shadowOffset:{width:0,height:R(4)}, shadowOpacity:0.5, shadowRadius:R(8), elevation:6 },
  label: { color: C.gold, fontFamily: 'vazir', fontSize: R(10), maxWidth: R(60), textAlign: 'center' },
  line:  { flex: 1, height: 1, backgroundColor: C.border, marginHorizontal: R(3) },
  lineDone: { backgroundColor: C.gold },
});

// ─────────────────────────────────────────────────────────
// مرحله ۱ — اطلاعات پایه
// ─────────────────────────────────────────────────────────
const Step1 = ({ data, setData }) => (
  <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

    {/* عکس پروفایل */}
    <SectionCard>
      <View style={{ alignItems: 'center', marginBottom: R(8) }}>
        <PhotoPlaceholder
          size={R(100)}
          uri={data.profilePhoto}
          icon="camera-outline"
          label="عکس پروفایل"
          onPress={() => {}}
        />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(11), marginTop: R(8) }}>
          عکس پروفایل کسب‌وکار
        </Text>
      </View>
    </SectionCard>

    <SectionCard>
      <Field label="نام کسب‌وکار" required
        placeholder="مثال: سالن زیبایی رخ"
        value={data.bizName}
        onChangeText={v => setData(p => ({ ...p, bizName: v }))} />

      <Field label="نام و نام خانوادگی صاحب کسب‌وکار" required
        placeholder="نام کامل"
        value={data.ownerName}
        onChangeText={v => setData(p => ({ ...p, ownerName: v }))} />

      <Field label="شماره تماس" required
        placeholder="۰۹۱۲XXXXXXX"
        value={data.phone}
        onChangeText={v => setData(p => ({ ...p, phone: v }))}
        keyboardType="phone-pad" />

      <Field label="توضیحات" required
        placeholder="درباره کسب‌وکار خود بنویسید..."
        value={data.description}
        onChangeText={v => setData(p => ({ ...p, description: v }))}
        multiline />
    </SectionCard>

    {/* نوع کسب‌وکار */}
    <SectionCard>
      <Label text="نوع کسب‌وکار" required />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: R(8), justifyContent: 'flex-end' }}>
        {BUSINESS_TYPES.map(t => {
          const active = data.bizType === t.key;
          return (
            <TouchableOpacity key={t.key} activeOpacity={0.8}
              onPress={() => setData(p => ({ ...p, bizType: t.key }))}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: R(6),
                paddingHorizontal: R(12), paddingVertical: R(8),
                borderRadius: R(20), borderWidth: 1,
                borderColor: active ? C.gold : C.border,
                backgroundColor: active ? C.goldSoft : C.surface2,
              }}>
              <Icon name={t.icon} size={R(14)} color={active ? C.gold : C.sub} />
              <Text style={{ color: active ? C.gold : C.sub, fontFamily: 'vazir', fontSize: R(12) }}>
                {t.key}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SectionCard>
  </ScrollView>
);

// ─────────────────────────────────────────────────────────
// مرحله ۲ — موقعیت مکانی
// ─────────────────────────────────────────────────────────
const Step2 = ({ data, setData }) => {
  const [provOpen, setProvOpen] = useState(false);

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <SectionCard>
        {/* استان */}
        <View style={{ marginBottom: R(16) }}>
          <Label text="استان" required />
          <TouchableOpacity onPress={() => setProvOpen(p => !p)}
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
              backgroundColor: C.surface2, borderRadius: R(12), borderWidth: 1,
              borderColor: provOpen ? C.gold : C.border,
              paddingHorizontal: R(14), height: R(48),
            }}>
            <Icon name="chevron-down" size={R(16)} color={C.sub}
              style={{ transform: [{ rotate: provOpen ? '180deg' : '0deg' }] }} />
            <Text style={{ color: data.province ? C.white : C.sub, fontFamily: 'vazir', fontSize: R(14) }}>
              {data.province || 'انتخاب استان'}
            </Text>
            <Icon name="location-outline" size={R(18)} color={data.province ? C.gold : C.sub} />
          </TouchableOpacity>
          {provOpen && (
            <View style={{
              backgroundColor: C.surface2, borderRadius: R(12),
              borderWidth: 1, borderColor: C.gold, marginTop: R(4),
              maxHeight: R(200), overflow: 'hidden',
            }}>
              <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
                {PROVINCES.map((prov, idx) => (
                  <TouchableOpacity key={prov}
                    onPress={() => { setData(p => ({ ...p, province: prov })); setProvOpen(false); }}
                    style={{
                      paddingHorizontal: R(16), paddingVertical: R(12),
                      borderBottomWidth: idx < PROVINCES.length - 1 ? 1 : 0,
                      borderBottomColor: C.border,
                      backgroundColor: data.province === prov ? C.goldSoft : 'transparent',
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: R(8),
                    }}>
                    {data.province === prov && <Icon name="checkmark" size={R(14)} color={C.gold} />}
                    <Text style={{
                      color: data.province === prov ? C.gold : C.white,
                      fontFamily: 'vazir', fontSize: R(14),
                    }}>{prov}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <Field label="شهر" required
          placeholder="نام شهر"
          value={data.city}
          onChangeText={v => setData(p => ({ ...p, city: v }))} />

        <Field label="منطقه / محله"
          placeholder="مثال: منطقه ۳، ونک"
          value={data.district}
          onChangeText={v => setData(p => ({ ...p, district: v }))} />

        <Field label="آدرس کامل"
          placeholder="خیابان، کوچه، پلاک..."
          value={data.address}
          onChangeText={v => setData(p => ({ ...p, address: v }))}
          multiline />
      </SectionCard>
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// مرحله ۳ — اعضای تیم
// ─────────────────────────────────────────────────────────
const Step3 = ({ data, setData }) => {
  const addMember = () => {
    setData(p => ({
      ...p,
      team: [...p.team, { id: Date.now(), name: '', role: '', photo: null }],
    }));
  };

  const removeMember = (id) => {
    setData(p => ({ ...p, team: p.team.filter(m => m.id !== id) }));
  };

  const updateMember = (id, field, value) => {
    setData(p => ({
      ...p,
      team: p.team.map(m => m.id === id ? { ...m, [field]: value } : m),
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <SectionCard>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(16) }}>
          <GoldBtn title="افزودن عضو" icon="add-outline" onPress={addMember} outline
            style={{ paddingHorizontal: R(16), height: R(38) }} />
          <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
            اعضای تیم (اختیاری)
          </Text>
        </View>

        {data.team.length === 0 && (
          <View style={{ alignItems: 'center', paddingVertical: R(24), gap: R(8) }}>
            <Icon name="people-outline" size={R(40)} color={C.border} />
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              هنوز عضوی اضافه نشده
            </Text>
          </View>
        )}

        {data.team.map((member, idx) => (
          <View key={member.id} style={{
            backgroundColor: C.surface2, borderRadius: R(14),
            borderWidth: 1, borderColor: C.border,
            padding: R(14), marginBottom: R(12),
          }}>
            {/* هدر کارت عضو */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(12) }}>
              <TouchableOpacity onPress={() => removeMember(member.id)}
                style={{ padding: R(4) }}>
                <Icon name="trash-outline" size={R(18)} color={C.red} />
              </TouchableOpacity>
              <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(13), fontWeight: 'bold' }}>
                عضو {toFarsiNum(idx + 1)}
              </Text>
            </View>

            {/* عکس پرسنل */}
            <View style={{ alignItems: 'center', marginBottom: R(12) }}>
              <PhotoPlaceholder
                size={R(70)}
                uri={member.photo}
                icon="person-outline"
                label="عکس"
                onPress={() => {}}
              />
            </View>

            <TextInput
              style={{
                backgroundColor: C.surface3, borderRadius: R(10),
                borderWidth: 1, borderColor: C.border,
                paddingHorizontal: R(12), height: R(44),
                color: C.white, fontFamily: 'vazir', fontSize: R(13),
                textAlign: 'right', marginBottom: R(8),
              }}
              placeholder="نام و نام خانوادگی"
              placeholderTextColor={C.sub}
              value={member.name}
              onChangeText={v => updateMember(member.id, 'name', v)}
            />
            <TextInput
              style={{
                backgroundColor: C.surface3, borderRadius: R(10),
                borderWidth: 1, borderColor: C.border,
                paddingHorizontal: R(12), height: R(44),
                color: C.white, fontFamily: 'vazir', fontSize: R(13),
                textAlign: 'right',
              }}
              placeholder="سمت / تخصص"
              placeholderTextColor={C.sub}
              value={member.role}
              onChangeText={v => updateMember(member.id, 'role', v)}
            />
          </View>
        ))}
      </SectionCard>
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// تقویم شمسی مینیمال
// ─────────────────────────────────────────────────────────
const PersianCalendar = ({ selectedDays, onToggleDay, month, year, onMonthChange }) => {
  const daysInMonth = getDaysInMonth(month);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <View style={cal.wrap}>
      {/* هدر ماه */}
      <View style={cal.header}>
        <TouchableOpacity onPress={() => onMonthChange(1)} style={cal.navBtn}>
          <Icon name="chevron-forward" size={R(18)} color={C.gold} />
        </TouchableOpacity>
        <Text style={cal.monthTxt}>
          {MONTHS_FA[month - 1]} {toFarsiNum(year)}
        </Text>
        <TouchableOpacity onPress={() => onMonthChange(-1)} style={cal.navBtn}>
          <Icon name="chevron-back" size={R(18)} color={C.gold} />
        </TouchableOpacity>
      </View>

      {/* نام روزها */}
      <View style={cal.dayNames}>
        {DAYS_FA.map(d => (
          <Text key={d} style={cal.dayName}>{d}</Text>
        ))}
      </View>

      {/* روزها */}
      <View style={cal.grid}>
        {days.map(day => {
          const key = `${year}/${month}/${day}`;
          const selected = selectedDays?.includes(key);
          return (
            <TouchableOpacity key={day} onPress={() => onToggleDay(key)}
              style={[cal.day, selected && cal.dayOn]}>
              <Text style={[cal.dayTxt, selected && cal.dayTxtOn]}>
                {toFarsiNum(day)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const DAY_SIZE = Math.floor((SW - R(32) - R(32) - R(4) * 6) / 7);

const cal = StyleSheet.create({
  wrap:     { backgroundColor: C.surface2, borderRadius: R(14), padding: R(12) },
  header:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(10) },
  navBtn:   { padding: R(6) },
  monthTxt: { color: C.gold, fontFamily: 'vazir', fontSize: R(15), fontWeight: 'bold' },
  dayNames: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: R(6) },
  dayName:  { color: C.sub, fontFamily: 'vazir', fontSize: R(11), width: DAY_SIZE, textAlign: 'center' },
  grid:     { flexDirection: 'row', flexWrap: 'wrap', gap: R(4) },
  day:      {
    width: DAY_SIZE, height: DAY_SIZE,
    borderRadius: DAY_SIZE / 2,
    justifyContent: 'center', alignItems: 'center',
    backgroundColor: C.surface3,
  },
  dayOn:    { backgroundColor: C.gold },
  dayTxt:   { color: C.sub,  fontFamily: 'vazir', fontSize: R(12) },
  dayTxtOn: { color: C.bg,   fontFamily: 'vazir', fontSize: R(12), fontWeight: 'bold' },
});

// ─────────────────────────────────────────────────────────
// کارت خدمت
// ─────────────────────────────────────────────────────────
const ServiceCard = ({ service, phone, onUpdate, onRemove }) => {
  const [calOpen, setCalOpen] = useState(false);
  const [calMonth, setCalMonth] = useState(4); // تیر
  const [calYear, setCalYear] = useState(1403);

  const changeMonth = (dir) => {
    let m = calMonth + dir;
    let y = calYear;
    if (m > 12) { m = 1; y++; }
    if (m < 1)  { m = 12; y--; }
    setCalMonth(m);
    setCalYear(y);
  };

  const toggleDay = (key) => {
    const current = service.availableDays || [];
    const next = current.includes(key)
      ? current.filter(d => d !== key)
      : [...current, key];
    onUpdate('availableDays', next);
  };

  const addSlot = (day, time) => {
    const current = service.slots || {};
    const daySlots = current[day] || [];
    const next = daySlots.includes(time)
      ? daySlots.filter(t => t !== time)
      : [...daySlots, time];
    onUpdate('slots', { ...current, [day]: next });
  };

  const selectedDay = service.availableDays?.[0];

  return (
    <View style={{
      backgroundColor: C.surface2, borderRadius: R(16),
      borderWidth: 1, borderColor: C.border,
      marginBottom: R(14), overflow: 'hidden',
    }}>
      {/* هدر خدمت */}
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        backgroundColor: C.surface3, paddingHorizontal: R(14), paddingVertical: R(10),
      }}>
        <TouchableOpacity onPress={onRemove} style={{ padding: R(4) }}>
          <Icon name="trash-outline" size={R(18)} color={C.red} />
        </TouchableOpacity>
        <View style={{
          backgroundColor: C.goldSoft, borderRadius: R(8),
          paddingHorizontal: R(10), paddingVertical: R(4),
          borderWidth: 1, borderColor: C.goldBorder,
        }}>
          <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(12) }}>
            {service.name || 'خدمت جدید'}
          </Text>
        </View>
      </View>

      <View style={{ padding: R(14) }}>
        {/* نام و قیمت */}
        <TextInput
          style={svc.input}
          placeholder="نام خدمت (مثال: رنگ مو)"
          placeholderTextColor={C.sub}
          value={service.name}
          onChangeText={v => onUpdate('name', v)}
          textAlign="right"
        />

        <View style={{ flexDirection: 'row', gap: R(8), marginBottom: R(12) }}>
          <TextInput
            style={[svc.input, { flex: 1, marginBottom: 0 }]}
            placeholder={phone || 'قیمت (تومان)'}
            placeholderTextColor={C.sub}
            value={service.price}
            onChangeText={v => onUpdate('price', v)}
            keyboardType="numeric"
            textAlign="right"
          />
          <View style={{
            backgroundColor: service.price ? C.goldSoft : C.surface3,
            borderRadius: R(10), borderWidth: 1,
            borderColor: service.price ? C.gold : C.border,
            paddingHorizontal: R(10), justifyContent: 'center',
          }}>
            <Text style={{ color: service.price ? C.gold : C.sub, fontFamily: 'vazir', fontSize: R(11) }}>
              {service.price ? 'تومان' : 'تماس'}
            </Text>
          </View>
        </View>

        {/* تقویم نوبت‌دهی */}
        <TouchableOpacity onPress={() => setCalOpen(p => !p)}
          style={{
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
            backgroundColor: C.surface3, borderRadius: R(10),
            paddingHorizontal: R(12), paddingVertical: R(10),
            borderWidth: 1, borderColor: calOpen ? C.gold : C.border,
            marginBottom: calOpen ? R(12) : 0,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: R(6) }}>
            <Icon name="chevron-down" size={R(15)} color={C.sub}
              style={{ transform: [{ rotate: calOpen ? '180deg' : '0deg' }] }} />
            {(service.availableDays?.length > 0) && (
              <View style={{
                backgroundColor: C.gold, borderRadius: R(8),
                paddingHorizontal: R(6), paddingVertical: R(2),
              }}>
                <Text style={{ color: C.bg, fontFamily: 'vazir', fontSize: R(10), fontWeight: 'bold' }}>
                  {toFarsiNum(service.availableDays.length)} روز
                </Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: R(6) }}>
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(12) }}>
              تنظیم تقویم نوبت‌دهی
            </Text>
            <Icon name="calendar-outline" size={R(16)} color={C.gold} />
          </View>
        </TouchableOpacity>

        {calOpen && (
          <>
            <PersianCalendar
              selectedDays={service.availableDays}
              onToggleDay={toggleDay}
              month={calMonth}
              year={calYear}
              onMonthChange={changeMonth}
            />

            {/* ساعت‌های نوبت */}
            {selectedDay && (
              <View style={{ marginTop: R(12) }}>
                <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(12), textAlign: 'right', marginBottom: R(8) }}>
                  نوبت‌های {selectedDay}
                </Text>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: R(6), justifyContent: 'flex-end' }}>
                  {SLOT_TIMES.map(t => {
                    const on = service.slots?.[selectedDay]?.includes(t);
                    return (
                      <TouchableOpacity key={t} onPress={() => addSlot(selectedDay, t)}
                        style={{
                          paddingHorizontal: R(10), paddingVertical: R(6),
                          borderRadius: R(8), borderWidth: 1,
                          borderColor: on ? C.gold : C.border,
                          backgroundColor: on ? C.goldSoft : C.surface3,
                        }}>
                        <Text style={{ color: on ? C.gold : C.sub, fontFamily: 'vazir', fontSize: R(11) }}>
                          {t}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}
          </>
        )}
      </View>
    </View>
  );
};

const svc = StyleSheet.create({
  input: {
    backgroundColor: C.surface3, borderRadius: R(10),
    borderWidth: 1, borderColor: C.border,
    paddingHorizontal: R(12), height: R(44),
    color: C.white, fontFamily: 'vazir', fontSize: R(13),
    textAlign: 'right', marginBottom: R(10),
  },
});

// ─────────────────────────────────────────────────────────
// مرحله ۴ — خدمات و نوبت‌دهی
// ─────────────────────────────────────────────────────────
const Step4 = ({ data, setData }) => {
  const addService = () => {
    setData(p => ({
      ...p,
      services: [...p.services, {
        id: Date.now(), name: '', price: '',
        availableDays: [], slots: {},
      }],
    }));
  };

  const removeService = (id) => {
    setData(p => ({ ...p, services: p.services.filter(s => s.id !== id) }));
  };

  const updateService = (id, field, value) => {
    setData(p => ({
      ...p,
      services: p.services.map(s => s.id === id ? { ...s, [field]: value } : s),
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: R(14),
      }}>
        <GoldBtn title="افزودن خدمت" icon="add-circle-outline" onPress={addService} outline
          style={{ height: R(42) }} />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
          خدمات کسب‌وکار
        </Text>
      </View>

      {data.services.length === 0 && (
        <SectionCard>
          <View style={{ alignItems: 'center', paddingVertical: R(24), gap: R(10) }}>
            <Icon name="cut-outline" size={R(44)} color={C.border} />
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              هنوز خدمتی اضافه نشده
            </Text>
            <Text style={{ color: C.border, fontFamily: 'vazir', fontSize: R(11), textAlign: 'center' }}>
              خدمات خود را به همراه قیمت و زمان‌بندی وارد کنید
            </Text>
          </View>
        </SectionCard>
      )}

      {data.services.map(s => (
        <ServiceCard
          key={s.id}
          service={s}
          phone={data.phone}
          onUpdate={(field, value) => updateService(s.id, field, value)}
          onRemove={() => removeService(s.id)}
        />
      ))}
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// مرحله ۵ — نمونه کارها
// ─────────────────────────────────────────────────────────
const Step5 = ({ data, setData }) => {
  const addPortfolio = () => {
    setData(p => ({
      ...p,
      portfolio: [...p.portfolio, {
        id: Date.now(), title: '', serviceType: '',
        description: '', photos: [],
      }],
    }));
  };

  const removePortfolio = (id) => {
    setData(p => ({ ...p, portfolio: p.portfolio.filter(item => item.id !== id) }));
  };

  const updatePortfolio = (id, field, value) => {
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item => item.id === id ? { ...item, [field]: value } : item),
    }));
  };

  const addPhoto = (id) => {
    // placeholder — بعداً ImagePicker وصل میشه
    const mockUri = `https://picsum.photos/seed/${Date.now()}/400/400`;
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item =>
        item.id === id ? { ...item, photos: [...item.photos, mockUri] } : item),
    }));
  };

  const removePhoto = (itemId, photoIdx) => {
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item =>
        item.id === itemId
          ? { ...item, photos: item.photos.filter((_, i) => i !== photoIdx) }
          : item),
    }));
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      <View style={{
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: R(14),
      }}>
        <GoldBtn title="افزودن نمونه کار" icon="images-outline" onPress={addPortfolio} outline
          style={{ height: R(42) }} />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
          نمونه کارها
        </Text>
      </View>

      {data.portfolio.length === 0 && (
        <SectionCard>
          <View style={{ alignItems: 'center', paddingVertical: R(24), gap: R(10) }}>
            <Icon name="images-outline" size={R(44)} color={C.border} />
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              هنوز نمونه کاری اضافه نشده
            </Text>
          </View>
        </SectionCard>
      )}

      {data.portfolio.map((item, idx) => (
        <SectionCard key={item.id}>
          {/* هدر */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(12) }}>
            <TouchableOpacity onPress={() => removePortfolio(item.id)} style={{ padding: R(4) }}>
              <Icon name="trash-outline" size={R(18)} color={C.red} />
            </TouchableOpacity>
            <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(14), fontWeight: 'bold' }}>
              نمونه کار {toFarsiNum(idx + 1)}
            </Text>
          </View>

          <TextInput
            style={{
              backgroundColor: C.surface2, borderRadius: R(10),
              borderWidth: 1, borderColor: C.border,
              paddingHorizontal: R(12), height: R(44),
              color: C.white, fontFamily: 'vazir', fontSize: R(13),
              textAlign: 'right', marginBottom: R(10),
            }}
            placeholder="عنوان نمونه کار"
            placeholderTextColor={C.sub}
            value={item.title}
            onChangeText={v => updatePortfolio(item.id, 'title', v)}
          />

          <TextInput
            style={{
              backgroundColor: C.surface2, borderRadius: R(10),
              borderWidth: 1, borderColor: C.border,
              paddingHorizontal: R(12), height: R(44),
              color: C.white, fontFamily: 'vazir', fontSize: R(13),
              textAlign: 'right', marginBottom: R(10),
            }}
            placeholder="نوع خدمت (مثال: رنگ مو)"
            placeholderTextColor={C.sub}
            value={item.serviceType}
            onChangeText={v => updatePortfolio(item.id, 'serviceType', v)}
          />

          <TextInput
            style={{
              backgroundColor: C.surface2, borderRadius: R(10),
              borderWidth: 1, borderColor: C.border,
              paddingHorizontal: R(12), paddingVertical: R(10),
              color: C.white, fontFamily: 'vazir', fontSize: R(13),
              textAlign: 'right', minHeight: R(70), textAlignVertical: 'top',
              marginBottom: R(12),
            }}
            placeholder="توضیحات این نمونه کار..."
            placeholderTextColor={C.sub}
            value={item.description}
            onChangeText={v => updatePortfolio(item.id, 'description', v)}
            multiline
          />

          {/* گالری عکس‌ها */}
          <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(12), textAlign: 'right', marginBottom: R(8) }}>
            عکس‌های نمونه کار
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: R(8), paddingBottom: R(4) }}>
            {item.photos.map((uri, photoIdx) => (
              <View key={photoIdx} style={{ position: 'relative' }}>
                <Image source={{ uri }} style={{
                  width: R(80), height: R(80), borderRadius: R(10),
                  borderWidth: 1, borderColor: C.border,
                }} />
                <TouchableOpacity onPress={() => removePhoto(item.id, photoIdx)}
                  style={{
                    position: 'absolute', top: -R(6), left: -R(6),
                    width: R(20), height: R(20), borderRadius: R(10),
                    backgroundColor: C.red, justifyContent: 'center', alignItems: 'center',
                  }}>
                  <Icon name="close" size={R(11)} color={C.white} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity onPress={() => addPhoto(item.id)}
              style={{
                width: R(80), height: R(80), borderRadius: R(10),
                backgroundColor: C.surface2, borderWidth: 1.5,
                borderColor: C.border, borderStyle: 'dashed',
                justifyContent: 'center', alignItems: 'center', gap: R(4),
              }}>
              <Icon name="add" size={R(22)} color={C.sub} />
              <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(9) }}>افزودن</Text>
            </TouchableOpacity>
          </ScrollView>
        </SectionCard>
      ))}
    </ScrollView>
  );
};

// ─────────────────────────────────────────────────────────
// صفحه اصلی
// ─────────────────────────────────────────────────────────
const CreateBusinessScreen = ({ navigation }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    // مرحله ۱
    profilePhoto: null,
    bizName: '',
    ownerName: '',
    phone: '',
    description: '',
    bizType: '',
    // مرحله ۲
    province: '',
    city: '',
    district: '',
    address: '',
    // مرحله ۳
    team: [],
    // مرحله ۴
    services: [],
    // مرحله ۵
    portfolio: [],
  });

  const canNext = () => {
    if (step === 1) return data.bizName && data.ownerName && data.phone && data.bizType;
    if (step === 2) return data.province && data.city;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length) setStep(p => p + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(p => p - 1);
  };

  const handleSubmit = () => {
    // ارسال داده — بعداً به API وصل میشه
    console.log('Submit:', data);
  };

  const renderStep = () => {
    switch (step) {
      case 1: return <Step1 data={data} setData={setData} />;
      case 2: return <Step2 data={data} setData={setData} />;
      case 3: return <Step3 data={data} setData={setData} />;
      case 4: return <Step4 data={data} setData={setData} />;
      case 5: return <Step5 data={data} setData={setData} />;
    }
  };

  return (
    <View style={s.container}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />

      {/* هدر */}
      <View style={s.header}>
        <TouchableOpacity onPress={step === 1 ? () => navigation?.goBack() : handleBack}
          style={s.backBtn}>
          <Icon name="arrow-forward" size={R(22)} color={C.gold} />
        </TouchableOpacity>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={s.headerTitle}>ثبت آگهی کسب‌وکار</Text>
          <Text style={s.headerSub}>
            مرحله {toFarsiNum(step)} از {toFarsiNum(STEPS.length)} — {STEPS[step - 1].title}
          </Text>
        </View>
        {/* لوگو / آیکون */}
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

      {/* دکمه‌های ناوبری */}
      <View style={s.navBar}>
        {step < STEPS.length ? (
          <GoldBtn
            title="مرحله بعد"
            icon="arrow-back-outline"
            onPress={handleNext}
            style={[s.nextBtn, !canNext() && { opacity: 0.45 }]}
          />
        ) : (
          <GoldBtn
            title="ثبت نهایی آگهی"
            icon="checkmark-circle-outline"
            onPress={handleSubmit}
            style={s.nextBtn}
          />
        )}

        {step > 1 && (
          <TouchableOpacity onPress={handleBack} style={s.backNavBtn}>
            <Icon name="arrow-forward" size={R(18)} color={C.sub} />
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>قبلی</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: C.bg,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight || R(24) : 0,
  },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: R(16), paddingTop: R(12), paddingBottom: R(16),
  },
  backBtn: {
    width: R(40), height: R(40), borderRadius: R(12),
    backgroundColor: C.surface, borderWidth: 1, borderColor: C.border,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { color: C.gold,  fontFamily: 'vazir', fontSize: R(18), fontWeight: 'bold' },
  headerSub:   { color: C.sub,   fontFamily: 'vazir', fontSize: R(12), marginTop: R(2) },
  headerIcon:  {
    width: R(44), height: R(44), borderRadius: R(14),
    backgroundColor: C.goldSoft, borderWidth: 1, borderColor: C.goldBorder,
    justifyContent: 'center', alignItems: 'center',
  },
  navBar: {
    flexDirection: 'row-reverse', 
    alignItems: 'center',
    paddingHorizontal: R(16), 
    paddingTop: R(12), // از بالا یکم فاصله بدیم
    // 👇 این خط جادوییه که دکمه رو میاره بالای تب‌بار
    paddingBottom: Platform.OS === 'ios' ? R(100) : R(140), 
    gap: R(10),
    borderTopWidth: 1, 
    borderTopColor: C.border,
    backgroundColor: C.bg,
  },
  nextBtn:    { flex: 1 },
  backNavBtn: {
    flexDirection: 'row', alignItems: 'center', gap: R(4),
    paddingHorizontal: R(14), height: R(48),
    borderRadius: R(14), borderWidth: 1, borderColor: C.border,
    backgroundColor: C.surface,
  },
});

export default CreateBusinessScreen;