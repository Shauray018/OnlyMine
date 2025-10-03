import { StyleSheet, View } from "react-native";
// import { PerplexityList } from "./";
// import mockData from "./mockData";
import { PerplexityList } from "@/components/AnimatedCard";
import { faker } from "@faker-js/faker";

faker.seed(12);
const data = [...Array(20).keys()].map((i) => ({
  key: faker.string.uuid(),
  title: faker.music.artist(),
  image: faker.image.urlPicsumPhotos({
    width: 300,
    height: 300 * 1.4,
    blur: 0,
  }),
  bg: "#808080",
  description: faker.lorem.sentences({ min: 1, max: 3 }),
  author: {
    name: faker.person.fullName(),
    avatar: faker.image.avatarGitHub(),
  },
}));

export type Item = (typeof data)[0];

export default function App() {
  return (
    <View style={styles.container}>
      <PerplexityList data={data} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    justifyContent: "center",
  },
});
