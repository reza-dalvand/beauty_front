// src/screens/HomeScreen.js
// ====================================================
// ✅ کاملاً کامپوننت‌بندی شده — ساختار گرید حفظ شده
//
// کامپوننت‌های مشترک با سایر صفحات:
//   ← SectionHeader   (profile & explore)
//   ← SearchBar       (explore)
//   ← CategoryTabs    (explore)
//   ← ServiceCard     (explore)
//
// کامپوننت‌های اختصاصی Home:
//   ← HomeHeader
//   ← HomeBanner
// ====================================================
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  useWindowDimensions,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '../theme/appTheme';

// ─── کامپوننت‌های مشترک با سایر صفحات ───────────────
import SectionHeader from '../components/shared/SectionHeader';
import SearchBar from '../components/shared/SearchBar';
import CategoryTabs from '../components/shared/CategoryTabs';
import ServiceCard from '../components/shared/ServiceCard';

// ─── کامپوننت‌های اختصاصی Home ───────────────────────
import HomeHeader from '../components/home/HomeHeader';

// ─── داده‌های تستی ───────────────────────────────────
const CATEGORIES = ['همه', 'ناخن', 'مو', 'پاکسازی', 'لیزر', 'میکاپ'];

const SERVICES_DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  title: ['کاشت ناخن', 'پروتئین مو', 'فیشیال', 'میکاپ مجلسی', 'لیزر', 'رنگ مو'][
    i % 6
  ],
  subtitle: ['سالن رز', 'کلینیک رخ', 'آتلیه آریا'][i % 3],
  image: `https://picsum.photos/seed/${i + 40}/300/300`,
  rating: (4 + (i % 10) * 0.1).toFixed(1),
}));

// ═══════════════════════════════════════════════════
//  MAIN SCREEN
// ═══════════════════════════════════════════════════
const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [query, setQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('همه');

  // ── محاسبه responsive grid ──
  const NUM_COLUMNS = width > 600 ? 4 : 3;
  const SPACING = 10;
  const H_PAD = width * 0.06;
  const CARD_W =
    (width - H_PAD * 2 - SPACING * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

  // ── فیلتر ──
  const filtered = SERVICES_DATA.filter(
    s =>
      (selectedCat === 'همه' || s.title.includes(selectedCat)) &&
      (!query || s.title.includes(query) || s.subtitle?.includes(query)),
  );

  // ── هدر لیست ──
  const ListHeader = () => (
    <>
      <HomeHeader
        notifCount={3}
        onNotifPress={() => console.log('notifications')}
      />

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="جستجوی خدمات، سالن یا متخصص..."
        style={styles.searchBar}
      />

      <CategoryTabs
        categories={CATEGORIES}
        selected={selectedCat}
        onSelect={setSelectedCat}
      />

      <SectionHeader
        title="خدمات"
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
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: H_PAD },
        ]}
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
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  listContent: {
    paddingBottom: 120,
  },
  row: {
    gap: 10,
    marginBottom: 10,
    justifyContent: 'flex-start',
  },
  searchBar: {
    marginBottom: 4,
  },
  sectionHeader: {
    marginTop: 6,
    marginBottom: 12,
  },
});

export default HomeScreen;
