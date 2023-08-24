import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import reduxActions from "../redux/actions";
import { addDoc } from "firebase/firestore";

import ManageBudgetTile from "./ManageBudgetTile";

export default function ManageBudgets() {
  const dispatch = useDispatch();
  const budgets = useSelector((state) => state.userReducer.budgets);
  const budgetsRef = useSelector((state) => state.userReducer.budgetsRef);

  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalInputText, setModalInputText] = useState("");

  const createBudget = async () => {
    setLoading(true);
    await addDoc(budgetsRef, { title: modalInputText, amount: 0 });
    dispatch(reduxActions.userActions.refreshBudgets());
    setModalVisible(false);
    setLoading(false);
  };

  return (
    <>
      {/* Main View */}
      <ScrollView>
        {budgets.map((budget) => {
          return <ManageBudgetTile key={budget.title} budget={budget} />;
        })}
        <Pressable
          style={styles.container}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.text}>Add New +</Text>
        </Pressable>
      </ScrollView>
      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalCentered}>
          <View style={styles.modal}>
            <TextInput
              style={styles.input}
              placeholder="Budget Name"
              value={modalInputText}
              onChangeText={setModalInputText}
            />
            <Pressable onPress={createBudget} style={styles.button}>
              <Text>Create</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      {/* Loader */}
      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : null}
    </>
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
  text: {
    fontSize: 26,
  },
  modalCentered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    margin: 6,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 36,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderRadius: 10,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 2,
    backgroundColor: "#2196f3",
    marginTop: 16,
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
