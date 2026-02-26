// src/screens/BusinessDashboardScreen.js
// ====================================================
// داشبورد مدیریت کسب‌وکار
//
// بخش‌ها:
//   ① BusinessHeader    — آواتار + آمار + ویرایش پست
//   ② ScoreDisplay      — امتیاز عددی + توزیع
//   ③ مدیریت خدمات     — ServiceManageCard (تقویم شمسی per service)
//   ④ نظرات مشتریان    — ReviewCard × n
//
// کامپوننت‌های shared که استفاده می‌شه:
//   ← SectionHeader  (shared)
//   ← SearchBar      (shared)
// ====================================================
import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, StatusBar, StyleSheet, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, RADII, SHADOWS } from '../theme/appTheme';
import SectionHeader  from '../components/shared/SectionHeader';
import SearchBar      from '../components/shared/SearchBar';
import BusinessHeader from '../components/business/BusinessHeader';
import ScoreDisplay   from '../components/business/ScoreDisplay';
import ServiceManageCard from '../components/business/ServiceManageCard';
import ReviewCard     from '../components/business/ReviewCard';

// ─── داده‌های تستی کسب‌وکار ───────────────────────────
const MOCK_BUSINESS = {
  name:          'سالن زیبایی رز',
  category:      'ناخن و مژه',
  avatar:        'https://i.pravatar.cc/150?img=47',
  bio:           'ارائه خدمات تخصصی ناخن، مژه و ابرو با بیش از ۸ سال تجربه در تهران',
  isOnline:      true,
  reviewCount:   128,
  totalBookings: 843,
  servicesCount: 6,
  avgScore:      4.3,
  scoreDist:     { 5: 62, 4: 38, 3: 18, 2: 7, 1: 3 },
};

const MOCK_SERVICES = [
  { id: 's1', name: 'کاشت ناخن ژل',    price: 350000, duration: 90,  image: 'https://picsum.photos/seed/s1/200/200', score: 4.6, bookingCount: 214, isActive: true,  scheduledDays: [] },
  { id: 's2', name: 'طراحی ناخن',       price: 180000, duration: 60,  image: 'https://picsum.photos/seed/s2/200/200', score: 4.4, bookingCount: 178, isActive: true,  scheduledDays: [] },
  { id: 's3', name: 'کاشت مژه',         price: 420000, duration: 120, image: 'https://picsum.photos/seed/s3/200/200', score: 4.8, bookingCount: 156, isActive: true,  scheduledDays: [] },
  { id: 's4', name: 'اصلاح ابرو',       price: 80000,  duration: 30,  image: 'https://picsum.photos/seed/s4/200/200', score: 4.1, bookingCount: 203, isActive: false, scheduledDays: [] },
  { id: 's5', name: 'لیفت مژه',         price: 280000, duration: 75,  image: 'https://picsum.photos/seed/s5/200/200', score: 4.5, bookingCount: 92,  isActive: true,  scheduledDays: [] },
];

const MOCK_REVIEWS = [
  { id: 'r1', userName: 'نیلوفر احمدی',  avatar: 'https://i.pravatar.cc/60?img=5',  score: 5.0, serviceName: 'کاشت ناخن ژل',  comment: 'کار عالی بود، رضایت کامل دارم. حتماً دوباره مراجعه می‌کنم.', date: '۱۴۰۳/۱۱/۱۵' },
  { id: 'r2', userName: 'مهسا رضایی',    avatar: 'https://i.pravatar.cc/60?img=9',  score: 4.0, serviceName: 'کاشت مژه',       comment: 'خوب بود ولی کمی دیر شد. کیفیت کار خوب بود.', date: '۱۴۰۳/۱۱/۱۰' },
  { id: 'r3', userName: 'زهرا محمدی',    avatar: 'https://i.pravatar.cc/60?img=16', score: 5.0, serviceName: 'طراحی ناخن',     comment: 'طرح دقیقاً همان چیزی بود که می‌خواستم. ممنونم!', date: '۱۴۰۳/۱۱/۰۵' },
  { id: 'r4', userName: 'فاطمه کریمی',   avatar: 'https://i.pravatar.cc/60?img=20', score: 3.0, serviceName: 'اصلاح ابرو',     comment: 'متوسط بود. انتظار بیشتری داشتم.', date: '۱۴۰۳/۱۰/۲۸' },
  { id: 'r5', userName: 'سارا علوی',     avatar: 'https://i.pravatar.cc/60?img=25', score: 5.0, serviceName: 'لیفت مژه',       comment: 'بهترین لیفت مژه‌ای که تا حالا داشتم. عالی بود.', date: '۱۴۰۳/۱۰/۲۰' },
];

// ─── تب سوئیچر ────────────────────────────────────
const TABS = [
  { id: 'services', label: 'خدمات',       icon: 'grid-outline' },
  { id: 'reviews',  label: 'نظرات',        icon: 'chatbubbles-outline' },
];

const TabSwitch = ({ active, onChange }) => (
  <View style={ts.wrap}>
    {TABS.map(t => (
      <TouchableOpacity
        key={t.id}
        style={[ts.btn, active === t.id && ts.btnOn]}
        onPress={() => onChange(t.id)}
        activeOpacity={0.8}>
        <Icon name={t.icon} size={15} color={active === t.id ? COLORS.background : COLORS.textSub} />
        <Text style={[ts.txt, active === t.id && ts.txtOn]}>{t.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
const ts = StyleSheet.create({
  wrap:  {
    flexDirection: 'row', marginHorizontal: 20, marginBottom: 16,
    backgroundColor: COLORS.surface, borderRadius: RADII.round,
    padding: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  btn:   { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 9, borderRadius: RADII.round, gap: 6 },
  btnOn: { backgroundColor: COLORS.gold, ...SHADOWS.goldButton },
  txt:   { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular },
  txtOn: { color: COLORS.background, fontFamily: FONTS.bold },
});

// ════════════════════════════════════════════════════
//  MAIN SCREEN
// ════════════════════════════════════════════════════
const BusinessDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [services, setServices] = useState(MOCK_SERVICES);
  const [activeTab, setActiveTab] = useState('services');
  const [searchQ, setSearchQ] = useState('');

  // ── آپدیت خدمات ──
  const toggleService = (id) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s));

  const saveSchedule = (id, days) =>
    setServices(prev => prev.map(s => s.id === id ? { ...s, scheduledDays: days } : s));

  // ── فیلتر ──
  const filteredServices = useMemo(() =>
    services.filter(s => !searchQ || s.name.includes(searchQ)),
    [services, searchQ],
  );

  const filteredReviews = useMemo(() =>
    MOCK_REVIEWS.filter(r => !searchQ || r.userName.includes(searchQ) || r.serviceName.includes(searchQ)),
    [searchQ],
  );

  // ── هدر لیست ──
  const ListHeader = () => (
    <>
      {/* هدر صفحه */}
      <View style={st.pageHeader}>
        <Text style={st.pageTitle}>کسب‌وکار من</Text>
        <Icon name="storefront-outline" size={26} color={COLORS.gold} />
      </View>

      {/* اطلاعات کسب‌وکار */}
      <BusinessHeader
        business={MOCK_BUSINESS}
        onEditPress={() => navigation?.navigate('EditPost')}
        onAvatarPress={() => console.log('change avatar')}
      />

      {/* امتیاز کلی */}
      <SectionHeader title="امتیاز کسب‌وکار" iconName="bar-chart-outline" style={{ marginBottom: 12 }} />
      <ScoreDisplay
        avg={MOCK_BUSINESS.avgScore}
        total={MOCK_BUSINESS.reviewCount}
        dist={MOCK_BUSINESS.scoreDist}
      />

      {/* فاصله */}
      <View style={{ height: 24 }} />

      {/* سرچ + تب‌ها */}
      <SearchBar
        value={searchQ}
        onChangeText={setSearchQ}
        placeholder={activeTab === 'services' ? 'جستجو در خدمات...' : 'جستجو در نظرات...'}
        style={{ marginBottom: 12 }}
      />
      <TabSwitch active={activeTab} onChange={(t) => { setActiveTab(t); setSearchQ(''); }} />

      {/* عنوان بخش */}
      <SectionHeader
        title={activeTab === 'services' ? `خدمات (${filteredServices.length})` : `نظرات (${filteredReviews.length})`}
        iconName={activeTab === 'services' ? 'grid-outline' : 'chatbubbles-outline'}
        actionLabel={activeTab === 'services' ? '+ افزودن' : undefined}
        onAction={() => console.log('add service')}
        style={{ marginBottom: 8 }}
      />
    </>
  );

  // ── داده‌های لیست بر اساس تب ──
  const listData = activeTab === 'services' ? filteredServices : filteredReviews;

  return (
    <View style={[st.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={st.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyList tab={activeTab} />}
        renderItem={({ item }) =>
          activeTab === 'services' ? (
            <ServiceManageCard
              service={item}
              onEdit={s => console.log('edit:', s.name)}
              onToggle={toggleService}
              onSaveSchedule={saveSchedule}
            />
          ) : (
            <ReviewCard review={item} />
          )
        }
      />
    </View>
  );
};

const EmptyList = ({ tab }) => (
  <View style={st.empty}>
    <Icon name={tab === 'services' ? 'grid-outline' : 'chatbubbles-outline'} size={48} color={COLORS.border} />
    <Text style={st.emptyTxt}>
      {tab === 'services' ? 'خدماتی یافت نشد' : 'نظری یافت نشد'}
    </Text>
  </View>
);

const st = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: 120 },
  pageHeader:  {
    flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 16, gap: 8,
  },
  pageTitle:   { color: COLORS.textMain, fontSize: 22, fontFamily: FONTS.bold },
  empty:       { alignItems: 'center', paddingTop: 50, gap: 10 },
  emptyTxt:    { color: COLORS.textSub, fontSize: 14, fontFamily: FONTS.regular },
});

export default BusinessDashboardScreen;