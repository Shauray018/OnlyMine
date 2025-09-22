import { useCameraSettingsStore } from "@/lib/store/cameraStore";
import { CameraView } from "expo-camera";
import { forwardRef } from "react";
import { Dimensions, View } from "react-native";
import { CameraControls } from "./CameraControl";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

interface CameraViewComponentProps {
  onTakePicture: () => void;
  onRecordVideo: () => void;
}

export const CameraViewComponent = forwardRef<CameraView, CameraViewComponentProps>(
  ({ onTakePicture, onRecordVideo }, ref) => {
    const { mode, facing } = useCameraSettingsStore();
    
    // Calculate square viewfinder size (use screen width with some padding)
    const squareSize = screenWidth - 40; // 20px padding on each side
    const topBottomOverlay = (screenHeight - squareSize) / 2;

    return (
      <View style={{ flex: 1, width: "100%" }}>
        <CameraView
          ref={ref}
          mode={mode}
          facing={facing}
          mute={false}
          responsiveOrientationWhenOrientationLocked
          style={{
            flex: 1, 
            width: "100%"
          }}
        >
          {/* Top overlay */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: topBottomOverlay,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }} />
          
          {/* Bottom overlay */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: topBottomOverlay-83,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }} />
          
          {/* Left overlay */}
          <View style={{
            position: 'absolute',
            top: topBottomOverlay,
            left: 0,
            width: 20,
            height: squareSize,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }} />
          
          {/* Right overlay */}
          <View style={{
            position: 'absolute',
            top: topBottomOverlay,
            right: 0,
            width: 20,
            height: squareSize,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          }} />
          
          {/* Square frame border */}
          <View style={{
            position: 'absolute',
            top: 0,
            left: 20,
            borderWidth: 2,
            borderColor: 'white',
            borderRadius: 10,
          }} />
          
          <CameraControls 
            onTakePicture={onTakePicture} 
            onRecordVideo={onRecordVideo} 
          />
        </CameraView>
      </View>
    );
  }
);
