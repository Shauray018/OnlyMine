// components/CameraPermission.tsx
import { View, Text, Button } from "react-native";

interface CameraPermissionProps {
  onRequestPermission: () => void;
}

export const CameraPermission = ({ onRequestPermission }: CameraPermissionProps) => {
  return (
    <View className="flex-1 bg-white items-center justify-center px-4">
      <Text className="text-center mb-4 text-gray-700">
        We need your permission to use the camera
      </Text>
      <Button onPress={onRequestPermission} title="Grant permission" />
    </View>
  );
};