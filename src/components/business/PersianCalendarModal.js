// src/components/business/PersianCalendarModal.js
// تقویم شمسی خالص — بدون کتابخانه خارجی
// فقط انتخاب روز، بدون ساعت
import React, { useState, useCallback } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

// ─── ابزارهای تبدیل تقویم (الگوریتم خالص) ────────────

function gregorianToJalali(gy, gm, gd) {
  const g_d = [0,31,59,90,120,151,181,212,243,273,304,334];
  let jy = gy - 1600, jm = 0, jd = 0;
  let g_day_no = 365 * (gy - 1) + Math.floor((gy - 1 + 3) / 4) - Math.floor((gy - 1 + 99) / 100) + Math.floor((gy - 1 + 399) / 400);
  for (let i = 0; i < gm - 1; i++) g_day_no += [31,28+(gy%4===0&&(gy%100!==0||gy%400===0)?1:0),31,30,31,30,31,31,30,31,30,31][i];
  g_day_no += gd - 1;
  let j_day_no = g_day_no - 79;
  let j_np = Math.floor(j_day_no / 12053); j_day_no %= 12053;
  jy = 979 + 33 * j_np + 4 * Math.floor(j_day_no / 1461);
  j_day_no %= 1461;
  if (j_day_no >= 366) { jy += Math.floor((j_day_no - 1) / 365); j_day_no = (j_day_no - 1) % 365; }
  for (let i = 0; i < 11 && j_day_no >= (i < 6 ? 31 : 30); i++) { j_day_no -= i < 6 ? 31 : 30; jm++; }
  jd = j_day_no + 1;
  return [jy, jm + 1, jd];
}

function jalaliToGregorian(jy, jm, jd) {
  let gy, leap;
  jy -= 979; jm -= 1; jd -= 1;
  let j_day_no = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4);
  for (let i = 0; i < jm; i++) j_day_no += i < 6 ? 31 : 30;
  j_day_no += jd;
  let g_day_no = j_day_no + 79;
  gy = 1600 + 400 * Math.floor(g_day_no / 146097); g_day_no %= 146097;
  leap = true;
  if (g_day_no >= 36525) {
    g_day_no--;
    gy += 100 * Math.floor(g_day_no / 36524); g_day_no %= 36524;
    if (g_day_no >= 365) g_day_no++; else leap = false;
  }
  gy += 4 * Math.floor(g_day_no / 1461); g_day_no %= 1461;
  if (g_day_no >= 366) { leap = false; g_day_no--; gy += Math.floor(g_day_no / 365); g_day_no %= 365; }
  const mDays = [31, 28 + (leap ? 1 : 0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (; gm < 12 && g_day_no >= mDays[gm]; gm++) g_day_no -= mDays[gm];
  return new Date(gy, gm, g_day_no + 1);
}

function daysInJMonth(jm, jy) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  // اسفند: چک کبیسه
  const leapYears = [1, 5, 9, 13, 17, 22, 26, 30];
  return leapYears.includes(jy % 33) ? 30 : 29;
}

// روز هفته اول ماه — شنبه=0 … جمعه=6
function firstWeekdayOf(jy, jm) {
  const d = jalaliToGregorian(jy, jm, 1);
  return (d.getDay() + 1) % 7;
}

function todayJalali() {
  const d = new Date();
  return gregorianToJalali(d.getFullYear(), d.getMonth() + 1, d.getDate());
}

const MONTHS = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const WDAYS  = ['ش','ی','د','س','چ','پ','ج'];

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════
/**
 * PersianCalendarModal
 * @param {boolean}  visible
 * @param {string}   serviceName
 * @param {string[]} initialDays   - آرایه 'YYYY/MM/DD' شمسی
 * @param {function} onClose
 * @param {function} onSave        - (days: string[]) => void
 */
const PersianCalendarModal = ({ visible, serviceName, initialDays = [], onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [todayJ] = useState(() => todayJalali());
  const [year,  setYear]  = useState(todayJ[0]);
  const [month, setMonth] = useState(todayJ[1]);
  const [picked, setPicked] = useState(() => new Set(initialDays));

  const prevMonth = () => {
    if (month === 1) { setMonth(12); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 12) { setMonth(1); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const key  = (d) => `${year}/${String(month).padStart(2,'0')}/${String(d).padStart(2,'0')}`;
  const isPast = (d) => {
    const [ty,tm,td] = todayJ;
    if (year < ty) return true;
    if (year === ty && month < tm) return true;
    if (year === ty && month === tm && d < td) return true;
    return false;
  };

  const toggle = useCallback((d) => {
    const k = key(d);
    setPicked(prev => {
      const n = new Set(prev);
      n.has(k) ? n.delete(k) : n.add(k);
      return n;
    });
  }, [year, month]);

  const days    = daysInJMonth(month, year);
  const offset  = firstWeekdayOf(year, month);
  const cells   = Array(offset).fill(null).concat(Array.from({ length: days }, (_, i) => i + 1));

  // گروه‌بندی به ردیف‌های ۷تایی
  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={s.handle} />

        {/* هدر */}
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top:10,bottom:10,left:10,right:10 }}>
            <Icon name="close" size={22} color={COLORS.textSub} />
          </TouchableOpacity>
          <View style={s.headerMid}>
            <Text style={s.headerTitle}>تقویم نوبت‌دهی</Text>
            <Text style={s.headerSub} numberOfLines={1}>{serviceName}</Text>
          </View>
          <Icon name="calendar-outline" size={22} color={COLORS.gold} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          {/* ناوبری ماه */}
          <View style={s.nav}>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn} activeOpacity={0.7}>
              <Icon name="chevron-forward" size={22} color={COLORS.gold} />
            </TouchableOpacity>
            <Text style={s.monthLabel}>{MONTHS[month - 1]}  {year}</Text>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn} activeOpacity={0.7}>
              <Icon name="chevron-back" size={22} color={COLORS.gold} />
            </TouchableOpacity>
          </View>

          {/* سرستون روزهای هفته */}
          <View style={s.weekRow}>
            {WDAYS.map(w => (
              <Text key={w} style={s.wday}>{w}</Text>
            ))}
          </View>

          {/* گرید روزها */}
          <View style={s.grid}>
            {rows.map((row, ri) => (
              <View key={ri} style={s.row}>
                {row.map((day, ci) => {
                  if (!day) return <View key={`e${ci}`} style={s.cell} />;
                  const k      = key(day);
                  const sel    = picked.has(k);
                  const past   = isPast(day);
                  const isToday = year === todayJ[0] && month === todayJ[1] && day === todayJ[2];
                  return (
                    <TouchableOpacity
                      key={k}
                      style={[s.cell, s.dayCell,
                        sel     && s.cellSel,
                        isToday && !sel && s.cellToday,
                        past    && s.cellPast,
                      ]}
                      onPress={() => !past && toggle(day)}
                      activeOpacity={past ? 1 : 0.7}>
                      <Text style={[s.dayTxt,
                        sel     && s.dayTxtSel,
                        past    && s.dayTxtPast,
                        isToday && !sel && s.dayTxtToday,
                      ]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
                {/* پر کردن آخرین ردیف */}
                {Array(7 - row.length).fill(null).map((_, i) => (
                  <View key={`f${i}`} style={s.cell} />
                ))}
              </View>
            ))}
          </View>

          {/* خلاصه */}
          <View style={s.summary}>
            <TouchableOpacity onPress={() => setPicked(new Set())} activeOpacity={0.7} style={s.clearBtn}>
              <Icon name="trash-outline" size={14} color={COLORS.red} />
              <Text style={s.clearTxt}>پاک کردن</Text>
            </TouchableOpacity>
            <View style={s.summaryRight}>
              <Icon name="checkmark-circle-outline" size={15} color={COLORS.gold} />
              <Text style={s.summaryTxt}>{picked.size} روز انتخاب شده</Text>
            </View>
          </View>
        </ScrollView>

        {/* دکمه ذخیره */}
        <TouchableOpacity
          style={[s.saveBtn, picked.size === 0 && s.saveBtnDisabled]}
          onPress={() => { onSave?.(Array.from(picked).sort()); onClose(); }}
          activeOpacity={0.85}>
          <Icon name="checkmark-circle" size={20} color={COLORS.background} />
          <Text style={s.saveTxt}>ذخیره  {picked.size > 0 ? `(${picked.size} روز)` : ''}</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const CELL = 44;

const s = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 16, maxHeight: '92%',
  },
  handle: {
    width: 40, height: 4, backgroundColor: COLORS.border,
    borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4,
  },
  // هدر
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  headerMid:   { alignItems: 'center', flex: 1, gap: 2 },
  headerTitle: { color: COLORS.textMain, fontSize: 15, fontFamily: FONTS.bold },
  headerSub:   { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.regular },
  // ناوبری
  nav:        {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4,
  },
  navBtn:     { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  monthLabel: { color: COLORS.textMain, fontSize: 17, fontFamily: FONTS.bold },
  // روزهای هفته
  weekRow: { flexDirection: 'row', paddingBottom: 6 },
  wday:    { width: `${100/7}%`, textAlign: 'center', color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.bold },
  // گرید
  grid:     {},
  row:      { flexDirection: 'row' },
  cell:     { width: `${100/7}%`, height: CELL, justifyContent: 'center', alignItems: 'center' },
  dayCell:  {},
  cellSel:  { backgroundColor: COLORS.gold, borderRadius: 12 },
  cellToday:{ borderWidth: 1.5, borderColor: COLORS.gold, borderRadius: 12 },
  cellPast: { opacity: 0.22 },
  dayTxt:      { color: COLORS.textMain, fontSize: 14, fontFamily: FONTS.regular },
  dayTxtSel:   { color: COLORS.background, fontFamily: FONTS.bold },
  dayTxtPast:  { color: COLORS.textSub },
  dayTxtToday: { color: COLORS.gold, fontFamily: FONTS.bold },
  // خلاصه
  summary: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 12, paddingHorizontal: 4,
  },
  summaryRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryTxt:   { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular },
  clearBtn:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  clearTxt:     { color: COLORS.red, fontSize: 12, fontFamily: FONTS.regular },
  // دکمه ذخیره
  saveBtn: {
    backgroundColor: COLORS.gold, height: 52, borderRadius: RADII.lg,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    gap: 8, marginTop: 4, ...SHADOWS.goldButton,
  },
  saveBtnDisabled: { opacity: 0.5 },
  saveTxt: { color: COLORS.background, fontSize: 15, fontFamily: FONTS.bold },
});

export default PersianCalendarModal;