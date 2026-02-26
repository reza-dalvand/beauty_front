// src/components/createPost/PhotoCircle.js
import React from 'react';
import { TouchableOpacity, Image, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, openImagePicker } from './createPostConstants';

const PhotoCircle = ({ size, onSelect, uri, label }) => {
  const sz = size ?? R(90);
  return (
    <TouchableOpacity
      onPress={() => openImagePicker(onSelect)}
      activeOpacity={0.8}
      style={{
        width: sz,
        height: sz,
        borderRadius: sz / 2,
        backgroundColor: C.surface2,
        borderWidth: 1.5,
        borderColor: uri ? C.gold : C.border,
        borderStyle: uri ? 'solid' : 'dashed',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
      }}>
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} />
      ) : (
        <>
          <Icon name="camera-outline" size={R(22)} color={C.sub} />
          {label && (
            <Text
              style={{
                color: C.sub,
                fontFamily: 'vazir',
                fontSize: R(10),
                marginTop: R(4),
              }}>
              {label}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default PhotoCircle;