import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  useWindowDimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { globalStyles } from '../theme/globalStyles';

const LOCAL_COLORS = {
  surface: '#1A1A1A',
  cardBg: '#222222',
  textSecondary: '#888888',
  border: '#333333',
  goldAccent: '#D4AF37',
};

const CATEGORIES = ['پاکسازی', 'لیزر', 'مو', 'ناخن', 'همه'];

const SERVICES_DATA = Array.from({ length: 20 }).map((_, i) => ({
  id: i.toString(),
  title: `Service ${i + 1}`,
  subtitle: 'Description text',
  image: `https://i.pravatar.cc/300?img=${i + 20}`,
}));

// ================= HEADER =================
const Header = ({ navigation }) => (
  <View style={localStyles.headerSection}>
    <Text style={globalStyles.titleText}>Rokh</Text>
  </View>
);

// ================= SEARCH =================
const SearchBox = () => (
  <View style={localStyles.sectionContainer}>
    <View style={localStyles.searchBar}>
      <Icon
        name="search-outline"
        size={20}
        color={LOCAL_COLORS.textSecondary}
        style={{ marginRight: 10 }}
      />
      <TextInput
        style={localStyles.searchInput}
        placeholder="جستجو..."
        placeholderTextColor={LOCAL_COLORS.textSecondary}
      />
    </View>
  </View>
);

// ================= CATEGORY =================
const CategoryTabs = ({ selectedCat, setSelectedCat }) => (
  <View style={localStyles.sectionContainer}>
    <FlatList
      data={CATEGORIES}
      horizontal
      inverted
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item}
      renderItem={({ item }) => {
        const isSelected = selectedCat === item;
        return (
          <TouchableOpacity
            style={[
              localStyles.categoryTab,
              isSelected && localStyles.categoryTabActive,
            ]}
            onPress={() => setSelectedCat(item)}
          >
            <Text
              style={[
                localStyles.categoryText,
                isSelected && localStyles.categoryTextActive,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        );
      }}
    />
  </View>
);

// ================= CARD =================
const ServiceCard = ({ item, cardWidth }) => (
  <TouchableOpacity
    style={[localStyles.cardContainer, { width: cardWidth }]}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: item.image }}
      style={[localStyles.cardImage, { width: cardWidth, height: cardWidth }]}
      resizeMode="cover"
    />
    <Text style={localStyles.cardTitle} numberOfLines={1}>
      {item.title}
    </Text>
    <Text style={localStyles.cardSubtitle} numberOfLines={1}>
      {item.subtitle}
    </Text>
  </TouchableOpacity>
);

// ================= MAIN SCREEN =================
const HomeScreen = ({ navigation }) => {
  const [selectedCat, setSelectedCat] = useState('همه');
  const { width } = useWindowDimensions();

  // ====== RESPONSIVE GRID CALCULATION ======
  const NUM_COLUMNS = width > 600 ? 4 : 3; // تبلت 4 ستون
  const SPACING = 10;
  const HORIZONTAL_PADDING = width * 0.06;

  const TOTAL_SPACING = SPACING * (NUM_COLUMNS - 1);
  const AVAILABLE_WIDTH = width - HORIZONTAL_PADDING * 2;
  const CARD_WIDTH = (AVAILABLE_WIDTH - TOTAL_SPACING) / NUM_COLUMNS;

  const renderHeaderComponent = () => (
    <>
      <Header navigation={navigation} />
      <SearchBox />
      <CategoryTabs
        selectedCat={selectedCat}
        setSelectedCat={setSelectedCat}
      />
    </>
  );

  return (
    <View
      style={[
        globalStyles.container,
        {
          justifyContent: 'flex-start',
          paddingTop: StatusBar.currentHeight || 20,
        },
      ]}
    >
      <StatusBar backgroundColor="#000" barStyle="light-content" />

      <FlatList
        data={SERVICES_DATA}
        keyExtractor={(item) => item.id}
        numColumns={NUM_COLUMNS}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          gap: SPACING,
          marginBottom: SPACING,
        }}
        contentContainerStyle={{
          paddingHorizontal: HORIZONTAL_PADDING,
          paddingBottom: 100,
        }}
        ListHeaderComponent={renderHeaderComponent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ServiceCard item={item} cardWidth={CARD_WIDTH} />
        )}
      />
    </View>
  );
};

// ================= STYLES =================
const localStyles = StyleSheet.create({
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    marginTop:3
  },
  sectionContainer: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: LOCAL_COLORS.surface,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    borderWidth: 1,
    borderColor: LOCAL_COLORS.border,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'right',
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: LOCAL_COLORS.border,
    marginRight: 10,
  },
  categoryTabActive: {
    backgroundColor: LOCAL_COLORS.surface,
    borderColor: LOCAL_COLORS.goldAccent,
  },
  categoryText: {
    color: LOCAL_COLORS.textSecondary,
    fontSize: 13,
  },
  categoryTextActive: {
    color: LOCAL_COLORS.goldAccent,
    fontWeight: 'bold',
  },
  cardContainer: {
    alignItems: 'center',
  },
  cardImage: {
    borderRadius: 10,
    backgroundColor: LOCAL_COLORS.cardBg,
    marginBottom: 8,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 2,
  },
  cardSubtitle: {
    color: LOCAL_COLORS.textSecondary,
    fontSize: 9,
    textAlign: 'center',
  },
});

export default HomeScreen;