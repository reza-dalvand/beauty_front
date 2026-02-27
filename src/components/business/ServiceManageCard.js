// src/components/business/ServiceManageCard.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';
import PersianCalendarModal  from './PersianCalendarModal';
import BookingRequestsModal  from './BookingRequestsModal';

// داده تستی نوبت‌ها — در پروژه واقعی از API/Context می‌آد
const MOCK_BOOKINGS = (serviceId) => [
  { id: `b1_${serviceId}`, customerName: 'نیلوفر احمدی', customerAvatar: 'https://i.pravatar.cc/80?img=5',  date: '۱۴۰۳/۱۲/۱۰', time: '10:00', status: 'pending',   customerNote: 'لطفاً رنگ صورتی ملایم',       providerMessage: null },
  { id: `b2_${serviceId}`, customerName: 'مهسا رضایی',   customerAvatar: 'https://i.pravatar.cc/80?img=9',  date: '۱۴۰۳/۱۲/۱۱', time: '14:30', status: 'pending',   customerNote: '',                              providerMessage: null },
  { id: `b3_${serviceId}`, customerName: 'زهرا محمدی',   customerAvatar: 'https://i.pravatar.cc/80?img=16', date: '۱۴۰۳/۱۲/۰۸', time: '11:00', status: 'confirmed', customerNote: '',                              providerMessage: 'خوش آمدید، منتظریم.' },
  { id: `b4_${serviceId}`, customerName: 'فاطمه کریمی',  customerAvatar: 'https://i.pravatar.cc/80?img=20', date: '۱۴۰۳/۱۲/۰۵', time: '09:00', status: 'rejected',  customerNote: 'طرح خاص می‌خوام',              providerMessage: 'متأسفانه ظرفیت تکمیل شد.' },
  { id: `b5_${serviceId}`, customerName: 'سارا علوی',    customerAvatar: 'https://i.pravatar.cc/80?img=25', date: '۱۴۰۳/۱۲/۱۲', time: '16:00', status: 'pending',   customerNote: '',                              providerMessage: null },
];

const ServiceManageCard = ({ service, onEdit, onToggle, onSaveSchedule }) => {
  const [calOpen,      setCalOpen]      = useState(false);
  const [bookingOpen,  setBookingOpen]  = useState(false);
  const [bookings,     setBookings]     = useState(() => MOCK_BOOKINGS(service.id));

  const schedule    = service.schedule ?? {};
  const daysCount   = Object.keys(schedule).filter(k => schedule[k].length > 0).length;
  const totalSlots  = Object.values(schedule).reduce((acc, arr) => acc + arr.length, 0);
  const pendingCount = bookings.filter(b => b.status === 'pending').length;

  return (
    <>
      <View style={s.card}>
        <Image source={{ uri: service.image }} style={s.img} resizeMode="cover" />

        <View style={s.body}>
          {/* نام + سوئیچ */}
          <View style={s.nameRow}>
            <Switch
              value={service.isActive}
              onValueChange={() => onToggle?.(service.id)}
              trackColor={{ false: COLORS.border, true: 'rgba(212,175,55,0.4)' }}
              thumbColor={service.isActive ? COLORS.gold : COLORS.textSub}
              style={s.sw}
            />
            <Text style={s.name} numberOfLines={1}>{service.name}</Text>
          </View>

          {/* قیمت + مدت */}
          <View style={s.meta}>
            <Chip icon="time-outline" text={`${service.duration} دقیقه`} />
            {service.callOnly
              ? <Chip icon="call-outline" text="تماس بگیرید" gold />
              : <Chip icon="cash-outline" text={`${service.price.toLocaleString()} ت`} gold />
            }
          </View>

          {/* رزرو + امتیاز */}
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Icon name="calendar-outline" size={12} color={COLORS.textSub} />
              <Text style={s.statTxt}>{service.bookingCount} رزرو</Text>
            </View>
            {service.score > 0 && (
              <View style={[s.scoreBadge, { backgroundColor: scoreColor(service.score) }]}>
                <Text style={s.scoreTxt}>{service.score.toFixed(1)}</Text>
              </View>
            )}
          </View>

          {/* وضعیت برنامه */}
          <View style={[s.schedStatus, daysCount > 0 && s.schedStatusOn]}>
            <Icon
              name={daysCount > 0 ? 'calendar-number-outline' : 'calendar-outline'}
              size={12}
              color={daysCount > 0 ? COLORS.gold : COLORS.textSub}
            />
            <Text style={[s.schedTxt, daysCount > 0 && s.schedTxtOn]}>
              {daysCount > 0 ? `${daysCount} روز · ${totalSlots} نوبت` : 'بدون برنامه نوبت'}
            </Text>
          </View>

          {/* دکمه‌ها */}
          <View style={s.actions}>
            {/* دکمه نوبت‌های دریافتی */}
            <TouchableOpacity
              style={s.bookingsBtn}
              onPress={() => setBookingOpen(true)}
              activeOpacity={0.8}>
              <Icon name="people-outline" size={14} color={COLORS.gold} />
              <Text style={s.bookingsBtnTxt}>نوبت‌ها</Text>
              {pendingCount > 0 && (
                <View style={s.pendingBadge}>
                  <Text style={s.pendingBadgeTxt}>{pendingCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* دکمه تقویم */}
            <TouchableOpacity style={s.calBtn} onPress={() => setCalOpen(true)} activeOpacity={0.8}>
              <Icon name="calendar-number-outline" size={14} color={COLORS.background} />
              <Text style={s.calTxt}>تنظیم نوبت</Text>
            </TouchableOpacity>

            {/* ویرایش */}
            <TouchableOpacity style={s.editBtn} onPress={() => onEdit?.(service)} activeOpacity={0.8}>
              <Icon name="create-outline" size={16} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* مودال تقویم */}
      <PersianCalendarModal
        visible={calOpen}
        serviceName={service.name}
        defaultDuration={service.duration}
        initialSchedule={schedule}
        onClose={() => setCalOpen(false)}
        onSave={(newSchedule, dur) => onSaveSchedule?.(service.id, newSchedule, dur)}
      />

      {/* مودال نوبت‌های دریافتی */}
      <BookingRequestsModal
        visible={bookingOpen}
        serviceName={service.name}
        bookings={bookings}
        onClose={() => setBookingOpen(false)}
        onUpdate={setBookings}
      />
    </>
  );
};

const scoreColor = (sc) => sc >= 4 ? '#4CAF50' : sc >= 3 ? COLORS.gold : COLORS.red;

const Chip = ({ icon, text, gold }) => (
  <View style={ch.wrap}>
    <Icon name={icon} size={12} color={gold ? COLORS.gold : COLORS.textSub} />
    <Text style={[ch.txt, gold && ch.gold]}>{text}</Text>
  </View>
);
const ch = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  txt:  { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular },
  gold: { color: COLORS.gold },
});

const s = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface, borderRadius: RADII.lg,
    marginHorizontal: 20, marginBottom: 14,
    borderWidth: 1, borderColor: COLORS.border,
    flexDirection: 'row', overflow: 'hidden', ...SHADOWS.card,
  },
  img:  { width: 95, backgroundColor: '#222' },
  body: { flex: 1, padding: 11, gap: 7 },
  nameRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 7 },
  name:     { color: COLORS.textMain, fontSize: 14, fontFamily: FONTS.bold, flex: 1, textAlign: 'right' },
  sw:       { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
  meta:     { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTxt:  { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular },
  scoreBadge:  { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADII.round, minWidth: 36, alignItems: 'center' },
  scoreTxt:    { color: '#FFF', fontSize: 12, fontFamily: FONTS.bold },
  schedStatus: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 5, paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: RADII.sm, backgroundColor: COLORS.background, alignSelf: 'flex-end',
  },
  schedStatusOn: { backgroundColor: 'rgba(212,175,55,0.08)' },
  schedTxt:   { color: COLORS.textSub, fontSize: 10, fontFamily: FONTS.regular },
  schedTxtOn: { color: COLORS.gold, fontFamily: FONTS.bold },

  actions:    { flexDirection: 'row', gap: 6, alignItems: 'center' },

  // دکمه نوبت‌ها
  bookingsBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 10, paddingVertical: 7,
    borderRadius: RADII.sm,
    backgroundColor: 'rgba(212,175,55,0.08)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
  },
  bookingsBtnTxt: { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.bold },
  pendingBadge:   {
    backgroundColor: '#F5A623', borderRadius: 8,
    minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3,
  },
  pendingBadgeTxt: { color: '#fff', fontSize: 10, fontFamily: FONTS.bold },

  // دکمه تقویم
  calBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 5, backgroundColor: COLORS.gold, borderRadius: RADII.sm,
    paddingVertical: 7, ...SHADOWS.goldButton,
  },
  calTxt:  { color: COLORS.background, fontSize: 12, fontFamily: FONTS.bold },

  // ویرایش
  editBtn: {
    width: 34, height: 34, borderRadius: RADII.sm,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
});

export default ServiceManageCard;