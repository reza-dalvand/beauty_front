// src/components/createPost/SectionCard.js
import React from 'react';
import { View } from 'react-native';
import { R, C } from './createPostConstants';

const SectionCard = ({ children, style }) => (
  <View
    style={[
      {
        backgroundColor: C.surface,
        borderRadius: R(18),
        borderWidth: 1,
        borderColor: C.border,
        padding: R(16),
        marginBottom: R(14),
      },
      style,
    ]}>
    {children}
  </View>
);

export default SectionCard;