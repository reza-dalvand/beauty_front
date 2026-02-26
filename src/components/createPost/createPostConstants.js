// src/components/createPost/createPostConstants.js
// ══════════════════════════════════════════════════
// ثابت‌ها، رنگ‌ها، داده‌ها و توابع کمکی مشترک
// بین همه کامپوننت‌های CreatePost
// ══════════════════════════════════════════════════
import { Dimensions } from 'react-native';

// ─── ریسپانسیو ───────────────────────────────────
const BASE = 390;
const { width: SW } = Dimensions.get('window');
export const R = n => Math.round((n / BASE) * SW);

// ─── رنگ‌ها — مطابق appTheme ─────────────────────
export const C = {
  bg: '#0B0B0B',
  surface: '#1A1A1A',
  surface2: '#222222',
  surface3: '#2A2A2A',
  gold: '#D4AF37',
  goldSoft: 'rgba(212,175,55,0.12)',
  goldBorder: 'rgba(212,175,55,0.35)',
  white: '#FFFFFF',
  sub: '#909090',
  border: '#2E2E2E',
  red: '#E53935',
  green: '#43A047',
  cardBg: '#141414',
};

// ─── داده‌های ثابت ────────────────────────────────
export const BUSINESS_TYPES = [
  { key: 'آرایشگاه', icon: 'cut-outline' },
  { key: 'کلینیک', icon: 'medkit-outline' },
  { key: 'ناخن', icon: 'color-palette-outline' },
  { key: 'اسپا', icon: 'leaf-outline' },
  { key: 'تتو', icon: 'brush-outline' },
  { key: 'آرایش عروس', icon: 'rose-outline' },
  { key: 'مو', icon: 'sparkles-outline' },
  { key: 'پوست', icon: 'body-outline' },
];

export const PROVINCES_CITIES = {
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
  'مرکزی':              ['اراک', 'ساوه', 'خمین', 'محلات', 'تفرش', 'آشتیان'],
  'بوشهر':              ['بوشهر', 'برازجان', 'گناوه', 'دیر', 'کنگان'],
  'هرمزگان':            ['بندرعباس', 'بندرلنگه', 'قشم', 'کیش', 'میناب', 'حاجی‌آباد'],
  'گلستان':             ['گرگان', 'گنبدکاووس', 'آق‌قلا', 'کردکوی', 'بندرترکمن'],
  'ایلام':              ['ایلام', 'مهران', 'دهلران', 'آبدانان', 'دره‌شهر'],
};
export const PROVINCES = Object.keys(PROVINCES_CITIES);

export const MONTHS_FA = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر',
  'مرداد', 'شهریور', 'مهر', 'آبان',
  'آذر', 'دی', 'بهمن', 'اسفند',
];

export const DAYS_FULL = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه',
  'چهارشنبه', 'پنج‌شنبه', 'جمعه',
];

export const SLOT_HOURS = (() => {
  const slots = [];
  for (let h = 8; h <= 21; h++) {
    slots.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 21) slots.push(`${String(h).padStart(2, '0')}:30`);
  }
  return slots;
})();

export const STEPS = [
  { id: 1, title: 'اطلاعات پایه', icon: 'storefront-outline' },
  { id: 2, title: 'موقعیت مکانی', icon: 'location-outline' },
  { id: 3, title: 'اعضای تیم', icon: 'people-outline' },
  { id: 4, title: 'نمونه کارها', icon: 'images-outline' },
];

// ─── Helpers شمسی ────────────────────────────────
export const toFa = n => String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

export const getDaysInMonth = month => (month <= 6 ? 31 : month <= 11 ? 30 : 29);

export const toShamsi = date => {
  let gy = date.getFullYear(), gm = date.getMonth() + 1, gd = date.getDate();
  let jy, jm, jd, g_d_no, j_d_no;
  gy -= (gm <= 2) ? 1 : 0;
  const g_y = gy - 1600, g_m = gm - 3, g_d = gd - 1;
  g_d_no = 365 * g_y + Math.floor((g_y + 3) / 4) - Math.floor((g_y + 99) / 100)
    + Math.floor((g_y + 399) / 400) + (gm <= 2 ? 306 : 0)
    + [306, 337, 0, 31, 61, 92, 122, 153, 184, 214, 245, 275][g_m] + g_d;
  j_d_no = g_d_no - 79;
  const j_np = Math.floor(j_d_no / 12053);
  j_d_no %= 12053;
  jy = 979 + 33 * j_np + 4 * Math.floor(j_d_no / 1461);
  j_d_no %= 1461;
  if (j_d_no >= 366) { jy += Math.floor((j_d_no - 1) / 365); j_d_no = (j_d_no - 1) % 365; }
  const jMD = [31, 31, 31, 31, 31, 31, 30, 30, 30, 30, 30, 29];
  for (jm = 0; jm < 12 && j_d_no >= jMD[jm]; jm++) j_d_no -= jMD[jm];
  jd = j_d_no + 1;
  return [jy, jm + 1, jd];
};

export const shamsiToGregorian = (jy, jm, jd) => {
  const jy2 = jy - 979, jm2 = jm - 1;
  let j_day_no = 365 * jy2 + Math.floor(jy2 / 33) * 8 + Math.floor((jy2 % 33 + 3) / 4);
  for (let i = 0; i < jm2; i++) j_day_no += [31,31,31,31,31,31,30,30,30,30,30,29][i];
  j_day_no += jd - 1;
  let g_day_no = j_day_no + 79;
  let gy = 1600 + 400 * Math.floor(g_day_no / 146097);
  g_day_no %= 146097;
  if (g_day_no >= 36525) { gy += 100 * Math.floor(--g_day_no / 36524); g_day_no %= 36524; if (g_day_no >= 365) g_day_no++; }
  gy += 4 * Math.floor(g_day_no / 1461);
  g_day_no %= 1461;
  if (g_day_no >= 366) { gy += Math.floor((g_day_no - 1) / 365); g_day_no = (g_day_no - 1) % 365; }
  let gDays = g_day_no + 1;
  const gMD = [31, (gy % 4 === 0 && (gy % 100 !== 0 || gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  for (let i = 0; i < 12; i++) { if (gDays < gMD[i]) { gm = i; break; } gDays -= gMD[i]; }
  return new Date(gy, gm, gDays + 1);
};

export const getCurrentShamsiWeek = (offsetWeeks = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + offsetWeeks * 7);
  const dow = (today.getDay() + 1) % 7;
  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - dow + i);
    const s = toShamsi(d);
    weekDays.push({ shamsi: s, gregorian: d, label: `${s[2]} ${MONTHS_FA[s[1] - 1]}` });
  }
  return weekDays;
};

// ─── openImagePicker ─────────────────────────────
import { Platform, Alert, ActionSheetIOS } from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

export const openImagePicker = (onSelect, { multiple = false } = {}) => {
  const options = { mediaType: 'photo', quality: 0.85, selectionLimit: multiple ? 10 : 1, includeBase64: false };
  const handleResult = response => {
    if (response.didCancel || response.errorCode) return;
    const assets = response.assets || [];
    if (!assets.length) return;
    multiple ? onSelect(assets.map(a => a.uri)) : onSelect(assets[0].uri);
  };
  const showSheet = (title, actions) => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        { options: [...actions.map(a => a.label), 'انصراف'], cancelButtonIndex: actions.length, title },
        idx => { if (idx < actions.length) actions[idx].fn(); },
      );
    } else {
      Alert.alert(title, '', [...actions.map(a => ({ text: a.label, onPress: a.fn })), { text: 'انصراف', style: 'cancel' }]);
    }
  };
  showSheet('انتخاب تصویر', [
    { label: '📷  دوربین', fn: () => launchCamera(options, handleResult) },
    { label: '🖼  گالری', fn: () => launchImageLibrary(options, handleResult) },
  ]);
};