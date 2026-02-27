// src/screens/ProvidersScreen.js
// ====================================================
// تغییر: فقط onBookPress به BusinessProfileModal وصل شد
// ظاهر صفحه هیچ تغییری نکرده
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
import BusinessProfileModal from '../components/business/BusinessProfileModal'; // ← جدید

import { ALL_PROVIDERS, PROVIDER_CATEGORIES } from '../data/providersData';

const ProvidersScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const initialCategory = route?.params?.category ?? 'همه';

  const [query,         setQuery]         = useState('');
  const [selectedCat,   setSelectedCat]   = useState(initialCategory);
  const [filterVisible, setFilterVisible] = useState(false);

  // ─── state جدید برای مودال رزرو ───────────────
  const [bookingProvider, setBookingProvider] = useState(null); // provider انتخاب‌شده

  const filtered = useMemo(() =>
    ALL_PROVIDERS.filter(p =>
      (!query || p.name.includes(query) || p.tags.some(t => t.includes(query))) &&
      (selectedCat === 'همه' || p.category === selectedCat)
    ),
    [query, selectedCat],
  );

  const ListHeader = () => (
    <>
      {/* ظاهر کاملاً دست نخورده */}
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
            onBookPress={p => setBookingProvider(p)} // ← وصل شد
          />
        )}
      />

      <ExploreFilterModal
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={f => console.log('filters:', f)}
      />

      {/* ─── مودال رزرو — نمایش پروفایل + فلو رزرو ─── */}
      <BusinessProfileModal
        visible={!!bookingProvider}
        provider={bookingProvider}
        onClose={() => setBookingProvider(null)}
        onBooked={(booking) => {
          // رزرو انجام شد — در app واقعی به context/store اضافه می‌شه
          // الان فقط در state محلی نگه می‌داریم و مودال بسته می‌شه در step success
          console.log('booked:', booking);
        }}
      />
    </View>
  );
};

const EmptyState = ({ query }) => (
  <View style={styles.emptyState}>
    <Icon name="people-outline" size={52} color={COLORS.border} />
    <Text style={styles.emptyTitle}>
      {query ? `نتیجه‌ای برای «${query}» پیدا نشد` : 'متخصصی در این دسته‌بندی وجود ندارد'}
    </Text>
    <Text style={styles.emptySubtitle}>دسته‌بندی دیگری را امتحان کنید</Text>
  </View>
);

// ظاهر استایل‌ها کاملاً دست نخورده
const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: COLORS.background },
  listContent: { paddingBottom: 120 },
  pageHeader:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingHorizontal: 16, paddingBottom: 16, gap: 8 },
  backBtn:     { marginRight: 'auto', width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.surface, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.border },
  pageTitle:   { color: COLORS.textMain, fontSize: 22, fontFamily: FONTS.bold },
  sectionHeader:{ marginTop: 4 },
  emptyState:  { alignItems: 'center', paddingTop: 70, gap: 10, paddingHorizontal: 40 },
  emptyTitle:  { color: COLORS.textSub, fontSize: 14, fontFamily: FONTS.regular, textAlign: 'center' },
  emptySubtitle:{ color: COLORS.border, fontSize: 12, fontFamily: FONTS.regular, textAlign: 'center' },
});

export default ProvidersScreen;