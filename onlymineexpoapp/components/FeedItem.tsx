import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react-native';
import React from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface FeedItemProps {
  post: {
    id: string;
    imageUrl: string;
    caption?: string;
    location?: string;
    likesCount: number;
    commentsCount: number;
    isLiked: boolean;
    isMinted: boolean;
    createdAt: string;
    user: {
      username: string;
      displayName: string;
      avatarUrl?: string;
    };
  };
  onLike: (postId: string, isLiked: boolean) => void;
  onComment?: (postId: string) => void;
  onShare?: (postId: string) => void;
}

export function FeedItem({ post, onLike, onComment, onShare }: FeedItemProps) {
  return (
    <View style={feedItemStyles.container}>
      {/* Header */}
      <View style={feedItemStyles.header}>
        <Image
          source={{ uri: post.user.avatarUrl || 'https://via.placeholder.com/40' }}
          style={feedItemStyles.avatar}
        />
        <View style={feedItemStyles.userInfo}>
          <Text style={feedItemStyles.displayName}>{post.user.displayName}</Text>
          <Text style={feedItemStyles.username}>@{post.user.username}</Text>
        </View>
        {post.isMinted && (
          <View style={feedItemStyles.nftBadge}>
            <Sparkles size={14} color="#000" />
            <Text style={feedItemStyles.nftText}>NFT</Text>
          </View>
        )}
      </View>

      {/* Image */}
      <Image
        source={{ uri: post.imageUrl }}
        style={feedItemStyles.image}
        resizeMode="cover"
      />

      {/* Actions */}
      <View style={feedItemStyles.actions}>
        <TouchableOpacity
          style={feedItemStyles.actionButton}
          onPress={() => onLike(post.id, post.isLiked)}
        >
          <Heart
            size={28}
            color={post.isLiked ? '#ff0066' : '#fff'}
            fill={post.isLiked ? '#ff0066' : 'none'}
          />
        </TouchableOpacity>
        {onComment && (
          <TouchableOpacity
            style={feedItemStyles.actionButton}
            onPress={() => onComment(post.id)}
          >
            <MessageCircle size={28} color="#fff" />
          </TouchableOpacity>
        )}
        {onShare && (
          <TouchableOpacity
            style={feedItemStyles.actionButton}
            onPress={() => onShare(post.id)}
          >
            <Share2 size={28} color="#fff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Likes */}
      <Text style={feedItemStyles.likes}>
        {post.likesCount.toLocaleString()}{' '}
        {post.likesCount === 1 ? 'like' : 'likes'}
      </Text>

      {/* Caption */}
      {post.caption && (
        <View style={feedItemStyles.captionContainer}>
          <Text style={feedItemStyles.caption}>
            <Text style={feedItemStyles.captionUsername}>
              @{post.user.username}
            </Text>{' '}
            {post.caption}
          </Text>
        </View>
      )}

      {/* Location */}
      {post.location && (
        <Text style={feedItemStyles.location}>📍 {post.location}</Text>
      )}
    </View>
  );
}

const feedItemStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#222',
  },
  userInfo: {
    flex: 1,
  },
  displayName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  username: {
    fontSize: 14,
    color: '#14F195',
    marginTop: 2,
  },
  nftBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#14F195',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  nftText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25,
    backgroundColor: '#222',
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 16,
  },
  actionButton: {
    padding: 4,
  },
  likes: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  captionContainer: {
    paddingHorizontal: 12,
    marginBottom: 4,
  },
  caption: {
    fontSize: 15,
    color: '#fff',
    lineHeight: 20,
  },
  captionUsername: {
    fontWeight: '700',
    color: '#fff',
  },
  location: {
    fontSize: 13,
    color: '#999',
    paddingHorizontal: 12,
    marginBottom: 4,
  },
});