// src/components/business/ScoreDisplay.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * ScoreDisplay — امتیاز عددی + نوار توزیع
 * @param {number} avg          - میانگین ۰ تا ۵
 * @param {number} total        - تعداد کل نظرات
 * @param {object} dist         - { 5: n, 4: n, 3: n, 2: n, 1: n }
 */
const ScoreDisplay = ({ avg = 0, total = 0, dist = {} }) => {
  const color = avg >= 4 ? '#4CAF50' : avg >= 3 ? COLORS.gold : COLORS.red;
  const label = avg >= 4.5 ? 'عالی' : avg >= 4 ? 'خوب' : avg >= 3 ? 'متوسط' : 'ضعیف';

  return (
    <View style={s.card}>
      {/* امتیاز بزرگ */}
      <View style={s.scoreCol}>
        <Text style={[s.bigNum, { color }]}>{avg.toFixed(1)}</Text>
        <Text style={s.outOf}>از ۵</Text>
        <View style={[s.badge, { backgroundColor: color + '22', borderColor: color + '55' }]}>
          <Text style={[s.badgeTxt, { color }]}>{label}</Text>
        </View>
        <Text style={s.totalTxt}>{total} نظر</Text>
      </View>

      <View style={s.vDiv} />

      {/* نوارها */}
      <View style={s.barsCol}>
        {[5, 4, 3, 2, 1].map(n => {
          const cnt = dist[n] ?? 0;
          const pct = total > 0 ? (cnt / total) * 100 : 0;
          const barColor = n >= 4 ? '#4CAF50' : n === 3 ? COLORS.gold : COLORS.red;
          return (
            <View key={n} style={s.barRow}>
              <Text style={s.barLbl}>{cnt}</Text>
              <View style={s.track}>
                <View style={[s.fill, { width: `${pct}%`, backgroundColor: barColor }]} />
              </View>
              <Text style={s.barNum}>{n}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse', alignItems: 'center',
    backgroundColor: COLORS.surface, marginHorizontal: 20,
    borderRadius: RADII.lg, borderWidth: 1, borderColor: COLORS.border,
    padding: 16, gap: 16,
  },
  scoreCol:  { alignItems: 'center', gap: 4, minWidth: 72 },
  bigNum:    { fontSize: 52, fontFamily: FONTS.bold, lineHeight: 58 },
  outOf:     { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  badge: {
    marginTop: 2, paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: RADII.round, borderWidth: 1,
  },
  badgeTxt:  { fontSize: 11, fontFamily: FONTS.bold },
  totalTxt:  { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular, marginTop: 2 },
  vDiv:      { width: 1, height: '85%', backgroundColor: COLORS.border },
  barsCol:   { flex: 1, gap: 7 },
  barRow:    { flexDirection: 'row-reverse', alignItems: 'center', gap: 6 },
  barNum:    { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.bold, width: 14, textAlign: 'center' },
  track:     { flex: 1, height: 6, backgroundColor: COLORS.border, borderRadius: 3, overflow: 'hidden' },
  fill:      { height: '100%', borderRadius: 3 },
  barLbl:    { color: COLORS.textSub, fontSize: 10, fontFamily: FONTS.regular, width: 22, textAlign: 'left' },
});

export default ScoreDisplay;