// src/components/TabNavigator.js
// ====================================================
// ProvidersScreen به عنوان Stack screen اضافه شده
// از HomeScreen با navigation.navigate('Providers', { category })
// فراخوانی می‌شه
// ====================================================
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ExploreScreen from '../screens/ExploreScreen';
import HomeScreen from '../screens/HomeScreen';
import CreatePostScreen from '../screens/CreatePostScreen';
import ProfileStack from './ProfileStack';
import ProvidersScreen from '../screens/ProvidersScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ─── Stack شامل Home + ProvidersScreen ──────────────
const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="Providers" component={ProvidersScreen} />
  </Stack.Navigator>
);

// ─── Tab Navigator اصلی ──────────────────────────────
const TabNavigator = () => {
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontFamily: 'vazir',
          fontSize: 10,
          marginBottom: 5,
        },
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#1A1A1A',
          borderTopWidth: 0,
          bottom: insets.bottom > 0 ? insets.bottom + 5 : 15,
          left: 20,
          right: 20,
          height: 65,
          borderRadius: 20,
          paddingBottom: 0,
          shadowColor: '#D4AF37',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#888',
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          if (route.name === 'خانه') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'اکسپلور') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'ساخت آگهی') {
            return (
              <View style={styles.centerButton}>
                <Icon name="add" size={30} color="#000" />
              </View>
            );
          } else if (route.name === 'پروفایل') {
            iconName = focused ? 'person' : 'person-outline';
          }
          return (
            <Icon name={iconName} size={focused ? 28 : 24} color={color} />
          );
        },
      })}>
      {/* HomeStack شامل Home + ProvidersScreen */}
      <Tab.Screen name="خانه" component={HomeStack} />
      <Tab.Screen name="اکسپلور" component={ExploreScreen} />
      <Tab.Screen
        name="ساخت آگهی"
        component={CreatePostScreen}
        options={{ tabBarLabel: () => null }}
      />
      <Tab.Screen name="پروفایل" component={ProfileStack} />
      <Tab.Screen name="تستی" component={ProfileStack} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  centerButton: {
    width: 55,
    height: 55,
    backgroundColor: '#D4AF37',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    bottom: 15,
    borderWidth: 4,
    borderColor: '#0B0B0B',
    shadowColor: '#D4AF37',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
});

export default TabNavigator;
