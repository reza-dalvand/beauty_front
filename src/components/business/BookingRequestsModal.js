// src/components/business/BookingRequestsModal.js
// مودال مدیریت نوبت‌های یک خدمت — تایید / رد / پیام اختیاری
import React, { useState, useMemo } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  FlatList, TextInput, Image, TouchableWithoutFeedback,
  KeyboardAvoidingView, Platform, Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

// ─── وضعیت‌ها ─────────────────────────────────────────
export const STATUS = {
  PENDING:   'pending',
  CONFIRMED: 'confirmed',
  REJECTED:  'rejected',
};

const STATUS_META = {
  pending:   { label: 'در انتظار',   icon: 'time-outline',            color: '#F5A623' },
  confirmed: { label: 'تایید شده',   icon: 'checkmark-circle-outline', color: '#4CAF50' },
  rejected:  { label: 'رد شده',      icon: 'close-circle-outline',     color: '#F44336' },
};

// ─── فیلترها ─────────────────────────────────────────
const FILTERS = [
  { id: 'all',      label: 'همه'        },
  { id: 'pending',  label: 'در انتظار'  },
  { id: 'confirmed',label: 'تایید شده'  },
  { id: 'rejected', label: 'رد شده'     },
];

// ════════════════════════════════════════════════
//  ACTION SHEET — تایید یا رد با پیام اختیاری
// ════════════════════════════════════════════════
const ActionSheet = ({ booking, onConfirm, onReject, onClose }) => {
  const [message, setMessage] = useState('');
  const [action,  setAction]  = useState(null); // 'confirm' | 'reject'

  const handleDone = () => {
    if (action === 'confirm') onConfirm(booking.id, message.trim());
    if (action === 'reject')  onReject(booking.id,  message.trim());
    onClose();
  };

  if (!booking) return null;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={as.kav}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={as.backdrop} />
      </TouchableWithoutFeedback>

      <View style={as.sheet}>
        <View style={as.handle} />

        {/* اطلاعات مشتری */}
        <View style={as.clientRow}>
          <View style={as.clientInfo}>
            <Text style={as.clientName}>{booking.customerName}</Text>
            <Text style={as.clientMeta}>{booking.date}  ·  {booking.time}</Text>
          </View>
          <Image source={{ uri: booking.customerAvatar }} style={as.clientAvatar} />
        </View>

        {/* دکمه‌های تایید / رد */}
        <View style={as.btnRow}>
          <TouchableOpacity
            style={[as.actionBtn, as.rejectBtn, action==='reject' && as.btnActive]}
            onPress={() => setAction(a => a==='reject' ? null : 'reject')}
            activeOpacity={0.8}>
            <Icon name="close-circle-outline" size={18} color={action==='reject' ? '#fff' : '#F44336'} />
            <Text style={[as.actionTxt, { color: action==='reject' ? '#fff' : '#F44336' }]}>رد کردن</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[as.actionBtn, as.confirmBtn, action==='confirm' && as.confirmActive]}
            onPress={() => setAction(a => a==='confirm' ? null : 'confirm')}
            activeOpacity={0.8}>
            <Icon name="checkmark-circle-outline" size={18} color={action==='confirm' ? '#fff' : '#4CAF50'} />
            <Text style={[as.actionTxt, { color: action==='confirm' ? '#fff' : '#4CAF50' }]}>تایید</Text>
          </TouchableOpacity>
        </View>

        {/* پیام اختیاری */}
        {action && (
          <>
            <Text style={as.msgLabel}>
              پیام به مشتری
              <Text style={as.msgOptional}> (اختیاری)</Text>
            </Text>
            <TextInput
              style={as.msgInput}
              placeholder={
                action === 'confirm'
                  ? 'مثال: لطفاً ۱۵ دقیقه زودتر تشریف بیاورید...'
                  : 'مثال: متأسفانه در این زمان در دسترس نیستم...'
              }
              placeholderTextColor={COLORS.textSub}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={3}
              textAlign="right"
              textAlignVertical="top"
            />
          </>
        )}

        {/* دکمه نهایی */}
        <TouchableOpacity
          style={[as.doneBtn,
            !action && as.doneBtnDisabled,
            action==='reject' && as.doneBtnReject,
          ]}
          onPress={handleDone}
          disabled={!action}
          activeOpacity={0.85}>
          <Icon
            name={action==='confirm' ? 'checkmark-circle' : action==='reject' ? 'close-circle' : 'ellipse-outline'}
            size={20}
            color="#fff"
          />
          <Text style={as.doneTxt}>
            {!action   ? 'یک گزینه انتخاب کنید' :
             action==='confirm' ? 'ثبت تایید' : 'ثبت رد'}
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const as = StyleSheet.create({
  kav:         { position: 'absolute', bottom: 0, left: 0, right: 0 },
  backdrop:    { position: 'absolute', top: -9999, left: 0, right: 0, bottom: 0 },
  sheet:       { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, paddingBottom: 32 },
  handle:      { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  clientRow:   { flexDirection: 'row-reverse', alignItems: 'center', gap: 12, marginBottom: 18, paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  clientAvatar:{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: COLORS.border },
  clientInfo:  { flex: 1, alignItems: 'flex-end', gap: 3 },
  clientName:  { color: COLORS.textMain, fontSize: 15, fontFamily: FONTS.bold },
  clientMeta:  { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  btnRow:      { flexDirection: 'row-reverse', gap: 10, marginBottom: 16 },
  actionBtn:   { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, height: 46, borderRadius: RADII.md, borderWidth: 1.5 },
  rejectBtn:   { borderColor: '#F44336', backgroundColor: 'transparent' },
  confirmBtn:  { borderColor: '#4CAF50', backgroundColor: 'transparent' },
  btnActive:   { backgroundColor: '#F44336' },
  confirmActive:{ backgroundColor: '#4CAF50', borderColor: '#4CAF50' },
  actionTxt:   { fontSize: 14, fontFamily: FONTS.bold },
  msgLabel:    { color: COLORS.textMain, fontSize: 13, fontFamily: FONTS.bold, textAlign: 'right', marginBottom: 8 },
  msgOptional: { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  msgInput:    {
    backgroundColor: COLORS.background, borderRadius: RADII.md,
    borderWidth: 1, borderColor: COLORS.border,
    padding: 12, color: COLORS.textMain, fontFamily: FONTS.regular, fontSize: 13,
    minHeight: 80, marginBottom: 16,
  },
  doneBtn:      { height: 50, backgroundColor: COLORS.gold, borderRadius: RADII.lg, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, ...SHADOWS.goldButton },
  doneBtnDisabled: { backgroundColor: COLORS.border },
  doneBtnReject:   { backgroundColor: '#F44336' },
  doneTxt:      { color: '#fff', fontSize: 15, fontFamily: FONTS.bold },
});

// ════════════════════════════════════════════════
//  BOOKING ITEM ROW
// ════════════════════════════════════════════════
const BookingRow = ({ booking, onPress }) => {
  const meta = STATUS_META[booking.status];
  return (
    <TouchableOpacity style={br.row} onPress={() => onPress(booking)} activeOpacity={0.85}>
      {/* عکس مشتری */}
      <Image source={{ uri: booking.customerAvatar }} style={br.avatar} />

      {/* اطلاعات */}
      <View style={br.info}>
        <Text style={br.name}>{booking.customerName}</Text>
        <View style={br.metaRow}>
          <Icon name="calendar-outline" size={11} color={COLORS.textSub} />
          <Text style={br.metaTxt}>{booking.date}</Text>
          <Icon name="time-outline" size={11} color={COLORS.textSub} style={{ marginRight: 4 }} />
          <Text style={br.metaTxt}>{booking.time}</Text>
        </View>
        {!!booking.customerNote && (
          <Text style={br.note} numberOfLines={1}>"{booking.customerNote}"</Text>
        )}
        {!!booking.providerMessage && (
          <View style={br.msgBadge}>
            <Icon name="chatbubble-outline" size={10} color={COLORS.textSub} />
            <Text style={br.msgTxt} numberOfLines={1}>{booking.providerMessage}</Text>
          </View>
        )}
      </View>

      {/* وضعیت */}
      <View style={[br.badge, { borderColor: meta.color + '66', backgroundColor: meta.color + '18' }]}>
        <Icon name={meta.icon} size={12} color={meta.color} />
        <Text style={[br.badgeTxt, { color: meta.color }]}>{meta.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const br = StyleSheet.create({
  row:     { flexDirection: 'row-reverse', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  avatar:  { width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: COLORS.border },
  info:    { flex: 1, gap: 3, alignItems: 'flex-end' },
  name:    { color: COLORS.textMain, fontSize: 13, fontFamily: FONTS.bold },
  metaRow: { flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  metaTxt: { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular },
  note:    { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular, fontStyle: 'italic' },
  msgBadge:{ flexDirection: 'row-reverse', alignItems: 'center', gap: 4 },
  msgTxt:  { color: COLORS.textSub, fontSize: 10, fontFamily: FONTS.regular, fontStyle: 'italic' },
  badge:   { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADII.round, borderWidth: 1 },
  badgeTxt:{ fontSize: 11, fontFamily: FONTS.bold },
});

// ════════════════════════════════════════════════
//  MAIN MODAL
// ════════════════════════════════════════════════
/**
 * BookingRequestsModal
 * @param {boolean}  visible
 * @param {string}   serviceName
 * @param {Array}    bookings     - آرایه نوبت‌های این خدمت
 * @param {function} onClose
 * @param {function} onUpdate     - (updatedBookings) => void
 */
const BookingRequestsModal = ({ visible, serviceName, bookings: initialBookings = [], onClose, onUpdate }) => {
  const insets = useSafeAreaInsets();
  const [bookings,   setBookings]   = useState(initialBookings);
  const [filter,     setFilter]     = useState('all');
  const [actionItem, setActionItem] = useState(null); // نوبت انتخاب‌شده برای action sheet

  // همگام‌سازی با props تازه
  React.useEffect(() => { setBookings(initialBookings); }, [initialBookings]);

  const pendingCount = bookings.filter(b => b.status === STATUS.PENDING).length;

  const filtered = useMemo(() =>
    filter === 'all' ? bookings : bookings.filter(b => b.status === filter),
    [bookings, filter]
  );

  const updateBooking = (id, patch) => {
    setBookings(prev => {
      const next = prev.map(b => b.id === id ? { ...b, ...patch } : b);
      onUpdate?.(next);
      return next;
    });
  };

  const handleConfirm = (id, message) =>
    updateBooking(id, { status: STATUS.CONFIRMED, providerMessage: message || null });

  const handleReject = (id, message) =>
    updateBooking(id, { status: STATUS.REJECTED, providerMessage: message || null });

  const counts = {
    all:       bookings.length,
    pending:   bookings.filter(b => b.status==='pending').length,
    confirmed: bookings.filter(b => b.status==='confirmed').length,
    rejected:  bookings.filter(b => b.status==='rejected').length,
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      {/* overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={m.overlay} />
      </TouchableWithoutFeedback>

      <View style={[m.sheet, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <View style={m.handle} />

        {/* هدر */}
        <View style={m.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{top:10,bottom:10,left:10,right:10}}>
            <Icon name="close" size={22} color={COLORS.textSub} />
          </TouchableOpacity>
          <View style={m.headerMid}>
            <Text style={m.headerTitle}>نوبت‌های دریافتی</Text>
            <Text style={m.headerSub} numberOfLines={1}>{serviceName}</Text>
          </View>
          {pendingCount > 0
            ? <View style={m.pendingBadge}><Text style={m.pendingBadgeTxt}>{pendingCount}</Text></View>
            : <Icon name="calendar-number-outline" size={22} color={COLORS.gold} />
          }
        </View>

        {/* فیلتر */}
        <View style={m.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity
              key={f.id}
              style={[m.filterChip, filter===f.id && m.filterChipOn]}
              onPress={() => setFilter(f.id)}
              activeOpacity={0.8}>
              <Text style={[m.filterTxt, filter===f.id && m.filterTxtOn]}>
                {f.label}
              </Text>
              {counts[f.id] > 0 && (
                <View style={[m.filterCount, filter===f.id && m.filterCountOn]}>
                  <Text style={[m.filterCountTxt, filter===f.id && m.filterCountTxtOn]}>
                    {counts[f.id]}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* لیست */}
        {filtered.length === 0 ? (
          <View style={m.empty}>
            <Icon name="calendar-outline" size={48} color={COLORS.border} />
            <Text style={m.emptyTxt}>نوبتی در این دسته‌بندی وجود ندارد</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            keyExtractor={i => i.id}
            renderItem={({ item }) => (
              <BookingRow
                booking={item}
                onPress={b => {
                  // فقط نوبت‌های در انتظار قابل تغییرند
                  if (b.status === STATUS.PENDING) setActionItem(b);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            style={m.list}
          />
        )}

        {/* راهنما */}
        <View style={m.hint}>
          <Icon name="information-circle-outline" size={13} color={COLORS.textSub} />
          <Text style={m.hintTxt}>روی نوبت «در انتظار» ضربه بزنید تا تایید یا رد کنید</Text>
        </View>
      </View>

      {/* Action Sheet — تایید/رد با پیام */}
      {actionItem && (
        <ActionSheet
          booking={actionItem}
          onConfirm={handleConfirm}
          onReject={handleReject}
          onClose={() => setActionItem(null)}
        />
      )}
    </Modal>
  );
};

const m = StyleSheet.create({
  overlay:    { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  sheet:      { backgroundColor: COLORS.surface, borderTopLeftRadius: 28, borderTopRightRadius: 28, maxHeight: '92%' },
  handle:     { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginTop: 10, marginBottom: 4 },
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  headerMid:  { alignItems: 'center', flex: 1, gap: 2 },
  headerTitle:{ color: COLORS.textMain, fontSize: 15, fontFamily: FONTS.bold },
  headerSub:  { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.regular },
  pendingBadge:    { backgroundColor: '#F5A623', borderRadius: RADII.round, minWidth: 24, height: 24, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 6 },
  pendingBadgeTxt: { color: '#fff', fontSize: 12, fontFamily: FONTS.bold },

  filterRow:     { flexDirection: 'row-reverse', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterChip:    { flexDirection: 'row-reverse', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: RADII.round, borderWidth: 1, borderColor: COLORS.border },
  filterChipOn:  { backgroundColor: COLORS.gold, borderColor: COLORS.gold },
  filterTxt:     { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular },
  filterTxtOn:   { color: COLORS.background, fontFamily: FONTS.bold },
  filterCount:   { backgroundColor: COLORS.border, borderRadius: 8, minWidth: 16, height: 16, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 3 },
  filterCountOn: { backgroundColor: 'rgba(0,0,0,0.25)' },
  filterCountTxt:   { color: COLORS.textSub, fontSize: 10, fontFamily: FONTS.bold },
  filterCountTxtOn: { color: COLORS.background },

  list:     { maxHeight: 460 },
  empty:    { alignItems: 'center', paddingVertical: 50, gap: 10 },
  emptyTxt: { color: COLORS.textSub, fontSize: 14, fontFamily: FONTS.regular },
  hint:     { flexDirection: 'row-reverse', alignItems: 'center', gap: 6, paddingHorizontal: 20, paddingVertical: 12 },
  hintTxt:  { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular, flex: 1, textAlign: 'right' },
});

export default BookingRequestsModal;