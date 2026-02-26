// src/components/createPost/steps/Step3.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, toFa } from '../createPostConstants';
import SectionCard from '../SectionCard';
import PhotoCircle from '../PhotoCircle';
import GoldBtn from '../GoldBtn';
import NavButtons from '../NavButtons';

const Step3 = ({ data, setData, navProps }) => {
  const addMember = () => setData(p => ({ ...p, team: [...p.team, { id: Date.now(), name: '', role: '', photo: null }] }));
  const removeMember = id => setData(p => ({ ...p, team: p.team.filter(m => m.id !== id) }));
  const updateMember = (id, field, val) => setData(p => ({ ...p, team: p.team.map(m => (m.id === id ? { ...m, [field]: val } : m)) }));

  return (
    <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: R(8) }}>
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(14) }}>
        <GoldBtn title="افزودن عضو" icon="add-outline" onPress={addMember} outline style={{ height: R(40), paddingHorizontal: R(16) }} />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>اعضای تیم (اختیاری)</Text>
      </View>

      {data.team.length === 0 && (
        <SectionCard>
          <View style={{ alignItems: 'center', paddingVertical: R(24), gap: R(10) }}>
            <Icon name="people-outline" size={R(40)} color={C.border} />
            <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>اگر تیمی ندارید این مرحله را رد کنید</Text>
          </View>
        </SectionCard>
      )}

      {data.team.map((member, idx) => (
        <View key={member.id} style={{ backgroundColor: C.surface, borderRadius: R(16), borderWidth: 1, borderColor: C.border, padding: R(14), marginBottom: R(12) }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', marginBottom: R(12) }}>
            <TouchableOpacity onPress={() => removeMember(member.id)} style={{ padding: R(4) }}>
              <Icon name="trash-outline" size={R(18)} color={C.red} />
            </TouchableOpacity>
            <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(13), fontWeight: 'bold' }}>عضو {toFa(idx + 1)}</Text>
          </View>
          <View style={{ alignItems: 'center', marginBottom: R(12) }}>
            <PhotoCircle size={R(72)} uri={member.photo} onSelect={uri => updateMember(member.id, 'photo', uri)} label="عکس" />
          </View>
          <TextInput
            style={{ backgroundColor: C.surface2, borderRadius: R(10), borderWidth: 1, borderColor: C.border, paddingHorizontal: R(12), height: R(44), color: C.white, fontFamily: 'vazir', fontSize: R(13), textAlign: 'left', marginBottom: R(8) }}
            placeholder="نام و نام خانوادگی"
            placeholderTextColor={C.sub}
            value={member.name}
            onChangeText={v => updateMember(member.id, 'name', v)}
          />
          <TextInput
            style={{ backgroundColor: C.surface2, borderRadius: R(10), borderWidth: 1, borderColor: C.border, paddingHorizontal: R(12), height: R(44), color: C.white, fontFamily: 'vazir', fontSize: R(13), textAlign: 'left' }}
            placeholder="سمت / تخصص"
            placeholderTextColor={C.sub}
            value={member.role}
            onChangeText={v => updateMember(member.id, 'role', v)}
          />
        </View>
      ))}
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

export default Step3;