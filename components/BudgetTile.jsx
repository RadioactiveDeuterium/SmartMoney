import { StyleSheet, Text, View, Image } from "react-native";

export default function BudgetTile({title, spent, total }) {
  return (
    <View style={styles.container}>
      <Image
            style={styles.image}
            source={require("../assets/placeholder.svg")}
          />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>{spent}/{total}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: 'center',
    backgroundColor: "lightgray",
    flexDirection: 'row',
    paddingVertical: 8,
    borderRadius: 30,
    paddingHorizontal: 6,
    marginVertical: 6
  },
  image: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: 26,
    flexGrow: 1,
    paddingLeft: 6
  },
  value: {
    fontSize: 26,
  }
});
