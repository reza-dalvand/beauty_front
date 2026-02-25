// src/components/explore/PortfolioPostModal.js
import React, { useState, useRef } from 'react';
import {
  View, Text, Image, Modal, TouchableOpacity, StyleSheet,
  FlatList, TextInput, KeyboardAvoidingView, Platform,
  ScrollView, Dimensions, TouchableWithoutFeedback, Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS, RADII, SHADOWS } from '../../theme/appTheme';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── داده‌های تستی کامنت ────────────────────────────
const MOCK_COMMENTS = [
  { id: 'c1', user: 'نیلوفر', avatar: 'https://i.pravatar.cc/40?img=5',  text: 'واقعاً عالی شده! 😍' },
  { id: 'c2', user: 'مهسا',   avatar: 'https://i.pravatar.cc/40?img=9',  text: 'چه رنگ قشنگی، چند ساعت طول کشید؟' },
  { id: 'c3', user: 'زهرا',   avatar: 'https://i.pravatar.cc/40?img=16', text: 'دستت درد نکنه، استاد!' },
];

// ─── نقطه‌های اندیکاتور اسلایدر ─────────────────────
const ImageDots = ({ count, activeIndex }) => (
  <View style={dotStyles.container}>
    {Array.from({ length: count }).map((_, i) => (
      <View key={i} style={[dotStyles.dot, i === activeIndex && dotStyles.dotActive]} />
    ))}
  </View>
);

const dotStyles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'center', gap: 5, marginVertical: 10 },
  dot:       { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.border },
  dotActive: { backgroundColor: COLORS.gold, width: 18 },
});

// ─── یک آیتم کامنت ──────────────────────────────────
const CommentItem = ({ item }) => (
  <View style={commentStyles.row}>
    <Image source={{ uri: item.avatar }} style={commentStyles.avatar} />
    <View style={commentStyles.bubble}>
      <Text style={commentStyles.user}>{item.user}</Text>
      <Text style={commentStyles.text}>{item.text}</Text>
    </View>
  </View>
);

const commentStyles = StyleSheet.create({
  row:    { flexDirection: 'row-reverse', alignItems: 'flex-start', marginBottom: 14, gap: 10 },
  avatar: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: COLORS.border },
  bubble: { flex: 1, backgroundColor: COLORS.surface, borderRadius: RADII.md, padding: 10, alignItems: 'flex-end' },
  user:   { color: COLORS.gold, fontSize: 12, fontFamily: FONTS.bold, marginBottom: 3 },
  text:   { color: COLORS.textMain, fontSize: 13, fontFamily: FONTS.regular, textAlign: 'right', lineHeight: 20 },
});

// ═══════════════════════════════════════════════════
//  MAIN MODAL
// ═══════════════════════════════════════════════════
const PortfolioPostModal = ({ visible, post, onClose }) => {
  const insets = useSafeAreaInsets();
  const [liked, setLiked]           = useState(false);
  const [likeCount, setLikeCount]   = useState(post?.likes ?? 0);
  const [saved, setSaved]           = useState(false);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments]     = useState(MOCK_COMMENTS);
  const [activeImg, setActiveImg]   = useState(0);
  const heartScale                  = useRef(new Animated.Value(1)).current;

  if (!post) return null;

  const images = post.images ?? [post.image];

  // ── انیمیشن قلب ──
  const handleLike = () => {
    setLiked(v => {
      const next = !v;
      setLikeCount(c => next ? c + 1 : c - 1);
      return next;
    });
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, bounciness: 20 }),
      Animated.spring(heartScale, { toValue: 1,   useNativeDriver: true }),
    ]).start();
  };

  // ── ارسال کامنت ──
  const handleSendComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [
      { id: Date.now().toString(), user: 'شما', avatar: 'https://i.pravatar.cc/40?img=33', text: commentText.trim() },
      ...prev,
    ]);
    setCommentText('');
  };

  return (
    <Modal visible={visible} transparent={false} animationType="slide" onRequestClose={onClose} statusBarTranslucent>
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}>

          {/* ── هدر: اطلاعات صاحب پست ── */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Icon name="close" size={24} color={COLORS.textMain} />
            </TouchableOpacity>
            <View style={styles.ownerInfo}>
              <View style={styles.ownerText}>
                <Text style={styles.ownerName}>{post.businessName}</Text>
                <Text style={styles.ownerCategory}>{post.category}</Text>
              </View>
              <Image source={{ uri: post.businessAvatar }} style={styles.ownerAvatar} />
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

            {/* ── اسلایدر عکس‌ها ── */}
            <FlatList
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(_, i) => i.toString()}
              onMomentumScrollEnd={e => {
                setActiveImg(Math.round(e.nativeEvent.contentOffset.x / SCREEN_W));
              }}
              renderItem={({ item }) => (
                <TouchableWithoutFeedback onPress={handleLike}>
                  <Image
                    source={{ uri: item }}
                    style={[styles.postImage, { width: SCREEN_W }]}
                    resizeMode="cover"
                  />
                </TouchableWithoutFeedback>
              )}
            />

            {/* نقطه‌های اندیکاتور */}
            {images.length > 1 && <ImageDots count={images.length} activeIndex={activeImg} />}

            {/* ── اکشن‌بار: لایک / کامنت / شیر / سیو ── */}
            <View style={styles.actions}>
              {/* سمت راست */}
              <View style={styles.actionsRight}>
                <TouchableOpacity style={styles.actionBtn} onPress={handleLike} activeOpacity={0.7}>
                  <Animated.View style={{ transform: [{ scale: heartScale }] }}>
                    <Icon name={liked ? 'heart' : 'heart-outline'} size={26}
                      color={liked ? '#FF4757' : COLORS.textMain} />
                  </Animated.View>
                  <Text style={[styles.actionCount, liked && { color: '#FF4757' }]}>
                    {likeCount}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <Icon name="chatbubble-outline" size={24} color={COLORS.textMain} />
                  <Text style={styles.actionCount}>{comments.length}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <Icon name="paper-plane-outline" size={24} color={COLORS.textMain} />
                  <Text style={styles.actionCount}>اشتراک</Text>
                </TouchableOpacity>
              </View>

              {/* سمت چپ: ذخیره */}
              <TouchableOpacity onPress={() => setSaved(v => !v)} activeOpacity={0.7}>
                <Icon name={saved ? 'bookmark' : 'bookmark-outline'} size={25}
                  color={saved ? COLORS.gold : COLORS.textMain} />
              </TouchableOpacity>
            </View>

            {/* ── کپشن ── */}
            {post.caption && (
              <View style={styles.captionWrap}>
                <Text style={styles.caption}>
                  <Text style={styles.captionUser}>{post.businessName}  </Text>
                  {post.caption}
                </Text>
              </View>
            )}

            {/* ── کامنت‌ها ── */}
            <View style={styles.commentsSection}>
              <Text style={styles.commentsTitle}>نظرات ({comments.length})</Text>
              {comments.map(c => <CommentItem key={c.id} item={c} />)}
            </View>

          </ScrollView>

          {/* ── اینپوت کامنت (پایین ثابت) ── */}
          <View style={[styles.commentInput, { paddingBottom: insets.bottom > 0 ? insets.bottom : 12 }]}>
            <TouchableOpacity style={styles.sendBtn} onPress={handleSendComment} activeOpacity={0.8}>
              <Icon name="send" size={18} color={COLORS.background} />
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              placeholder="نظر بده..."
              placeholderTextColor={COLORS.textSub}
              value={commentText}
              onChangeText={setCommentText}
              textAlign="right"
              returnKeyType="send"
              onSubmitEditing={handleSendComment}
            />
            <Image
              source={{ uri: 'https://i.pravatar.cc/40?img=33' }}
              style={styles.myAvatar}
            />
          </View>

        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // ── کانتینر تمام‌صفحه ──
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  // ── هدر ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ownerInfo: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 10,
  },
  ownerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  ownerText: {
    alignItems: 'flex-end',
  },
  ownerName: {
    color: COLORS.textMain,
    fontSize: 14,
    fontFamily: FONTS.bold,
  },
  ownerCategory: {
    color: COLORS.gold,
    fontSize: 11,
    fontFamily: FONTS.regular,
  },
  // ── تصویر ──
  postImage: {
    height: SCREEN_W,
    backgroundColor: '#111',
  },
  // ── اکشن‌ها ──
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  actionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  actionCount: {
    color: COLORS.textMain,
    fontSize: 13,
    fontFamily: FONTS.regular,
  },
  // ── کپشن ──
  captionWrap: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  caption: {
    color: COLORS.textSub,
    fontSize: 13,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    lineHeight: 22,
  },
  captionUser: {
    color: COLORS.textMain,
    fontFamily: FONTS.bold,
  },
  // ── کامنت‌ها ──
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  commentsTitle: {
    color: COLORS.textSub,
    fontSize: 12,
    fontFamily: FONTS.regular,
    textAlign: 'right',
    marginBottom: 14,
  },
  // ── اینپوت ──
  commentInput: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
    gap: 10,
  },
  sendBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    ...SHADOWS.goldButton,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: RADII.round,
    paddingHorizontal: 14,
    color: COLORS.textMain,
    fontFamily: FONTS.regular,
    fontSize: 13,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  myAvatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
});

export default PortfolioPostModal;