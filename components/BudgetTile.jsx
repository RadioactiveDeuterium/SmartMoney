import { StyleSheet, Text, View, Image } from "react-native";

export default function BudgetTile({title, spent, total}) {
  const underArrow = require("../assets/under-arrow.png")
  const overArrow = require("../assets/over-arrow.png")
  return (
    <View style={styles.container}>
      <Image
            style={styles.image}
            source={(Number(spent) > Number(total)) ? overArrow : underArrow }
          />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.value}>${spent}/${total}</Text>
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
    width: 30,
    height: 30,
    marginVertical: 5,
    marginHorizontal: 5
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
