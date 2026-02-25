// src/components/explore/ExploreFilterModal.js
import React, { useState, useRef } from 'react';
import {
  View, Text, Modal, TouchableOpacity, StyleSheet,
  ScrollView, TouchableWithoutFeedback, Animated, FlatList,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

// ─── داده‌های کامل استان‌ها ───────────────────────────
const PROVINCES_CITIES = {
  'تهران':              ['تهران', 'شهریار', 'ری', 'اسلامشهر', 'پردیس', 'ورامین', 'دماوند', 'فیروزکوه', 'پاکدشت'],
  'اصفهان':             ['اصفهان', 'کاشان', 'نجف‌آباد', 'خمینی‌شهر', 'شاهین‌شهر', 'مبارکه', 'اردستان', 'گلپایگان'],
  'فارس':               ['شیراز', 'مرودشت', 'کازرون', 'جهرم', 'فسا', 'داراب', 'آباده', 'لارستان'],
  'خراسان رضوی':        ['مشهد', 'نیشابور', 'سبزوار', 'تربت‌حیدریه', 'قوچان', 'کاشمر', 'تایباد', 'گناباد'],
  'آذربایجان شرقی':     ['تبریز', 'مراغه', 'مرند', 'اهر', 'میانه', 'بناب', 'عجبشیر', 'ملکان'],
  'آذربایجان غربی':     ['ارومیه', 'خوی', 'مهاباد', 'بوکان', 'میاندوآب', 'سلماس', 'تکاب'],
  'مازندران':           ['ساری', 'آمل', 'بابل', 'قائمشهر', 'چالوس', 'نوشهر', 'تنکابن', 'بابلسر'],
  'گیلان':              ['رشت', 'بندرانزلی', 'لاهیجان', 'لنگرود', 'رودبار', 'آستانه اشرفیه', 'صومعه‌سرا'],
  'البرز':              ['کرج', 'فردیس', 'نظرآباد', 'هشتگرد', 'محمدشهر', 'اشتهارد'],
  'کرمانشاه':           ['کرمانشاه', 'اسلام‌آباد', 'هرسین', 'سنقر', 'جوانرود', 'کنگاور', 'صحنه'],
  'خوزستان':            ['اهواز', 'آبادان', 'خرمشهر', 'دزفول', 'بهبهان', 'اندیمشک', 'مسجدسلیمان'],
  'کرمان':              ['کرمان', 'رفسنجان', 'بم', 'جیرفت', 'زرند', 'سیرجان', 'شهربابک'],
  'سیستان و بلوچستان':  ['زاهدان', 'چابهار', 'ایرانشهر', 'خاش', 'سراوان', 'زابل'],
  'همدان':              ['همدان', 'ملایر', 'نهاوند', 'کبودرآهنگ', 'اسدآباد', 'تویسرکان'],
  'لرستان':             ['خرم‌آباد', 'بروجرد', 'الیگودرز', 'دورود', 'ازنا', 'کوهدشت'],
  'قزوین':              ['قزوین', 'البرز', 'آبیک', 'بوئین‌زهرا', 'تاکستان'],
  'سمنان':              ['سمنان', 'شاهرود', 'دامغان', 'گرمسار', 'مهدیشهر'],
  'زنجان':              ['زنجان', 'ابهر', 'خرمدره', 'قیدار', 'ماهنشان'],
  'اردبیل':             ['اردبیل', 'پارس‌آباد', 'مشگین‌شهر', 'خلخال', 'نمین'],
  'قم':                 ['قم'],
  'چهارمحال و بختیاری': ['شهرکرد', 'بروجن', 'فارسان', 'لردگان'],
  'بوشهر':              ['بوشهر', 'برازجان', 'گناوه', 'دیر', 'کنگان'],
  'هرمزگان':            ['بندرعباس', 'بندرلنگه', 'قشم', 'کیش', 'میناب', 'حاجی‌آباد'],
  'کهگیلویه و بویراحمد': ['یاسوج', 'گچساران', 'دوگنبدان', 'سی‌سخت'],
  'مرکزی':              ['اراک', 'ساوه', 'خمین', 'محلات', 'تفرش', 'آشتیان'],
  'ایلام':              ['ایلام', 'مهران', 'دهلران', 'آبدانان', 'دره‌شهر'],
  'گلستان':             ['گرگان', 'گنبدکاووس', 'آق‌قلا', 'علی‌آباد', 'کردکوی'],
  'گلستان':             ['گرگان', 'گنبدکاووس', 'آق‌قلا', 'علی‌آباد کتول', 'کردکوی'],
  'خراسان شمالی':       ['بجنورد', 'شیروان', 'اسفراین', 'جاجرم', 'مانه و سملقان'],
  'خراسان جنوبی':       ['بیرجند', 'قاین', 'فردوس', 'بشرویه', 'طبس'],
  'یزد':                ['یزد', 'میبد', 'اردکان', 'ابرکوه', 'بافق', 'طبس'],
  'گلستان':             ['گرگان', 'گنبدکاووس', 'آق‌قلا', 'علی‌آباد کتول', 'کردکوی'],
};

const BUSINESS_TYPES = [
  { id: 'nail',    label: 'ناخن',         icon: 'color-palette-outline' },
  { id: 'hair',    label: 'مو',           icon: 'cut-outline' },
  { id: 'skin',    label: 'پوست و لیزر',  icon: 'sparkles-outline' },
  { id: 'makeup',  label: 'میکاپ',        icon: 'brush-outline' },
  { id: 'brow',    label: 'ابرو و مژه',   icon: 'eye-outline' },
  { id: 'massage', label: 'ماساژ',        icon: 'hand-left-outline' },
  { id: 'tattoo',  label: 'تاتو',         icon: 'pencil-outline' },
  { id: 'salon',   label: 'سالن جامع',    icon: 'storefront-outline' },
];

// ═══════════════════════════════════════════════════
//  DROPDOWN COMPONENT
// ═══════════════════════════════════════════════════
const Dropdown = ({ label, icon, selected, items, onSelect, disabled, placeholder }) => {
  const [open, setOpen] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const toggleOpen = () => {
    if (disabled) return;
    const toValue = open ? 0 : 1;
    Animated.spring(rotateAnim, {
      toValue,
      useNativeDriver: true,
      bounciness: 0,
      speed: 20,
    }).start();
    setOpen(v => !v);
  };

  const handleSelect = (item) => {
    onSelect(item);
    setOpen(false);
    Animated.spring(rotateAnim, { toValue: 0, useNativeDriver: true, speed: 20, bounciness: 0 }).start();
  };

  const chevronRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={dropdownStyles.wrapper}>
      {/* ── تریگر ── */}
      <TouchableOpacity
        style={[
          dropdownStyles.trigger,
          open && dropdownStyles.triggerOpen,
          disabled && dropdownStyles.triggerDisabled,
          selected && dropdownStyles.triggerSelected,
        ]}
        onPress={toggleOpen}
        activeOpacity={0.8}>

        {/* سمت راست: آیکون + متن */}
        <View style={dropdownStyles.triggerRight}>
          <Icon
            name={icon}
            size={16}
            color={disabled ? COLORS.border : selected ? COLORS.gold : COLORS.textSub}
          />
          <View style={dropdownStyles.triggerTexts}>
            <Text style={dropdownStyles.triggerLabel}>{label}</Text>
            <Text
              style={[
                dropdownStyles.triggerValue,
                selected && dropdownStyles.triggerValueSelected,
                disabled && dropdownStyles.triggerValueDisabled,
              ]}
              numberOfLines={1}>
              {selected || placeholder || 'انتخاب کنید'}
            </Text>
          </View>
        </View>

        {/* سمت چپ: شِوِرون */}
        <Animated.View style={{ transform: [{ rotate: chevronRotate }] }}>
          <Icon
            name="chevron-down"
            size={18}
            color={disabled ? COLORS.border : COLORS.textSub}
          />
        </Animated.View>
      </TouchableOpacity>

      {/* ── لیست کشویی ── */}
      {open && (
        <View style={dropdownStyles.listContainer}>
          {/* آیتم پاک کردن */}
          {selected && (
            <TouchableOpacity
              style={dropdownStyles.clearItem}
              onPress={() => handleSelect(null)}
              activeOpacity={0.7}>
              <Icon name="close-circle-outline" size={15} color={COLORS.red} />
              <Text style={dropdownStyles.clearText}>پاک کردن انتخاب</Text>
            </TouchableOpacity>
          )}

          <FlatList
            data={items}
            keyExtractor={(item) => item}
            nestedScrollEnabled
            style={dropdownStyles.list}
            showsVerticalScrollIndicator
            indicatorStyle="white"
            renderItem={({ item }) => {
              const isSelected = selected === item;
              return (
                <TouchableOpacity
                  style={[dropdownStyles.item, isSelected && dropdownStyles.itemActive]}
                  onPress={() => handleSelect(item)}
                  activeOpacity={0.75}>
                  <Icon
                    name={isSelected ? 'radio-button-on' : 'radio-button-off'}
                    size={16}
                    color={isSelected ? COLORS.gold : COLORS.border}
                  />
                  <Text style={[dropdownStyles.itemText, isSelected && dropdownStyles.itemTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

const dropdownStyles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
    zIndex: 10,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.background,
    borderRadius: RADII.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  triggerOpen: {
    borderColor: COLORS.gold,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  triggerSelected: {
    borderColor: 'rgba(212,175,55,0.5)',
  },
  triggerDisabled: {
    opacity: 0.4,
  },
  triggerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  triggerTexts: {
    flex: 1,
    alignItems: 'flex-end',
  },
  triggerLabel: {
    color: COLORS.textSub,
    fontSize: 11,
    fontFamily: FONTS.regular,
    marginBottom: 2,
  },
  triggerValue: {
    color: COLORS.textSub,
    fontSize: 14,
    fontFamily: FONTS.regular,
    textAlign: 'right',
  },
  triggerValueSelected: {
    color: COLORS.textMain,
    fontFamily: FONTS.bold,
  },
  triggerValueDisabled: {
    color: COLORS.border,
  },
  // ── لیست ──
  listContainer: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.gold,
    borderTopWidth: 0,
    borderBottomLeftRadius: RADII.md,
    borderBottomRightRadius: RADII.md,
    overflow: 'hidden',
  },
  list: {
    maxHeight: 200,
  },
  clearItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  clearText: {
    color: COLORS.red,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemActive: {
    backgroundColor: 'rgba(212,175,55,0.07)',
  },
  itemText: {
    color: COLORS.textSub,
    fontSize: 13,
    fontFamily: FONTS.regular,
    flex: 1,
    textAlign: 'right',
  },
  itemTextActive: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
  },
});

// ═══════════════════════════════════════════════════
//  CHIP (برای نوع کسب‌وکار)
// ═══════════════════════════════════════════════════
const Chip = ({ label, active, onPress, icon }) => (
  <TouchableOpacity
    style={[styles.chip, active && styles.chipActive]}
    onPress={onPress}
    activeOpacity={0.75}>
    {icon && <Icon name={icon} size={13} color={active ? COLORS.gold : COLORS.textSub} />}
    <Text style={[styles.chipText, active && styles.chipTextActive]}>{label}</Text>
    {active && <Icon name="checkmark" size={12} color={COLORS.gold} />}
  </TouchableOpacity>
);

// ─── عنوان سکشن ─────────────────────────────────────
const SectionTitle = ({ icon, label, count }) => (
  <View style={styles.sectionTitleRow}>
    <View style={styles.sectionTitleLeft}>
      {count > 0 && (
        <View style={styles.countBadge}>
          <Text style={styles.countBadgeText}>{count}</Text>
        </View>
      )}
    </View>
    <View style={styles.sectionTitleRight}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <Icon name={icon} size={16} color={COLORS.gold} />
    </View>
  </View>
);

// ═══════════════════════════════════════════════════
//  MAIN MODAL
// ═══════════════════════════════════════════════════
const ExploreFilterModal = ({ visible, onClose, onApply }) => {
  const insets = useSafeAreaInsets();

  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity]         = useState(null);
  const [selectedTypes, setSelectedTypes]       = useState([]);

  const provinceList = Object.keys(PROVINCES_CITIES);
  const cityList     = selectedProvince ? PROVINCES_CITIES[selectedProvince] : [];

  const toggleType = (id) =>
    setSelectedTypes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  const handleSelectProvince = (p) => {
    setSelectedProvince(p);
    setSelectedCity(null);
  };

  const handleReset = () => {
    setSelectedProvince(null);
    setSelectedCity(null);
    setSelectedTypes([]);
  };

  const handleApply = () => {
    onApply?.({ province: selectedProvince, city: selectedCity, businessTypes: selectedTypes });
    onClose();
  };

  const activeCount =
    (selectedProvince ? 1 : 0) + (selectedCity ? 1 : 0) + selectedTypes.length;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>

      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.sheet, { paddingBottom: insets.bottom > 0 ? insets.bottom : 24 }]}>

        {/* هندل */}
        <View style={styles.handle} />

        {/* هدر */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleReset} activeOpacity={0.7}>
            <Text style={styles.resetText}>پاک کردن</Text>
          </TouchableOpacity>

          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>فیلتر</Text>
            {activeCount > 0 && (
              <View style={styles.activeCountBadge}>
                <Text style={styles.activeCountText}>{activeCount}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
            <Icon name="close" size={22} color={COLORS.textSub} />
          </TouchableOpacity>
        </View>

        {/* ─── محتوا ─── */}
        <FlatList
  data={[{ key: 'content' }]}
  keyExtractor={(item) => item.key}
  showsVerticalScrollIndicator={false}
  keyboardShouldPersistTaps="handled"
  contentContainerStyle={styles.scrollContent}
  renderItem={() => (
    <>
      {/* ── ① موقعیت مکانی ── */}
      <SectionTitle
        icon="location-outline"
        label="موقعیت مکانی"
        count={(selectedProvince ? 1 : 0) + (selectedCity ? 1 : 0)}
      />

      <Dropdown
        label="استان"
        icon="map-outline"
        selected={selectedProvince}
        items={provinceList}
        onSelect={handleSelectProvince}
        placeholder="استان را انتخاب کنید"
      />

      <View style={styles.cityDropdownWrap}>
        <Dropdown
          label="شهر"
          icon="location-outline"
          selected={selectedCity}
          items={cityList}
          onSelect={setSelectedCity}
          disabled={!selectedProvince}
          placeholder={
            selectedProvince
              ? 'شهر را انتخاب کنید'
              : 'ابتدا استان را انتخاب کنید'
          }
        />
      </View>

      <View style={styles.divider} />

      <SectionTitle
        icon="storefront-outline"
        label="نوع کسب‌وکار"
        count={selectedTypes.length}
      />

      <View style={styles.chipsGrid}>
        {BUSINESS_TYPES.map((t) => (
          <Chip
            key={t.id}
            label={t.label}
            icon={t.icon}
            active={selectedTypes.includes(t.id)}
            onPress={() => toggleType(t.id)}
          />
        ))}
      </View>
    </>
  )}
/>

        {/* دکمه اعمال */}
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.85}>
          <Text style={styles.applyBtnText}>
            {activeCount > 0 ? `اعمال ${activeCount} فیلتر` : 'اعمال فیلتر'}
          </Text>
          <Icon name="options-outline" size={18} color={COLORS.background} />
        </TouchableOpacity>

      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
  },
  sheet: {
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    maxHeight: '85%',
  },
  handle: {
    width: 44,
    height: 4,
    backgroundColor: COLORS.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  headerTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  activeCountBadge: {
    backgroundColor: COLORS.gold,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  activeCountText: {
    color: COLORS.background,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  resetText: {
    color: COLORS.red,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  scrollContent: {
    paddingBottom: 8,
    paddingTop: 8,
  },
  cityDropdownWrap: {
    marginTop: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 12,
  },
  sectionTitleRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  sectionTitleLeft: {
    minWidth: 28,
    alignItems: 'flex-start',
  },
  sectionLabel: {
    color: COLORS.textMain,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  countBadge: {
    backgroundColor: 'rgba(212,175,55,0.12)',
    borderRadius: 10,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.4)',
  },
  countBadgeText: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 12,
  },
  chipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 13,
    borderRadius: RADII.round,
    borderWidth: 1,
    borderColor: COLORS.border,
    gap: 5,
  },
  chipActive: {
    borderColor: COLORS.gold,
    backgroundColor: 'rgba(212,175,55,0.1)',
  },
  chipText: {
    color: COLORS.textSub,
    fontSize: 12,
    fontFamily: FONTS.regular,
  },
  chipTextActive: {
    color: COLORS.gold,
    fontFamily: FONTS.bold,
  },
  applyBtn: {
    backgroundColor: COLORS.gold,
    height: 52,
    borderRadius: RADII.lg,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    ...SHADOWS.goldButton,
  },
  applyBtnText: {
    color: COLORS.background,
    fontSize: 15,
    fontFamily: FONTS.bold,
  },
});

export default ExploreFilterModal;