// src/data/discountData.js
// ====================================================
// داده‌های مشترک خدمات تخفیفی — استفاده در ExploreScreen
// ====================================================

export const DISCOUNT_SERVICES = Array.from({ length: 16 }).map((_, i) => ({
    id: `d${i}`,
    title: ['کاشت ناخن ژل', 'فیشیال تخصصی', 'میکاپ مجلسی', 'کراتین برزیلی',
            'لیزر موهای زائد', 'رنگ مو', 'هایلایت', 'ابرو و مژه'][i % 8],
    businessName: ['سالن رز', 'کلینیک رخ', 'آتلیه آریا', 'مرکز لیلا'][i % 4],
    businessAvatar: `https://i.pravatar.cc/60?img=${(i % 8) + 20}`,
    image: `https://picsum.photos/seed/disc${i}/400/300`,
    originalPrice: (i + 2) * 80,
    discountPercent: [10, 15, 20, 25, 30, 40, 50][i % 7],
    rating: (4 + (i % 5) * 0.2).toFixed(1),
    category: ['ناخن', 'پوست', 'میکاپ', 'مو', 'لیزر', 'مو', 'مو', 'ابرو'][i % 8],
    expiresIn: `${(i % 6) + 1} روز دیگر`,
  }));