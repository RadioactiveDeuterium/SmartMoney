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

import ManageSavingTile from "./ManageSavingTile";

export default function ManageSavings({ navigation }) {
  const dispatch = useDispatch();
  const savings = useSelector((state) => state.userReducer.savings);
  const savingsRef = useSelector((state) => state.userReducer.savingsRef);

  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* Main View */}
      <ScrollView>
        {savings.map((saving) => {
          return <ManageSavingTile key={saving.title} saving={saving} navigation={navigation} />;
        })}
        <Pressable
          style={styles.container}
          onPress={() => navigation.navigate("Create Goal")}
        >
          <Text style={styles.text}>Add New +</Text>
        </Pressable>
      </ScrollView>
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
