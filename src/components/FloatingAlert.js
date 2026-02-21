import React from 'react';
import { Animated, Text, StyleSheet } from 'react-native';

const FloatingAlert = ({ message, slideAnim }) => {
  if (!message) return null;

  return (
    <Animated.View style={[styles.alertBox, { transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.alertText}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  alertBox: {
    position: 'absolute',
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 15,
    zIndex: 1000,
    elevation: 10,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FF5252',
  },
  alertText: {
    color: 'black',
    fontFamily: 'vazir_bold',
    fontSize: 14,
    textAlign: 'right',
  },
});

export default FloatingAlert;