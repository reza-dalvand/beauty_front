// src/components/profile/FavoriteCard.js
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * FavoriteCard - کارت تکی علاقه‌مندی
 */
const FavoriteCard = ({ item, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={() => onPress?.(item)} activeOpacity={0.8}>
    <Image source={{ uri: item.image }} style={styles.image} />
    <Text style={styles.title} numberOfLines={1}>{item.title}</Text>
  </TouchableOpacity>
);

/**
 * FavoritesList - لیست افقی علاقه‌مندی‌ها
 * @param {Array} data - آرایه آیتم‌ها { id, title, image }
 * @param {function} onItemPress - کلیک روی هر آیتم
 */
export const FavoritesList = ({ data, onItemPress }) => (
  <FlatList
    data={data}
    horizontal
    inverted
    showsHorizontalScrollIndicator={false}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.listContent}
    renderItem={({ item }) => (
      <FavoriteCard item={item} onPress={onItemPress} />
    )}
  />
);

const styles = StyleSheet.create({
  card: {
    width: 100,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.lg,
    padding: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 70,
    borderRadius: RADII.md,
    marginBottom: 8,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 5,
  },
});

export default FavoriteCard;