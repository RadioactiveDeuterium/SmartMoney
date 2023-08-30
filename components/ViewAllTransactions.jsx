import { View, StyleSheet, Text, ScrollView, Alert } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { deleteDoc } from "firebase/firestore";
import reduxActions from "../redux/actions";

export default function ViewAllTransactions({ navigation }) {
  const dispatch = useDispatch();
  const transactions = useSelector(
    (state) => state.userReducer.viewTransactions
  );

  const startDeleteTxn = (ref) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [{ text: "Cancel" }, { text: "Delete", onPress: () => deleteTxn(ref) }]
    );
  };

  const deleteTxn = async (ref) => {
    await deleteDoc(ref);
    dispatch(reduxActions.userActions.refreshBudgets());
    navigation.navigate("Home");
  };

  return (
    <ScrollView>
      {transactions.map((txn) => {
        return (
          <View style={styles.container}>
            <Text style={styles.dateText}>
              {txn.date.toDate().toDateString()}
            </Text>
            <View style={styles.recentRow} key={txn.amount + txn.merchant}>
              <Text style={styles.recentText}>${txn.amount}&nbsp;</Text>
              <Text style={styles.recentText}>{txn.merchant}&nbsp;</Text>
              <Text
                style={styles.recentTextGrow}
                onPress={() => startDeleteTxn(txn.ref)}
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
