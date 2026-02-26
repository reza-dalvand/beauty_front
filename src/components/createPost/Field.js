// src/components/createPost/Field.js
import React from 'react';
import { View, TextInput } from 'react-native';
import { R, C } from './createPostConstants';
import Label from './Label';

const Field = ({ label, required, placeholder, value, onChangeText, keyboardType, multiline }) => (
  <View style={{ marginBottom: R(14) }}>
    {label && <Label text={label} required={required} />}
    <TextInput
      style={{
        backgroundColor: C.surface2,
        borderRadius: R(12),
        borderWidth: 1,
        borderColor: C.border,
        paddingHorizontal: R(14),
        paddingVertical: R(12),
        color: C.white,
        fontFamily: 'vazir',
        fontSize: R(14),
        textAlign: 'right',
        minHeight: multiline ? R(80) : undefined,
        textAlignVertical: multiline ? 'top' : 'center',
      }}
      placeholder={placeholder}
      placeholderTextColor={C.sub}
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      multiline={multiline}
    />
  </View>
);

export default Field;