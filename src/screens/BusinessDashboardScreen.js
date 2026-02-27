// src/screens/BusinessDashboardScreen.js
// ====================================================
// داشبورد مدیریت کسب‌وکار
// ✅ fix1: دکمه ویرایش پست → navigate به CreatePost (edit mode)
// ✅ fix2: نمایش اعضای تیم از داده‌های ثبت آگهی
// ✅ fix3: تقویم با مدت نوبت + انتخاب ساعت
// ✅ fix4: دکمه افزودن خدمت → AddServiceModal
// ====================================================
import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, StatusBar, StyleSheet,
  TouchableOpacity, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, RADII, SHADOWS } from '../theme/appTheme';
import SectionHeader     from '../components/shared/SectionHeader';
import SearchBar         from '../components/shared/SearchBar';
import BusinessHeader    from '../components/business/BusinessHeader';
import ScoreDisplay      from '../components/business/ScoreDisplay';
import ServiceManageCard from '../components/business/ServiceManageCard';
import ReviewCard        from '../components/business/ReviewCard';
import AddServiceModal   from '../components/business/AddServiceModal';

// ─── داده‌های تستی ─────────────────────────────────
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

// ✅ fix2: اعضای تیم — در واقعیت از state/context/AsyncStorage می‌آد
// اینجا به صورت mock نمایش داده می‌شه
const MOCK_TEAM = [
  { id: 't1', name: 'مریم احمدی',  role: 'متخصص ناخن',   photo: 'https://i.pravatar.cc/80?img=5'  },
  { id: 't2', name: 'سارا رضایی',  role: 'متخصص مژه',    photo: 'https://i.pravatar.cc/80?img=9'  },
  { id: 't3', name: 'نیلوفر کریمی', role: 'پذیرش',        photo: 'https://i.pravatar.cc/80?img=12' },
];

const MOCK_SERVICES_INITIAL = [
  { id: 's1', name: 'کاشت ناخن ژل',  price: 350000, duration: 90,  image: 'https://picsum.photos/seed/s1/200/200', score: 4.6, bookingCount: 214, isActive: true,  schedule: {} },
  { id: 's2', name: 'طراحی ناخن',     price: 180000, duration: 60,  image: 'https://picsum.photos/seed/s2/200/200', score: 4.4, bookingCount: 178, isActive: true,  schedule: {} },
  { id: 's3', name: 'کاشت مژه',       price: 420000, duration: 120, image: 'https://picsum.photos/seed/s3/200/200', score: 4.8, bookingCount: 156, isActive: true,  schedule: {} },
  { id: 's4', name: 'اصلاح ابرو',     price: 80000,  duration: 30,  image: 'https://picsum.photos/seed/s4/200/200', score: 4.1, bookingCount: 203, isActive: false, schedule: {} },
  { id: 's5', name: 'لیفت مژه',       price: 280000, duration: 75,  image: 'https://picsum.photos/seed/s5/200/200', score: 4.5, bookingCount: 92,  isActive: true,  schedule: {} },
];

const MOCK_REVIEWS = [
  { id: 'r1', userName: 'نیلوفر احمدی', avatar: 'https://i.pravatar.cc/60?img=5',  score: 5.0, serviceName: 'کاشت ناخن ژل', comment: 'کار عالی بود، رضایت کامل دارم. حتماً دوباره مراجعه می‌کنم.', date: '۱۴۰۳/۱۱/۱۵' },
  { id: 'r2', userName: 'مهسا رضایی',   avatar: 'https://i.pravatar.cc/60?img=9',  score: 4.0, serviceName: 'کاشت مژه',     comment: 'خوب بود ولی کمی دیر شد. کیفیت کار خوب بود.', date: '۱۴۰۳/۱۱/۱۰' },
  { id: 'r3', userName: 'زهرا محمدی',   avatar: 'https://i.pravatar.cc/60?img=16', score: 5.0, serviceName: 'طراحی ناخن',   comment: 'طرح دقیقاً همان چیزی بود که می‌خواستم. ممنونم!', date: '۱۴۰۳/۱۱/۰۵' },
  { id: 'r4', userName: 'فاطمه کریمی',  avatar: 'https://i.pravatar.cc/60?img=20', score: 3.0, serviceName: 'اصلاح ابرو',   comment: 'متوسط بود. انتظار بیشتری داشتم.', date: '۱۴۰۳/۱۰/۲۸' },
  { id: 'r5', userName: 'سارا علوی',    avatar: 'https://i.pravatar.cc/60?img=25', score: 5.0, serviceName: 'لیفت مژه',     comment: 'بهترین لیفت مژه‌ای که تا حالا داشتم. عالی بود.', date: '۱۴۰۳/۱۰/۲۰' },
];

// ─── تب‌ها ─────────────────────────────────────────
const TABS = [
  { id: 'services', label: 'خدمات',  icon: 'grid-outline' },
  { id: 'team',     label: 'تیم',    icon: 'people-outline' },
  { id: 'reviews',  label: 'نظرات',  icon: 'chatbubbles-outline' },
];

const TabSwitch = ({ active, onChange }) => (
  <View style={ts.wrap}>
    {TABS.map(t => (
      <TouchableOpacity key={t.id} style={[ts.btn, active===t.id && ts.btnOn]}
        onPress={() => onChange(t.id)} activeOpacity={0.8}>
        <Icon name={t.icon} size={15} color={active===t.id ? COLORS.background : COLORS.textSub} />
        <Text style={[ts.txt, active===t.id && ts.txtOn]}>{t.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);
const ts = StyleSheet.create({
  wrap:  { flexDirection: 'row', marginHorizontal: 20, marginBottom: 16, backgroundColor: COLORS.surface, borderRadius: RADII.round, padding: 4, borderWidth: 1, borderColor: COLORS.border },
  btn:   { flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 9, borderRadius: RADII.round, gap: 6 },
  btnOn: { backgroundColor: COLORS.gold, ...SHADOWS.goldButton },
  txt:   { color: COLORS.textSub, fontSize: 13, fontFamily: FONTS.regular },
  txtOn: { color: COLORS.background, fontFamily: FONTS.bold },
});

// ─── کارت عضو تیم ──────────────────────────────────
const TeamMemberCard = ({ member }) => (
  <View style={tm.card}>
    {member.photo
      ? <Image source={{ uri: member.photo }} style={tm.photo} />
      : <View style={[tm.photo, { backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center' }]}>
          <Icon name="person-outline" size={24} color={COLORS.gold} />
        </View>
    }
    <Text style={tm.name} numberOfLines={1}>{member.name || '—'}</Text>
    {!!member.role && <Text style={tm.role} numberOfLines={1}>{member.role}</Text>}
  </View>
);
const tm = StyleSheet.create({
  card:  { alignItems: 'center', width: 90, gap: 6 },
  photo: { width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: 'rgba(212,175,55,0.4)' },
  name:  { color: COLORS.textMain, fontSize: 12, fontFamily: FONTS.bold, textAlign: 'center' },
  role:  { color: COLORS.textSub, fontSize: 10, fontFamily: FONTS.regular, textAlign: 'center' },
});

// ════════════════════════════════════════════════════
//  MAIN SCREEN
// ════════════════════════════════════════════════════
const BusinessDashboardScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  const [services,  setServices]  = useState(MOCK_SERVICES_INITIAL);
  const [activeTab, setActiveTab] = useState('services');
  const [searchQ,   setSearchQ]   = useState('');
  const [addModal,  setAddModal]  = useState(false); // ✅ fix4

  // ── آپدیت خدمات ──
  const toggleService = (id) =>
    setServices(prev => prev.map(s => s.id===id ? {...s, isActive: !s.isActive} : s));

  // ✅ fix3: ذخیره schedule + duration
  const saveSchedule = (id, schedule, duration) =>
    setServices(prev => prev.map(s => s.id===id ? {...s, schedule, duration} : s));

  // ✅ fix4: افزودن خدمت جدید
  const addService = (service) =>
    setServices(prev => [...prev, service]);

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
      <View style={st.pageHeader}>
        <Text style={st.pageTitle}>کسب‌وکار من</Text>
        <Icon name="storefront-outline" size={26} color={COLORS.gold} />
      </View>

      <BusinessHeader
        business={MOCK_BUSINESS}
        // ✅ fix1: navigate به CreatePostScreen با edit mode
        onEditPress={() => navigation?.navigate('ساخت آگهی', { editMode: true })}
        onAvatarPress={() => {}}
      />

      <SectionHeader title="امتیاز کسب‌وکار" iconName="bar-chart-outline" style={{ marginBottom: 12 }} />
      <ScoreDisplay avg={MOCK_BUSINESS.avgScore} total={MOCK_BUSINESS.reviewCount} dist={MOCK_BUSINESS.scoreDist} />

      <View style={{ height: 24 }} />

      <SearchBar
        value={searchQ}
        onChangeText={setSearchQ}
        placeholder={activeTab==='services' ? 'جستجو در خدمات...' : activeTab==='team' ? 'جستجو در تیم...' : 'جستجو در نظرات...'}
        style={{ marginBottom: 12 }}
      />
      <TabSwitch active={activeTab} onChange={(t) => { setActiveTab(t); setSearchQ(''); }} />

      {/* عنوان بخش + دکمه افزودن */}
      <SectionHeader
        title={
          activeTab==='services' ? `خدمات (${filteredServices.length})` :
          activeTab==='team'     ? `اعضای تیم (${MOCK_TEAM.length})` :
          `نظرات (${filteredReviews.length})`
        }
        iconName={activeTab==='services' ? 'grid-outline' : activeTab==='team' ? 'people-outline' : 'chatbubbles-outline'}
        // ✅ fix4: دکمه افزودن فقط در تب خدمات
        actionLabel={activeTab==='services' ? '+ افزودن' : undefined}
        onAction={() => setAddModal(true)}
        style={{ marginBottom: 8 }}
      />

      {/* ✅ fix2: نمایش تیم به صورت inline در بالای لیست تیم */}
      {activeTab==='team' && (
        <TeamSection team={MOCK_TEAM} />
      )}
    </>
  );

  const listData = activeTab==='services' ? filteredServices : activeTab==='reviews' ? filteredReviews : [];

  return (
    <View style={[st.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      {/* ✅ fix4: مودال افزودن خدمت */}
      <AddServiceModal
        visible={addModal}
        onClose={() => setAddModal(false)}
        onSave={addService}
      />

      <FlatList
        data={listData}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={st.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={activeTab !== 'team' ? <EmptyList tab={activeTab} /> : null}
        renderItem={({ item }) =>
          activeTab==='services' ? (
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

// ── سکشن تیم ──────────────────────────────────────
const TeamSection = ({ team }) => {
  if (!team || team.length === 0) {
    return (
      <View style={st.emptyTeam}>
        <Icon name="people-outline" size={40} color={COLORS.border} />
        <Text style={st.emptyTeamTxt}>عضو تیمی ثبت نشده</Text>
        <Text style={st.emptyTeamSub}>هنگام ثبت آگهی اعضای تیم را اضافه کنید</Text>
      </View>
    );
  }
  return (
    <View style={st.teamGrid}>
      {team.map(member => <TeamMemberCard key={member.id} member={member} />)}
    </View>
  );
};

const EmptyList = ({ tab }) => (
  <View style={st.empty}>
    <Icon name={tab==='services' ? 'grid-outline' : 'chatbubbles-outline'} size={48} color={COLORS.border} />
    <Text style={st.emptyTxt}>{tab==='services' ? 'خدماتی یافت نشد' : 'نظری یافت نشد'}</Text>
  </View>
);

const st = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: 120 },
  pageHeader:  { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingHorizontal: 20, paddingBottom: 16, gap: 8 },
  pageTitle:   { color: COLORS.textMain, fontSize: 22, fontFamily: FONTS.bold },
  empty:       { alignItems: 'center', paddingTop: 50, gap: 10 },
  emptyTxt:    { color: COLORS.textSub, fontSize: 14, fontFamily: FONTS.regular },
  teamGrid: {
    flexDirection: 'row-reverse', flexWrap: 'wrap',
    gap: 16, paddingHorizontal: 20, paddingBottom: 20,
    justifyContent: 'flex-end',
  },
  emptyTeam:    { alignItems: 'center', paddingVertical: 40, gap: 10 },
  emptyTeamTxt: { color: COLORS.textSub, fontSize: 14, fontFamily: FONTS.bold },
  emptyTeamSub: { color: COLORS.border, fontSize: 12, fontFamily: FONTS.regular },
});

export default BusinessDashboardScreen;