// src/components/createPost/SubmitSuccessModal.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { R, C } from './createPostConstants';

const SubmitSuccessModal = ({ visible, onConfirm }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onConfirm}>
    <View style={s.overlay}>
      <View style={s.box}>

        {/* آیکون */}
        <View style={s.iconWrap}>
          <Icon name="time-outline" size={R(52)} color={C.gold} />
        </View>

        {/* عنوان */}
        <Text style={s.title}>آگهی شما ثبت شد</Text>

        {/* متن */}
        <Text style={s.desc}>
          آگهی کسب‌وکار شما با موفقیت ارسال شد و پس از بررسی و تایید توسط تیم پشتیبانی، در لیست کسب‌وکارها قرار خواهد گرفت.
        </Text>

        {/* بج وضعیت */}
        <View style={s.statusBadge}>
          <Icon name="hourglass-outline" size={R(14)} color={C.gold} />
          <Text style={s.statusText}>در انتظار تایید پشتیبانی</Text>
        </View>

        {/* دکمه */}
        <TouchableOpacity onPress={onConfirm} style={s.btn} activeOpacity={0.85}>
          <Icon name="home-outline" size={R(18)} color={C.bg} />
          <Text style={s.btnTxt}>بازگشت به خانه</Text>
        </TouchableOpacity>

      </View>
    </View>
  </Modal>
);

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: R(24),
  },
  box: {
    backgroundColor: C.surface,
    borderRadius: R(24),
    padding: R(28),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.goldBorder,
  },
  iconWrap: {
    width: R(96),
    height: R(96),
    borderRadius: R(48),
    backgroundColor: C.goldSoft,
    borderWidth: 1.5,
    borderColor: C.goldBorder,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: R(20),
  },
  title: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(20),
    fontWeight: 'bold',
    marginBottom: R(12),
    textAlign: 'center',
  },
  desc: {
    color: C.sub,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'center',
    lineHeight: R(24),
    marginBottom: R(16),
  },
  statusBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(6),
    backgroundColor: C.goldSoft,
    borderRadius: R(20),
    paddingHorizontal: R(14),
    paddingVertical: R(7),
    borderWidth: 1,
    borderColor: C.goldBorder,
    marginBottom: R(24),
  },
  statusText: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(12),
    fontWeight: 'bold',
  },
  btn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(8),
    backgroundColor: C.gold,
    height: R(50),
    borderRadius: R(14),
    width: '100%',
    shadowColor: C.gold,
    shadowOffset: { width: 0, height: R(4) },
    shadowOpacity: 0.35,
    shadowRadius: R(10),
    elevation: 8,
  },
  btnTxt: {
    color: C.bg,
    fontFamily: 'vazir',
    fontSize: R(15),
    fontWeight: 'bold',
  },
});

export default SubmitSuccessModal;