import { Carousel } from "@/components/AnimatedCarousel";
import { BlurView } from "expo-blur";
import { Image, StyleSheet, Text, View } from "react-native";

const images = [
  "https://cdn.dribbble.com/users/3281732/screenshots/11192830/media/7690704fa8f0566d572a085637dd1eee.jpg?compress=1&resize=500x500",
  "https://cdn.dribbble.com/users/3281732/screenshots/13130602/media/592ccac0a949b39f058a297fd1faa38e.jpg?compress=1&resize=500x500",
  "https://cdn.dribbble.com/users/3281732/screenshots/9165292/media/ccbfbce040e1941972dbc6a378c35e98.jpg?compress=1&resize=500x500",
  "https://cdn.dribbble.com/users/3281732/screenshots/11205211/media/44c854b0a6e381340fbefe276e03e8e4.jpg?compress=1&resize=500x500",
  "https://cdn.dribbble.com/users/3281732/screenshots/7003560/media/48d5ac3503d204751a2890ba82cc42ad.jpg?compress=1&resize=500x500",
  "https://cdn.dribbble.com/users/3281732/screenshots/6727912/samji_illustrator.jpeg?compress=1&resize=500x500",
  "https://cdn.dribbble.com/users/3281732/screenshots/13661330/media/1d9d3cd01504fa3f5ae5016e5ec3a313.jpg?compress=1&resize=500x500",
];
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

// Function to generate random UUID
function generateRandomUUID() {
  // Implement your own UUID generation logic or use a library like 'uuid'
  // For simplicity, let's assume a simple UUID generation function
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const extendedImages = images.map((url) => ({
  title: generateRandomTitle(),
  key: generateRandomUUID(),
  image: url,
}));

export default function Thing() {
  return (
    <View style={styles.container}>
      <Carousel
        data={extendedImages}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <Image source={{ uri: item.image }} style={{ flex: 1 }} />
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#122",
    alignItems: "center",
    justifyContent: "center",
  },
});
