// src/components/SectionHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../../theme/appTheme';

/**
 * SectionHeader - هدر بخش قابل استفاده در همه صفحات
 * @param {string} title - عنوان بخش
 * @param {string} iconName - نام آیکون Ionicons
 * @param {string} actionLabel - متن دکمه "همه" (اختیاری)
 * @param {function} onAction - کلیک روی دکمه همه
 * @param {object} style - استایل اضافی container
 */
const SectionHeader = ({ title, iconName, actionLabel, onAction, style }) => {
  return (
    <View style={[styles.container, style]}>
      {/* سمت چپ: دکمه "همه" اختیاری */}
      {actionLabel ? (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.actionLabel}>{actionLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.spacer} />
      )}

      {/* سمت راست: آیکون + عنوان */}
      <View style={styles.titleRow}>
        <Text style={styles.title}>{title}</Text>
        {iconName && (
          <Icon
            name={iconName}
            size={20}
            color={COLORS.gold}
            style={styles.icon}
          />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 6,
  },
  title: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  actionLabel: {
    color: COLORS.gold,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  spacer: {
    width: 1,
  },
});

export default SectionHeader;
