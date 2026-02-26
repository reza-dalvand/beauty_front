// src/components/explore/DiscountCard.js
// کارت خدمات تخفیفی — مخصوص ExploreScreen
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

/**
 * DiscountCard - کارت خدمت تخفیف‌دار
 * @param {object} item - { id, title, businessName, businessAvatar, image,
 *                          originalPrice, discountPercent, rating, expiresIn }
 * @param {function} onPress
 */
const DiscountCard = ({ item, onPress }) => {
  const finalPrice = Math.round(item.originalPrice * (1 - item.discountPercent / 100));

  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.85}>

      {/* تصویر با بج تخفیف */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: item.image }} style={styles.image} resizeMode="cover" />

        {/* بج درصد تخفیف */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>{item.discountPercent}٪</Text>
          <Text style={styles.discountLabel}>تخفیف</Text>
        </View>

        {/* انقضا */}
        <View style={styles.expireBadge}>
          <Icon name="time-outline" size={10} color="#FFF" />
          <Text style={styles.expireText}>{item.expiresIn}</Text>
        </View>
      </View>

      {/* محتوای کارت */}
      <View style={styles.body}>
        {/* اطلاعات کسب‌وکار */}
        <View style={styles.businessRow}>
          <Text style={styles.businessName}>{item.businessName}</Text>
          <Image source={{ uri: item.businessAvatar }} style={styles.businessAvatar} />
        </View>

        {/* عنوان خدمت */}
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>

        {/* امتیاز */}
        <View style={styles.ratingRow}>
          <Icon name="star" size={11} color={COLORS.gold} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>

        {/* قیمت‌ها */}
        <View style={styles.priceRow}>
          {/* قیمت اصلی خط خورده */}
          <Text style={styles.originalPrice}>{item.originalPrice.toLocaleString()} تومان</Text>
          {/* قیمت نهایی */}
          <Text style={styles.finalPrice}>{finalPrice.toLocaleString()} تومان</Text>
        </View>

        {/* دکمه رزرو */}
        <TouchableOpacity style={styles.bookBtn} onPress={() => onPress?.(item)} activeOpacity={0.8}>
          <Icon name="ticket-outline" size={14} color={COLORS.background} />
          <Text style={styles.bookBtnText}>دریافت تخفیف</Text>
        </TouchableOpacity>
      </View>

    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    marginHorizontal: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  // ── تصویر ──
  imageWrap: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
  },
  discountBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.red,
    borderRadius: RADII.sm,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
  },
  discountText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: FONTS.bold,
    lineHeight: 18,
  },
  discountLabel: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 9,
    fontFamily: FONTS.regular,
  },
  expireBadge: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    borderRadius: RADII.round,
    paddingHorizontal: 8,
    paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expireText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONTS.regular,
  },
  // ── بدنه ──
  body: {
    padding: 14,
  },
  businessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 6,
  },
  businessAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: COLORS.gold,
  },
  businessName: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 15,
    fontFamily: FONTS.bold,
    textAlign: 'right',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 4,
    marginBottom: 10,
  },
  ratingText: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  // ── قیمت ──
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 12,
  },
  originalPrice: {
    color: COLORS.textSub,
    fontSize: 11,
    fontFamily: FONTS.regular,
    textDecorationLine: 'line-through',
  },
  finalPrice: {
    color: COLORS.textMain,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  // ── دکمه ──
  bookBtn: {
    backgroundColor: COLORS.gold,
    borderRadius: RADII.md,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
    ...SHADOWS.goldButton,
  },
  bookBtnText: {
    color: COLORS.background,
    fontSize: 13,
    fontFamily: FONTS.bold,
  },
});

export default DiscountCard;