// app/(tabs)/home.tsx (or index.tsx)
import { useAuth } from '@/components/contexts/AuthContext';
import { Heart, MessageCircle, Share2, Sparkles } from 'lucide-react-native';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';


const API_URL = process.env.EXPO_PUBLIC_API_URL;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Post {
  id: string;
  imageUrl: string;
  caption?: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  isLiked: boolean;
  isMinted: boolean;
  trendingScore: number;
  createdAt: string;
  user: {
    id: string;
    username: string;
    displayName: string;
    avatarUrl?: string;
    walletAddress: string;
  };
}

export default function FeedScreen() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchFeed();
  }, []);

  const fetchFeed = async (refresh = false) => {
    if (loading || (!hasMore && !refresh)) return;

    setLoading(true);
    if (refresh) {
      setRefreshing(true);
      setCursor(null);
      setHasMore(true);
    }

    try {
      const url = `${API_URL}/api/feed?limit=10${
        cursor && !refresh ? `&cursor=${cursor}` : ''
      }${user?.id ? `&userId=${user.id}` : ''}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch feed');
      }

      const data = await response.json();

      if (refresh) {
        setPosts(data.posts);
      } else {
        setPosts(prev => [...prev, ...data.posts]);
      }

      setCursor(data.nextCursor);
      setHasMore(!!data.nextCursor);
    } catch (error) {
      console.error('Feed fetch error:', error);
      alert('Failed to load feed. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLike = async (postId: string, currentlyLiked: boolean) => {
    if (!user) {
      alert('Please connect your wallet to like posts');
      return;
    }

    // Optimistic update
    setPosts(prev =>
      prev.map(post =>
        post.id === postId
          ? {
              ...post,
              isLiked: !currentlyLiked,
              likesCount: currentlyLiked
                ? post.likesCount - 1
                : post.likesCount + 1,
            }
          : post
      )
    );

    try {
      const method = currentlyLiked ? 'DELETE' : 'POST';
      const response = await fetch(`${API_URL}/api/posts/${postId}/like`, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        throw new Error('Failed to like post');
      }
    } catch (error) {
      console.error('Like error:', error);
      // Revert optimistic update
      setPosts(prev =>
        prev.map(post =>
          post.id === postId
            ? {
                ...post,
                isLiked: currentlyLiked,
                likesCount: currentlyLiked
                  ? post.likesCount + 1
                  : post.likesCount - 1,
              }
            : post
        )
      );
      alert('Failed to like post. Please try again.');
    }
  };

  const onRefresh = useCallback(() => {
    fetchFeed(true);
  }, []);

  const renderPost = ({ item }: { item: Post }) => (
    <View style={styles.postContainer}>
      {/* Header */}
      <View style={styles.postHeader}>
        <Image
          source={{ uri: item.user.avatarUrl || 'https://via.placeholder.com/40' }}
          style={styles.avatar}
        />
        <View style={styles.userInfo}>
          <Text style={styles.displayName}>{item.user.displayName}</Text>
          <Text style={styles.username}>@{item.user.username}</Text>
        </View>
        {item.isMinted && (
          <View style={styles.nftBadge}>
            <Sparkles size={14} color="#000" />
            <Text style={styles.nftText}>NFT</Text>
          </View>
        )}
      </View>

      {/* Image */}
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
        resizeMode="cover"
      />

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleLike(item.id, item.isLiked)}
        >
          <Heart
            size={28}
            color={item.isLiked ? '#ff0066' : '#fff'}
            fill={item.isLiked ? '#ff0066' : 'none'}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <MessageCircle size={28} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Share2 size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <Text style={styles.likes}>
        {item.likesCount.toLocaleString()} {item.likesCount === 1 ? 'like' : 'likes'}
      </Text>

      {/* Caption */}
      {item.caption && (
        <View style={styles.captionContainer}>
          <Text style={styles.caption}>
            <Text style={styles.captionUsername}>@{item.user.username}</Text>{' '}
            {item.caption}
          </Text>
        </View>
      )}

      {/* Location */}
      {item.location && (
        <Text style={styles.location}>📍 {item.location}</Text>
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>
        {getTimeAgo(new Date(item.createdAt))}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || refreshing) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#14F195" />
      </View>
    );
  };

  const renderEmpty = () => {
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No posts yet</Text>
        <Text style={styles.emptySubtext}>
          Be the first to share something amazing!
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={item => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#14F195"
            colors={['#14F195']}
          />
        }
        onEndReached={() => fetchFeed()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// Helper function for timestamp
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';

  return Math.floor(seconds) + 's ago';
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  postContainer: {
    marginBottom: 20,
    backgroundColor: '#000',
  },
  postHeader: {
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
  postImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH * 1.25, // 4:5 aspect ratio
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
  timestamp: {
    fontSize: 13,
    color: '#666',
    paddingHorizontal: 12,
    marginTop: 4,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 100,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 15,
    color: '#444',
  },
});

