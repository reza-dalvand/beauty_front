// src/screens/ProfileScreen.js
// ====================================================
// تغییر: فقط بخش «درخواست‌های من» اضافه شده
// ظاهر تمام بخش‌های قبلی دست نخورده
// ====================================================
import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../theme/appTheme';
import ProfileHeader    from '../components/profile/ProfileHeader';
import ModelToggleCard  from '../components/profile/ModelToggleCard';
import { FavoritesList }from '../components/profile/FavoriteCard';
import AppointmentCard  from '../components/profile/AppointmentCard';
import RequestCard      from '../components/profile/RequestCard';   // ← جدید
import SectionHeader    from '../components/shared/SectionHeader';
import DangerButton     from '../components/shared/DangerButton';

// ─── داده‌های تستی (دست نخورده) ─────────────────────
const FAVORITES = [
  { id: '1', title: 'کاشت ناخن', image: 'https://i.pravatar.cc/150?img=1'  },
  { id: '2', title: 'میکاپ صورت',image: 'https://i.pravatar.cc/150?img=5'  },
  { id: '3', title: 'کوتاهی مو', image: 'https://i.pravatar.cc/150?img=12' },
];

const APPOINTMENTS = [
  { id: '1', provider: 'سالن زیبایی رز', subtitle: 'خدمات ناخن',     time: '16:30', date: '1402/07/15', avatar: 'https://i.pravatar.cc/150?img=9'  },
  { id: '2', provider: 'کلینیک رخ',       subtitle: 'فیشیال تخصصی', time: '10:00', date: '1402/07/20', avatar: 'https://i.pravatar.cc/150?img=20' },
];

// ─── داده تستی درخواست‌ها (در app واقعی از store میاد) ─
const MOCK_REQUESTS = [
  {
    id: 'rq1',
    provider:  'سالن زیبایی رز',
    subtitle:  'کاشت ناخن ژل',
    date:      '۱۴۰۳/۱۱/۲۰',
    time:      '۱۴:۰۰',
    avatar:    'https://i.pravatar.cc/150?img=47',
    price:     350000,
    status:    'pending',
    message:   '',
  },
  {
    id: 'rq2',
    provider:  'کلینیک پوست رخ',
    subtitle:  'فیشیال تخصصی',
    date:      '۱۴۰۳/۱۱/۱۸',
    time:      '۱۰:۳۰',
    avatar:    'https://i.pravatar.cc/150?img=32',
    price:     280000,
    status:    'approved',
    message:   'نوبت شما تأیید شد. لطفاً ۱۵ دقیقه قبل از ساعت مقرر در محل حاضر باشید.',
  },
  {
    id: 'rq3',
    provider:  'آتلیه مو آریا',
    subtitle:  'کراتین مو',
    date:      '۱۴۰۳/۱۱/۱۵',
    time:      '۱۱:۰۰',
    avatar:    'https://i.pravatar.cc/150?img=15',
    price:     450000,
    status:    'rejected',
    message:   'متأسفانه در آن روز ظرفیت کامل است. لطفاً روز دیگری را انتخاب کنید.',
  },
];

// ────────────────────────────────────────────────────

const ProfileScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [isModelEnabled, setIsModelEnabled] = useState(false);

  // state درخواست‌ها — در app واقعی از context/store میاد
  const [requests, setRequests] = useState(MOCK_REQUESTS);

  const cancelRequest = (req) => {
    setRequests(prev => prev.filter(r => r.id !== req.id));
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor="#0B0B0B" barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scroll}>

        {/* ① هدر کاربر — دست نخورده */}
        <ProfileHeader
          name="رضا محبی"
          phone="09123456789"
          avatarUri="https://i.pravatar.cc/150?img=33"
          onEditPress={() => navigation.navigate('editProfile')}
          onCameraPress={() => console.log('change avatar')}
        />

        {/* ② سوئیچ مدل — دست نخورده */}
        <ModelToggleCard
          value={isModelEnabled}
          onToggle={() => setIsModelEnabled(v => !v)}
        />

        {/* ③ علاقه‌مندی‌ها — دست نخورده */}
        <SectionHeader title="علاقه‌مندی‌های من" iconName="bookmark" actionLabel="همه" />
        <FavoritesList
          data={FAVORITES}
          onItemPress={item => console.log('favorite:', item.title)}
        />

        {/* ④ نوبت‌ها — دست نخورده */}
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

        {/* ─────────────────────────────────────────
             ⑤ درخواست‌های من — بخش جدید
             ظاهر کاملاً هماهنگ با بقیه صفحه
        ───────────────────────────────────────── */}
        <SectionHeader
          title="درخواست‌های من"
          iconName="document-text-outline"
          style={{ marginTop: 20 }}
          actionLabel={requests.length > 0 ? `${requests.length} درخواست` : undefined}
        />
        <View style={styles.requestsWrap}>
          {requests.length === 0 ? (
            <View style={styles.emptyRequests}>
              <View style={styles.emptyReqIcon}>
                <View style={styles.emptyReqIconInner} />
              </View>
            </View>
          ) : (
            requests.map(req => (
              <RequestCard
                key={req.id}
                request={req}
                onCancel={cancelRequest}
              />
            ))
          )}
        </View>

        {/* ⑥ دکمه خروج — دست نخورده */}
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
  // ─── استایل‌های بخش درخواست‌ها ───
  requestsWrap: {
    paddingHorizontal: 20,
  },
  emptyRequests: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyReqIcon: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1, borderColor: COLORS.border,
    justifyContent: 'center', alignItems: 'center',
  },
  emptyReqIconInner: {
    width: 20, height: 20, borderRadius: 10,
    backgroundColor: COLORS.border,
  },
  logoutBtn: {
    marginTop: 40,
    marginBottom: 20,
  },
});

export default ProfileScreen;