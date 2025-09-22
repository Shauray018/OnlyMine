// store/cameraStore.ts
import { create } from 'zustand';
import { CameraMode, CameraType } from 'expo-camera';

interface CameraState {
  isActive: boolean;
  setActive: (active: boolean) => void;
}

interface CameraSettingsState {
  mode: CameraMode;
  facing: CameraType;
  recording: boolean;
  setMode: (mode: CameraMode) => void;
  setFacing: (facing: CameraType) => void;
  setRecording: (recording: boolean) => void;
  toggleMode: () => void;
  toggleFacing: () => void;
}

interface UriState {
  uri: string | null;
  setUri: (uri: string | null) => void;
}

export const useCameraStore = create<CameraState>((set) => ({
  isActive: true, // Start as true by default
  setActive: (active: boolean) => set({ isActive: active }),
}));

export const useCameraSettingsStore = create<CameraSettingsState>((set) => ({
  mode: 'picture',
  facing: 'back',
  recording: false,
  setMode: (mode) => set({ mode }),
  setFacing: (facing) => set({ facing }),
  setRecording: (recording) => set({ recording }),
  toggleMode: () => set((state) => ({ mode: state.mode === 'picture' ? 'video' : 'picture' })),
  toggleFacing: () => set((state) => ({ facing: state.facing === 'back' ? 'front' : 'back' })),
}));

export const useUriStore = create<UriState>((set) => ({
  uri: null,
  setUri: (uri) => set({ uri }),
}));