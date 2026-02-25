// src/components/profile/ProfileHeader.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ProfileAvatar from './ProfileAvatar';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * ProfileHeader
 * @param {string} name - نام کاربر
 * @param {string} phone - شماره موبایل
 * @param {string} avatarUri - آدرس عکس پروفایل
 * @param {function} onEditPress - کلیک روی ویرایش مشخصات
 * @param {function} onCameraPress - کلیک روی دوربین آواتار
 */
const ProfileHeader = ({ name, phone, avatarUri, onEditPress, onCameraPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* اطلاعات متنی سمت چپ */}
        <View style={styles.textBlock}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.phone}>{phone}</Text>

          <TouchableOpacity style={styles.editBtn} onPress={onEditPress} activeOpacity={0.8}>
            <Icon name="pencil" size={13} color={COLORS.background} />
            <Text style={styles.editBtnText}>ویرایش مشخصات</Text>
          </TouchableOpacity>
        </View>

        {/* آواتار سمت راست */}
        <ProfileAvatar
          uri={avatarUri}
          size={110}
          editable
          onCameraPress={onCameraPress}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    marginTop: '10%',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textBlock: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 20,
  },
  name: {
    color: COLORS.textMain,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: FONTS.bold,
  },
  phone: {
    color: COLORS.textSub,
    fontSize: 14,
    marginTop: 5,
    fontFamily: FONTS.regular,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADII.sm,
    marginTop: 10,
    gap: 5,
  },
  editBtnText: {
    color: COLORS.background,
    fontFamily: FONTS.regular,
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default ProfileHeader;