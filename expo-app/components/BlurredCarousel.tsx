import { Button, ButtonText } from "@/components/ui/button"; // Adjust import path as needed
import { useUriStore } from "@/lib/store/cameraStore";
import * as React from "react";
import { Dimensions, Image, StyleSheet, View } from "react-native";

const { width, height } = Dimensions.get("screen");

const imageW = width * 0.7;
const imageH = imageW * 1.54;

export default function NewRenderPicture() {
  const { uri, setUri } = useUriStore();

  if (!uri) {
    return (
      <View style={{ flex: 1, backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
        {/* You can add a placeholder or loading state here */}
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#000", width:"100%" }}>
      {/* Background Image with Blur */}
      <View style={StyleSheet.absoluteFillObject}>
        <Image
          source={{ uri }}
          style={[
            StyleSheet.absoluteFillObject,
            {
              width,
              height,
            },
          ]}
          blurRadius={60}
        />
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {/* Main Image */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            shadowColor: "#000",
            shadowRadius: 30,
            shadowOffset: { height: 0, width: 0 },
            shadowOpacity: 0.6,
            elevation: 2,
          }}>
          <Image
            source={{ uri }}
            style={{
              borderRadius: 16,
              width: imageW,
              height: imageH,
              resizeMode: "cover",
            }}
          />
        </View>

        {/* Buttons */}
        <View style={{ 
          flexDirection: "row", 
          gap: 16,
          marginTop: 32,
        }}>
          <Button 
            onPress={() => setUri(null)} 
            variant="solid" 
            action="negative"
          >
            <ButtonText>
              Take Another Picture
            </ButtonText> 
          </Button>
          <Button 
            variant="solid"
          >
            <ButtonText>
              Save to Gallery
            </ButtonText> 
          </Button>
        </View>
      </View>
    </View>
  );
}