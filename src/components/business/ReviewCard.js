// src/components/business/ReviewCard.js
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * ReviewCard
 * @param {object} review - { id, userName, avatar, score, comment, date, serviceName }
 */
const ReviewCard = ({ review }) => {
  const color = review.score >= 4 ? '#4CAF50' : review.score >= 3 ? COLORS.gold : COLORS.red;
  return (
    <View style={s.card}>
      <View style={s.topRow}>
        <View style={s.userInfo}>
          <Text style={s.userName}>{review.userName}</Text>
          <Text style={s.service}>{review.serviceName}</Text>
        </View>
        <View style={s.avatarSec}>
          <Image source={{ uri: review.avatar }} style={s.avatar} />
          <View style={[s.badge, { backgroundColor: color }]}>
            <Text style={s.badgeTxt}>{review.score.toFixed(1)}</Text>
          </View>
        </View>
      </View>
      <Text style={s.comment}>{review.comment}</Text>
      <Text style={s.date}>{review.date}</Text>
    </View>
  );
};

const s = StyleSheet.create({
  card:      {
    backgroundColor: COLORS.surface, borderRadius: RADII.lg,
    padding: 14, marginHorizontal: 20, marginBottom: 10,
    borderWidth: 1, borderColor: COLORS.border, gap: 8,
  },
  topRow:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  userInfo:  { flex: 1, alignItems: 'flex-end', gap: 3 },
  userName:  { color: COLORS.textMain, fontSize: 14, fontFamily: FONTS.bold },
  service:   { color: COLORS.gold, fontSize: 11, fontFamily: FONTS.regular },
  avatarSec: { alignItems: 'center', gap: 4, marginLeft: 12 },
  avatar:    { width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: COLORS.border },
  badge:     { paddingHorizontal: 7, paddingVertical: 2, borderRadius: RADII.round, minWidth: 34, alignItems: 'center' },
  badgeTxt:  { color: '#FFF', fontSize: 12, fontFamily: FONTS.bold },
  comment:   { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 20 },
  date:      { color: COLORS.border, fontSize: 11, fontFamily: FONTS.regular, textAlign: 'left' },
});

export default ReviewCard;