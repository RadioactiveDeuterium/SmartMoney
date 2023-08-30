import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";
import { deleteDoc } from "firebase/firestore";
import { useDispatch } from "react-redux";
import reduxActions from "../redux/actions";

export default function ManageSavingTile({ saving, navigation }) {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  const deleteSaving = async () => {
    setDeleting(true);
    await deleteDoc(saving.ref);
    dispatch(reduxActions.userActions.refreshSavings());
    setDeleting(false);
  };

  const startDeleteSaving = () => {
    Alert.alert(
      "Delete Saving Goal",
      "Are you sure you want to delete: " + saving.title + "?",
      [{ text: "Cancel" }, { text: "Delete", onPress: deleteSaving }]
    );
  };

  const editSaving = () => {
    dispatch(reduxActions.userActions.setEditingRef(saving));
    navigation.navigate("Edit Goal");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{saving.title}</Text>
      <Pressable style={styles.button} onPress={editSaving}>
        <Text style={styles.buttonText}>✏️</Text>
      </Pressable>
      <Pressable style={styles.button} onPress={startDeleteSaving}>
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
  button: {
    marginLeft: 4,
  },
  buttonText: {
    fontSize: 24,
  },
});
