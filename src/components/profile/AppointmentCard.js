// src/components/profile/AppointmentCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * AppointmentCard - کارت نوبت رزرو شده
 * @param {object} item - { id, provider, subtitle, time, date, avatar }
 * @param {function} onCancel - لغو نوبت
 * @param {function} onPress - کلیک روی کارت
 */
const AppointmentCard = ({ item, onCancel, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.85}>
      {/* ردیف بالا: جزئیات + آواتار */}
      <View style={styles.topRow}>
        {/* اطلاعات سمت چپ */}
        <View style={styles.details}>
          <Text style={styles.provider}>{item.provider}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>

          {/* زمان */}
          <View style={styles.timeRow}>
            <Icon name="time-outline" size={13} color={COLORS.textSub} />
            <Text style={styles.timeText}>{item.time} - {item.date}</Text>
          </View>

          {/* دکمه لغو */}
          {onCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => onCancel(item)}
              activeOpacity={0.7}>
              <Icon name="close-circle-outline" size={13} color={COLORS.red} />
              <Text style={styles.cancelText}>لغو نوبت</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* آواتار سمت راست */}
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginLeft: 15,
  },
  details: {
    flex: 1,
    alignItems: 'flex-end',
  },
  provider: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  subtitle: {
    color: COLORS.textSub,
    fontSize: 12,
    marginTop: 3,
    fontFamily: FONTS.regular,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  timeText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: COLORS.redBorder,
    backgroundColor: COLORS.redFaint,
    gap: 4,
  },
  cancelText: {
    color: COLORS.red,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
});

export default AppointmentCard;