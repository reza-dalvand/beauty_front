import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
const Stack = createNativeStackNavigator();

const ProfileStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="profile" component={ProfileScreen} />
      <Stack.Screen name="editProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStack;
