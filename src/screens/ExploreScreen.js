// src/screens/ExploreScreen.js
// ====================================================
// ✅ کاملاً کامپوننت‌بندی شده
// از کامپوننت‌های مشترک با ProfileScreen استفاده می‌کند:
//   - SectionHeader
// از کامپوننت‌های shared استفاده می‌کند:
//   - SearchBar, CategoryTabs
// از کامپوننت‌های اختصاصی Explore استفاده می‌کند:
//   - ProviderCard, ExploreFilterModal, PortfolioGrid
// ====================================================
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, RADII, SHADOWS } from '../theme/appTheme';

// ─── کامپوننت‌های مشترک با سایر صفحات ───────────────
import SectionHeader from '../components/shared/SectionHeader';

// ─── کامپوننت‌های shared ──────────────────────────────
import SearchBar from '../components/shared/SearchBar';
import CategoryTabs from '../components/shared/CategoryTabs';

// ─── کامپوننت‌های اختصاصی Explore ────────────────────
import ProviderCard from '../components/explore/ProviderCard';
import ExploreFilterModal from '../components/explore/ExploreFilterModal';
import PortfolioGrid from '../components/explore/PortfolioGrid';

// ─── داده‌های تستی ───────────────────────────────────
const CATEGORIES = ['همه', 'ناخن', 'مو', 'پوست', 'لیزر', 'میکاپ', 'مژه'];

const PROVIDERS_DATA = [
  {
    id: 'p1',
    name: 'سالن زیبایی رز',
    category: 'ناخن و مژه',
    rating: '4.9',
    reviewCount: 128,
    distance: '۱.۲ کیلومتر',
    avatar: 'https://i.pravatar.cc/150?img=47',
    tags: ['کاشت ناخن', 'مژه', 'ابرو'],
    isOnline: true,
  },
  {
    id: 'p2',
    name: 'کلینیک پوست رخ',
    category: 'پوست و لیزر',
    rating: '4.7',
    reviewCount: 86,
    distance: '۲.۵ کیلومتر',
    avatar: 'https://i.pravatar.cc/150?img=32',
    tags: ['فیشیال', 'لیزر موهای زائد', 'جوانسازی'],
    isOnline: true,
  },
  {
    id: 'p3',
    name: 'آتلیه مو آریا',
    category: 'مو',
    rating: '4.5',
    reviewCount: 54,
    distance: '۳.۸ کیلومتر',
    avatar: 'https://i.pravatar.cc/150?img=15',
    tags: ['کراتین', 'رنگ مو', 'کوتاهی'],
    isOnline: false,
  },
  {
    id: 'p4',
    name: 'مرکز میکاپ لیلا',
    category: 'میکاپ',
    rating: '4.8',
    reviewCount: 201,
    distance: '۰.۸ کیلومتر',
    avatar: 'https://i.pravatar.cc/150?img=23',
    tags: ['عروس', 'مجلسی', 'روزانه'],
    isOnline: true,
  },
];

// ─── داده‌های تستی نمونه کارها ───────────────────────
const PORTFOLIO_DATA = Array.from({ length: 18 }).map((_, i) => ({
  id: `post-${i}`,
  // هر پست ۱ تا ۳ عکس داره
  images: Array.from({ length: (i % 3) + 1 }).map(
    (_, j) => `https://picsum.photos/seed/${i * 10 + j}/400/400`,
  ),
  businessName: ['سالن رز', 'کلینیک رخ', 'آتلیه آریا', 'مرکز لیلا'][i % 4],
  businessAvatar: `https://i.pravatar.cc/80?img=${(i % 4) + 20}`,
  category: ['ناخن', 'پوست', 'مو', 'میکاپ'][i % 4],
  likes: Math.floor(Math.random() * 500) + 50,
  caption: [
    'کاشت ناخن ژل با طرح فرنچ 💅',
    'فیشیال تخصصی با دستگاه RF ✨',
    'کراتین برزیلی نتیجه فوق‌العاده 🌟',
    'میکاپ عروس افتخار ما 👰',
  ][i % 4],
}));

// ─── تب سوئیچر بالای صفحه ────────────────────────────
const ViewToggle = ({ activeView, onToggle }) => (
  <View style={toggleStyles.container}>
    <TouchableOpacity
      style={[
        toggleStyles.btn,
        activeView === 'portfolio' && toggleStyles.btnActive,
      ]}
      onPress={() => onToggle('portfolio')}
      activeOpacity={0.8}>
      <Icon
        name="images-outline"
        size={16}
        color={activeView === 'portfolio' ? COLORS.background : COLORS.textSub}
      />
      <Text
        style={[
          toggleStyles.text,
          activeView === 'portfolio' && toggleStyles.textActive,
        ]}>
        نمونه کارها
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[
        toggleStyles.btn,
        activeView === 'providers' && toggleStyles.btnActive,
      ]}
      onPress={() => onToggle('providers')}
      activeOpacity={0.8}>
      <Icon
        name="storefront-outline"
        size={16}
        color={activeView === 'providers' ? COLORS.background : COLORS.textSub}
      />
      <Text
        style={[
          toggleStyles.text,
          activeView === 'providers' && toggleStyles.textActive,
        ]}>
        متخصصین
      </Text>
    </TouchableOpacity>
  </View>
);

const toggleStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.round,
    padding: 4,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: RADII.round,
    gap: 6,
  },
  btnActive: {
    backgroundColor: COLORS.gold,
    ...SHADOWS.goldButton,
  },
  text: {
    color: COLORS.textSub,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  textActive: {
    color: COLORS.background,
    fontFamily: FONTS.bold,
  },
});

// ═══════════════════════════════════════════════════
//  MAIN SCREEN
// ═══════════════════════════════════════════════════
const ExploreScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('همه');
  const [activeView, setActiveView] = useState('portfolio');
  const [filterVisible, setFilterVisible] = useState(false);

  // ── فیلتر متخصصین ──
  const filteredProviders = useMemo(
    () =>
      PROVIDERS_DATA.filter(
        p =>
          (!query ||
            p.name.includes(query) ||
            p.tags.some(t => t.includes(query))) &&
          (selectedCat === 'همه' || p.category.includes(selectedCat)),
      ),
    [query, selectedCat],
  );

  // ── فیلتر نمونه کارها ──
  const filteredPortfolio = useMemo(
    () =>
      PORTFOLIO_DATA.filter(
        p =>
          (!query ||
            p.businessName.includes(query) ||
            p.caption?.includes(query)) &&
          (selectedCat === 'همه' || p.category === selectedCat),
      ),
    [query, selectedCat],
  );

  // ── هدر مشترک هر دو حالت ──
  const ListHeader = () => (
    <>
      {/* سرتیتر صفحه */}
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>اکسپلور</Text>
        <Icon name="compass-outline" size={26} color={COLORS.gold} />
      </View>

      {/* سرچ با دکمه فیلتر */}
      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="جستجوی متخصص یا نمونه کار..."
        onFilterPress={() => setFilterVisible(true)}
      />

      {/* سوئیچ متخصصین / نمونه کارها */}
      <ViewToggle activeView={activeView} onToggle={setActiveView} />

      {/* تب‌های دسته‌بندی */}
      <CategoryTabs
        categories={CATEGORIES}
        selected={selectedCat}
        onSelect={setSelectedCat}
      />

      {/* عنوان بخش */}
      <SectionHeader
        title={activeView === 'providers' ? 'متخصصین' : 'نمونه کارها'}
        iconName={
          activeView === 'providers' ? 'people-outline' : 'images-outline'
        }
        actionLabel="همه"
        style={styles.sectionHeaderStyle}
      />
    </>
  );

  // ── حالت متخصصین ──
  if (activeView === 'providers') {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <StatusBar
          backgroundColor={COLORS.background}
          barStyle="light-content"
        />
        <FlatList
          data={filteredProviders}
          keyExtractor={item => item.id}
          ListHeaderComponent={ListHeader}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<EmptyState query={query} />}
          renderItem={({ item }) => (
            <ProviderCard
              item={item}
              onPress={p => console.log('provider:', p.name)}
              onBookPress={p => console.log('book:', p.name)}
            />
          )}
        />
        <ExploreFilterModal
          visible={filterVisible}
          onClose={() => setFilterVisible(false)}
          onApply={filters => console.log('filters:', filters)}
        />
      </View>
    );
  }

  // ── حالت نمونه کارها (گرید اینستاگرامی) ──
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <PortfolioGrid
        posts={filteredPortfolio}
        ListHeaderComponent={<ListHeader />}
      />
      <ExploreFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={filters => console.log('filters:', filters)}
      />
    </View>
  );
};

// ── کامپوننت خالی بودن نتایج ──
const EmptyState = ({ query }) => (
  <View style={styles.emptyState}>
    <Icon name="search-outline" size={48} color={COLORS.border} />
    <Text style={styles.emptyTitle}>
      {query
        ? `نتیجه‌ای برای "${query}" پیدا نشد`
        : 'موردی برای نمایش وجود ندارد'}
    </Text>
    <Text style={styles.emptySubtitle}>
      دسته‌بندی یا فیلتر دیگری را امتحان کنید
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 120,
  },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  pageTitle: {
    color: COLORS.textMain,
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  sectionHeaderStyle: {
    marginTop: 4,
  },
  emptyState: {
    alignItems: 'center',
    paddingTop: 60,
    gap: 10,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    color: COLORS.textSub,
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
  emptySubtitle: {
    color: COLORS.border,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
});

export default ExploreScreen;
