/**
 * ExploreScreen.js
 * ✓ کاملاً ریسپانسیو روی همه گوشی‌ها
 * ✓ راست‌چین (RTL) در همه بخش‌ها
 * ✓ دراپ‌داون شهرها
 * ✓ فیلترهای شیک با آیکون
 * ✓ بدون پکیج اضافه
 */

import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
  ScrollView,
  Dimensions,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Pressable,
  Share,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const BASE = 390;
const { width: SW, height: SH } = Dimensions.get('window');
const R = n => Math.round((n / BASE) * SW);
const RH = n => Math.round((n / 844) * SH);

const C = {
  bg: '#0B0B0B',
  surface: '#1A1A1A',
  surface2: '#222222',
  surface3: '#2A2A2A',
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.12)',
  white: '#FFFFFF',
  sub: '#909090',
  border: '#2E2E2E',
  red: '#E53935',
  cardBg: '#151515',
};

const BUSINESS_TYPES = [
  { key: 'همه', icon: 'grid-outline' },
  { key: 'آرایشگاه', icon: 'cut-outline' },
  { key: 'کلینیک', icon: 'medkit-outline' },
  { key: 'ناخن', icon: 'color-palette-outline' },
  { key: 'اسپا', icon: 'leaf-outline' },
  { key: 'تتو', icon: 'brush-outline' },
];

const SORT_OPTIONS = [
  { key: 'popular', label: 'پربازدید', icon: 'eye-outline' },
  { key: 'liked', label: 'پرلایک', icon: 'heart-outline' },
  { key: 'newest', label: 'جدیدترین', icon: 'time-outline' },
  { key: 'rated', label: 'بهترین', icon: 'star-outline' },
];

const CITIES = [
  'همه شهرها',
  'تهران',
  'اصفهان',
  'شیراز',
  'مشهد',
  'تبریز',
  'کرج',
  'اهواز',
  'قم',
  'رشت',
  'کرمانشاه',
  'ارومیه',
  'زاهدان',
  'همدان',
  'یزد',
  'اردبیل',
  'بندرعباس',
  'سنندج',
  'خرم‌آباد',
  'گرگان',
  'بابل',
  'ساری',
  'قزوین',
];

const MOCK_COMMENTS = [
  {
    id: '1',
    user: 'مریم ک.',
    text: 'خیلی عالیه، حتماً میام!',
    avatar: 'https://i.pravatar.cc/40?img=5',
  },
  {
    id: '2',
    user: 'نگار م.',
    text: 'قیمتا مناسبه؟',
    avatar: 'https://i.pravatar.cc/40?img=9',
  },
  {
    id: '3',
    user: 'سارا ر.',
    text: 'بهترین سالنی که رفتم 🌟',
    avatar: 'https://i.pravatar.cc/40?img=15',
  },
];

const NAMES = [
  'سالن رخ',
  'کلینیک رز',
  'آتلیه زیبا',
  'اسپا مروارید',
  'استودیو گلد',
  'سالن بلور',
];
const BUSINESSES = Array.from({ length: 54 }, (_, i) => ({
  id: String(i + 1),
  name: NAMES[i % NAMES.length] + ' ' + (i + 1),
  type: BUSINESS_TYPES[(i % (BUSINESS_TYPES.length - 1)) + 1].key,
  region: CITIES[(i % (CITIES.length - 1)) + 1],
  views: 500 + ((i * 173) % 9000),
  likes: 100 + ((i * 97) % 3000),
  rating: (3.5 + (i % 15) * 0.1).toFixed(1),
  thumb: `https://picsum.photos/seed/biz${i + 1}/300/300`,
  gallery: Array.from({ length: (i % 4) + 2 }, (__, j) => ({
    id: String(j),
    uri: `https://picsum.photos/seed/biz${i + 1}g${j}/800/800`,
  })),
  avatar: `https://i.pravatar.cc/80?img=${(i % 70) + 1}`,
  isVerified: i % 3 === 0,
  comments: [...MOCK_COMMENTS],
}));

// ─────────────────────────────────────────────────────────
// FrostedOverlay
// ─────────────────────────────────────────────────────────
const FrostedOverlay = ({ opacity }) => (
  <>
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(0,0,0,0.38)', opacity },
      ]}
    />
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor: 'rgba(4,4,4,0.42)', opacity },
      ]}
    />
    <Animated.View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        {
          opacity,
          backgroundColor: 'transparent',
          borderWidth: SW * 0.13,
          borderColor: 'rgba(0,0,0,0.52)',
        },
      ]}
    />
  </>
);

// ─────────────────────────────────────────────────────────
// CityDropdown
// ─────────────────────────────────────────────────────────
const CityDropdown = ({ selected, onSelect, onOpenChange }) => {
  const [open, setOpen] = useState(false);
  const [btnLayout, setBtnLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const btnRef = useRef(null);

  const toggle = () => {
    if (!open) {
      btnRef.current?.measureInWindow((x, y, width, height) => {
        setBtnLayout({ x, y, width, height });
        setOpen(true);
        onOpenChange?.(true);
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }).start();
      });
    } else {
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
      setOpen(false);
      onOpenChange?.(false);
    }
  };

  const select = city => {
    onSelect(city);
    toggle();
  };
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  return (
    <View style={dd.wrapper}>
      <TouchableOpacity
        ref={btnRef}
        activeOpacity={0.82}
        onPress={toggle}
        style={[dd.trigger, open && dd.triggerOpen]}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Icon
            name="chevron-down"
            size={R(15)}
            color={open ? C.gold : C.sub}
          />
        </Animated.View>
        <View style={dd.triggerCenter}>
          <Text
            style={[
              dd.triggerTxt,
              selected !== 'همه شهرها' && dd.triggerTxtActive,
            ]}>
            {selected}
          </Text>
          <Icon
            name="location-outline"
            size={R(14)}
            color={selected !== 'همه شهرها' ? C.gold : C.sub}
          />
        </View>
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="none"
        onRequestClose={toggle}>
        <Pressable style={StyleSheet.absoluteFill} onPress={toggle} />
        <View
          style={[
            dd.list,
            {
              position: 'absolute',
              top: btnLayout.y + btnLayout.height + R(4),
              left: btnLayout.x,
              width: btnLayout.width,
            },
          ]}>
          <ScrollView
            style={{ maxHeight: RH(280) }}
            showsVerticalScrollIndicator={false}>
            {CITIES.map((city, idx) => (
              <TouchableOpacity
                key={city}
                onPress={() => select(city)}
                activeOpacity={0.75}
                style={[
                  dd.item,
                  idx < CITIES.length - 1 && dd.itemBorder,
                  city === selected && dd.itemActive,
                ]}>
                {city === selected ? (
                  <Icon name="checkmark" size={R(14)} color={C.gold} />
                ) : (
                  <View style={{ width: R(14) }} />
                )}
                <Text
                  style={[dd.itemTxt, city === selected && dd.itemTxtActive]}>
                  {city}
                </Text>
                <Icon
                  name={
                    city === 'همه شهرها' ? 'earth-outline' : 'location-outline'
                  }
                  size={R(14)}
                  color={city === selected ? C.gold : C.sub}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

const dd = StyleSheet.create({
  wrapper: { position: 'relative', zIndex: 100 },
  trigger: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: R(12),
    paddingHorizontal: R(12),
    height: R(40),
    borderWidth: 1,
    borderColor: C.border,
    gap: R(6),
  },
  triggerOpen: { borderColor: C.gold, backgroundColor: C.surface2 },
  triggerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: R(6),
  },
  triggerTxt: { color: C.sub, fontFamily: 'vazir', fontSize: R(12) },
  triggerTxtActive: { color: C.gold, fontFamily: 'vazir', fontSize: R(12) },
  list: {
    backgroundColor: C.surface2,
    borderRadius: R(14),
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: R(8) },
    shadowOpacity: 0.5,
    shadowRadius: R(12),
    elevation: 20,
  },
  item: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: R(14),
    paddingVertical: R(11),
    gap: R(8),
  },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  itemActive: { backgroundColor: C.goldSoft },
  itemTxt: {
    flex: 1,
    color: C.sub,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
  },
  itemTxtActive: {
    flex: 1,
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
    fontWeight: 'bold',
  },
});

// ─────────────────────────────────────────────────────────
// TypeFilter — گرید ۳ ستونه، بدون Modal، inline expand
// ─────────────────────────────────────────────────────────
const TypeFilter = ({ active, onSelect, onOpenChange }) => {
  const [open, setOpen] = useState(false);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    onOpenChange?.(next);
  };

  const select = key => {
    onSelect(key);
    setOpen(false);
    onOpenChange?.(false);
  };

  const activeItem =
    BUSINESS_TYPES.find(t => t.key === active) || BUSINESS_TYPES[0];

  return (
    <View style={tf.wrapper}>
      {/* دکمه trigger */}
      <TouchableOpacity
        activeOpacity={0.82}
        onPress={toggle}
        style={[tf.trigger, open && tf.triggerOpen]}>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Icon
            name="chevron-down"
            size={R(15)}
            color={open ? C.gold : C.sub}
          />
        </View>
        <View style={tf.triggerMid}>
          <View style={tf.miniIcons}>
            {BUSINESS_TYPES.filter(t => t.key !== active)
              .slice(0, 4)
              .map(t => (
                <Icon key={t.key} name={t.icon} size={R(11)} color={C.border} />
              ))}
          </View>
          <Text style={tf.triggerCount}>{BUSINESS_TYPES.length - 1} دسته</Text>
        </View>
        <View style={tf.triggerActive}>
          <Text style={tf.triggerActiveTxt}>{activeItem.key}</Text>
          <Icon name={activeItem.icon} size={R(15)} color={C.bg} />
        </View>
      </TouchableOpacity>

      {/* پنل گرید — inline، بدون Modal، بدون Pressable */}
      {open && (
        <View style={tf.panel}>
          <View style={tf.grid}>
            {BUSINESS_TYPES.map(t => {
              const isActive = active === t.key;
              return (
                <TouchableOpacity
                  key={t.key}
                  activeOpacity={0.75}
                  onPress={() => select(t.key)}
                  style={[tf.gridItem, isActive && tf.gridItemOn]}>
                  <View style={[tf.iconCircle, isActive && tf.iconCircleOn]}>
                    <Icon
                      name={t.icon}
                      size={R(18)}
                      color={isActive ? C.bg : C.sub}
                    />
                  </View>
                  <Text
                    style={[tf.gridTxt, isActive && tf.gridTxtOn]}
                    numberOfLines={1}>
                    {t.key}
                  </Text>
                  {isActive && <View style={tf.activeDot} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const GRID_ITEM_W = Math.floor((SW - R(28) - R(20) - R(6) * 2) / 3);

const tf = StyleSheet.create({
  wrapper: { paddingHorizontal: R(14), marginBottom: R(2) },
  trigger: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: R(14),
    paddingHorizontal: R(14),
    height: R(46),
    borderWidth: 1,
    borderColor: C.border,
    gap: R(10),
  },
  triggerOpen: {
    borderColor: C.gold,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomColor: 'transparent',
  },
  triggerMid: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: R(8),
  },
  miniIcons: { flexDirection: 'row-reverse', gap: R(5), alignItems: 'center' },
  triggerCount: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  triggerActive: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(6),
    backgroundColor: C.gold,
    borderRadius: R(10),
    paddingHorizontal: R(10),
    paddingVertical: R(5),
  },
  triggerActiveTxt: {
    color: C.bg,
    fontFamily: 'vazir',
    fontSize: R(12),
    fontWeight: 'bold',
  },
  panel: {
    backgroundColor: C.surface,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: C.gold,
    borderBottomLeftRadius: R(14),
    borderBottomRightRadius: R(14),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: R(10),
    gap: R(6),
  },
  gridItem: {
    width: GRID_ITEM_W,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: R(10),
    borderRadius: R(12),
    backgroundColor: C.surface2,
    borderWidth: 1,
    borderColor: C.border,
    position: 'relative',
  },
  gridItemOn: { backgroundColor: C.goldSoft, borderColor: C.gold },
  iconCircle: {
    width: R(38),
    height: R(38),
    borderRadius: R(19),
    backgroundColor: C.surface3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: R(6),
  },
  iconCircleOn: { backgroundColor: C.gold },
  gridTxt: {
    color: C.sub,
    fontFamily: 'vazir',
    fontSize: R(11),
    textAlign: 'center',
  },
  gridTxtOn: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(11),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  activeDot: {
    position: 'absolute',
    top: R(6),
    left: R(6),
    width: R(7),
    height: R(7),
    borderRadius: R(4),
    backgroundColor: C.gold,
  },
});

// ─────────────────────────────────────────────────────────
// SortFilter
// ─────────────────────────────────────────────────────────
const SortFilter = ({ active, onSelect }) => (
  <ScrollView
    horizontal
    inverted
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      paddingHorizontal: R(14),
      gap: R(8),
      paddingVertical: R(2),
    }}>
    {SORT_OPTIONS.map(opt => {
      const isActive = active === opt.key;
      return (
        <TouchableOpacity
          key={opt.key}
          activeOpacity={0.75}
          onPress={() => onSelect(opt.key)}
          style={[sf.chip, isActive && sf.chipOn]}>
          <Icon name={opt.icon} size={R(13)} color={isActive ? C.bg : C.gold} />
          <Text style={[sf.txt, isActive && sf.txtOn]}>{opt.label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const sf = StyleSheet.create({
  chip: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(5),
    paddingHorizontal: R(13),
    paddingVertical: R(8),
    borderRadius: R(22),
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: C.surface,
  },
  chipOn: { backgroundColor: C.goldSoft, borderColor: C.gold },
  txt: { color: C.sub, fontFamily: 'vazir', fontSize: R(12) },
  txtOn: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(12),
    fontWeight: 'bold',
  },
});

// ─────────────────────────────────────────────────────────
// GridItem
// ─────────────────────────────────────────────────────────
const GAP = R(2);
const CELL_SZ = (SW - GAP * 2) / 3;

const GridItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.82}
    onPress={() => onPress(item)}
    style={{ width: CELL_SZ, height: CELL_SZ, position: 'relative' }}>
    <Image
      source={{ uri: item.thumb }}
      style={{ width: '100%', height: '100%' }}
      resizeMode="cover"
    />
    {item.gallery.length > 1 && (
      <View style={{ position: 'absolute', top: R(6), left: R(6) }}>
        <Icon name="copy-outline" size={R(13)} color="#fff" />
      </View>
    )}
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: R(6),
        paddingVertical: R(4),
        backgroundColor: 'rgba(0,0,0,0.45)',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: R(3),
      }}>
      <Icon name="heart" size={R(11)} color={C.gold} />
      <Text style={{ color: '#fff', fontSize: R(10), fontFamily: 'vazir' }}>
        {item.likes > 999 ? (item.likes / 1000).toFixed(1) + 'k' : item.likes}
      </Text>
    </View>
  </TouchableOpacity>
));

// ─────────────────────────────────────────────────────────
// GalleryModal — ✏️ ورودی کامنت شناور خارج از ScrollView
// ─────────────────────────────────────────────────────────
const MODAL_H = SH * 0.86;
const MODAL_PAD = R(16);
const MODAL_TOP = (SH - MODAL_H) / 2;
const IMG_SIZE = SW - MODAL_PAD * 2 - R(32);

const GalleryModal = ({ business, onClose }) => {
  const [imgIdx, setImgIdx] = useState(0);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(business.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(business.comments);
  const [showCmts, setShowCmts] = useState(false);

  const slideY = useRef(new Animated.Value(SH)).current;
  const bgOpacity = useRef(new Animated.Value(0)).current;
  const cardScale = useRef(new Animated.Value(0.93)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(slideY, {
        toValue: 0,
        useNativeDriver: true,
        damping: 22,
        stiffness: 220,
      }),
      Animated.spring(cardScale, {
        toValue: 1,
        useNativeDriver: true,
        damping: 22,
        stiffness: 220,
      }),
      Animated.timing(bgOpacity, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(slideY, {
        toValue: SH,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(cardScale, {
        toValue: 0.93,
        duration: 260,
        useNativeDriver: true,
      }),
      Animated.timing(bgOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(onClose);
  };

  const toggleLike = () => {
    setLiked(p => !p);
    setLikeCount(p => (liked ? p - 1 : p + 1));
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${business.name} — ${business.type} در ${business.region}`,
      });
    } catch {}
  };

  const sendComment = () => {
    if (!comment.trim()) return;
    setComments(p => [
      {
        id: String(Date.now()),
        user: 'شما',
        text: comment,
        avatar: 'https://i.pravatar.cc/40?img=33',
      },
      ...p,
    ]);
    setComment('');
  };

  const onScroll = useCallback(e => {
    setImgIdx(Math.round(e.nativeEvent.contentOffset.x / IMG_SIZE));
  }, []);

  return (
    <Modal
      visible
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleClose}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose}>
        <FrostedOverlay opacity={bgOpacity} />
      </Pressable>

      <Animated.View
        style={[
          m.card,
          { transform: [{ translateY: slideY }, { scale: cardScale }] },
        ]}>
        <View style={m.handle} />
        {/* ✏️ ساختار جدید: flex column — اسکرول بالا، ورودی کامنت پایین ثابت */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
          keyboardVerticalOffset={R(20)}>
          {/* محتوای اسکرول‌پذیر */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ paddingBottom: R(16) }}>
            {/* هدر کسب‌وکار */}
            <View style={m.bizRow}>
              <TouchableOpacity style={m.followBtn} activeOpacity={0.85}>
                <Text style={m.followTxt}>دنبال کردن</Text>
              </TouchableOpacity>
              <View style={m.bizInfo}>
                <Text style={m.bizName} numberOfLines={1}>
                  {business.name}
                </Text>
                <View style={m.bizMetaRow}>
                  <Text style={m.bizMeta}>{business.region}</Text>
                  <Text style={m.bizMetaDot}>·</Text>
                  <Text style={m.bizMeta}>{business.type}</Text>
                </View>
              </View>
              <View style={m.bizAvatarWrap}>
                <Image source={{ uri: business.avatar }} style={m.bizAvatar} />
                {business.isVerified && (
                  <View style={m.verifiedBadge}>
                    <Icon name="checkmark" size={R(9)} color={C.bg} />
                  </View>
                )}
              </View>
            </View>

            {/* گالری */}
            <FlatList
              data={business.gallery}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={img => img.id}
              onScroll={onScroll}
              scrollEventThrottle={16}
              renderItem={({ item: img }) => (
                <Image
                  source={{ uri: img.uri }}
                  style={{ width: IMG_SIZE, height: IMG_SIZE }}
                  resizeMode="cover"
                />
              )}
            />

            {/* dots */}
            <View style={m.dots}>
              {business.gallery.map((_, idx) => (
                <View key={idx} style={[m.dot, idx === imgIdx && m.dotOn]} />
              ))}
            </View>

            {/* دکمه‌های تعامل */}
            <View style={m.actionRow}>
              <TouchableOpacity
                style={m.actionBtn}
                onPress={() => setSaved(p => !p)}
                activeOpacity={0.7}>
                <Icon
                  name={saved ? 'bookmark' : 'bookmark-outline'}
                  size={R(24)}
                  color={saved ? C.gold : C.white}
                />
              </TouchableOpacity>
              <View style={{ flex: 1 }} />
              <TouchableOpacity
                style={m.actionBtn}
                onPress={handleShare}
                activeOpacity={0.7}>
                <Icon name="paper-plane-outline" size={R(24)} color={C.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={m.actionBtn}
                onPress={() => setShowCmts(p => !p)}
                activeOpacity={0.7}>
                <Icon
                  name={showCmts ? 'chatbubble' : 'chatbubble-outline'}
                  size={R(23)}
                  color={showCmts ? C.gold : C.white}
                />
                <Text style={[m.actionCount, showCmts && { color: C.gold }]}>
                  {comments.length}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={m.actionBtn}
                onPress={toggleLike}
                activeOpacity={0.7}>
                <Icon
                  name={liked ? 'heart' : 'heart-outline'}
                  size={R(26)}
                  color={liked ? C.red : C.white}
                />
                <Text style={[m.actionCount, liked && { color: C.red }]}>
                  {likeCount}
                </Text>
              </TouchableOpacity>
            </View>

            {/* آمار */}
            <View style={m.statsRow}>
              <View style={m.statItem}>
                <Text style={m.statTxt}>{business.rating}</Text>
                <Icon name="star" size={R(13)} color={C.gold} />
              </View>
              <View style={m.statItem}>
                <Text style={m.statTxt}>
                  {business.views.toLocaleString()} بازدید
                </Text>
                <Icon name="eye-outline" size={R(13)} color={C.sub} />
              </View>
            </View>

            {/* لیست کامنت‌ها */}
            {showCmts && (
              <View style={m.cmtSection}>
                <View style={m.cmtSep} />
                <Text style={m.cmtTitle}>نظرات</Text>
                {comments.map(c => (
                  <View key={c.id} style={m.cmtRow}>
                    <Image source={{ uri: c.avatar }} style={m.cmtAvatar} />
                    <View style={m.cmtBubble}>
                      <Text style={m.cmtUser}>{c.user}</Text>
                      <Text style={m.cmtText}>{c.text}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>

          {/* ✏️ ورودی کامنت شناور — همیشه پایین مودال پیداست */}
          {showCmts && (
            <View style={m.floatingCmtBar}>
              <TouchableOpacity onPress={sendComment} style={m.sendBtn}>
                <Icon
                  name="arrow-back"
                  size={R(19)}
                  color={comment.trim() ? C.gold : C.border}
                />
              </TouchableOpacity>
              <TextInput
                style={m.cmtField}
                placeholder="نظر خود را بنویسید..."
                placeholderTextColor={C.sub}
                value={comment}
                onChangeText={setComment}
                textAlign="right"
                returnKeyType="send"
                onSubmitEditing={sendComment}
                multiline={false}
              />
              <Image
                source={{ uri: 'https://i.pravatar.cc/40?img=33' }}
                style={m.cmtSelfAvatar}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </Animated.View>
    </Modal>
  );
};

const m = StyleSheet.create({
  card: {
    position: 'absolute',
    top: MODAL_TOP,
    bottom: MODAL_TOP,
    left: MODAL_PAD,
    right: MODAL_PAD,
    backgroundColor: C.cardBg,
    borderRadius: R(26),
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: R(20) },
    shadowOpacity: 0.8,
    shadowRadius: R(30),
    elevation: 30,
  },
  handle: {
    alignSelf: 'center',
    width: R(40),
    height: R(4),
    borderRadius: R(2),
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginTop: R(10),
    marginBottom: R(4),
  },
  bizRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: R(14),
    paddingTop: R(14),
    paddingBottom: R(10),
    gap: R(10),
  },
  bizAvatarWrap: { position: 'relative' },
  bizAvatar: {
    width: R(44),
    height: R(44),
    borderRadius: R(22),
    borderWidth: R(2),
    borderColor: C.gold,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    left: -R(2),
    width: R(18),
    height: R(18),
    borderRadius: R(9),
    backgroundColor: C.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: R(1.5),
    borderColor: C.cardBg,
  },
  bizInfo: { flex: 1, alignItems: 'flex-start' },
  bizName: {
    color: C.white,
    fontSize: R(15),
    fontFamily: 'vazir_bold',
    textAlign: 'left',
  },
  bizMetaRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(4),
    marginTop: R(2),
  },
  bizMeta: { color: C.sub, fontSize: R(11), fontFamily: 'vazir' },
  bizMetaDot: { color: C.border, fontSize: R(11) },
  followBtn: {
    paddingHorizontal: R(13),
    paddingVertical: R(7),
    borderRadius: R(20),
    borderWidth: 1,
    borderColor: C.gold,
  },
  followTxt: { color: C.gold, fontSize: R(12), fontFamily: 'vazir' },
  dots: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: R(5),
    paddingVertical: R(10),
  },
  dot: {
    width: R(7),
    height: R(7),
    borderRadius: R(4),
    backgroundColor: C.border,
  },
  dotOn: { backgroundColor: C.gold, width: R(22), borderRadius: R(4) },
  actionRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: R(10),
    paddingVertical: R(2),
    gap: R(2),
  },
  actionBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(4),
    padding: R(8),
  },
  actionCount: { color: C.white, fontSize: R(13), fontFamily: 'vazir' },
  statsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    paddingHorizontal: R(18),
    gap: R(16),
    marginTop: R(2),
  },
  statItem: { flexDirection: 'row-reverse', alignItems: 'center', gap: R(5) },
  statTxt: { color: C.sub, fontSize: R(12), fontFamily: 'vazir' },
  cmtSection: { paddingHorizontal: R(14), marginTop: R(4) },
  cmtSep: { height: 1, backgroundColor: C.border, marginBottom: R(14) },
  cmtTitle: {
    color: C.gold,
    fontSize: R(14),
    fontFamily: 'vazir_bold',
    textAlign: 'left',
    marginBottom: R(12),
  },
  cmtRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: R(10),
    gap: R(8),
  },
  cmtAvatar: { width: R(32), height: R(32), borderRadius: R(16) },
  cmtBubble: {
    flex: 1,
    backgroundColor: C.surface2,
    borderRadius: R(14),
    padding: R(10),
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: C.border,
  },
  cmtUser: {
    color: C.gold,
    fontSize: R(12),
    fontFamily: 'vazir_bold',
    marginBottom: R(3),
  },
  cmtText: {
    color: C.white,
    fontSize: R(13),
    fontFamily: 'vazir',
    lineHeight: R(21),
    textAlign: 'left',
  },

  // ✏️ ورودی کامنت شناور پایین مودال
  floatingCmtBar: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: R(12),
    paddingVertical: R(10),
    gap: R(8),
    backgroundColor: C.cardBg,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  cmtSelfAvatar: {
    width: R(30),
    height: R(30),
    borderRadius: R(15),
    borderWidth: 1,
    borderColor: C.border,
  },
  cmtField: {
    flex: 1,
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
    height: R(40),
    backgroundColor: C.surface2,
    borderRadius: R(20),
    paddingHorizontal: R(14),
    borderWidth: 1,
    borderColor: C.border,
  },
  sendBtn: { padding: R(6),  },
  reserveTxt: { color: C.bg, fontSize: R(16), fontFamily: 'vazir_bold' },
});

// ─────────────────────────────────────────────────────────
// صفحه اصلی اکسپلور
// ─────────────────────────────────────────────────────────
const ExploreScreen = () => {
  const [search, setSearch] = useState('');
  const [type, setType] = useState('همه');
  const [city, setCity] = useState('همه شهرها');
  const [sort, setSort] = useState('popular');
  const [selBiz, setSelBiz] = useState(null);
  const [focused, setFocused] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = BUSINESSES;
    if (type !== 'همه') list = list.filter(b => b.type === type);
    if (city !== 'همه شهرها') list = list.filter(b => b.region === city);
    if (search.trim())
      list = list.filter(
        b =>
          b.name.includes(search) ||
          b.type.includes(search) ||
          b.region.includes(search),
      );
    if (sort === 'popular') list = [...list].sort((a, b) => b.views - a.views);
    if (sort === 'liked') list = [...list].sort((a, b) => b.likes - a.likes);
    if (sort === 'newest')
      list = [...list].sort((a, b) => Number(b.id) - Number(a.id));
    if (sort === 'rated')
      list = [...list].sort(
        (a, b) => parseFloat(b.rating) - parseFloat(a.rating),
      );
    return list;
  }, [type, city, sort, search]);

  const ListHeader = () => (
    <View style={{ backgroundColor: C.bg }}>
      <View style={p.header}>
        <View style={p.titleBlock}>
          <Text style={p.title}>اکسپلور</Text>
        </View>
        <View style={p.titleIcon}>
          <Icon name="compass-outline" size={R(28)} color={C.gold} />
        </View>
      </View>

      <View style={p.searchRow}>
        <View style={{ width: R(140) }}>
          <CityDropdown
            selected={city}
            onSelect={setCity}
            onOpenChange={setCityOpen}
          />
        </View>
        <View style={[p.searchBar, { flex: 1 }, focused && p.searchBarOn]}>
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Icon name="close-circle" size={R(17)} color={C.sub} />
            </TouchableOpacity>
          ) : null}
          <TextInput
            style={p.searchInput}
            placeholder="جستجو..."
            placeholderTextColor={C.sub}
            value={search}
            onChangeText={setSearch}
            textAlign="right"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
          <Icon
            name="search-outline"
            size={R(17)}
            color={focused ? C.gold : C.sub}
          />
        </View>
      </View>

      <View style={[p.filterBlock, { zIndex: 50 }]}>
        <Text style={p.filterLabel}>دسته‌بندی</Text>
        <TypeFilter
          active={type}
          onSelect={setType}
          onOpenChange={setTypeOpen}
        />
      </View>

      <View style={[p.filterBlock, { zIndex: 10 }]}>
        <Text style={p.filterLabel}>مرتب‌سازی</Text>
        <SortFilter active={sort} onSelect={setSort} />
      </View>

      <View style={[p.resultRow, { zIndex: 1 }]}>
        <Text style={p.resultTxt}>نمونه کار یافت شد.</Text>
        <View style={p.resultBadge}>
          <Text style={p.resultCount}>{filtered.length}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={p.container}>
      <StatusBar backgroundColor={C.bg} barStyle="light-content" />
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        numColumns={3}
        columnWrapperStyle={{ gap: GAP, marginBottom: GAP }}
        ListHeaderComponent={<ListHeader />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: R(60), gap: R(12) }}>
            <Icon name="search" size={R(46)} color={C.border} />
            <Text
              style={{ color: C.sub, fontSize: R(15), fontFamily: 'vazir' }}>
              نتیجه‌ای یافت نشد
            </Text>
          </View>
        }
        renderItem={({ item }) => <GridItem item={item} onPress={setSelBiz} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: R(100) }}
      />
      {selBiz && (
        <GalleryModal business={selBiz} onClose={() => setSelBiz(null)} />
      )}
    </View>
  );
};

const p = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingTop:
      Platform.OS === 'android' ? StatusBar.currentHeight || R(24) : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    paddingHorizontal: R(18),
    paddingTop: R(12),
    paddingBottom: R(8),
  },
  titleBlock: { alignItems: 'flex-end' },
  title: {
    color: C.gold,
    fontSize: R(26),
    fontFamily: 'vazir_bold',
    textAlign: 'right',
  },
  sub: {
    color: C.sub,
    fontSize: R(12),
    fontFamily: 'vazir',
    textAlign: 'right',
    marginBottom: R(2),
  },
  titleIcon: {
    width: R(48),
    height: R(48),
    borderRadius: R(14),
    backgroundColor: C.goldSoft,
    borderWidth: 1,
    borderColor: C.gold,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: R(14),
    gap: R(8),
    marginBottom: R(10),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.surface,
    borderRadius: R(12),
    paddingHorizontal: R(12),
    height: R(40),
    borderWidth: 1,
    borderColor: C.border,
    gap: R(6),
  },
  searchBarOn: { borderColor: C.gold },
  searchInput: {
    flex: 1,
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(13),
  },
  filterBlock: { marginBottom: R(6), zIndex: 1 },
  filterLabel: {
    color: C.sub,
    fontSize: R(11),
    fontFamily: 'vazir',
    textAlign: 'left',
    paddingHorizontal: R(16),
    marginBottom: R(4),
  },
  resultRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: R(16),
    paddingVertical: R(8),
    gap: R(6),
  },
  resultBadge: {
    backgroundColor: C.goldSoft,
    borderRadius: R(8),
    paddingHorizontal: R(8),
    paddingVertical: R(2),
    borderWidth: 1,
    borderColor: 'rgba(212,175,55,0.3)',
  },
  resultCount: { color: C.gold, fontSize: R(12), fontFamily: 'vazir_bold' },
  resultTxt: { color: C.sub, fontSize: R(12), fontFamily: 'vazir' },
});

export default ExploreScreen;
