import { StyleSheet, Text, View, Image, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import reduxActions from "../redux/actions";

export default function SavingTile({ saving, navigation }) {
  const dispatch = useDispatch();

  const navigateToDashboard = () => {
    dispatch(reduxActions.userActions.setSavingDashboard(saving));
    navigation.navigate("Saving Dashboard");
  }

  return (
    <Pressable onPress={navigateToDashboard} style={styles.container}>
      <View style={styles.leftHalf}>
        <Text style={styles.title}>{saving.title}</Text>
        <Text style={styles.value}>
          ${saving.current}/${saving.goal}
        </Text>
      </View>
      <Image
        style={styles.image}
        source={require("../assets/right-arrow.png")}
      />
    </Pressable>
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
    width: 60,
    height: 60,
    marginRight: 6,
    marginVertical: 10
  },
  title: {
    fontSize: 24,
    flexGrow: 1,
    paddingLeft: 6,
  },
  value: {
    fontSize: 24,
  },
  leftHalf: {
    marginLeft: 8,
    flexGrow: 1
  }
});
