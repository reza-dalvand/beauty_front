// src/components/profile/RequestCard.js
// کارت وضعیت درخواست رزرو — برای قسمت پروفایل مشتری
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

const STATUS = {
  pending:  { label:'در انتظار تأیید',  color:'#F59E0B', icon:'time-outline',           bg:'rgba(245,158,11,0.1)',  border:'rgba(245,158,11,0.3)'  },
  approved: { label:'تأیید شده',         color:'#4CAF50', icon:'checkmark-circle-outline',bg:'rgba(76,175,80,0.1)',   border:'rgba(76,175,80,0.3)'   },
  rejected: { label:'رد شده',            color:COLORS.red, icon:'close-circle-outline',  bg:'rgba(229,57,53,0.1)',   border:'rgba(229,57,53,0.3)'   },
};

/**
 * RequestCard
 * @param {object}   request - { id, provider, subtitle, date, time, avatar, price, status, message }
 * @param {function} onCancel
 */
const RequestCard = ({ request, onCancel }) => {
  const [expanded, setExpanded] = useState(false);
  const st = STATUS[request.status] ?? STATUS.pending;

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(e => !e);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={toggle} activeOpacity={0.88}>
      {/* ردیف بالا */}
      <View style={styles.topRow}>
        {/* آواتار */}
        <Image source={{ uri: request.avatar }} style={styles.avatar} />

        {/* اطلاعات */}
        <View style={styles.info}>
          <Text style={styles.provider}>{request.provider}</Text>
          <Text style={styles.subtitle}>{request.subtitle}</Text>
          <View style={styles.metaRow}>
            <Icon name="calendar-outline" size={12} color={COLORS.textSub} />
            <Text style={styles.meta}>{request.date}</Text>
            <Icon name="time-outline" size={12} color={COLORS.textSub} />
            <Text style={styles.meta}>{request.time}</Text>
          </View>
        </View>

        {/* بج وضعیت */}
        <View style={[styles.badge, { backgroundColor: st.bg, borderColor: st.border }]}>
          <Icon name={st.icon} size={13} color={st.color} />
          <Text style={[styles.badgeTxt, { color: st.color }]}>{st.label}</Text>
        </View>
      </View>

      {/* بخش باز‌شدنی */}
      {expanded && (
        <View style={styles.expandBody}>
          {/* قیمت */}
          <View style={styles.detailRow}>
            <Icon name="cash-outline" size={14} color={COLORS.gold} />
            <Text style={styles.detailVal}>{request.price?.toLocaleString()} تومان</Text>
            <Text style={styles.detailLbl}>هزینه خدمت:</Text>
          </View>

          {/* پیام صاحب کسب‌وکار */}
          {request.message ? (
            <View style={[styles.msgBox, { borderColor: st.border, backgroundColor: st.bg }]}>
              <View style={styles.msgHeader}>
                <Text style={[styles.msgLabel, { color: st.color }]}>پیام کسب‌وکار:</Text>
                <Icon name="chatbubble-outline" size={14} color={st.color} />
              </View>
              <Text style={styles.msgTxt}>{request.message}</Text>
            </View>
          ) : (
            request.status === 'pending' && (
              <View style={styles.pendingBox}>
                <Icon name="hourglass-outline" size={14} color={COLORS.textSub} />
                <Text style={styles.pendingTxt}>در انتظار پاسخ از کسب‌وکار هستید</Text>
              </View>
            )
          )}

          {/* دکمه لغو — فقط در حالت pending */}
          {request.status === 'pending' && onCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => onCancel(request)}
              activeOpacity={0.7}>
              <Icon name="close-circle-outline" size={13} color={COLORS.red} />
              <Text style={styles.cancelTxt}>لغو درخواست</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* آیکون expand */}
      <View style={styles.expandIcon}>
        <Icon name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.border} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topRow:   { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 10 },
  avatar:   { width: 52, height: 52, borderRadius: 26, borderWidth: 1.5, borderColor: COLORS.border },
  info:     { flex: 1, alignItems: 'flex-end', gap: 3 },
  provider: { color: COLORS.textMain, fontSize: 14, fontFamily: FONTS.bold },
  subtitle: { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  metaRow:  { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  meta:     { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular },
  badge:    { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 5, borderRadius: RADII.md, borderWidth: 1, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 10, fontFamily: FONTS.bold },

  // expand
  expandBody: { marginTop: 12, gap: 10, borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 },
  detailRow:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 8 },
  detailLbl:  { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  detailVal:  { color: COLORS.gold, fontSize: 13, fontFamily: FONTS.bold },
  msgBox:     { borderRadius: RADII.md, borderWidth: 1, padding: 10, gap: 6 },
  msgHeader:  { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 5 },
  msgLabel:   { fontSize: 12, fontFamily: FONTS.bold },
  msgTxt:     { color: COLORS.textMain, fontSize: 13, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 20 },
  pendingBox: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: 6 },
  pendingTxt: { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  cancelBtn:  {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5,
    paddingVertical: 8, paddingHorizontal: 14, borderRadius: RADII.md,
    borderWidth: 1, borderColor: 'rgba(229,57,53,0.3)',
    backgroundColor: 'rgba(229,57,53,0.07)', alignSelf: 'flex-end',
  },
  cancelTxt:  { color: COLORS.red, fontSize: 12, fontFamily: FONTS.regular },
  expandIcon: { alignItems: 'center', marginTop: 6 },
});

export default RequestCard;