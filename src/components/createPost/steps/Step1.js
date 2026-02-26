// src/components/createPost/steps/Step1.js
import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, BUSINESS_TYPES } from '../createPostConstants';
import SectionCard from '../SectionCard';
import Field from '../Field';
import Label from '../Label';
import PhotoCircle from '../PhotoCircle';
import NavButtons from '../NavButtons';

const Step1 = ({ data, setData, navProps }) => (
  <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: R(8) }}>
    <SectionCard>
      <View style={{ alignItems: 'center', marginBottom: R(16) }}>
        <PhotoCircle
          size={R(100)}
          uri={data.profilePhoto}
          onSelect={uri => setData(p => ({ ...p, profilePhoto: uri }))}
          label="عکس پروفایل"
        />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(11), marginTop: R(8) }}>
          عکس پروفایل کسب‌وکار
        </Text>
      </View>
      <Field label="نام کسب‌وکار" required placeholder="مثال: سالن زیبایی رخ" value={data.bizName} onChangeText={v => setData(p => ({ ...p, bizName: v }))} />
      <Field label="نام و نام خانوادگی" required placeholder="نام کامل" value={data.ownerName} onChangeText={v => setData(p => ({ ...p, ownerName: v }))} />
      <Field label="شماره تماس" required placeholder="۰۹۱۲XXXXXXX" value={data.phone} onChangeText={v => setData(p => ({ ...p, phone: v }))} keyboardType="phone-pad" />
      <Field label="توضیحات" required placeholder="درباره کسب‌وکار خود بنویسید..." value={data.description} onChangeText={v => setData(p => ({ ...p, description: v }))} multiline />
    </SectionCard>

    <SectionCard>
      <Label text="نوع کسب‌وکار" required />
      <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: R(8), justifyContent: 'flex-end' }}>
        {BUSINESS_TYPES.map(t => {
          const active = data.bizType === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              activeOpacity={0.8}
              onPress={() => setData(p => ({ ...p, bizType: t.key }))}
              style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: R(6), paddingHorizontal: R(12), paddingVertical: R(8), borderRadius: R(20), borderWidth: 1, borderColor: active ? C.gold : C.border, backgroundColor: active ? C.goldSoft : C.surface2 }}>
              <Icon name={t.icon} size={R(14)} color={active ? C.gold : C.sub} />
              <Text style={{ color: active ? C.gold : C.sub, fontFamily: 'vazir', fontSize: R(12) }}>{t.key}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SectionCard>

    <NavButtons {...navProps} />
  </ScrollView>
);

export default Step1;