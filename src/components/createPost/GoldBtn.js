// src/components/createPost/GoldBtn.js
import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C } from './createPostConstants';

const GoldBtn = ({ title, icon, onPress, outline, style, disabled }) => (
  <TouchableOpacity
    onPress={disabled ? undefined : onPress}
    activeOpacity={disabled ? 1 : 0.85}
    style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: R(8),
        height: R(48),
        borderRadius: R(14),
        padding: 5,
        backgroundColor: outline ? 'transparent' : disabled ? '#5a4a15' : C.gold,
        borderWidth: outline ? 1 : 0,
        borderColor: outline ? (disabled ? C.border : C.gold) : 'transparent',
      },
      style,
    ]}>
    {icon && (
      <Icon
        name={icon}
        size={R(18)}
        color={outline ? (disabled ? C.border : C.gold) : disabled ? '#888' : C.bg}
      />
    )}
    <Text
      style={{
        color: outline ? (disabled ? C.border : C.gold) : disabled ? '#888' : C.bg,
        fontFamily: 'vazir',
        fontSize: R(15),
        fontWeight: 'bold',
      }}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default GoldBtn;