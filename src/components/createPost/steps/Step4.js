// src/components/createPost/steps/Step5.js
import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C, toFa, openImagePicker } from '../createPostConstants';
import SectionCard from '../SectionCard';
import GoldBtn from '../GoldBtn';
import NavButtons from '../NavButtons';

const Step5 = ({ data, setData, navProps }) => {
  const addPortfolio = () =>
    setData(p => ({
      ...p,
      portfolio: [
        ...p.portfolio,
        {
          id: Date.now(),
          title: '',
          serviceType: '',
          description: '',
          photos: [],
        },
      ],
    }));
  const removePortfolio = id =>
    setData(p => ({
      ...p,
      portfolio: p.portfolio.filter(item => item.id !== id),
    }));
  const updatePortfolio = (id, field, val) =>
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item =>
        item.id === id ? { ...item, [field]: val } : item,
      ),
    }));
  const addPhoto = id => {
    openImagePicker(
      uris => {
        const arr = Array.isArray(uris) ? uris : [uris];
        setData(p => ({
          ...p,
          portfolio: p.portfolio.map(item =>
            item.id === id
              ? { ...item, photos: [...item.photos, ...arr] }
              : item,
          ),
        }));
      },
      { multiple: true },
    );
  };
  const removePhoto = (itemId, photoIdx) =>
    setData(p => ({
      ...p,
      portfolio: p.portfolio.map(item =>
        item.id === itemId
          ? { ...item, photos: item.photos.filter((_, i) => i !== photoIdx) }
          : item,
      ),
    }));

  const pInputStyle = {
    backgroundColor: C.surface2,
    borderRadius: R(10),
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: R(12),
    height: R(44),
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
    marginBottom: R(10),
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: R(8) }}>
      <View
        style={{
          flexDirection: 'row-reverse',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: R(14),
        }}>
        <GoldBtn
          title="افزودن نمونه کار"
          icon="images-outline"
          onPress={addPortfolio}
          outline
          style={{ height: R(42) }}
        />
        <Text style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
          نمونه کارها
        </Text>
      </View>

      {data.portfolio.length === 0 && (
        <SectionCard>
          <View
            style={{
              alignItems: 'center',
              paddingVertical: R(24),
              gap: R(10),
            }}>
            <Icon name="images-outline" size={R(45)} color={C.border} />
            <Text
              style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(13) }}>
              هنوز نمونه کاری اضافه نشده
            </Text>
          </View>
        </SectionCard>
      )}

      {data.portfolio.map((item, idx) => (
        <SectionCard key={item.id} style={{ paddingTop: R(12) }}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: R(12),
            }}>
            <TouchableOpacity
              onPress={() => removePortfolio(item.id)}
              style={{ padding: R(4) }}>
              <Icon name="trash-outline" size={R(18)} color={C.red} />
            </TouchableOpacity>
            <Text
              style={{
                color: C.gold,
                fontFamily: 'vazir',
                fontSize: R(14),
                fontWeight: 'bold',
              }}>
              نمونه کار {toFa(idx + 1)}
            </Text>
          </View>
          <TextInput
            style={pInputStyle}
            placeholder="عنوان نمونه کار"
            placeholderTextColor={C.sub}
            value={item.title}
            onChangeText={v => updatePortfolio(item.id, 'title', v)}
            textAlign="left"
          />
          <TextInput
            style={pInputStyle}
            placeholder="نوع خدمت (مثال: رنگ مو)"
            placeholderTextColor={C.sub}
            value={item.serviceType}
            onChangeText={v => updatePortfolio(item.id, 'serviceType', v)}
            textAlign="left"
          />
          <TextInput
            style={[
              pInputStyle,
              {
                minHeight: R(70),
                textAlignVertical: 'top',
                paddingTop: R(10),
                marginBottom: R(14),
              },
            ]}
            placeholder="توضیحات این نمونه کار..."
            placeholderTextColor={C.sub}
            value={item.description}
            onChangeText={v => updatePortfolio(item.id, 'description', v)}
            multiline
            textAlign="left"
          />
          <Text
            style={{
              color: C.sub,
              fontFamily: 'vazir',
              fontSize: R(12),
              textAlign: 'left',
              marginBottom: R(8),
            }}>
            عکس‌های نمونه کار
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: R(8),
              paddingTop: R(8),
              paddingBottom: R(30),
              paddingHorizontal: R(2),
            }}>
            {item.photos.map((uri, pi) => (
              <View key={pi} style={{ position: 'relative', marginTop: R(2) }}>
                <Image
                  source={{ uri }}
                  style={{
                    width: R(80),
                    height: R(80),
                    borderRadius: R(10),
                    borderWidth: 1,
                    borderColor: C.border,
                  }}
                />
                <TouchableOpacity
                  onPress={() => removePhoto(item.id, pi)}
                  style={{
                    position: 'absolute',
                    top: -R(8),
                    left: -R(8),
                    width: R(22),
                    height: R(22),
                    borderRadius: R(11),
                    backgroundColor: C.red,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderWidth: 1.5,
                    borderColor: C.surface,
                  }}>
                  <Icon name="close" size={R(12)} color={C.white} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => addPhoto(item.id)}
              style={{
                width: R(80),
                height: R(80),
                borderRadius: R(10),
                backgroundColor: C.surface2,
                borderWidth: 1.5,
                borderColor: C.border,
                borderStyle: 'dashed',
                justifyContent: 'center',
                alignItems: 'center',
                gap: R(4),
                marginTop: R(2),
              }}>
              <Icon name="add" size={R(24)} color={C.sub} />
              <Text
                style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(10) }}>
                افزودن عکس
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </SectionCard>
      ))}
      <NavButtons {...navProps} />
    </ScrollView>
  );
};

export default Step5;
