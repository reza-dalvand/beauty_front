import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true, // نمایش نام زیر آیکون
        tabBarStyle: {
          backgroundColor: '#1A1A1A', // مشکی تم پروژه
          borderTopColor: '#333',
          height: 60,
          paddingBottom: 10,
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
        },
        tabBarActiveTintColor: '#D4AF37', // طلایی (فعال)
        tabBarInactiveTintColor: '#888', // خاکستری (غیرفعال)
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'خانه') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'اکسپلور') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'ساخت آگهی') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'پروفایل') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
      })}>
      <Tab.Screen name="خانه" component={HomeScreen} />
      <Tab.Screen name="اکسپلور" component={ExploreScreen} />
      <Tab.Screen name="ساخت آگهی" component={CreatePostScreen} />
      <Tab.Screen name="پروفایل" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
