import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { deleteDoc } from "firebase/firestore";
import reduxActions from "../redux/actions";

export default function ViewAllContributions({ navigation }) {
  const dispatch = useDispatch();
  const contributions = useSelector(
    (state) => state.userReducer.viewContributions
  );

  const startDeleteCbn = (ref) => {
    Alert.alert(
      "Delete Contribution",
      "Are you sure you want to delete this contribution?",
      [{ text: "Cancel" }, { text: "Delete", onPress: () => deleteCbn(ref) }]
    );
  };

  const deleteCbn = async (ref) => {
    await deleteDoc(ref);
    dispatch(reduxActions.userActions.refreshSavings());
    navigation.navigate("Home");
  };

  return (
    <ScrollView>
      {contributions.map((cbn) => {
        return (
          <View style={styles.container}>
            <Text style={styles.dateText}>
              {cbn.date.toDate().toDateString()}
            </Text>
            <View style={styles.recentRow} key={cbn.amount}>
              <Text style={styles.recentText}>${cbn.amount}&nbsp;</Text>
              <Text
                style={styles.recentTextGrow}
                onPress={() => startDeleteCbn(cbn.ref)}
              >
                🗑️
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "90%",
    borderBottomWidth: 2,
    alignSelf: "center",
    paddingVertical: 4,
  },
  recentRow: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    marginVertical: 6,
  },
  recentText: {
    fontSize: 20,
  },
  dateText: {
    fontSize: 20,
    flexGrow: 1,
  },
  recentTextGrow: {
    fontSize: 20,
    flexGrow: 1,
    textAlign: "right",
  },
});
