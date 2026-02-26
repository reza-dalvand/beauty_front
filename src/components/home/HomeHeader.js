// src/components/home/HomeBanner.js
import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, Image, TouchableOpacity,
  FlatList, StyleSheet, Dimensions,
} from 'react-native';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

const { width: SCREEN_W } = Dimensions.get('window');
const BANNER_W = SCREEN_W - 32; // با padding دو طرف
const BANNER_H = BANNER_W * 0.42;

const BANNERS = [
  {
    id: '1',
    title: '۳۰٪ تخفیف کاشت ناخن',
    subtitle: 'فقط تا پایان این هفته',
    image: 'https://picsum.photos/seed/banner1/600/250',
    color: 'rgba(212,175,55,0.85)',
  },
  {
    id: '2',
    title: 'لیزر موهای زائد',
    subtitle: 'با بهترین دستگاه‌های روز دنیا',
    image: 'https://picsum.photos/seed/banner2/600/250',
    color: 'rgba(30,30,30,0.75)',
  },
  {
    id: '3',
    title: 'میکاپ عروس',
    subtitle: 'رزرو آنلاین — بدون انتظار',
    image: 'https://picsum.photos/seed/banner3/600/250',
    color: 'rgba(100,60,100,0.75)',
  },
];

/**
 * HomeBanner - اسلایدر بنر تبلیغاتی با اسکرول خودکار
 * @param {function} onBannerPress
 */
const HomeBanner = ({ onBannerPress }) => {
  const flatRef  = useRef(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // اسکرول خودکار هر ۳ ثانیه
  useEffect(() => {
    const interval = setInterval(() => {
      const next = (activeIdx + 1) % BANNERS.length;
      flatRef.current?.scrollToIndex({ index: next, animated: true });
      setActiveIdx(next);
    }, 3000);
    return () => clearInterval(interval);
  }, [activeIdx]);

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatRef}
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={b => b.id}
        snapToInterval={BANNER_W + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.listContent}
        onMomentumScrollEnd={e => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / (BANNER_W + 12));
          setActiveIdx(Math.min(idx, BANNERS.length - 1));
        }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.bannerCard}
            onPress={() => onBannerPress?.(item)}
            activeOpacity={0.9}>
            <Image source={{ uri: item.image }} style={styles.bannerImage} resizeMode="cover" />
            {/* گرادینت متنی */}
            <View style={[styles.overlay, { backgroundColor: item.color }]}>
              <Text style={styles.bannerTitle}>{item.title}</Text>
              <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
              <View style={styles.cta}>
                <Text style={styles.ctaText}>مشاهده</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* نقطه‌های اندیکاتور */}
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIdx && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  bannerCard: {
    width: BANNER_W,
    height: BANNER_H,
    borderRadius: RADII.lg,
    overflow: 'hidden',
    ...SHADOWS.card,
  },
  bannerImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 14,
  },
  bannerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: FONTS.bold,
    textAlign: 'left',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'left',
    marginTop: 3,
  },
  cta: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: RADII.sm,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 8,
  },
  ctaText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: FONTS.bold,
  },
  dots: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    backgroundColor: COLORS.gold,
    width: 18,
  },
});

export default HomeBanner;