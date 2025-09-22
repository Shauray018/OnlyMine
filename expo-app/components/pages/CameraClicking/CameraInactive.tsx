// components/CameraInactive.tsx
import { View, Text } from "react-native";

export const CameraInactive = () => {
  return (
    <View className="flex-1 w-full bg-black items-center justify-center">
      <Text className="text-white text-lg">Camera is inactive</Text>
    </View>
  );
};