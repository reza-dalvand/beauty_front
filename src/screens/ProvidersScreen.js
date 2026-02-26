// src/screens/ProvidersScreen.js
// ====================================================
// صفحه مستقل متخصصین — طراحی کاملاً مطابق ExploreScreen
// از HomeScreen با route.params.category فراخوانی می‌شه
//
// کامپوننت‌های استفاده‌شده:
//   ← ProviderCard    (explore — بدون تغییر)
//   ← SearchBar       (shared)
//   ← CategoryTabs    (shared)
//   ← SectionHeader   (shared)
//   ← ExploreFilterModal (explore)
// ====================================================
import React, { useState, useMemo } from 'react';
import {
  View, Text, FlatList, TouchableOpacity,
  StatusBar, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

import { COLORS, FONTS, RADII } from '../theme/appTheme';

import SearchBar          from '../components/shared/SearchBar';
import CategoryTabs       from '../components/shared/CategoryTabs';
import SectionHeader      from '../components/shared/SectionHeader';
import ProviderCard       from '../components/explore/ProviderCard';
import ExploreFilterModal from '../components/explore/ExploreFilterModal';

import { ALL_PROVIDERS, PROVIDER_CATEGORIES } from '../data/providersData';

// ═══════════════════════════════════════════════════
//  MAIN SCREEN
// ═══════════════════════════════════════════════════
const ProvidersScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();

  // دسته‌بندی پیش‌فرض از HomeScreen
  const initialCategory = route?.params?.category ?? 'همه';

  const [query, setQuery]           = useState('');
  const [selectedCat, setSelectedCat] = useState(initialCategory);
  const [filterVisible, setFilterVisible] = useState(false);

  // ── فیلتر ──
  const filtered = useMemo(() =>
    ALL_PROVIDERS.filter(p =>
      (!query || p.name.includes(query) || p.tags.some(t => t.includes(query))) &&
      (selectedCat === 'همه' || p.category === selectedCat)
    ),
    [query, selectedCat],
  );

  // ── هدر ──
  const ListHeader = () => (
    <>
      {/* هدر با دکمه بازگشت */}
      <View style={styles.pageHeader}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.75}>
          <Icon name="arrow-back" size={22} color={COLORS.textMain} />
        </TouchableOpacity>
        <Text style={styles.pageTitle}>متخصصین</Text>
        <Icon name="people-outline" size={24} color={COLORS.gold} />
      </View>

      <SearchBar
        value={query}
        onChangeText={setQuery}
        placeholder="جستجوی متخصص..."
        onFilterPress={() => setFilterVisible(true)}
      />

      <CategoryTabs
        categories={PROVIDER_CATEGORIES}
        selected={selectedCat}
        onSelect={setSelectedCat}
      />

      <SectionHeader
        title={selectedCat === 'همه' ? 'همه متخصصین' : `متخصصین ${selectedCat}`}
        iconName="people-outline"
        actionLabel={`${filtered.length} نفر`}
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
        onApply={f => console.log('filters:', f)}
      />
    </View>
  );
};

// ── Empty State ──
const EmptyState = ({ query }) => (
  <View style={styles.emptyState}>
    <Icon name="people-outline" size={52} color={COLORS.border} />
    <Text style={styles.emptyTitle}>
      {query ? `نتیجه‌ای برای «${query}» پیدا نشد` : 'متخصصی در این دسته‌بندی وجود ندارد'}
    </Text>
    <Text style={styles.emptySubtitle}>دسته‌بندی دیگری را امتحان کنید</Text>
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
  // ── هدر ──
  pageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  backBtn: {
    marginRight: 'auto',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  pageTitle: {
    color: COLORS.textMain,
    fontSize: 22,
    fontFamily: FONTS.bold,
  },
  sectionHeader: {
    marginTop: 4,
  },
  // ── Empty ──
  emptyState: {
    alignItems: 'center',
    paddingTop: 70,
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

export default ProvidersScreen;