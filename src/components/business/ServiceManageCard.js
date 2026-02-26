// src/components/business/ServiceManageCard.js
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';
import PersianCalendarModal from './PersianCalendarModal';

/**
 * ServiceManageCard
 * @param {object}   service  - { id, name, price, duration, image, score, bookingCount, isActive, scheduledDays }
 * @param {function} onEdit
 * @param {function} onToggle        - (id) => void
 * @param {function} onSaveSchedule  - (id, days[]) => void
 */
const ServiceManageCard = ({ service, onEdit, onToggle, onSaveSchedule }) => {
  const [calOpen, setCalOpen] = useState(false);
  const daysCount = service.scheduledDays?.length ?? 0;

  return (
    <>
      <View style={s.card}>
        {/* تصویر */}
        <Image source={{ uri: service.image }} style={s.img} resizeMode="cover" />

        {/* بدنه */}
        <View style={s.body}>
          {/* ردیف نام + سوئیچ */}
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
            <Chip icon="time-outline"  text={`${service.duration} دقیقه`} />
            <Chip icon="cash-outline"  text={`${service.price.toLocaleString()} ت`} gold />
          </View>

          {/* رزرو + امتیاز */}
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Icon name="calendar-outline" size={12} color={COLORS.textSub} />
              <Text style={s.statTxt}>{service.bookingCount} رزرو</Text>
            </View>
            {/* امتیاز عددی */}
            <View style={[s.scoreBadge, { backgroundColor: scoreColor(service.score) }]}>
              <Text style={s.scoreTxt}>{service.score.toFixed(1)}</Text>
            </View>
          </View>

          {/* وضعیت برنامه */}
          <View style={[s.schedStatus, daysCount > 0 && s.schedStatusOn]}>
            <Icon
              name={daysCount > 0 ? 'calendar-number-outline' : 'calendar-outline'}
              size={12}
              color={daysCount > 0 ? COLORS.gold : COLORS.textSub}
            />
            <Text style={[s.schedTxt, daysCount > 0 && s.schedTxtOn]}>
              {daysCount > 0 ? `${daysCount} روز برنامه‌ریزی شده` : 'بدون برنامه نوبت'}
            </Text>
          </View>

          {/* دکمه‌ها */}
          <View style={s.actions}>
            <TouchableOpacity style={s.calBtn} onPress={() => setCalOpen(true)} activeOpacity={0.8}>
              <Icon name="calendar-number-outline" size={14} color={COLORS.background} />
              <Text style={s.calTxt}>تنظیم نوبت</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.editBtn} onPress={() => onEdit?.(service)} activeOpacity={0.8}>
              <Icon name="create-outline" size={16} color={COLORS.gold} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* تقویم شمسی */}
      <PersianCalendarModal
        visible={calOpen}
        serviceName={service.name}
        initialDays={service.scheduledDays ?? []}
        onClose={() => setCalOpen(false)}
        onSave={(days) => onSaveSchedule?.(service.id, days)}
      />
    </>
  );
};

// ── helpers ──
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
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 7 },
  name:    { color: COLORS.textMain, fontSize: 14, fontFamily: FONTS.bold, flex: 1, textAlign: 'right' },
  sw:      { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] },
  meta:    { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  statTxt:  { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular },
  scoreBadge: {
    paddingHorizontal: 7, paddingVertical: 2,
    borderRadius: RADII.round, minWidth: 36, alignItems: 'center',
  },
  scoreTxt:   { color: '#FFF', fontSize: 12, fontFamily: FONTS.bold },
  schedStatus: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end',
    gap: 5, paddingVertical: 4, paddingHorizontal: 8,
    borderRadius: RADII.sm, backgroundColor: COLORS.background, alignSelf: 'flex-end',
  },
  schedStatusOn: { backgroundColor: 'rgba(212,175,55,0.08)' },
  schedTxt:   { color: COLORS.textSub, fontSize: 10, fontFamily: FONTS.regular },
  schedTxtOn: { color: COLORS.gold, fontFamily: FONTS.bold },
  actions: { flexDirection: 'row', gap: 7, alignItems: 'center' },
  calBtn: {
    flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 5, backgroundColor: COLORS.gold, borderRadius: RADII.sm,
    paddingVertical: 7, ...SHADOWS.goldButton,
  },
  calTxt:  { color: COLORS.background, fontSize: 12, fontFamily: FONTS.bold },
  editBtn: {
    width: 34, height: 34, borderRadius: RADII.sm,
    backgroundColor: 'rgba(212,175,55,0.1)',
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
});

export default ServiceManageCard;