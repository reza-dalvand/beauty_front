// src/screens/ExploreScreen.js
// ====================================================
// ✅ کاملاً کامپوننت‌بندی شده
//
// تب‌ها:
//   ① نمونه کارها — گرید اینستاگرامی (PortfolioGrid)
//   ② خدمات تخفیفی — لیست DiscountCard
//
// متخصصین → به ProvidersScreen منتقل شد
// ====================================================
import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StatusBar, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, RADII, SHADOWS } from '../theme/appTheme';

import SectionHeader      from '../components/shared/SectionHeader';
import SearchBar          from '../components/shared/SearchBar';
import CategoryTabs       from '../components/shared/CategoryTabs';
import ExploreFilterModal from '../components/explore/ExploreFilterModal';
import PortfolioGrid      from '../components/explore/PortfolioGrid';
import DiscountCard       from '../components/explore/DiscountCard';

import { DISCOUNT_SERVICES } from '../data/Discountdata';

// ─── دسته‌بندی‌ها ──────────────────────────────────
const CATEGORIES = ['همه', 'ناخن', 'مو', 'پوست', 'لیزر', 'میکاپ', 'ابرو'];

// ─── داده‌های نمونه کارها ─────────────────────────
const PORTFOLIO_DATA = Array.from({ length: 18 }).map((_, i) => ({
  id: `post-${i}`,
  images: Array.from({ length: (i % 3) + 1 }).map((_, j) =>
    `https://picsum.photos/seed/${i * 10 + j}/400/400`
  ),
  businessName: ['سالن رز', 'کلینیک رخ', 'آتلیه آریا', 'مرکز لیلا'][i % 4],
  businessAvatar: `https://i.pravatar.cc/80?img=${(i % 4) + 20}`,
  category: ['ناخن', 'پوست', 'مو', 'میکاپ'][i % 4],
  likes: Math.floor(Math.random() * 500) + 50,
  caption: ['کاشت ناخن ژل با طرح فرنچ 💅', 'فیشیال تخصصی با دستگاه RF ✨',
            'کراتین برزیلی نتیجه فوق‌العاده 🌟', 'میکاپ عروس افتخار ما 👰'][i % 4],
}));

// ─── سوئیچر تب ───────────────────────────────────
const ViewToggle = ({ activeView, onToggle }) => (
  <View style={toggleStyles.container}>
    <TouchableOpacity
      style={[toggleStyles.btn, activeView === 'portfolio' && toggleStyles.btnActive]}
      onPress={() => onToggle('portfolio')}
      activeOpacity={0.8}>
      <Icon
        name="images-outline"
        size={16}
        color={activeView === 'portfolio' ? COLORS.background : COLORS.textSub}
      />
      <Text style={[toggleStyles.text, activeView === 'portfolio' && toggleStyles.textActive]}>
        نمونه کارها
      </Text>
    </TouchableOpacity>

    <TouchableOpacity
      style={[toggleStyles.btn, activeView === 'discounts' && toggleStyles.btnActive]}
      onPress={() => onToggle('discounts')}
      activeOpacity={0.8}>
      <Icon
        name="pricetag-outline"
        size={16}
        color={activeView === 'discounts' ? COLORS.background : COLORS.textSub}
      />
      <Text style={[toggleStyles.text, activeView === 'discounts' && toggleStyles.textActive]}>
        خدمات تخفیفی
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
  const [query, setQuery]               = useState('');
  const [selectedCat, setSelectedCat]   = useState('همه');
  const [activeView, setActiveView]     = useState('portfolio');
  const [filterVisible, setFilterVisible] = useState(false);

  const filteredPortfolio = useMemo(() =>
    PORTFOLIO_DATA.filter(p =>
      (!query || p.businessName.includes(query) || p.caption?.includes(query)) &&
      (selectedCat === 'همه' || p.category === selectedCat)
    ), [query, selectedCat]);

  const filteredDiscounts = useMemo(() =>
    DISCOUNT_SERVICES.filter(d =>
      (!query || d.title.includes(query) || d.businessName.includes(query)) &&
      (selectedCat === 'همه' || d.category === selectedCat)
    ), [query, selectedCat]);

  const ListHeader = () => (
    <>
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>اکسپلور</Text>
        <Icon name="compass-outline" size={26} color={COLORS.gold} />
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder={activeView === 'discounts' ? 'جستجوی خدمات تخفیفی...' : 'جستجوی نمونه کار...'}
        onFilterPress={() => setFilterVisible(true)}
      />

      <ViewToggle activeView={activeView} onToggle={setActiveView} />

      <CategoryTabs
        categories={CATEGORIES}
        selected={selectedCat}
        onSelect={setSelectedCat}
      />

      <SectionHeader
        title={activeView === 'discounts' ? 'خدمات تخفیفی' : 'نمونه کارها'}
        iconName={activeView === 'discounts' ? 'pricetag-outline' : 'images-outline'}
        actionLabel="همه"
        style={styles.sectionHeaderStyle}
      />
    </>
  );

  // ── تب نمونه کارها ──
  if (activeView === 'portfolio') {
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
          onApply={f => console.log('filters:', f)}
        />
      </View>
    );
  }

  // ── تب خدمات تخفیفی ──
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />
      <FlatList
        data={filteredDiscounts}
        keyExtractor={item => item.id}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState query={query} />}
        renderItem={({ item }) => (
          <DiscountCard
            item={item}
            onPress={d => console.log('discount:', d.title)}
          />
        )}
      />
      <ExploreFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={f => console.log('filters:', f)}
      />
    </View>
  );
};

const EmptyState = ({ query }) => (
  <View style={styles.emptyState}>
    <Icon name="search-outline" size={48} color={COLORS.border} />
    <Text style={styles.emptyTitle}>
      {query ? `نتیجه‌ای برای «${query}» پیدا نشد` : 'موردی برای نمایش وجود ندارد'}
    </Text>
    <Text style={styles.emptySubtitle}>دسته‌بندی یا فیلتر دیگری را امتحان کنید</Text>
  </View>
);

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: COLORS.background },
  listContent:       { paddingBottom: 120 },
  pageHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  pageTitle:         { color: COLORS.textMain, fontSize: 22, fontFamily: FONTS.bold },
  sectionHeaderStyle:{ marginTop: 4 },
  emptyState:        { alignItems: 'center', paddingTop: 60, gap: 10, paddingHorizontal: 40 },
  emptyTitle:        { color: COLORS.textSub, fontSize: 14, fontFamily: FONTS.regular, textAlign: 'center' },
  emptySubtitle:     { color: COLORS.border, fontSize: 12, fontFamily: FONTS.regular, textAlign: 'center' },
});

export default ExploreScreen;