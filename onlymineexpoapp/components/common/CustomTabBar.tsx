import HomeIcon from "@/assets/icons/HomeIcon";
import HomeIconActive from "@/assets/icons/HomeIconActive";
import TrendingIcon from "@/assets/icons/TrendingIcon";
import TrendingIconActive from "@/assets/icons/TrendingIconActive";
import { BlurView } from "expo-blur";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import CameraIcon from "../../assets/icons/CameraIcon";
import CameraIconActive from "../../assets/icons/CameraIconActive";

export function CustomTabBar({ state, descriptors, navigation }: any) {
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScrollY = useRef(0);
  const isHidden = useRef(false);

  useEffect(() => {
    // Listen for scroll events from the active screen
    const unsubscribe = navigation.addListener('state', () => {
      // This will trigger on navigation state changes
    });

    return unsubscribe;
  }, [navigation]);

  // Export scroll handler to be used by screens
  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    if (scrollDiff > 5 && !isHidden.current) {
      // Scrolling down - hide tab bar
      isHidden.current = true;
      Animated.timing(translateY, {
        toValue: 150,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5 && isHidden.current) {
      // Scrolling up - show tab bar
      isHidden.current = false;
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  // Store the handler in a global context or navigation params
  useEffect(() => {
    (global as any).tabBarScrollHandler = handleScroll;
  }, []);

  // Check if camera tab is active
  const isCameraActive = state.routes[state.index]?.name === "camera";

  // Hide tab bar when camera is active
  if (isCameraActive) {
    return null;
  }

  return (
    <Animated.View 
      style={[
        styles.tabBarContainer,
        {
          transform: [{ translateY }]
        }
      ]}
    >
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.tabBar}>
          {state.routes.map((route: any, index: number) => {
            const { options } = descriptors[route.key];
            const isFocused = state.index === index;

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            // Render icon based on route
            const renderIcon = () => {
              const iconColor = isFocused ? "#00FF00" : "#FFFFFF";
              switch (route.name) {
                case "camera":
                  const CameraComponent = isFocused ? CameraIconActive : CameraIcon;
                  return <CameraComponent />;
                case "feed":
                  const HomeComponent = isFocused ? HomeIconActive : HomeIcon;
                  return <HomeComponent />;
                case "dailymine":
                  return <View style={[styles.placeholderIcon, { backgroundColor: iconColor }]} />;
                case "trending":
                  const TrendingComponent = isFocused ? TrendingIconActive : TrendingIcon;
                  return <TrendingComponent />;
                case "wallet":
                  return <View style={[styles.placeholderIcon, { backgroundColor: iconColor }]} />;
                default:
                  return <View style={[styles.placeholderIcon, { backgroundColor: iconColor }]} />;
              }
            };

            // Label mapping
            const getLabel = () => {
              switch (route.name) {
                case "feed":
                  return "Feed";
                case "dailymine":
                  return "DailyMine";
                case "camera":
                  return "Camera";
                case "trending":
                  return "Trending";
                case "wallet":
                  return "Wallet";
                default:
                  return route.name;
              }
            };

            const label = getLabel();

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={onPress}
                style={styles.tabItem}
              >
                {renderIcon()}
                {isFocused && label && (
                  <Text style={[
                    styles.labelText,
                    { color: "#00FF00" }
                  ]}>
                    {label}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: "absolute",
    bottom: 20, // Floating margin from bottom
    left: 0,
    right: 0,
    paddingHorizontal: 10,
  },
  blurContainer: {
    borderRadius: 50,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#3F3F46",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 30, 30, 1)",
    height: 80,
    paddingBottom: 5,
    paddingTop: 5,
    justifyContent: "space-between",
    paddingHorizontal: 5,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  placeholderIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
  },
  labelText: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
});