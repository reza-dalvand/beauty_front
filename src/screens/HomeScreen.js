// src/screens/HomeScreen.js
// ====================================================
// ✅ کاملاً کامپوننت‌بندی شده — ساختار گرید حفظ شده
//
// کامپوننت‌های مشترک با سایر صفحات:
//   ← SectionHeader   (profile & explore)
//   ← SearchBar       (explore)
//   ← CategoryTabs    (explore)  — کلیک → ProvidersScreen
//   ← ServiceCard     (explore)
//
// کامپوننت‌های اختصاصی Home:
//   ← HomeHeader
//   ← HomeBanner
// ====================================================
import React, { useState } from 'react';
import {
  View, Text, StyleSheet, StatusBar, useWindowDimensions,
  FlatList, TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, RADII, SHADOWS } from '../theme/appTheme';

import SectionHeader from '../components/shared/SectionHeader';
import SearchBar     from '../components/shared/SearchBar';
import ServiceCard   from '../components/shared/ServiceCard';
import HomeHeader    from '../components/home/HomeHeader';
import HomeBanner    from '../components/home/HomeBanner';

// ─── دسته‌بندی‌ها با آیکون ── navigate به ProvidersScreen ──
const CATEGORIES = [
  { id: 'ناخن',    label: 'ناخن',        icon: 'color-palette-outline' },
  { id: 'مو',      label: 'مو',          icon: 'cut-outline' },
  { id: 'پوست',    label: 'پوست',        icon: 'sparkles-outline' },
  { id: 'لیزر',    label: 'لیزر',        icon: 'flash-outline' },
  { id: 'میکاپ',   label: 'میکاپ',       icon: 'brush-outline' },
  { id: 'پاکسازی', label: 'پاکسازی',     icon: 'water-outline' },
  { id: 'ابرو',    label: 'ابرو و مژه',  icon: 'eye-outline' },
];

const SERVICES_DATA = Array.from({ length: 9 }).map((_, i) => ({
  id: i.toString(),
  title: ['کاشت ناخن', 'پروتئین مو', 'فیشیال', 'میکاپ مجلسی', 'لیزر', 'رنگ مو'][i % 6],
  subtitle: ['سالن رز', 'کلینیک رخ', 'آتلیه آریا'][i % 3],
  image: `https://picsum.photos/seed/${i + 40}/300/300`,
  rating: (4 + (i % 10) * 0.1).toFixed(1),
}));

// ─── گرید دسته‌بندی‌ها ────────────────────────────
const CategoryGrid = ({ onCategoryPress }) => (
  <View style={catStyles.container}>
    {CATEGORIES.map(cat => (
      <TouchableOpacity
        key={cat.id}
        style={catStyles.item}
        onPress={() => onCategoryPress(cat)}
        activeOpacity={0.75}>
        <View style={catStyles.iconWrap}>
          <Icon name={cat.icon} size={24} color={COLORS.gold} />
        </View>
        <Text style={catStyles.label} numberOfLines={1}>{cat.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const catStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginBottom: 20,
    gap: 10,
    justifyContent: 'flex-end',
  },
  item: {
    width: 72,
    alignItems: 'center',
    gap: 6,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
    ...SHADOWS.card,
  },
  label: {
    color: COLORS.textSub,
    fontSize: 10,
    fontFamily: FONTS.regular,
    textAlign: 'center',
  },
});

// ═══════════════════════════════════════════════════
//  MAIN SCREEN
// ═══════════════════════════════════════════════════
const HomeScreen = ({ navigation }) => {
  const insets    = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');

  const NUM_COLUMNS = width > 600 ? 4 : 3;
  const SPACING     = 10;
  const H_PAD       = width * 0.06;
  const CARD_W      = (width - H_PAD * 2 - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  const filtered = SERVICES_DATA.filter(s =>
    !query || s.title.includes(query) || s.subtitle?.includes(query)
  );

  // کلیک روی category → ProvidersScreen با فیلتر آن دسته
  const handleCategoryPress = (cat) => {
    navigation.navigate('Providers', { category: cat.id });
  };

  const ListHeader = () => (
    <>
      <HomeHeader
        notifCount={3}
        onNotifPress={() => console.log('notifications')}
      />

      {/* <HomeBanner
        onBannerPress={b => console.log('banner:', b.title)}
      /> */}

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="جستجوی خدمات، سالن یا متخصص..."
        style={styles.searchBar}
      />

      {/* دسته‌بندی‌ها — هر کدام به ProvidersScreen می‌برند */}
      <SectionHeader
        title="دسته‌بندی‌ها"
        iconName="grid-outline"
        style={styles.sectionHeader}
      />
      <CategoryGrid onCategoryPress={handleCategoryPress} />

      <SectionHeader
        title="خدمات پیشنهادی"
        iconName="sparkles-outline"
        actionLabel="همه"
        style={styles.sectionHeader}
      />
    </>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar backgroundColor={COLORS.background} barStyle="light-content" />

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={NUM_COLUMNS}
        key={`grid-${NUM_COLUMNS}`}
        ListHeaderComponent={ListHeader}
        columnWrapperStyle={styles.row}
        contentContainerStyle={[styles.listContent, { paddingHorizontal: H_PAD }]}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ServiceCard
            item={item}
            cardWidth={CARD_W}
            onPress={s => console.log('service:', s.title)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: 120 },
  row:         { gap: 10, marginBottom: 10, justifyContent: 'flex-start' },
  searchBar:   { marginBottom: 4 },
  sectionHeader: { marginTop: 6, marginBottom: 12 },
});

export default HomeScreen;