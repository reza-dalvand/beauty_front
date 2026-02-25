// src/components/profile/ModelToggleCard.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * ModelToggleCard - کارت سوئیچ "تمایل به مدل شدن"
 * @param {boolean} value - وضعیت سوئیچ
 * @param {function} onToggle - تغییر وضعیت
 */
const ModelToggleCard = ({ value, onToggle }) => {
  return (
    <View style={styles.card}>
      <Switch
        trackColor={{ false: COLORS.switchOff, true: COLORS.gold }}
        thumbColor="#FFF"
        onValueChange={onToggle}
        value={value}
        style={styles.switch}
      />

      <View style={styles.textBlock}>
        <Text style={styles.title}>تمایل به مدل شدن</Text>
        <Text style={styles.desc}>
          با فعال کردن این امکان از خدمات رایگان و پرتخفیف بهره‌مند شوید.
        </Text>
      </View>

      <Icon name="diamond-outline" size={24} color={COLORS.gold} />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: 25,
    gap: 10,
  },
  textBlock: {
    flex: 1,
    alignItems: 'flex-end',
  },
  title: {
    color: COLORS.textMain,
    fontSize: 15,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  desc: {
    color: COLORS.textSub,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    lineHeight: 18,
  },
  switch: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
});

export default ModelToggleCard;