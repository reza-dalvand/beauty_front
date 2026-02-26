// src/components/createPost/steps/Step2.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, PROVINCES, PROVINCES_CITIES } from '../createPostConstants';
import SectionCard from '../SectionCard';
import Field from '../Field';
import Label from '../Label';
import NavButtons from '../NavButtons';

// ─── دراپ‌داون ────────────────────────────────────────
const Dropdown = ({ label, required, value, items, onSelect, placeholder, disabled, icon }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={{ marginBottom: R(14) }}>
      <Label text={label} required={required} />
      <TouchableOpacity
        disabled={disabled}
        onPress={() => setOpen(p => !p)}
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: disabled ? C.surface3 : C.surface2,
          borderRadius: R(12),
          borderWidth: 1,
          borderColor: open ? C.gold : value ? 'rgba(212,175,55,0.4)' : C.border,
          paddingHorizontal: R(14),
          height: R(48),
          opacity: disabled ? 0.5 : 1,
        }}>
        <Icon
          name="chevron-down"
          size={R(16)}
          color={C.sub}
          style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}
        />
        <Text style={{ color: value ? C.white : C.sub, fontFamily: 'vazir', fontSize: R(14) }}>
          {value || placeholder}
        </Text>
        <Icon name={icon || 'location-outline'} size={R(18)} color={value ? C.gold : C.sub} />
      </TouchableOpacity>

      {open && (
        <View style={{
          backgroundColor: C.surface2,
          borderRadius: R(12),
          borderWidth: 1,
          borderColor: C.gold,
          marginTop: R(4),
          maxHeight: R(200),
          overflow: 'hidden',
        }}>
          <ScrollView nestedScrollEnabled showsVerticalScrollIndicator={false}>
            {items.map((item, idx) => (
              <TouchableOpacity
                key={item}
                onPress={() => { onSelect(item); setOpen(false); }}
                style={{
                  paddingHorizontal: R(16),
                  paddingVertical: R(12),
                  borderBottomWidth: idx < items.length - 1 ? 1 : 0,
                  borderBottomColor: C.border,
                  backgroundColor: value === item ? C.goldSoft : 'transparent',
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: R(8),
                }}>
                {value === item && <Icon name="checkmark" size={R(14)} color={C.gold} />}
                <Text style={{ color: value === item ? C.gold : C.white, fontFamily: 'vazir', fontSize: R(14) }}>
                  {item}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

// ─── Step2 ────────────────────────────────────────────
const Step2 = ({ data, setData, navProps }) => {
  const cities = data.province ? (PROVINCES_CITIES[data.province] || []) : [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: R(8) }}>
      <SectionCard>
        <Dropdown
          label="استان"
          required
          value={data.province}
          items={PROVINCES}
          placeholder="انتخاب استان"
          onSelect={prov => setData(p => ({ ...p, province: prov, city: '' }))}
        />
        <Dropdown
          label="شهر"
          required
          value={data.city}
          items={cities}
          placeholder={data.province ? 'انتخاب شهر' : 'ابتدا استان را انتخاب کنید'}
          disabled={!data.province}
          onSelect={city => setData(p => ({ ...p, city }))}
          icon="business-outline"
        />
        <Field
          label="منطقه / محله"
          placeholder="مثال: منطقه ۳، ونک"
          value={data.district}
          onChangeText={v => setData(p => ({ ...p, district: v }))}
        />
        <Field label="آدرس کامل" placeholder="خیابان، کوچه، پلاک..." value={data.address} onChangeText={v => setData(p => ({ ...p, address: v }))} multiline />
      </SectionCard>
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

export default Step2;


