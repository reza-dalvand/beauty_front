// src/components/createPost/ServiceItem.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, toFa } from './createPostConstants';
import WeeklyCalendar from './WeeklyCalendar';

const ServiceItem = ({ service, phone, onUpdate, onRemove }) => {
  const [calOpen, setCalOpen] = useState(false);
  const slotCount = Object.keys(service.slots || {}).length;

  return (
    <View style={{ backgroundColor: C.surface, borderRadius: R(16), borderWidth: 1, borderColor: C.border, marginBottom: R(14), overflow: 'hidden' }}>
      {/* هدر */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface2, paddingHorizontal: R(14), paddingVertical: R(10) }}>
        <TouchableOpacity onPress={onRemove} style={{ padding: R(4) }}>
          <Icon name="trash-outline" size={R(18)} color={C.red} />
        </TouchableOpacity>
        <View style={{ backgroundColor: C.goldSoft, borderRadius: R(8), paddingHorizontal: R(10), paddingVertical: R(4), borderWidth: 1, borderColor: C.goldBorder }}>
          <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(12) }}>
            {service.name || 'خدمت جدید'}
          </Text>
        </View>
      </View>

      <View style={{ padding: R(14) }}>
        {/* نام خدمت */}
        <TextInput
          style={{ backgroundColor: C.surface2, borderRadius: R(10), borderWidth: 1, borderColor: C.border, paddingHorizontal: R(12), height: R(44), color: C.white, fontFamily: 'vazir', fontSize: R(13), textAlign: 'left', marginBottom: R(10) }}
          placeholder="نام خدمت (مثال: رنگ مو)"
          placeholderTextColor={C.sub}
          value={service.name}
          onChangeText={v => onUpdate('name', v)}
        />

        {/* قیمت */}
        <View style={{ flexDirection: 'row-reverse', gap: R(8), marginBottom: R(12), alignItems: 'center' }}>
          <TextInput
            style={{ flex: 1, backgroundColor: C.surface2, borderRadius: R(10), borderWidth: 1, borderColor: C.border, paddingHorizontal: R(12), height: R(44), color: C.white, fontFamily: 'vazir', fontSize: R(13), textAlign: 'left' }}
            placeholder={service.price ? 'قیمت (تومان)' : phone || 'برای هماهنگی تماس بگیرید'}
            placeholderTextColor={C.sub}
            value={service.price}
            onChangeText={v => onUpdate('price', v)}
            keyboardType="numeric"
          />
          <View style={{ backgroundColor: service.price ? C.goldSoft : C.surface2, borderRadius: R(10), borderWidth: 1, borderColor: service.price ? C.gold : C.border, paddingHorizontal: R(10), height: R(44), justifyContent: 'center' }}>
            <Text style={{ color: service.price ? C.gold : C.sub, fontFamily: 'vazir', fontSize: R(11) }}>
              {service.price ? 'تومان' : 'تماس'}
            </Text>
          </View>
        </View>

        {/* دکمه تقویم */}
        <TouchableOpacity
          onPress={() => setCalOpen(p => !p)}
          style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.surface2, borderRadius: R(10), paddingHorizontal: R(12), paddingVertical: R(10), borderWidth: 1, borderColor: calOpen ? C.gold : C.border }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: R(6) }}>
            <Icon name="chevron-down" size={R(15)} color={C.sub} style={{ transform: [{ rotate: calOpen ? '180deg' : '0deg' }] }} />
            {slotCount > 0 && (
              <View style={{ backgroundColor: C.gold, borderRadius: R(8), paddingHorizontal: R(6), paddingVertical: R(2) }}>
                <Text style={{ color: C.bg, fontFamily: 'vazir', fontSize: R(10), fontWeight: 'bold' }}>{toFa(slotCount)} نوبت</Text>
              </View>
            )}
          </View>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: R(6) }}>
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(12) }}>تقویم نوبت‌دهی شمسی</Text>
            <Icon name="calendar-outline" size={R(16)} color={C.gold} />
          </View>
        </TouchableOpacity>

        {calOpen && (
          <WeeklyCalendar
            slots={service.slots}
            onSlotsChange={s => onUpdate('slots', s)}
          />
        )}
      </View>
    </View>
  );
};

export default ServiceItem;