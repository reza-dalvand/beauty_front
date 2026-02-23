import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// کدهای قبلی اسکرین‌ها...
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileStack from './ProfileStack';
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'vazir', // استفاده از فونت پروژه
          fontSize: 10,
          marginBottom: 5,
        },
        tabBarStyle: {
          position: 'absolute', // شناور کردن منو
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          bottom: insets.bottom > 0 ? insets.bottom + 5 : 15,
          left: 20,
          right: 20,
          height: 65,
          borderRadius: 20, // گرد کردن گوشه‌ها
          paddingBottom: 0,
          // استایل سایه برای عمق دادن به منو
          shadowColor: '#D4AF37',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'خانه') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'اکسپلور') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'ساخت آگهی') {
            // استایل خاص برای دکمه وسط
            return (
              <View style={styles.centerButton}>
                <Icon name="add" size={30} color="#000" />
              </View>
            );
          } else if (route.name === 'پروفایل') {
            iconName = focused ? 'person' : 'person-outline';
          } else if (route.name === 'تستی') {
            iconName = focused ? 'diamond' : 'diamond-outline';
          }

          return (
            <Icon name={iconName} size={focused ? 28 : 24} color={color} />
          );
        },
      })}>
      <Tab.Screen name="خانه" component={HomeScreen} />
      <Tab.Screen name="اکسپلور" component={ExploreScreen} />
      <Tab.Screen
        name="ساخت آگهی"
        component={CreatePostScreen}
        options={{ tabBarLabel: () => null }} // حذف متن زیر دکمه وسط برای زیبایی
      />
      <Tab.Screen name="پروفایل" component={ProfileStack} />
      {/* <Tab.Screen name="تستی" component={ProfileStack} /> */}
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerButton: {
    width: 55,
    height: 55,
    backgroundColor: '#D4AF37', // طلایی براق
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15, // بالا آمدن دکمه از سطح منو
    borderWidth: 4,
    borderColor: '#0B0B0B', // هماهنگ با رنگ پس‌زمینه اصلی
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default TabNavigator;
