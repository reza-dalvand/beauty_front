// src/components/business/PersianCalendarModal.js
// تقویم شمسی — انتخاب روزها + مدت هر نوبت + بازه ساعتی
import React, { useState, useCallback } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, TouchableWithoutFeedback,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

// ─── تبدیل تقویم ─────────────────────────────────────
function gregorianToJalali(gy, gm, gd) {
  let jy, jm, jd;
  let g_day_no = 365*(gy-1) + Math.floor((gy-1+3)/4) - Math.floor((gy-1+99)/100) + Math.floor((gy-1+399)/400);
  for (let i=0; i<gm-1; i++) g_day_no += [31,28+(gy%4===0&&(gy%100!==0||gy%400===0)?1:0),31,30,31,30,31,31,30,31,30,31][i];
  g_day_no += gd-1;
  let j_day_no = g_day_no - 79;
  let j_np = Math.floor(j_day_no/12053); j_day_no %= 12053;
  jy = 979 + 33*j_np + 4*Math.floor(j_day_no/1461);
  j_day_no %= 1461;
  if (j_day_no >= 366) { jy += Math.floor((j_day_no-1)/365); j_day_no = (j_day_no-1)%365; }
  let i=0;
  for (; i<11 && j_day_no>=(i<6?31:30); i++) j_day_no -= i<6?31:30;
  jd = j_day_no+1; jm = i+1;
  return [jy, jm, jd];
}

function jalaliToGregorian(jy, jm, jd) {
  jy -= 979; jm -= 1; jd -= 1;
  let j_day_no = 365*jy + Math.floor(jy/33)*8 + Math.floor((jy%33+3)/4);
  for (let i=0; i<jm; i++) j_day_no += i<6?31:30;
  j_day_no += jd;
  let g_day_no = j_day_no + 79;
  let gy = 1600 + 400*Math.floor(g_day_no/146097); g_day_no %= 146097;
  let leap = true;
  if (g_day_no >= 36525) { g_day_no--; gy += 100*Math.floor(g_day_no/36524); g_day_no %= 36524; if (g_day_no >= 365) g_day_no++; else leap=false; }
  gy += 4*Math.floor(g_day_no/1461); g_day_no %= 1461;
  if (g_day_no >= 366) { leap=false; g_day_no--; gy += Math.floor(g_day_no/365); g_day_no %= 365; }
  const mDays = [31, 28+(leap?1:0), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (; gm<12 && g_day_no>=mDays[gm]; gm++) g_day_no -= mDays[gm];
  return new Date(gy, gm, g_day_no+1);
}

function daysInJMonth(jm, jy) {
  if (jm <= 6) return 31;
  if (jm <= 11) return 30;
  const leapYears = [1,5,9,13,17,22,26,30];
  return leapYears.includes(jy%33) ? 30 : 29;
}

function firstWeekdayOf(jy, jm) {
  const d = jalaliToGregorian(jy, jm, 1);
  return (d.getDay() + 1) % 7;
}

function todayJalali() {
  const d = new Date();
  return gregorianToJalali(d.getFullYear(), d.getMonth()+1, d.getDate());
}

// ─── تولید ساعت‌ها بر اساس مدت ───────────────────────
function generateSlots(durationMin) {
  const slots = [];
  const start = 8 * 60; // 08:00
  const end   = 21 * 60; // 21:00
  for (let m = start; m + durationMin <= end; m += durationMin) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2,'0')}:${String(min).padStart(2,'0')}`);
  }
  return slots;
}

const MONTHS  = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
const WDAYS   = ['ش','ی','د','س','چ','پ','ج'];
const DURATIONS = [15, 30, 45, 60, 90, 120];

// ════════════════════════════════════════════════
//  COMPONENT
// ════════════════════════════════════════════════
/**
 * PersianCalendarModal
 * @param {boolean}  visible
 * @param {string}   serviceName
 * @param {number}   defaultDuration  - مدت پیش‌فرض (دقیقه)
 * @param {object}   initialSchedule  - { 'YYYY/MM/DD': ['HH:MM', ...], ... }
 * @param {function} onClose
 * @param {function} onSave           - (schedule, duration) => void
 */
const PersianCalendarModal = ({ visible, serviceName, defaultDuration = 60, initialSchedule = {}, onClose, onSave }) => {
  const insets = useSafeAreaInsets();
  const [todayJ] = useState(() => todayJalali());
  const [year,  setYear]  = useState(todayJ[0]);
  const [month, setMonth] = useState(todayJ[1]);
  const [duration, setDuration] = useState(defaultDuration);
  // schedule: { 'YYYY/MM/DD': Set<'HH:MM'> }
  const [schedule, setSchedule] = useState(() => {
    const s = {};
    Object.entries(initialSchedule).forEach(([day, hours]) => {
      s[day] = new Set(hours);
    });
    return s;
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [showDurPicker, setShowDurPicker] = useState(false);

  const prevMonth = () => { if (month===1){setMonth(12);setYear(y=>y-1);}else setMonth(m=>m-1); };
  const nextMonth = () => { if (month===12){setMonth(1);setYear(y=>y+1);}else setMonth(m=>m+1); };

  const dayKey = (d) => `${year}/${String(month).padStart(2,'0')}/${String(d).padStart(2,'0')}`;

  const isPast = (d) => {
    const [ty,tm,td] = todayJ;
    if (year < ty) return true;
    if (year === ty && month < tm) return true;
    if (year === ty && month === tm && d < td) return true;
    return false;
  };

  const toggleDay = useCallback((d) => {
    const k = dayKey(d);
    setSchedule(prev => {
      const n = { ...prev };
      if (n[k]) { delete n[k]; if (selectedDay === k) setSelectedDay(null); }
      else { n[k] = new Set(); setSelectedDay(k); }
      return n;
    });
  }, [year, month, selectedDay]);

  const toggleHour = useCallback((hour) => {
    if (!selectedDay) return;
    setSchedule(prev => {
      const n = { ...prev };
      const hours = new Set(n[selectedDay] || []);
      hours.has(hour) ? hours.delete(hour) : hours.add(hour);
      n[selectedDay] = hours;
      return n;
    });
  }, [selectedDay]);

  const totalDays  = Object.keys(schedule).filter(k => schedule[k].size > 0).length;
  const totalSlots = Object.values(schedule).reduce((acc, s) => acc + s.size, 0);

  const days   = daysInJMonth(month, year);
  const offset = firstWeekdayOf(year, month);
  const cells  = Array(offset).fill(null).concat(Array.from({length:days},(_,i)=>i+1));
  const rows   = [];
  for (let i=0; i<cells.length; i+=7) rows.push(cells.slice(i,i+7));

  // slots باید قبل از toggleAllHours باشه
  const slots = generateSlots(duration);

  // انتخاب / حذف همه ساعت‌های یک روز با یه تیک
  const toggleAllHours = useCallback(() => {
    if (!selectedDay) return;
    setSchedule(prev => {
      const n = { ...prev };
      const current = n[selectedDay] || new Set();
      const allSelected = slots.every(h => current.has(h));
      n[selectedDay] = allSelected ? new Set() : new Set(slots);
      return n;
    });
  }, [selectedDay, slots]);

  const handleSave = () => {
    const out = {};
    Object.entries(schedule).forEach(([k,v]) => { if (v.size > 0) out[k] = Array.from(v).sort(); });
    onSave?.(out, duration);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={s.overlay} />
      </TouchableWithoutFeedback>

      <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 24) }]}>
        <View style={s.handle} />

        {/* هدر */}
        <View style={s.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Icon name="close" size={22} color={COLORS.textSub} />
          </TouchableOpacity>
          <View style={s.headerMid}>
            <Text style={s.headerTitle}>تقویم نوبت‌دهی</Text>
            <Text style={s.headerSub} numberOfLines={1}>{serviceName}</Text>
          </View>
          <Icon name="calendar-outline" size={22} color={COLORS.gold} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false} keyboardShouldPersistTaps="handled">

          {/* ── مدت هر نوبت ── */}
          <TouchableOpacity style={s.durRow} onPress={() => setShowDurPicker(v=>!v)} activeOpacity={0.85}>
            <Animated.View style={{ transform: [{ rotate: showDurPicker ? '180deg' : '0deg' }] }}>
              <Icon name="chevron-down" size={16} color={COLORS.textSub} />
            </Animated.View>
            <View style={{ flex: 1, marginHorizontal: 10 }}>
              <Text style={s.durLabel}>مدت هر نوبت</Text>
            </View>
            <View style={s.durBadge}>
              <Icon name="time-outline" size={13} color={COLORS.gold} />
              <Text style={s.durVal}>{duration} دقیقه</Text>
            </View>
          </TouchableOpacity>

          {showDurPicker && (
            <View style={s.durGrid}>
              {DURATIONS.map(d => (
                <TouchableOpacity key={d} style={[s.durChip, duration===d && s.durChipOn]}
                  onPress={() => { setDuration(d); setShowDurPicker(false); setSelectedDay(null); setSchedule({}); }}>
                  <Text style={[s.durChipTxt, duration===d && s.durChipTxtOn]}>{d} دقیقه</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── ناوبری ماه ── */}
          <View style={s.nav}>
            <TouchableOpacity onPress={nextMonth} style={s.navBtn}><Icon name="chevron-forward" size={22} color={COLORS.gold} /></TouchableOpacity>
            <Text style={s.monthLabel}>{MONTHS[month-1]}  {year}</Text>
            <TouchableOpacity onPress={prevMonth} style={s.navBtn}><Icon name="chevron-back" size={22} color={COLORS.gold} /></TouchableOpacity>
          </View>

          {/* ── سرستون هفته ── */}
          <View style={s.weekRow}>{WDAYS.map(w=><Text key={w} style={s.wday}>{w}</Text>)}</View>

          {/* ── گرید روزها ── */}
          <View style={s.grid}>
            {rows.map((row,ri) => (
              <View key={ri} style={s.row}>
                {row.map((day,ci) => {
                  if (!day) return <View key={`e${ci}`} style={s.cell} />;
                  const k      = dayKey(day);
                  const hasSel = schedule[k] && schedule[k].size > 0;
                  const past   = isPast(day);
                  const isToday = year===todayJ[0] && month===todayJ[1] && day===todayJ[2];
                  const isSel  = selectedDay === k;
                  return (
                    <TouchableOpacity key={k}
                      style={[s.cell, s.dayCell, hasSel && s.cellSel, isSel && s.cellActive, isToday && !hasSel && s.cellToday, past && s.cellPast]}
                      onPress={() => { if (!past) { if (hasSel || !schedule[k]) toggleDay(day); setSelectedDay(isSel ? null : k); } }}
                      activeOpacity={past ? 1 : 0.7}>
                      <Text style={[s.dayTxt, hasSel && s.dayTxtSel, past && s.dayTxtPast, isToday && !hasSel && s.dayTxtToday]}>
                        {day}
                      </Text>
                      {hasSel && (
                        <View style={s.dotWrap}>
                          <Text style={s.dotTxt}>{schedule[k].size}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
                {Array(7-row.length).fill(null).map((_,i)=><View key={`f${i}`} style={s.cell}/>)}
              </View>
            ))}
          </View>

          {/* ── انتخاب ساعت ── */}
          {selectedDay && (
            <View style={s.hoursSection}>
              <View style={s.hoursSectionHeader}>
                <Icon name="time-outline" size={15} color={COLORS.gold} />
                <Text style={s.hoursSectionTitle}>
                  انتخاب ساعت‌های نوبت — {selectedDay}
                </Text>
              </View>
              <View style={s.hoursHintRow}>
                <TouchableOpacity onPress={toggleAllHours} activeOpacity={0.8} style={s.selectAllBtn}>
                  <Icon
                    name={slots.every(h => schedule[selectedDay]?.has(h)) ? 'checkbox' : 'checkbox-outline'}
                    size={15}
                    color={COLORS.gold}
                  />
                  <Text style={s.selectAllTxt}>
                    {slots.every(h => schedule[selectedDay]?.has(h)) ? 'حذف همه' : 'انتخاب همه'}
                  </Text>
                </TouchableOpacity>
                <Text style={s.hoursHint}>هر نوبت {duration} دقیقه</Text>
              </View>
              <View style={s.hoursGrid}>
                {slots.map(hour => {
                  const active = schedule[selectedDay]?.has(hour);
                  return (
                    <TouchableOpacity key={hour} style={[s.hourChip, active && s.hourChipOn]}
                      onPress={() => toggleHour(hour)} activeOpacity={0.75}>
                      <Text style={[s.hourTxt, active && s.hourTxtOn]}>{hour}</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {!selectedDay && (
            <View style={s.hintBox}>
              <Icon name="finger-print-outline" size={20} color={COLORS.border} />
              <Text style={s.hintTxt}>روی یک روز ضربه بزنید تا ساعت‌های نوبت را تنظیم کنید</Text>
            </View>
          )}

          {/* ── خلاصه ── */}
          <View style={s.summary}>
            <TouchableOpacity onPress={() => { setSchedule({}); setSelectedDay(null); }} activeOpacity={0.7} style={s.clearBtn}>
              <Icon name="trash-outline" size={14} color={COLORS.red} />
              <Text style={s.clearTxt}>پاک کردن همه</Text>
            </TouchableOpacity>
            <View style={s.summaryRight}>
              <Icon name="checkmark-circle-outline" size={15} color={COLORS.gold} />
              <Text style={s.summaryTxt}>{totalDays} روز · {totalSlots} نوبت</Text>
            </View>
          </View>
        </ScrollView>

        {/* دکمه ذخیره */}
        <TouchableOpacity
          style={[s.saveBtn, totalSlots === 0 && s.saveBtnDisabled]}
          onPress={handleSave} activeOpacity={0.85}>
          <Icon name="checkmark-circle" size={20} color={COLORS.background} />
          <Text style={s.saveTxt}>
            ذخیره{totalSlots > 0 ? ` (${totalSlots} نوبت)` : ''}
          </Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

// برای rotate آیکون chevron بدون Animated import
const Animated = require('react-native').Animated;

const CELL = 44;
const s = StyleSheet.create({
  overlay:  { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28, borderTopRightRadius: 28,
    paddingHorizontal: 16, maxHeight: '94%',
  },
  handle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerMid: { alignItems: 'center', flex: 1, gap: 2 },
  headerTitle: { color: COLORS.textMain, fontSize: 15, fontFamily: FONTS.bold },
  headerSub: { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.regular },

  // مدت
  durRow: {
    flexDirection: 'row-reverse', alignItems: 'center',
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  durLabel: { color: COLORS.textMain, fontSize: 13, fontFamily: FONTS.bold, textAlign: 'right' },
  durBadge: {
    flexDirection: 'row-reverse', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(212,175,55,0.1)', borderRadius: RADII.round,
    paddingHorizontal: 12, paddingVertical: 5,
    borderWidth: 1, borderColor: 'rgba(212,175,55,0.35)',
  },
  durVal: { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.bold },
  durGrid: {
    flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8,
    justifyContent: 'flex-start', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: COLORS.border,
  },
  durChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: RADII.round, borderWidth: 1, borderColor: COLORS.border },
  durChipOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  durChipTxt: { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  durChipTxtOn: { color: COLORS.background, fontFamily: FONTS.bold },

  // ناوبری
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 4 },
  navBtn: { width: 36, height: 36, justifyContent: 'center', alignItems: 'center' },
  monthLabel: { color: COLORS.textMain, fontSize: 17, fontFamily: FONTS.bold },
  // هفته
  weekRow: { flexDirection: 'row', paddingBottom: 6 },
  wday: { width: `${100/7}%`, textAlign: 'center', color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.bold },
  // گرید
  grid: {},
  row: { flexDirection: 'row' },
  cell: { width: `${100/7}%`, height: CELL, justifyContent: 'center', alignItems: 'center' },
  dayCell: {},
  cellSel: { backgroundColor: COLORS.gold, borderRadius: 12 },
  cellActive: { borderWidth: 2, borderColor: COLORS.gold, borderRadius: 12, backgroundColor: 'rgba(212,175,55,0.15)' },
  cellToday: { borderWidth: 1.5, borderColor: COLORS.gold, borderRadius: 12 },
  cellPast: { opacity: 0.22 },
  dayTxt: { color: COLORS.textMain, fontSize: 14, fontFamily: FONTS.regular },
  dayTxtSel: { color: COLORS.background, fontFamily: FONTS.bold },
  dayTxtPast: { color: COLORS.textSub },
  dayTxtToday: { color: COLORS.gold, fontFamily: FONTS.bold },
  dotWrap: { position: 'absolute', bottom: 3, width: 14, height: 8, borderRadius: 4, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  dotTxt: { color: '#fff', fontSize: 7, fontFamily: FONTS.bold },

  // ساعت‌ها
  hoursSection: { marginTop: 12, backgroundColor: COLORS.background, borderRadius: RADII.lg, padding: 14, borderWidth: 1, borderColor: COLORS.border },
  hoursSectionHeader: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, marginBottom: 6 },
  hoursSectionTitle: { color: COLORS.gold, fontSize: 13, fontFamily: FONTS.bold, textAlign: 'right', flex: 1 },
  hoursHint: { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular, textAlign: 'right', marginBottom: 10 },
  hoursHintRow: { flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 },
  selectAllBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: 5 },
  selectAllTxt: { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.bold },
  hoursGrid: { flexDirection: 'row-reverse', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-start' },
  hourChip: { paddingHorizontal: 12, paddingVertical: 7, borderRadius: RADII.sm, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border },
  hourChipOn: { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  hourTxt: { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  hourTxtOn: { color: COLORS.background, fontFamily: FONTS.bold },

  // hint
  hintBox: { flexDirection: 'row-reverse', alignItems: 'center', gap: 8, justifyContent: 'center', paddingVertical: 16 },
  hintTxt: { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular, textAlign: 'center', flex: 1 },

  // خلاصه
  summary: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4 },
  summaryRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  summaryTxt: { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular },
  clearBtn: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  clearTxt: { color: COLORS.red, fontSize: 12, fontFamily: FONTS.regular },

  // ذخیره
  saveBtn: { backgroundColor: COLORS.gold, height: 52, borderRadius: RADII.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 4, ...SHADOWS.goldButton },
  saveBtnDisabled: { opacity: 0.5 },
  saveTxt: { color: COLORS.background, fontSize: 15, fontFamily: FONTS.bold },
});

export default PersianCalendarModal;