// src/screens/ProfileScreen.js
// ====================================================
// ✅ کاملاً کامپوننت‌بندی شده - بدون استایل تکراری
// ====================================================
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../theme/appTheme';
import ProfileHeader from '../components/profile/ProfileHeader';
import ModelToggleCard from '../components/profile/ModelToggleCard';
import { FavoritesList } from '../components/profile/FavoriteCard';
import AppointmentCard from '../components/profile/AppointmentCard';
import SectionHeader from '../components/shared/SectionHeader';
import DangerButton from '../components/shared/DangerButton';

// ─── داده‌های تستی ───────────────────────────────────
const FAVORITES = [
  { id: '1', title: 'کاشت ناخن', image: 'https://i.pravatar.cc/150?img=1' },
  { id: '2', title: 'میکاپ صورت', image: 'https://i.pravatar.cc/150?img=5' },
  { id: '3', title: 'کوتاهی مو', image: 'https://i.pravatar.cc/150?img=12' },
];

const APPOINTMENTS = [
  {
    id: '1',
    provider: 'سالن زیبایی رز',
    subtitle: 'خدمات ناخن',
    time: '16:30',
    date: '1402/07/15',
    avatar: 'https://i.pravatar.cc/150?img=9',
  },
  {
    id: '2',
    provider: 'کلینیک رخ',
    subtitle: 'فیشیال تخصصی',
    time: '10:00',
    date: '1402/07/20',
    avatar: 'https://i.pravatar.cc/150?img=20',
  },
];
// ─────────────────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isModelEnabled, setIsModelEnabled] = useState(false);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#0B0B0B" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* ① هدر کاربر */}
        <ProfileHeader
          name="رضا محبی"
          phone="09123456789"
          avatarUri="https://i.pravatar.cc/150?img=33"
          onEditPress={() => navigation.navigate('editProfile')}
          onCameraPress={() => console.log('change avatar')}
        />

        {/* ② سوئیچ مدل */}
        <ModelToggleCard
          value={isModelEnabled}
          onToggle={() => setIsModelEnabled(v => !v)}
        />

        {/* ③ علاقه‌مندی‌ها */}
        <SectionHeader
          title="علاقه‌مندی‌های من"
          iconName="bookmark"
          actionLabel="همه"
        />
        <FavoritesList
          data={FAVORITES}
          onItemPress={item => console.log('favorite:', item.title)}
        />

        {/* ④ نوبت‌ها */}
        <SectionHeader
          title="نوبت‌های رزرو شده"
          iconName="calendar"
          style={{ marginTop: 20 }}
        />
        <View style={styles.appointmentsWrap}>
          {APPOINTMENTS.map(item => (
            <AppointmentCard
              key={item.id}
              item={item}
              onCancel={apt => console.log('cancel:', apt.id)}
              onPress={apt => console.log('view:', apt.id)}
            />
          ))}
        </View>

        {/* ⑤ دکمه خروج */}
        <DangerButton
          title="خروج از حساب"
          iconName="log-out-outline"
          onPress={() => navigation.replace('Login')}
          style={styles.logoutBtn}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scroll: {
    paddingBottom: 120,
  },
  appointmentsWrap: {
    paddingHorizontal: 20,
  },
  logoutBtn: {
    marginTop: 40,
    marginBottom: 20,
  },
});

export default ProfileScreen;
