// src/components/createPost/Label.js
import React from 'react';
import { View, Text } from 'react-native';
import { R, C } from './createPostConstants';

const Label = ({ text, required }) => (
  <View
    style={{
      flexDirection: 'row-reverse',
      alignItems: 'center',
      justifyContent: 'flex-end',
      marginBottom: R(6),
      gap: R(4),
    }}>
    {required && <Text style={{ color: C.red, fontSize: R(12) }}>*</Text>}
    <Text
      style={{
        color: C.sub,
        fontFamily: 'vazir',
        fontSize: R(13),
        textAlign: 'left',
      }}>
      {text}
    </Text>
  </View>
);

export default Label;