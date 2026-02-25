// src/components/shared/CategoryTabs.js
// ✅ قابل استفاده در: HomeScreen, ExploreScreen
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * CategoryTabs - تب‌های افقی دسته‌بندی
 * @param {string[]} categories - آرایه دسته‌بندی‌ها
 * @param {string} selected - دسته انتخاب‌شده
 * @param {function} onSelect - تابع انتخاب
 * @param {object} style - استایل اضافی container
 */
const CategoryTabs = ({ categories, selected, onSelect, style }) => {
  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={categories}
        horizontal
        inverted
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => {
          const isActive = selected === item;
          return (
            <TouchableOpacity
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onSelect(item)}
              activeOpacity={0.75}>
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    paddingVertical: 7,
    paddingHorizontal: 16,
    borderRadius: RADII.round,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.gold,
  },
  tabText: {
    color: COLORS.textSub,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  tabTextActive: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
  },
});

export default CategoryTabs;