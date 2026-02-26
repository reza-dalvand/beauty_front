// src/components/shared/SearchBar.js
// ✅ قابل استفاده در: HomeScreen, ExploreScreen
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII } from '../../theme/appTheme';

/**
 * SearchBar
 * @param {string} value - مقدار جاری
 * @param {function} onChangeText
 * @param {string} placeholder
 * @param {function} onFilterPress - کلیک آیکون فیلتر (اختیاری)
 * @param {object} style - استایل container
 */
const SearchBar = ({ value, onChangeText, placeholder = 'جستجو...', onFilterPress, style }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.inputRow, isFocused && styles.focused]}>
        <Icon name="search-outline" size={20} color={COLORS.textSub} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSub}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          returnKeyType="search"
        />
        {value?.length > 0 && (
          <TouchableOpacity onPress={() => onChangeText('')} activeOpacity={0.7}>
            <Icon name="close-circle" size={18} color={COLORS.textSub} />
          </TouchableOpacity>
        )}
      </View>

      {onFilterPress && (
        <TouchableOpacity style={styles.filterBtn} onPress={onFilterPress} activeOpacity={0.8}>
          <Icon name="options-outline" size={20} color={COLORS.gold} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
  },
  inputRow: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    paddingHorizontal: 12,
    height: 50,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 8,
    marginBottom: 15,

  },
  focused: {
    borderColor: COLORS.gold,
  },
  searchIcon: {
    marginLeft: 2,
  },
  input: {
    flex: 1,
    color: COLORS.textMain,
    fontFamily: FONTS.regular,
    fontSize: 14,
    textAlign: 'right',
  },
  filterBtn: {
    width: 48,
    height: 48,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SearchBar;