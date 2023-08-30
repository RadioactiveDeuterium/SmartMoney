import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Image,
  ScrollView,
  Pressable,
} from "react-native";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import BudgetTile from "./BudgetTile";
import SavingTile from "./SavingTile";
// import reduxActions from "../redux/actions";

export default function Home({ navigation }) {
  // const dispatch = useDispatch();
  const name = useSelector((state) => state.userReducer.name);
  const budgets = useSelector((state) => state.userReducer.budgets);
  const savings = useSelector((state) => state.userReducer.savings);
  const [selected, setSelected] = useState("spend");
  const [greeting, setGreeting] = useState("Good Morning,");

  useEffect(() => {
    const date = new Date();
    const hour = date.getHours();
    if (hour > 12 && hour < 17) {
      setGreeting("Good Afternoon,");
    } else if (hour >= 17) {
      setGreeting("Good Evening,");
    }
  }, []);

  return (
    <View style={styles.container}>
      {/* Upper Container (blue section) */}
      <View style={styles.upperContainer}>
        {/* Status Bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.welcomeText}>{greeting}</Text>
            <Text style={styles.nameText}>{name}</Text>
          </View>
          <Image
            style={styles.image}
            source={require("../assets/profile-default.png")}
          />
        </View>
        {/* Toggle Switch */}
        <View style={styles.toggleContainer}>
          <Text
            onPress={() => setSelected("spend")}
            style={
              selected == "spend"
                ? styles.toggleTextSelected
                : styles.toggleText
            }
          >
            Spend
          </Text>
          <Text style={styles.toggleSeperator}>|</Text>
          <Text
            onPress={() => setSelected("save")}
            style={
              selected == "save" ? styles.toggleTextSelected : styles.toggleText
            }
          >
            Save
          </Text>
        </View>
      </View>
      {/* Lower Container (white section) */}
      <View>
        <ScrollView>
          {selected == "spend" ? (
            <>
              {budgets.map((budget) => {
                return (
                  <BudgetTile
                    key={budget.title}
                    budget={budget}
                    navigation={navigation}
                  />
                );
              })}
            </>
          ) : (
            <>
              {savings.map((saving) => {
                return (
                  <SavingTile
                    key={saving.title}
                    saving={saving}
                    navigation={navigation}
                  />
                );
              })}
            </>
          )}
          <View style={styles.doubleButtonContainer}>
            <Pressable style={styles.halfButton}>
              <Text
                onPress={
                  selected == "spend"
                    ? () => navigation.navigate("New Transaction")
                    : () => navigation.navigate("New Contribution")
                }
                style={styles.halfButtonText}
              >
                {selected == "spend" ? "Add Transaction" : "Add Contribution"}
              </Text>
            </Pressable>
            <View style={styles.spacer} />
            <Pressable
              onPress={
                selected == "spend"
                  ? () => navigation.navigate("Manage Budgets")
                  : () => navigation.navigate("Manage Savings")
              }
              style={styles.halfButton}
            >
              <Text style={styles.halfButtonText}>
                {selected == "spend" ? "Manage Budgets" : "Manage Goals"}
              </Text>
            </Pressable>
          </View>
          {/* <Pressable onPress={() => dispatch(reduxActions.userActions.refreshBudgets())}><Text style={styles.halfButtonText}>RELOAD</Text></Pressable> */}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topBar: {
    flexDirection: "row",
    width: "100%",
    marginTop: StatusBar.currentHeight,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  welcomeText: {
    fontSize: 14,
  },
  nameText: {
    fontSize: 30,
    marginTop: -8,
    marginLeft: -1,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 0,
    marginLeft: "auto",
  },
  upperContainer: {
    backgroundColor: "#2196f3",
    width: "100%",
    height: "35%",
  },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "white",
    width: "80%",
    alignSelf: "center",
    borderRadius: 20,
    paddingVertical: 4,
    marginTop: 4,
  },
  toggleText: {
    fontSize: 24,
    lineHeight: 24,
    paddingTop: 3,
    maxHeight: 30,
    width: "48%",
    textAlign: "center",
  },
  toggleTextSelected: {
    fontSize: 24,
    lineHeight: 24,
    paddingTop: 3,
    maxHeight: 30,
    width: "48%",
    textAlign: "center",
    fontWeight: "bold",
  },
  toggleSeperator: {
    fontSize: 24,
    lineHeight: 24,
    paddingTop: 2,
    maxHeight: 30,
    width: "4%",
    textAlign: "center",
  },
  doubleButtonContainer: {
    flexDirection: "row",
    width: "90%",
    alignSelf: "center",
    marginTop: 6,
  },
  spacer: {
    width: "4%",
  },
  halfButton: {
    width: "48%",
    backgroundColor: "lightgray",
    borderRadius: 30,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  halfButtonText: {
    textAlign: "center",
    fontSize: 20,
  },
});
