// src/components/createPost/BusinessCard.js
import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Modal,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { R, C, toFa } from './createPostConstants';
import PhotoCircle from './PhotoCircle';

// ─── مدال تایید ──────────────────────────────────────
const ApproveModal = ({ visible, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}>
    <View style={m.overlay}>
      <View style={m.box}>
        <View
          style={[
            m.iconWrap,
            { backgroundColor: 'rgba(67,160,71,0.15)', borderColor: '#43A047' },
          ]}>
          <Icon name="checkmark-circle" size={R(48)} color="#43A047" />
        </View>
        <Text style={m.title}>آگهی تایید شد!</Text>
        <Text style={m.desc}>
          آگهی کسب‌وکار شما با موفقیت ثبت و تایید شد. مشتریان می‌توانند شما را
          پیدا کنند.
        </Text>
        <TouchableOpacity
          onPress={onClose}
          style={[m.btn, { backgroundColor: '#43A047' }]}>
          <Icon name="checkmark" size={R(18)} color={C.white} />
          <Text style={m.btnTxt}>متوجه شدم</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

// ─── مدال رد ─────────────────────────────────────────
const RejectModal = ({ visible, onClose, onEdit }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}>
    <View style={m.overlay}>
      <View style={m.box}>
        <View
          style={[
            m.iconWrap,
            { backgroundColor: 'rgba(229,57,53,0.15)', borderColor: C.red },
          ]}>
          <Icon name="close-circle" size={R(48)} color={C.red} />
        </View>
        <Text style={m.title}>آگهی قابل تایید نیست</Text>
        <Text style={m.desc}>
          اطلاعات ثبت‌شده کامل نیست یا با قوانین پلتفرم مطابقت ندارد. لطفاً آگهی
          را ویرایش کنید.
        </Text>
        <View
          style={{ flexDirection: 'row-reverse', gap: R(10), width: '100%' }}>
          <TouchableOpacity
            onPress={onEdit}
            style={[m.btn, { flex: 1, backgroundColor: C.gold }]}>
            <Icon name="create-outline" size={R(16)} color={C.bg} />
            <Text style={[m.btnTxt, { color: C.bg }]}>ویرایش آگهی</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={[
              m.btn,
              {
                flex: 0.7,
                backgroundColor: 'transparent',
                borderWidth: 1,
                borderColor: C.border,
              },
            ]}>
            <Text style={[m.btnTxt, { color: C.sub }]}>بستن</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const m = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: R(24),
  },
  box: {
    backgroundColor: C.surface,
    borderRadius: R(20),
    padding: R(24),
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: C.border,
  },
  iconWrap: {
    width: R(88),
    height: R(88),
    borderRadius: R(44),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    marginBottom: R(16),
  },
  title: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(18),
    fontWeight: 'bold',
    marginBottom: R(10),
    textAlign: 'center',
  },
  desc: {
    color: C.sub,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'center',
    lineHeight: R(22),
    marginBottom: R(20),
  },
  btn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(8),
    height: R(48),
    borderRadius: R(12),
    paddingHorizontal: R(16),
  },
  btnTxt: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(14),
    fontWeight: 'bold',
  },
});

// ─── BusinessCard ─────────────────────────────────────
const BusinessCard = ({ data, onEdit }) => {
  const [activeTab, setActiveTab] = useState('team');
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);
  const insets = useSafeAreaInsets();

  // safe defaults برای داده‌های اختیاری
  const team = data.team || [];
  const portfolio = data.portfolio || [];

  const FLOAT_H = R(52) + R(24) + R(12) + insets.bottom + R(60);

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar
        backgroundColor={C.bg}
        barStyle="light-content"
        translucent={false}
      />

      <ApproveModal
        visible={showApprove}
        onClose={() => setShowApprove(false)}
      />
      <RejectModal
        visible={showReject}
        onClose={() => setShowReject(false)}
        onEdit={() => {
          setShowReject(false);
          onEdit?.();
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: R(8), paddingBottom: FLOAT_H }}>
        {/* هدر آگهی */}
        <View style={bc.hero}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              gap: R(14),
            }}>
            <View>
              {data.profilePhoto ? (
                <Image source={{ uri: data.profilePhoto }} style={bc.avatar} />
              ) : (
                <View
                  style={[
                    bc.avatar,
                    {
                      backgroundColor: C.surface2,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}>
                  <Icon name="storefront-outline" size={R(32)} color={C.gold} />
                </View>
              )}
              <View style={bc.verifiedBadge}>
                <Icon name="checkmark" size={R(9)} color={C.bg} />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={bc.bizName}>{data.bizName || 'نام کسب‌وکار'}</Text>
              <Text style={bc.bizType}>{data.bizType}</Text>
              <View
                style={{
                  flexDirection: 'row-reverse',
                  alignItems: 'center',
                  gap: R(4),
                  marginTop: R(4),
                }}>
                <Icon name="location-outline" size={R(12)} color={C.sub} />
                <Text style={bc.location}>
                  {[data.district, data.city, data.province]
                    .filter(Boolean)
                    .join('، ')}
                </Text>
              </View>
            </View>
          </View>

          {/* آمار */}
          <View style={bc.statsRow}>
            {[
              { num: team.length, label: 'عضو تیم' },
              { num: portfolio.length, label: 'نمونه کار' },
            ].map((item, i, arr) => (
              <React.Fragment key={item.label}>
                <View style={bc.statItem}>
                  <Text style={bc.statNum}>{toFa(item.num)}</Text>
                  <Text style={bc.statLabel}>{item.label}</Text>
                </View>
                {i < arr.length - 1 && <View style={bc.statDivider} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* اطلاعات مالک */}
        <View style={bc.infoCard}>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <View style={bc.phoneRow}>
              <Icon name="call-outline" size={R(14)} color={C.gold} />
              <Text style={bc.phoneNum}>{data.phone}</Text>
            </View>
            <View style={{ alignItems: 'flex-start' }}>
              <Text
                style={{ color: C.sub, fontFamily: 'vazir', fontSize: R(11) }}>
                صاحب کسب‌وکار
              </Text>
              <Text
                style={{
                  color: C.white,
                  fontFamily: 'vazir',
                  fontSize: R(14),
                  fontWeight: 'bold',
                }}>
                {data.ownerName}
              </Text>
            </View>
          </View>
          {data.description ? (
            <Text
              style={{
                color: C.sub,
                fontFamily: 'vazir',
                fontSize: R(13),
                textAlign: 'left',
                marginTop: R(12),
                lineHeight: R(22),
              }}>
              {data.description}
            </Text>
          ) : null}
        </View>

        {/* تب‌ها */}
        <View style={bc.tabs}>
          {[
            { key: 'team', label: 'تیم', icon: 'people-outline' },
            { key: 'portfolio', label: 'نمونه کار', icon: 'images-outline' },
          ].map(tab => (
            <TouchableOpacity
              key={tab.key}
              onPress={() => setActiveTab(tab.key)}
              style={[bc.tab, activeTab === tab.key && bc.tabActive]}>
              <Icon
                name={tab.icon}
                size={R(14)}
                color={activeTab === tab.key ? C.gold : C.sub}
              />
              <Text
                style={[bc.tabTxt, activeTab === tab.key && bc.tabTxtActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* محتوای تب */}
        <View style={{ paddingHorizontal: R(16), marginTop: R(8) }}>
          {/* تیم */}
          {activeTab === 'team' &&
            (team.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: R(30) }}>
                <Icon name="people-outline" size={R(40)} color={C.border} />
                <Text
                  style={{
                    color: C.sub,
                    fontFamily: 'vazir',
                    fontSize: R(13),
                    marginTop: R(10),
                  }}>
                  عضو تیمی ثبت نشده
                </Text>
              </View>
            ) : (
              <View
                style={{
                  flexDirection: 'row-reverse',
                  flexWrap: 'wrap',
                  gap: R(12),
                  justifyContent: 'flex-end',
                }}>
                {team.map(member => (
                  <View key={member.id} style={bc.memberCard}>
                    <PhotoCircle size={R(64)} uri={member.photo} />
                    <Text
                      style={{
                        color: C.white,
                        fontFamily: 'vazir',
                        fontSize: R(12),
                        textAlign: 'center',
                        marginTop: R(6),
                      }}>
                      {member.name || '—'}
                    </Text>
                    <Text
                      style={{
                        color: C.sub,
                        fontFamily: 'vazir',
                        fontSize: R(10),
                        textAlign: 'center',
                      }}>
                      {member.role || ''}
                    </Text>
                  </View>
                ))}
              </View>
            ))}

          {/* نمونه کار */}
          {activeTab === 'portfolio' &&
            (portfolio.length === 0 ? (
              <View style={{ alignItems: 'center', paddingVertical: R(30) }}>
                <Icon name="images-outline" size={R(40)} color={C.border} />
                <Text
                  style={{
                    color: C.sub,
                    fontFamily: 'vazir',
                    fontSize: R(13),
                    marginTop: R(10),
                  }}>
                  نمونه کاری ثبت نشده
                </Text>
              </View>
            ) : (
              portfolio.map(item => (
                <View key={item.id} style={bc.portfolioItem}>
                  <View
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: R(10),
                    }}>
                    <View
                      style={{
                        backgroundColor: C.goldSoft,
                        borderRadius: R(8),
                        paddingHorizontal: R(8),
                        paddingVertical: R(3),
                        borderWidth: 1,
                        borderColor: C.goldBorder,
                      }}>
                      <Text
                        style={{
                          color: C.gold,
                          fontFamily: 'vazir',
                          fontSize: R(11),
                        }}>
                        {item.serviceType || 'خدمت'}
                      </Text>
                    </View>
                    <Text
                      style={{
                        color: C.white,
                        fontFamily: 'vazir',
                        fontSize: R(14),
                        fontWeight: 'bold',
                      }}>
                      {item.title}
                    </Text>
                  </View>
                  {item.description ? (
                    <Text
                      style={{
                        color: C.sub,
                        fontFamily: 'vazir',
                        fontSize: R(12),
                        textAlign: 'left',
                        marginBottom: R(10),
                      }}>
                      {item.description}
                    </Text>
                  ) : null}
                  {item.photos?.length > 0 && (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={{ gap: R(8) }}>
                      {item.photos.map((uri, i) => (
                        <Image
                          key={i}
                          source={{ uri }}
                          style={{
                            width: R(100),
                            height: R(100),
                            borderRadius: R(10),
                          }}
                        />
                      ))}
                    </ScrollView>
                  )}
                </View>
              ))
            ))}
        </View>
      </ScrollView>

      {/* دکمه‌های شناور */}
      <View style={[bc.floatWrap, { paddingBottom: insets.bottom + R(12) }]}>
        <View style={{ flexDirection: 'row-reverse', gap: R(10) }}>
          {/* تایید */}
          <TouchableOpacity
            onPress={() => setShowApprove(true)}
            style={[bc.actionBtn, { flex: 1, backgroundColor: '#43A047' }]}>
            <Icon
              name="checkmark-circle-outline"
              size={R(20)}
              color={C.white}
            />
            <Text style={bc.actionBtnTxt}>تایید آگهی</Text>
          </TouchableOpacity>
          {/* رد */}
          <TouchableOpacity
            onPress={() => setShowReject(true)}
            style={[bc.actionBtn, { flex: 1, backgroundColor: C.red }]}>
            <Icon name="close-circle-outline" size={R(20)} color={C.white} />
            <Text style={bc.actionBtnTxt}>رد آگهی</Text>
          </TouchableOpacity>
        </View>
        {/* ویرایش */}
        <TouchableOpacity onPress={onEdit} style={bc.editBtn}>
          <Icon name="create-outline" size={R(18)} color={C.gold} />
          <Text style={{ color: C.gold, fontFamily: 'vazir', fontSize: R(13) }}>
            ویرایش آگهی
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const bc = StyleSheet.create({
  hero: {
    backgroundColor: C.surface,
    margin: R(16),
    marginTop: R(12),
    borderRadius: R(20),
    padding: R(18),
    borderWidth: 1,
    borderColor: C.border,
  },
  avatar: {
    width: R(80),
    height: R(80),
    borderRadius: R(40),
    borderWidth: 2,
    borderColor: C.gold,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: -R(2),
    width: R(20),
    height: R(20),
    borderRadius: R(10),
    backgroundColor: C.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: C.surface,
  },
  bizName: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(20),
    fontWeight: 'bold',
    textAlign: 'left',
  },
  bizType: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(13),
    textAlign: 'left',
    marginTop: R(2),
  },
  location: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: R(18),
    paddingTop: R(14),
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  statItem: { alignItems: 'center', gap: R(2) },
  statNum: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(20),
    fontWeight: 'bold',
  },
  statLabel: { color: C.sub, fontFamily: 'vazir', fontSize: R(11) },
  statDivider: { width: 1, height: R(32), backgroundColor: C.border },
  infoCard: {
    backgroundColor: C.surface,
    marginHorizontal: R(16),
    borderRadius: R(16),
    padding: R(16),
    borderWidth: 1,
    borderColor: C.border,
    marginBottom: R(16),
  },
  phoneRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: R(6),
    backgroundColor: C.goldSoft,
    borderRadius: R(10),
    paddingHorizontal: R(10),
    paddingVertical: R(6),
    borderWidth: 1,
    borderColor: C.goldBorder,
  },
  phoneNum: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(13),
    fontWeight: 'bold',
  },
  tabs: {
    flexDirection: 'row-reverse',
    marginHorizontal: R(16),
    backgroundColor: C.surface,
    borderRadius: R(14),
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  tab: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(5),
    paddingVertical: R(12),
  },
  tabActive: { backgroundColor: C.goldSoft },
  tabTxt: { color: C.sub, fontFamily: 'vazir', fontSize: R(12) },
  tabTxtActive: {
    color: C.gold,
    fontFamily: 'vazir',
    fontSize: R(12),
    fontWeight: 'bold',
  },
  memberCard: { alignItems: 'center', width: R(90) },
  portfolioItem: {
    backgroundColor: C.surface,
    borderRadius: R(16),
    padding: R(16),
    marginBottom: R(12),
    borderWidth: 1,
    borderColor: C.border,
  },
  floatWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: R(16),
    paddingTop: R(12),
    backgroundColor: C.bg,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: R(8),
  },
  actionBtn: {
    height: R(48),
    borderRadius: R(14),
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(8),
  },
  actionBtnTxt: {
    color: C.white,
    fontFamily: 'vazir',
    fontSize: R(14),
    fontWeight: 'bold',
  },
  editBtn: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: R(6),
    paddingVertical: R(8),
  },
});

export default BusinessCard;
