// src/components/explore/ProviderCard.js
// ✅ کارت آرایشگر / سالن - مخصوص ExploreScreen
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

/**
 * ProviderCard - کارت ارائه‌دهنده خدمات
 * @param {object} item - { id, name, category, rating, reviewCount, distance, avatar, tags, isOnline }
 * @param {function} onPress
 * @param {function} onBookPress - دکمه رزرو
 */
const ProviderCard = ({ item, onPress, onBookPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.85}>
      {/* ردیف بالا: آواتار + اطلاعات اصلی */}
      <View style={styles.topRow}>
        {/* آواتار + نشانگر آنلاین */}
        <View style={styles.avatarWrap}>
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
          {item.isOnline && <View style={styles.onlineDot} />}
        </View>

        {/* اطلاعات */}
        <View style={styles.infoBlock}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category}</Text>

          {/* ستاره + فاصله */}
          <View style={styles.metaRow}>
            <View style={styles.ratingChip}>
              <Icon name="star" size={11} color={COLORS.gold} />
              <Text style={styles.ratingText}>{item.rating}</Text>
              <Text style={styles.reviewText}>({item.reviewCount})</Text>
            </View>

            {item.distance && (
              <View style={styles.distanceChip}>
                <Icon name="location-outline" size={11} color={COLORS.textSub} />
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>
            )}
          </View>

          {/* تگ‌های خدمات */}
          {item.tags?.length > 0 && (
            <View style={styles.tagsRow}>
              {item.tags.slice(0, 3).map(tag => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* دکمه رزرو */}
      <TouchableOpacity style={styles.bookBtn} onPress={() => onBookPress?.(item)} activeOpacity={0.8}>
        <Icon name="calendar-outline" size={14} color={COLORS.background} />
        <Text style={styles.bookBtnText}>رزرو نوبت</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...SHADOWS.card,
  },
  topRow: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    marginBottom: 12,
    gap: 12,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  infoBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  name: {
    color: COLORS.textMain,
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 2,
  },
  category: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.regular,
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  ratingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    color: COLORS.gold,
    fontSize: 12,
    fontFamily: FONTS.bold,
  },
  reviewText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  distanceChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  distanceText: {
    color: COLORS.textSub,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 5,
  },
  tag: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: RADII.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.3)',
  },
  tagText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.regular,
  },
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

export default ProviderCard;