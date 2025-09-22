import { CameraInactive } from "@/components/pages/CameraClicking/CameraInactive";
import { CameraPermission } from "@/components/pages/CameraClicking/CameraPermission";
import { CameraViewComponent } from "@/components/pages/CameraClicking/CameraViewComponent";
import RenderPicture from "@/components/pages/CameraClicking/RenderPicture";
import { useCameraSettingsStore, useCameraStore, useUriStore } from "@/lib/store/cameraStore";
import { useFocusEffect } from "@react-navigation/native";
import { useCameraPermissions } from "expo-camera";
import { useCallback, useEffect, useRef } from "react";
import { AppState, AppStateStatus, Dimensions, View } from "react-native";

const { width: screenWidth } = Dimensions.get('window');

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const ref = useRef(null);
  
  const { isActive, setActive } = useCameraStore();
  const { mode, recording, setRecording } = useCameraSettingsStore();
  const { uri, setUri } = useUriStore();

  // Handle app state changes (background/foreground)
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (nextAppState === 'background' || nextAppState === 'inactive') {
        setActive(false);
        if (recording) {
          setRecording(false);
          //@ts-ignore
          ref.current?.stopRecording();
        }
      } else if (nextAppState === 'active') {
        setActive(true);
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [recording, setActive, setRecording]);

  // Handle tab focus/blur (if using React Navigation)
  useFocusEffect(
    useCallback(() => {
      // Camera screen is focused
      setActive(true);
      
      return () => {
        // Camera screen is unfocused
        setActive(false);
        if (recording) {
          setRecording(false);
          //@ts-ignore
          ref.current?.stopRecording();
        }
      };
    }, [recording, setActive, setRecording])
  );

  if (!permission) {
    return null;
  }

  if (!permission.granted) {
    return <CameraPermission onRequestPermission={requestPermission} />;
  }

  const takePicture = async () => {
    if (!isActive) return;
    
    // Calculate square crop parameters
    const squareSize = Math.min(screenWidth, screenWidth); // Use screen width as square size
    const cropX = 0;
    const cropY = 0;
    
    //@ts-ignore
    const photo = await ref.current?.takePictureAsync({
      quality: 1,
      base64: false,
      exif: false,
      // Note: Expo Camera doesn't have built-in cropping, 
      // so we'll handle the square aspect in the display
    });
    
    setUri(photo?.uri);
  };

  const recordVideo = async () => {
    if (!isActive) return;
    
    if (recording) {
      setRecording(false);
          //@ts-ignore
      ref.current?.stopRecording();
      return;
    }
    setRecording(true);
    //@ts-ignore
    const video = await ref.current?.recordAsync();
    console.log({ video });
  };

  const renderCamera = () => {
    if (!isActive) {
      return <CameraInactive />;
    }

    return (
      <CameraViewComponent
        ref={ref}
        onTakePicture={takePicture}
        onRecordVideo={recordVideo}
      />
    );
  };

  return (
    <View 
      className="flex-1 items-center justify-center"
      style={{
        backgroundColor: uri ? '#18181b' : 'transparent' // zinc-900 when showing picture
      }}
    >
      {uri ? <RenderPicture /> : renderCamera()}
    </View>
  );
}