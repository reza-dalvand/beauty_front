// src/components/createPost/WeeklyCalendar.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, SLOT_HOURS, DAYS_FA, DAYS_FULL, toFa, getCurrentShamsiWeek, MONTHS_FA } from './createPostConstants';

const { width: SW } = Dimensions.get('window');
const DAY_W = Math.floor((SW - R(32) - R(2) * 6) / 7);

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

  const weekTitle = `${weekDays[0].shamsi[0]}/${String(weekDays[0].shamsi[1]).padStart(2, '0')}/${String(weekDays[0].shamsi[2]).padStart(2, '0')} — ${weekDays[6].label}`;

  return (
    <View style={{ marginTop: R(12) }}>
      {/* ناوبری هفته */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(10) }}>
        <TouchableOpacity onPress={() => setWeekOffset(w => w + 1)} style={wc.navBtn}>
          <Icon name="chevron-back" size={R(16)} color={C.gold} />
          <Text style={wc.navTxt}>بعد</Text>
        </TouchableOpacity>
        <Text style={wc.weekTitle}>{weekTitle}</Text>
        <TouchableOpacity onPress={() => setWeekOffset(w => w - 1)} style={wc.navBtn} disabled={weekOffset <= 0}>
          <Text style={[wc.navTxt, weekOffset <= 0 && { color: C.border }]}>قبل</Text>
          <Icon name="chevron-forward" size={R(16)} color={weekOffset <= 0 ? C.border : C.gold} />
        </TouchableOpacity>
      </View>

      {/* روزهای هفته */}
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
              <Text style={[wc.dayName, isSelected && wc.dayNameOn]}>{DAYS_FA[i]}</Text>
              <Text style={[wc.dayNum, isSelected && wc.dayNumOn]}>{toFa(d.shamsi[2])}</Text>
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
            نوبت‌های {DAYS_FULL[weekDays.findIndex(d => `${d.shamsi[0]}-${d.shamsi[1]}-${d.shamsi[2]}` === selectedDay)]} — {weekDays.find(d => `${d.shamsi[0]}-${d.shamsi[1]}-${d.shamsi[2]}` === selectedDay)?.label}
          </Text>
          <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: R(6), justifyContent: 'flex-end' }}>
            {SLOT_HOURS.map(h => {
              const key = `${selectedDay}__${h}`;
              const active = !!(slots && slots[key]);
              return (
                <TouchableOpacity key={h} onPress={() => toggleSlot(selectedDay, h)} style={[wc.slot, active && wc.slotOn]}>
                  <Text style={[wc.slotTxt, active && wc.slotTxtOn]}>{h}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
          <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(10), textAlign: 'left', marginTop: R(6) }}>
            روی ساعت‌ها ضربه بزنید تا نوبت‌های موجود را مشخص کنید
          </Text>
        </View>
      )}
      {!selectedDay && (
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(12), textAlign: 'center', paddingVertical: R(10) }}>
          یک روز را انتخاب کنید تا ساعت‌های نوبت را تنظیم کنید
        </Text>
      )}
    </View>
  );
};

const wc = StyleSheet.create({
  navBtn: { flexDirection: 'row-reverse', alignItems: 'center', gap: R(2), padding: R(6) },
  navTxt: { color: C.gold, fontFamily: 'vazir', fontSize: R(12) },
  weekTitle: { color: C.sub, fontFamily: 'vazir', fontSize: R(11), textAlign: 'center', flex: 1 },
  dayBtn: { width: DAY_W, alignItems: 'center', paddingVertical: R(8), borderRadius: R(10), backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, position: 'relative' },
  dayBtnOn: { backgroundColor: C.gold, borderColor: C.gold },
  dayName: { color: C.sub, fontFamily: 'vazir', fontSize: R(10) },
  dayNameOn: { color: C.bg },
  dayNum: { color: C.white, fontFamily: 'vazir', fontSize: R(13), fontWeight: 'bold', marginTop: R(2) },
  dayNumOn: { color: C.bg },
  badge: { position: 'absolute', top: -R(4), left: -R(4), backgroundColor: C.red, borderRadius: R(8), minWidth: R(16), height: R(16), justifyContent: 'center', alignItems: 'center', paddingHorizontal: R(2) },
  badgeTxt: { color: C.white, fontFamily: 'vazir', fontSize: R(8), fontWeight: 'bold' },
  hoursWrap: { backgroundColor: C.surface2, borderRadius: R(12), padding: R(12), borderWidth: 1, borderColor: C.border },
  dayLabel: { color: C.gold, fontFamily: 'vazir', fontSize: R(12), fontWeight: 'bold', textAlign: 'left', marginBottom: R(10) },
  slot: { paddingHorizontal: R(10), paddingVertical: R(6), borderRadius: R(8), backgroundColor: C.surface3, borderWidth: 1, borderColor: C.border },
  slotOn: { backgroundColor: C.gold, borderColor: C.gold },
  slotTxt: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  slotTxtOn: { color: C.bg, fontWeight: 'bold' },
});

export default WeeklyCalendar;