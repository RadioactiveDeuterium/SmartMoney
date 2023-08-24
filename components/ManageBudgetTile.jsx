import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { updateDoc, deleteDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import reduxActions from "../redux/actions";

export default function ManageBudgetTile({ budget }) {
  const dispatch = useDispatch();
  const [stateTotal, setStateTotal] = useState(budget.amount + "");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const updateBudget = async () => {
    setLoading(true);
    await updateDoc(budget.ref, {
      amount: stateTotal,
    });
    dispatch(reduxActions.userActions.refreshBudgets());
    setLoading(false);
    Alert.alert(
      "Update Sucessful!",
      budget.title + " total updated to $" + stateTotal + "!",
      [{ text: "OK" }]
    );
  };

  const deleteBudget = async () => {
    setDeleting(true);
    await deleteDoc(budget.ref);
    dispatch(reduxActions.userActions.refreshBudgets());
    setDeleting(false);
  };

  const startDeleteBudget = () => {
    Alert.alert(
      "Delete Budget",
      "Are you sure you want to delete: " + budget.title + "?",
      [{ text: "Cancel" }, { text: "Delete", onPress: deleteBudget }]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{budget.title}</Text>
      <Text style={styles.preInput}>$</Text>
      <TextInput
        style={styles.input}
        value={stateTotal}
        onChangeText={setStateTotal}
      />
      <Pressable style={styles.button} onPress={updateBudget}>
        {loading ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text style={styles.buttonText}>💾</Text>
        )}
      </Pressable>
      <Pressable style={styles.button} onPress={startDeleteBudget}>
        {deleting ? (
          <ActivityIndicator size="large" />
        ) : (
          <Text style={styles.buttonText}>🗑️</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomColor: "black",
    borderBottomWidth: 1,
    alignContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    flexGrow: 1,
  },
  preInput: {
    fontSize: 20,
    marginRight: 2,
  },
  input: {
    height: 30,
    borderWidth: 1,
    paddingHorizontal: 6,
    fontSize: 20,
    marginRight: 8,
  },
  button: {
    marginLeft: 4,
  },
  buttonText: {
    fontSize: 24,
  },
});
