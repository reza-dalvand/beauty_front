import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Switch,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  background: '#0B0B0B',
  surface: '#1A1A1A',
  gold: '#D4AF37',
  textMain: '#FFFFFF',
  textSub: '#A0A0A0',
  redButton: '#E53935',
  borderDark: '#333333',
};

const ProfileScreen = () => {
  const [isModelEnabled, setIsModelEnabled] = useState(false);

  // داده‌های تستی
  const FAVORITES = [
    { id: '1', title: 'کاشت ناخن', image: 'https://i.pravatar.cc/150?img=1' },
    { id: '2', title: 'میکاپ صورت', image: 'https://i.pravatar.cc/150?img=5' },
    { id: '3', title: 'کوتاهی مو', image: 'https://i.pravatar.cc/150?img=12' },
  ];

  const APPOINTMENTS = [
    {
      id: '1',
      provider: 'سالن زیبایی رز',
      subtitle: 'خدمات ناخن',
      time: '16:30',
      date: '1402/07/15',
      avatar: 'https://i.pravatar.cc/150?img=9',
    },
    {
      id: '2',
      provider: 'کلینیک رخ',
      subtitle: 'فیشیال تخصصی',
      time: '10:00',
      date: '1402/07/20',
      avatar: 'https://i.pravatar.cc/150?img=20',
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* --- هدر: مشخصات کاربر و دکمه ویرایش --- */}
        <View style={styles.headerContainer}>
          <View style={styles.userInfoRow}>
            <View style={styles.textInfo}>
              <Text style={styles.userName}>رضا محبی</Text>
              <Text style={styles.userPhone}>09123456789</Text>

              {/* دکمه ویرایش مشخصات که درخواست کرده بودی */}
              <TouchableOpacity style={styles.editProfileBtn}>
                <Icon name="pencil" size={14} color={COLORS.background} />
                <Text style={styles.editProfileText}>ویرایش مشخصات</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.avatarWrapper}>
              {/* هاله طلایی دور عکس */}
              <View style={styles.avatarGlow}>
                <Image
                  source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
                  style={styles.avatar}
                />
              </View>
              <TouchableOpacity style={styles.cameraIcon}>
                <Icon name="camera" size={16} color={COLORS.background} />
              </TouchableOpacity>
            </View>
          </View>

          {/* متن توضیحات زیر هدر */}
          <View style={styles.bioContainer}>
            <Text style={styles.bioTitle}>توضیحات مدل</Text>
            <Text style={styles.bioText}>
              با فعال کردن این امکان میتوانید با دریافت ناتیفیکیشن یا پیام متنی
              از سمت کسبو کار هایی که نیاز به مدل دارند از خدمات رایگان و پرتخیفف بهرمند شوید.{' '}
            </Text>
          </View>
        </View>

        {/* --- بخش سوئیچ (مدل شدن) --- */}
        <View style={styles.toggleCard}>
          <Switch
            trackColor={{ false: '#444', true: COLORS.gold }}
            thumbColor={'#FFF'}
            onValueChange={() => setIsModelEnabled(!isModelEnabled)}
            value={isModelEnabled}
            style={styles.switchStyle}
          />
          <View style={styles.toggleTextContainer}>
            <Text style={styles.toggleTitle}>تمایل به مدل شدن</Text>
          </View>
          <Icon name="diamond-outline" size={24} color={COLORS.gold} />
        </View>

        {/* --- بخش علاقه‌مندی‌ها --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>علاقه‌مندی‌های من</Text>
          <Icon name="bookmark" size={20} color={COLORS.gold} />
        </View>

        <FlatList
          data={FAVORITES}
          horizontal
          inverted={true} // برای راست‌چین شدن لیست افقی در فارسی
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.favoritesList}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.favoriteCard}>
              <Image
                source={{ uri: item.image }}
                style={styles.favoriteImage}
              />
              <Text style={styles.favoriteText}>{item.title}</Text>
            </TouchableOpacity>
          )}
        />

        {/* --- بخش نوبت‌ها --- */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>نوبت‌های رزرو شده</Text>
          <Icon name="calendar" size={20} color={COLORS.gold} />
        </View>

        <View style={styles.appointmentsContainer}>
          {APPOINTMENTS.map(item => (
            <View key={item.id} style={styles.appointmentCard}>
              {/* دکمه لغو نوبت جدید */}
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => console.log('Cancel appointment', item.id)}>
                <Text style={styles.cancelBtnText}>لغو نوبت</Text>
                <Icon
                  name="close-circle-outline"
                  size={14}
                  color={COLORS.redButton}
                />
              </TouchableOpacity>
              <View style={styles.appointmentDetails}>
                <Text style={styles.appointmentProvider}>{item.provider}</Text>
                <Text style={styles.appointmentSubtitle}>{item.subtitle}</Text>
                <View style={styles.appointmentTimeRow}>
                  <Text style={styles.timeText}>{item.time}</Text>
                  <Icon
                    name="time-outline"
                    size={14}
                    color={COLORS.gold}
                    style={styles.timeIcon}
                  />
                  <Text style={styles.timeText}>{item.date}</Text>
                  <Icon
                    name="calendar-outline"
                    size={14}
                    color={COLORS.gold}
                    style={styles.timeIcon}
                  />
                </View>
              </View>
              <Image
                source={{ uri: item.avatar }}
                style={styles.appointmentAvatar}
              />
            </View>
          ))}
        </View>
        {/* --- دکمه قرمز شناور پایین صفحه --- */}
        <TouchableOpacity style={styles.floatingRedButton}>
          <Icon
            name="arrow-back-outline"
            size={20}
            color="#FFF"
            style={{ marginLeft: 10 }}
          />
          <Text style={styles.floatingRedButtonText}>خروج از حساب کاربری</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: 120, // فضا برای دکمه قرمز و منوی تب پایین
  },
  headerContainer: {
    paddingHorizontal: 20,
    marginTop: 30,
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInfo: {
    alignItems: 'flex-start',
    marginRight: 20,
  },
  userName: {
    color: COLORS.textMain,
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'vazir',
  },
  userPhone: {
    color: COLORS.textSub,
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'vazir',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginTop: 10,
  },
  editProfileText: {
    color: COLORS.background,
    fontFamily: 'vazir',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarGlow: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.gold,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  bioContainer: {
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  bioTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    fontFamily: 'vazir',
  },
  bioText: {
    color: COLORS.textSub,
    fontSize: 13,
    textAlign: 'left',
    lineHeight: 20,
    fontFamily: 'vazir',
  },
  toggleCard: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.gold,
    marginBottom: 25,
  },
  toggleTextContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 10,
  },
  toggleTitle: {
    color: COLORS.textMain,
    fontSize: 15,
    fontFamily: 'vazir',
    marginLeft: 5,
  },
  switchStyle: {
    transform: [{ scaleX: 1.1 }, { scaleY: 1.1 }],
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    color: COLORS.textMain,
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
    fontFamily: 'vazir',
  },
  favoritesList: {
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  favoriteCard: {
    width: 100,
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 8,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
  },
  favoriteImage: {
    width: '100%',
    height: 70,
    borderRadius: 10,
    marginBottom: 8,
  },
  favoriteText: {
    color: COLORS.textMain,
    fontSize: 12,
    fontFamily: 'vazir',
    textAlign: 'center',
  },
  appointmentsContainer: {
    paddingHorizontal: 20,
  },
  appointmentCard: {
    flexDirection: 'row-reverse',
    backgroundColor: COLORS.surface,
    borderRadius: 15,
    padding: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: COLORS.gold,
    alignItems: 'center',
  },
  appointmentAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  appointmentDetails: {
    flex: 1,
    alignItems: 'flex-start',
  },
  appointmentProvider: {
    color: COLORS.textMain,
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'vazir',
  },
  appointmentSubtitle: {
    color: COLORS.textSub,
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'vazir',
  },
  appointmentTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  timeText: {
    color: COLORS.textSub,
    fontSize: 11,
    marginLeft: 5,
    fontFamily: 'vazir',
  },
  timeIcon: {
    marginLeft: 10,
  },
  floatingRedButton: {
    position: 'relative', // حالا دکمه با اسکرول حرکت می‌کند
    marginTop: 40, // فاصله از آخرین کارت نوبت
    marginBottom: 20, // فاصله احتیاطی از پایین‌ترین نقطه محتوا
    alignSelf: 'center',
    backgroundColor: COLORS.redButton,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    elevation: 4,
  },
  floatingRedButtonText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: 'bold',
    fontFamily: 'vazir',
  },
  cancelBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    alignSelf: 'flex-start', // قرار گرفتن در سمت چپِ باکس (چون کل کانتینر راست‌چین است)
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(229, 57, 53, 0.3)', // قرمز با شفافیت کم برای دورخط
    backgroundColor: 'rgba(229, 57, 53, 0.05)', // پس‌زمینه خیلی ملایم قرمز
  },
  cancelBtnText: {
    color: COLORS.redButton,
    fontSize: 11,
    fontFamily: 'vazir',
    marginRight: 5,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },
});

export default ProfileScreen;
