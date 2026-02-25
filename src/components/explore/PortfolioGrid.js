// src/components/explore/PortfolioGrid.js
// گرید ۳ ستونه اینستاگرام‌مانند برای نمونه کارها
import React, { useState } from 'react';
import {
  View, Image, TouchableOpacity, FlatList,
  StyleSheet, Dimensions, Text,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { COLORS, FONTS } from '../../theme/appTheme';
import PortfolioPostModal from './PortfolioPostModal';

const { width: SCREEN_W } = Dimensions.get('window');
const CELL_SIZE = (SCREEN_W - 2) / 3; // 2px برای 2 خط جداکننده

/**
 * PortfolioGrid
 * @param {Array} posts - آرایه پست‌ها
 * { id, images[], image, businessName, businessAvatar, category, likes, caption }
 * @param {Array} header - هدر لیست (از FlatList ListHeaderComponent)
 */
const PortfolioGrid = ({ posts, ListHeaderComponent }) => {
  const [selectedPost, setSelectedPost] = useState(null);

  // تبدیل آرایه به ردیف‌های ۳تایی
  const rows = [];
  for (let i = 0; i < posts.length; i += 3) {
    rows.push(posts.slice(i, i + 3));
  }

  const renderRow = ({ item: row, index: rowIndex }) => (
    <View style={styles.row}>
      {row.map((post, colIndex) => {
        const isFirst = colIndex === 0;
        const hasMultiple = (post.images?.length ?? 1) > 1;

        return (
          <TouchableOpacity
            key={post.id}
            style={[
              styles.cell,
              !isFirst && styles.cellGap,
            ]}
            onPress={() => setSelectedPost(post)}
            activeOpacity={0.88}>

            <Image
              source={{ uri: post.images?.[0] ?? post.image }}
              style={styles.cellImage}
              resizeMode="cover"
            />

            {/* آیکون چند عکسه */}
            {hasMultiple && (
              <View style={styles.multiIcon}>
                <Icon name="copy-outline" size={14} color="#FFF" />
              </View>
            )}

            {/* تعداد لایک روی عکس */}
            <View style={styles.likeOverlay}>
              <Icon name="heart" size={11} color="#FFF" />
              <Text style={styles.likeText}>{post.likes}</Text>
            </View>

          </TouchableOpacity>
        );
      })}

      {/* اگه ردیف ناقص بود، سلول خالی پر کن */}
      {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
        <View key={`empty-${i}`} style={[styles.cell, styles.cellGap, styles.cellEmpty]} />
      ))}
    </View>
  );

  return (
    <>
      <FlatList
        data={rows}
        keyExtractor={(_, i) => i.toString()}
        ListHeaderComponent={ListHeaderComponent}
        renderItem={renderRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.rowSep} />}
      />

      <PortfolioPostModal
        visible={!!selectedPost}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 120,
  },
  row: {
    flexDirection: 'row',
  },
  rowSep: {
    height: 2,
    backgroundColor: COLORS.background,
  },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    position: 'relative',
    overflow: 'hidden',
  },
  cellGap: {
    marginLeft: 1,
  },
  cellEmpty: {
    backgroundColor: COLORS.surface,
  },
  cellImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
  },
  multiIcon: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    padding: 3,
  },
  likeOverlay: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 3,
  },
  likeText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: FONTS.regular,
  },
});

export default PortfolioGrid;