// src/components/profile/ProfileAvatar.js
import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, SHADOWS, RADII } from '../../theme/appTheme';

/**
 * ProfileAvatar
 * @param {string} uri - آدرس عکس پروفایل
 * @param {number} size - اندازه کلی (پیش‌فرض: 110)
 * @param {boolean} editable - نمایش آیکون دوربین
 * @param {function} onCameraPress - کلیک روی دوربین
 */
const ProfileAvatar = ({ uri, size = 110, editable = true, onCameraPress }) => {
  const innerSize = size - 14;

  return (
    <View style={[styles.wrapper, { width: size, height: size, borderRadius: size / 2 }]}>
      <View
        style={[
          styles.glowRing,
          { width: size, height: size, borderRadius: size / 2 },
          SHADOWS.gold,
        ]}>
        <Image
          source={{ uri }}
          style={{ width: innerSize, height: innerSize, borderRadius: innerSize / 2 }}
        />
      </View>

      {editable && (
        <TouchableOpacity
          style={styles.cameraBtn}
          onPress={onCameraPress}
          activeOpacity={0.8}>
          <Icon name="camera" size={14} color={COLORS.background} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
  },
  glowRing: {
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
});

export default ProfileAvatar;