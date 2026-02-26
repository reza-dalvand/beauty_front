// src/components/business/BusinessHeader.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

const BusinessHeader = ({ business, onEditPress, onAvatarPress }) => (
  <View style={s.container}>
    <View style={s.topRow}>
      <TouchableOpacity onPress={onAvatarPress} activeOpacity={0.85} style={s.avatarWrap}>
        <View style={s.avatarGlow}>
          <Image source={{ uri: business.avatar }} style={s.avatar} />
        </View>
        <View style={s.cameraBtn}>
          <Icon name="camera" size={12} color={COLORS.background} />
        </View>
        <View style={[s.onlineDot, { backgroundColor: business.isOnline ? '#4CAF50' : COLORS.border }]} />
      </TouchableOpacity>

      <View style={s.infoBlock}>
        <Text style={s.name}>{business.name}</Text>
        <View style={s.catRow}>
          <Icon name="storefront-outline" size={13} color={COLORS.gold} />
          <Text style={s.category}>{business.category}</Text>
        </View>
        {!!business.bio && <Text style={s.bio} numberOfLines={2}>{business.bio}</Text>}
      </View>
    </View>

    <View style={s.statsRow}>
      <StatBox value={business.reviewCount  ?? 0} label="نظر" />
      <View style={s.div} />
      <StatBox value={business.totalBookings ?? 0} label="رزرو" />
      <View style={s.div} />
      <StatBox value={business.servicesCount ?? 0} label="خدمت" />
    </View>

    <TouchableOpacity style={s.editBtn} onPress={onEditPress} activeOpacity={0.85}>
      <Icon name="create-outline" size={17} color={COLORS.background} />
      <Text style={s.editTxt}>ویرایش پست کسب‌وکار</Text>
    </TouchableOpacity>
  </View>
);

const StatBox = ({ value, label }) => (
  <View style={s.statBox}>
    <Text style={s.statVal}>{value}</Text>
    <Text style={s.statLbl}>{label}</Text>
  </View>
);

const s = StyleSheet.create({
  container:  { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20, gap: 16 },
  topRow:     { flexDirection: 'row-reverse', alignItems: 'flex-start', gap: 16 },
  avatarWrap: { position: 'relative' },
  avatarGlow: {
    width: 86, height: 86, borderRadius: 43,
    borderWidth: 2.5, borderColor: COLORS.gold,
    justifyContent: 'center', alignItems: 'center', ...SHADOWS.gold,
  },
  avatar:     { width: 78, height: 78, borderRadius: 39 },
  cameraBtn:  {
    position: 'absolute', bottom: 0, left: 0, width: 26, height: 26, borderRadius: 13,
    backgroundColor: COLORS.gold, justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: COLORS.background,
  },
  onlineDot:  {
    position: 'absolute', top: 2, right: 2, width: 14, height: 14, borderRadius: 7,
    borderWidth: 2, borderColor: COLORS.background,
  },
  infoBlock:  { flex: 1, alignItems: 'flex-end', gap: 5 },
  name:       { color: COLORS.textMain, fontSize: 18, fontFamily: FONTS.bold, textAlign: 'right' },
  catRow:     { flexDirection: 'row', alignItems: 'center', gap: 5 },
  category:   { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.regular },
  bio:        { color: COLORS.textSub, fontSize: 12, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 18 },
  statsRow:   {
    flexDirection: 'row', backgroundColor: COLORS.surface,
    borderRadius: RADII.lg, borderWidth: 1, borderColor: COLORS.border, paddingVertical: 14,
  },
  statBox:    { flex: 1, alignItems: 'center', gap: 3 },
  statVal:    { color: COLORS.textMain, fontSize: 20, fontFamily: FONTS.bold },
  statLbl:    { color: COLORS.textSub, fontSize: 11, fontFamily: FONTS.regular },
  div:        { width: 1, backgroundColor: COLORS.border, marginVertical: 4 },
  editBtn:    {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8,
    backgroundColor: COLORS.gold, borderRadius: RADII.md, height: 46, ...SHADOWS.goldButton,
  },
  editTxt:    { color: COLORS.background, fontSize: 14, fontFamily: FONTS.bold },
});

export default BusinessHeader;