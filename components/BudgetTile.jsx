import { StyleSheet, Text, Image, Pressable } from "react-native";
import { useDispatch } from "react-redux";
import reduxActions from "../redux/actions";

export default function BudgetTile({ budget, navigation }) {
  const dispatch = useDispatch();
  const underArrow = require("../assets/under-arrow.png");
  const overArrow = require("../assets/over-arrow.png");

  const navigateToDashboard = () => {
    dispatch(reduxActions.userActions.setBudgetDashboard(budget));
    navigation.navigate("Budget Dashboard");
  };

  return (
    <Pressable onPress={navigateToDashboard} style={styles.container}>
      <Image
        style={styles.image}
        source={
          Number(budget.monthlyBreakdown[0].monthlyTotal) > Number(budget.amount)
            ? overArrow
            : underArrow
        }
      />
      <Text style={styles.title}>{budget.title}</Text>
      <Text style={styles.value}>
        ${budget.monthlyBreakdown[0].monthlyTotal}/${budget.amount}
      </Text>
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
    width: 30,
    height: 30,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 26,
    flexGrow: 1,
    paddingLeft: 6,
  },
  value: {
    fontSize: 26,
  },
});
