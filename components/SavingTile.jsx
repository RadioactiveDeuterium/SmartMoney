import { StyleSheet, Text, View, Image } from "react-native";

export default function SavingTile({ title, progress, total }) {
  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require("../assets/placeholder.svg")}
      />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>
          {progress}/{total}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    backgroundColor: "lightgray",
    flexDirection: "row",
    paddingVertical: 8,
    borderRadius: 30,
    paddingHorizontal: 6,
    marginVertical: 6,
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 6
  },
  title: {
    fontSize: 24,
    flexGrow: 1,
    paddingLeft: 6,
  },
  value: {
    fontSize: 24,
  },
});
