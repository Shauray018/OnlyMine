import { CustomHeader } from '@/components/common/CustomHeader';
import { CustomTabBar } from '@/components/common/CustomTabBar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        header: () => <CustomHeader />,
      }} 
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "Feed",
        }}
      />
      <Tabs.Screen
        name="dailymine"
        options={{
          title: "DailyMine",
        }}
      />
      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          headerShown: false, // Hide header on camera tab
        }}
      />
      <Tabs.Screen
        name="trending"
        options={{
          title: "Trending",
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "wallet",
        }}
      />
    </Tabs>
  );
}