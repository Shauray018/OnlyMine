import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    Image,
    PanResponder,
    StyleSheet,
    Text,
    View,
} from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = 0.7; // 70% of the container width

interface SwipeToConnectProps {
  onSwipeComplete: () => void;
}

const SwipeToConnect: React.FC<SwipeToConnectProps> = ({ onSwipeComplete }) => {
  const pan = useRef(new Animated.Value(0)).current;
  const containerWidth = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset(pan._value);
        pan.setValue(0);
      },
      onPanResponderMove: (_, gesture) => {
        const maxSwipe = containerWidth.current - 70; // 70 is the circle diameter
        if (gesture.dx >= 0 && gesture.dx <= maxSwipe) {
          pan.setValue(gesture.dx);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        pan.flattenOffset();
        const maxSwipe = containerWidth.current - 70;
        const threshold = maxSwipe * SWIPE_THRESHOLD;

        if (gesture.dx >= threshold) {
          // Complete the swipe
          Animated.spring(pan, {
            toValue: maxSwipe,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
          }).start(() => {
            onSwipeComplete();
            // Reset after a delay
            setTimeout(() => {
              Animated.spring(pan, {
                toValue: 0,
                useNativeDriver: false,
              }).start();
            }, 300);
          });
        } else {
          // Reset to start
          Animated.spring(pan, {
            toValue: 0,
            useNativeDriver: false,
            tension: 50,
            friction: 7,
          }).start();
        }
      },
    })
  ).current;

  const onLayout = (event: any) => {
    containerWidth.current = event.nativeEvent.layout.width;
  };

  return (
    <View style={styles.actionCard} onLayout={onLayout}>
      <Animated.View
        style={[
          styles.iconCircle,
          {
            transform: [{ translateX: pan }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <Image
          source={require('./assets/container.svg')}
          style={styles.actionIcon}
        />
      </Animated.View>
      <View style={styles.actionTextContainer}>
        <Text style={styles.actionText}>Swipe to capture, share,</Text>
        <Text style={styles.actionTextBold}>OWN</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 35,
    padding: 5,
    paddingRight: 20,
    position: 'relative',
    height: 70,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 2,
  },
  actionIcon: {
    width: 30,
    height: 30,
  },
  actionTextContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  actionText: {
    fontSize: 16,
    color: '#666',
    marginRight: 5,
  },
  actionTextBold: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
  },
});