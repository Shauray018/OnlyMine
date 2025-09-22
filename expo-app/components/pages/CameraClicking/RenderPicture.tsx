import { Carousel } from "@/components/AnimatedCarousel";
import { Button, ButtonIcon, ButtonText } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CloseIcon, Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { Modal, ModalBackdrop, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal";
import { useUriStore } from "@/lib/store/cameraStore";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { Dimensions, Image, StyleSheet, Text, View } from "react-native";

// Function to generate random title
function generateRandomTitle() {
  const adjectives = [
    "Beautiful",
    "Colorful",
    "Creative",
    "Enchanting",
    "Fantastic",
    "Glorious",
    "Majestic",
    "Serene",
    "Wonderful",
  ];
  const nouns = [
    "Landscape",
    "Nature",
    "Artwork",
    "Illustration",
    "Photograph",
    "Sketch",
    "Painting",
    "Design",
    "Masterpiece",
  ];
  const randomAdjective =
    adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  const randomNoun2 = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective} ${randomNoun} ${randomNoun2}`;
}

const { width: screenWidth } = Dimensions.get('window');
const frameSize = screenWidth - 60; // 30px margin on each side

// Function to generate random UUID
function generateRandomUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function RenderPicture() {
  const { uri, setUri } = useUriStore();
  const [currentTitle, setCurrentTitle] = useState(generateRandomTitle());
  const [customTitle, setCustomTitle] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Check if URI exists
  if (!uri) {
    return (
      <View style={[styles.container, { justifyContent: "center" }]}>
        <Text style={{ color: "white", fontSize: 18, marginBottom: 20 }}>
          No image available
        </Text>
        <Button onPress={() => {
          // Navigate back to camera or handle this case
          console.log("No URI available");
        }}>
          <ButtonText>Go Back</ButtonText>
        </Button>
      </View>
    );
  }

  const extendedImages = [{
    title: currentTitle,
    key: generateRandomUUID(),
    image: uri,
  }];

  const handleSaveCustomTitle = () => {
    if (customTitle.trim()) {
      setCurrentTitle(customTitle.trim());
      setCustomTitle("");
      setShowModal(false);
    }
  };

  const handleGenerateNewTitle = () => {
    setCurrentTitle(generateRandomTitle());
  };

  return (
    <View style={styles.container}>
      <View className="flex flex-row justify-end w-full mt-16 pr-10 ">
          <Button variant="outline" action="negative" className="px-2" onPress={() => setUri(null)} >
            <ButtonIcon as={CloseIcon} />
          </Button>
        </View>
      <Carousel
        data={extendedImages}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Image 
            source={{ uri: item.image }} 
            style={{ 
              flex: 1,  
              borderColor:"#808080", 
              borderRadius:4 
            }}
          />
        )}
        cellStyle={{ borderRadius: 16 }}
        contentContainerStyle={{ alignItems: "center" }}
        // OVERLAY - footer in our example
        overlayComponentStyle={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          minHeight: "20%",
        }}
        renderOverlayComponent={({ item }) => {
          return (
            <BlurView
              intensity={40}
              tint='dark'
              style={[
                StyleSheet.absoluteFillObject,
                { padding: 10, justifyContent: "space-between" },
              ]}>
              <Text style={{ color: "white", fontWeight: "700", fontSize: 18 }}>
                {item.title}
              </Text>
              <Text
                style={{
                  color: "white",
                  fontWeight: "black",
                  textAlign: "center",
                }}>
                · · ·
              </Text>
            </BlurView>
          );
        }}
      />
      
      {/* Title Controls */}
      {/* <View style={{ flexDirection: "row", gap: 8, marginVertical: 16, paddingHorizontal: 20 }}>
        <Button 
          onPress={handleGenerateNewTitle}
          variant="solid"
          action="secondary"
          style={{ flex: 1 }}
        >
          <ButtonText>New Title</ButtonText>
        </Button>
        <Button 
          onPress={() => setShowModal(true)}
          variant="solid"
          action="secondary"
          style={{ flex: 1 }}
        >
          <ButtonText>Custom Title</ButtonText>
        </Button>
      </View> */}

      {/* Main Action Buttons */}
      <View style={{ flexDirection: "row", gap: 16, paddingHorizontal: 20, marginBottom:40 }}>
        {/* <Button 
          onPress={() => setUri(null)} 
          variant="solid" 
          action="negative"
        >
          <ButtonText>
            Take Another Picture
          </ButtonText> 
        </Button> */}
        <Button 
          onPress={() => setShowModal(true)}
          variant="solid"
          action="secondary"
          style={{ flex: 1}}
        >
          <ButtonText className="">Custom Title</ButtonText>
        </Button>
        <Button 
          variant="solid"
          style={{ flex: 1 }}
        >
          <ButtonText>
            Save to Gallery
          </ButtonText> 
        </Button>
      </View>

      {/* Custom Title Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setCustomTitle("");
        }}
      >
        <ModalBackdrop />
        <ModalContent>
          <ModalHeader>
            <Heading size="lg">Create Custom Title</Heading>
            <ModalCloseButton>
              <Icon as={CloseIcon} />
            </ModalCloseButton>
          </ModalHeader>
          <ModalBody>
            <Input>
              <InputField
                placeholder="Enter your custom title..."
                value={customTitle}
                onChangeText={setCustomTitle}
                autoFocus
              />
            </Input>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="outline"
              action="secondary"
              onPress={() => {
                setShowModal(false);
                setCustomTitle("");
              }}
              style={{ marginRight: 8 }}
            >
              <ButtonText>Cancel</ButtonText>
            </Button>
            <Button
              onPress={handleSaveCustomTitle}
              disabled={!customTitle.trim()}
            >
              <ButtonText>Save Title</ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});