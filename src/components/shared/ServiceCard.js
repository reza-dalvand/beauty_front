// src/components/shared/ServiceCard.js
// ✅ قابل استفاده در: HomeScreen, ExploreScreen
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * ServiceCard - کارت سرویس برای گرید
 * @param {object} item - { id, title, subtitle, image, price, rating }
 * @param {number} cardWidth - عرض کارت (از parent پاس می‌شه برای responsive)
 * @param {function} onPress
 */
const ServiceCard = ({ item, cardWidth, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => onPress?.(item)}
      activeOpacity={0.85}>

      {/* تصویر - تغییر: height از 0.85 به 1.1 برای بزرگ‌تر شدن کارت */}
      <Image
        source={{ uri: item.image }}
        style={[styles.image, { width: cardWidth, height: cardWidth * 1.25 }]}
        resizeMode="cover"
      />

      {/* بج قیمت */}
      {item.price && (
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{item.price}</Text>
        </View>
      )}

      {/* اطلاعات پایین */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
        {item.subtitle ? (
          <Text style={styles.subtitle} numberOfLines={1}>{item.subtitle}</Text>
        ) : null}

        {/* رتبه‌بندی */}
        {item.rating && (
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Icon name="star" size={11} color={COLORS.gold} />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  image: {
    backgroundColor: '#222',
  },
  priceBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: RADII.sm,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: COLORS.gold,
  },
  priceText: {
    color: COLORS.gold,
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  info: {
    padding: 8,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 12,
    fontFamily: FONTS.bold,
    textAlign: 'right',
    marginBottom: 2,
  },
  subtitle: {
    color: COLORS.textSub,
    fontSize: 10,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 3,
    marginTop: 4,
  },
  ratingText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
});

export default ServiceCard;