import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const COLORS = {
  background: '#0B0B0B',
  surface: '#1A1A1A',
  gold: '#D4AF37',
  textMain: '#FFFFFF',
  textSub: '#A0A0A0',
  border: '#333',
  error: '#E53935',
};

const EditProfileScreen = ({ navigation }) => {
  const [name, setName] = useState('رضا محبی');
  const [phone] = useState('09123456789');
  const [bio, setBio] = useState('در جستجوی بهترین خدمات زیبایی...');

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}>

        {/* هدر صفحه */}
        {/* <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="chevron-forward-outline" size={28} color={COLORS.textMain} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ویرایش مشخصات</Text>
          <View style={{ width: 28 }} />
        </View> */}

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>

          {/* بخش تغییر عکس پروفایل */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: 'https://i.pravatar.cc/150?img=33' }}
                style={styles.avatar}
              />
              <TouchableOpacity style={styles.changePicBtn}>
                <Icon name="camera" size={20} color={COLORS.background} />
              </TouchableOpacity>
            </View>
            <Text style={styles.changePicText}>تغییر عکس پروفایل</Text>
          </View>

          {/* فرم مشخصات */}
          <View style={styles.form}>

            {/* نام */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>نام و نام خانوادگی</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholderTextColor={COLORS.textSub}
                  textAlign="right"
                />
                <Icon name="person-outline" size={20} color={COLORS.gold} />
              </View>
            </View>

            {/* موبایل - غیر قابل ویرایش */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>شماره موبایل</Text>
              <View style={[styles.inputWrapper, styles.disabledInput]}>
                <TextInput
                  style={[styles.input, { color: COLORS.textSub }]}
                  value={phone}
                  editable={false}
                  textAlign="right"
                />
                <Icon name="call-outline" size={20} color={COLORS.textSub} />
              </View>
              <Text style={styles.helperText}>شماره موبایل قابل تغییر نیست</Text>
            </View>

            {/* بیوگرافی */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>توضیحات (بیوگرافی)</Text>
              <View style={[styles.inputWrapper, styles.bioWrapper]}>
                <TextInput
                  style={[styles.input, styles.bioInput]}
                  value={bio}
                  onChangeText={setBio}
                  multiline
                  numberOfLines={4}
                  textAlign="right"
                  textAlignVertical="top"
                  placeholderTextColor={COLORS.textSub}
                />
                <Icon
                  name="document-text-outline"
                  size={20}
                  color={COLORS.gold}
                  style={{ alignSelf: 'flex-start', marginTop: 4 }}
                />
              </View>
            </View>

          </View>

          {/* دکمه ذخیره */}
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
            <Text style={styles.saveBtnText}>ذخیره تغییرات</Text>
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerTitle: {
    color: COLORS.textMain,
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'vazir',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 150,
  },
  avatarSection: {
    alignItems: 'center',
    marginTop: "15%",
    marginBottom: 40,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  changePicBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.background,
  },
  changePicText: {
    color: COLORS.gold,
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'vazir',
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 25,
  },
  label: {
    color: COLORS.textSub,
    marginBottom: 8,
    fontSize: 14,
    fontFamily: 'vazir',
    textAlign: 'left',
  },
  inputWrapper: {
    flexDirection: 'row-reverse',
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 55,
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  bioWrapper: {
    height: 110,
    alignItems: 'flex-end',
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    flex: 1,
    color: COLORS.textMain,
    fontFamily: 'vazir',
    fontSize: 15,
    marginRight: 10,
  },
  bioInput: {
    height: '100%',
    textAlignVertical: 'top',
  },
  disabledInput: {
    backgroundColor: '#121212',
    borderColor: '#222',
  },
  helperText: {
    color: COLORS.textSub,
    fontSize: 11,
    textAlign: 'left',
    marginTop: 5,
    fontFamily: 'vazir',
  },
  saveBtn: {
    backgroundColor: COLORS.gold,
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveBtnText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'vazir',
  },
});

export default EditProfileScreen;