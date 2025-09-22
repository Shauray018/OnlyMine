// components/CameraControls.tsx
import { useCameraSettingsStore } from "@/lib/store/cameraStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { Pressable, View } from "react-native";

interface CameraControlsProps {
  onTakePicture: () => void;
  onRecordVideo: () => void;
}

export const CameraControls = ({ onTakePicture, onRecordVideo }: CameraControlsProps) => {
  const { mode, recording, toggleMode, toggleFacing } = useCameraSettingsStore();

  return (
    <View
      style={{
        position: "absolute",
        left: 0,
        bottom:40,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 28, // px-7 => 7 * 4px
      }}
    >
      {/* Toggle mode button */}
      <Pressable onPress={toggleMode}>
        {mode === "picture" ? (
          <AntDesign name="picture" size={32} color="white" />
        ) : (
          <Feather name="video" size={32} color="white" />
        )}
      </Pressable>

      {/* Capture button */}
      <Pressable onPress={mode === "picture" ? onTakePicture : onRecordVideo}>
        {({ pressed }) => (
          <View
            style={{
              backgroundColor: "transparent", // bg-inherit
              borderWidth: 4,
              borderColor: "white",
              width: 80, // w-20 => 20 * 4px
              height: 80, // h-20 => 20 * 4px
              borderRadius: 40, // rounded-full
              alignItems: "center",
              justifyContent: "center",
              opacity: pressed ? 0.5 : 1,
            }}
          >
            <View
              style={{
                width: 64, // w-16 => 16 * 4px
                height: 64, // h-16
                borderRadius: 32, // rounded-full
                backgroundColor:
                  mode === "picture" ? "white" : recording ? "red" : "white",
              }}
            />
          </View>
        )}
      </Pressable>

      {/* Flip camera button */}
      <Pressable onPress={toggleFacing}>
        <FontAwesome6 name="rotate-left" size={32} color="white" />
      </Pressable>
    </View>
  );
};
