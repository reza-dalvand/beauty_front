// src/components/createPost/StepIndicator.js
import React from 'react';
import { View, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, STEPS } from './createPostConstants';

const StepIndicator = ({ currentStep }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: R(16),
      marginBottom: R(20),
    }}>
    {STEPS.map((s, idx) => {
      const done = s.id < currentStep;
      const active = s.id === currentStep;
      return (
        <React.Fragment key={s.id}>
          <View style={{ alignItems: 'center', gap: R(4) }}>
            <View
              style={[
                {
                  width: R(34),
                  height: R(34),
                  borderRadius: R(17),
                  backgroundColor: C.surface2,
                  borderWidth: 1,
                  borderColor: C.border,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
                (done || active) && { backgroundColor: C.gold, borderColor: C.gold },
                active && {
                  shadowColor: C.gold,
                  shadowOffset: { width: 0, height: R(4) },
                  shadowOpacity: 0.6,
                  shadowRadius: R(8),
                  elevation: 8,
                },
              ]}>
              {done ? (
                <Icon name="checkmark" size={R(14)} color={C.bg} />
              ) : (
                <Icon name={s.icon} size={R(14)} color={active ? C.bg : C.sub} />
              )}
            </View>
            {active && (
              <Text
                style={{
                  color: C.gold,
                  fontFamily: 'vazir',
                  fontSize: R(9),
                  maxWidth: R(56),
                  textAlign: 'center',
                }}>
                {s.title}
              </Text>
            )}
          </View>
          {idx < STEPS.length - 1 && (
            <View
              style={{
                flex: 1,
                height: 1,
                backgroundColor: done ? C.gold : C.border,
                marginHorizontal: R(4),
                marginBottom: active ? R(14) : 0,
              }}
            />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

export default StepIndicator;