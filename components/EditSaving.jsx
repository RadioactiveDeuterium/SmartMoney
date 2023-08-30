import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useState, useCallback, useEffect } from "react";
import { DatePickerModal } from "react-native-paper-dates";
import { useSelector, useDispatch } from "react-redux";
import { updateDoc } from "firebase/firestore";
import reduxActions from "../redux/actions";

export default function EditSaving({ navigation }) {
  const dispatch = useDispatch();
  const editingSaving = useSelector((state) => state.userReducer.editingRef);

  const [title, setTitle] = useState(editingSaving.title || "");
  const [goal, setGoal] = useState(editingSaving.goal || "");
  const [date, setDate] = useState(editingSaving.date.toDate() || new Date());
  const [returnRate, setReturnRate] = useState(editingSaving.returnRate || "");
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [canCreate, setCanCreate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isGoalValid, setIsGoalValid] = useState(false);
  const [isReturnRateValid, setIsReturnRateValid] = useState(false);

  useEffect(() => {
    setIsGoalValid(/^[0-9]+$/.test(goal));
    setIsReturnRateValid(/^[0-9]+$/.test(returnRate));
    setCanCreate(isGoalValid && isReturnRateValid && title !== "");
  }, [goal, isGoalValid, returnRate, isReturnRateValid, title]);

  const onDateConfirm = useCallback(
    (params) => {
      setDateModalOpen(false);
      setDate(params.date);
    },
    [setDateModalOpen, setDate]
  );

  const saveGoal = async () => {
    if (canCreate) {
      setLoading(true);
      await updateDoc(editingSaving.ref, {
        title: title,
        goal: goal,
        date: date,
        returnRate: returnRate,
      });
      dispatch(reduxActions.userActions.refreshSavings());
      navigation.navigate("Manage Savings");
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Title */}
        <Text>Title:</Text>
        <TextInput
          style={styles.input}
          placeholder="Vacation"
          value={title}
          onChangeText={setTitle}
        />
        {/* Goal */}
        <Text>Goal ($):</Text>
        <TextInput
          style={styles.input}
          placeholder="5000"
          value={goal}
          onChangeText={setGoal}
        />
        {!isGoalValid && goal !== "" ? (
          <Text style={styles.errorText}>Goal must be a number!</Text>
        ) : null}
        {/* Completion date */}
        <Text>Target Completion:</Text>
        <TextInput
          style={styles.input}
          placeholder="Target Completion"
          onPressOut={() => setDateModalOpen(true)}
          value={date.toDateString()}
        />
        {/* Return rate */}
        <Text>Projected Return Rate:</Text>
        <TextInput
          style={styles.input}
          placeholder="4%"
          value={returnRate}
          onChangeText={setReturnRate}
        />
        {!isReturnRateValid && returnRate !== "" ? (
          <Text style={styles.errorText}>Return rate must be a number!</Text>
        ) : null}
        <Pressable style={canCreate ? styles.button : styles.buttonDisabled}>
          <Text onPress={saveGoal}>Save</Text>
        </Pressable>
      </View>
      <DatePickerModal
        locale="en-GB"
        mode="single"
        visible={dateModalOpen}
        onDismiss={() => setDateModalOpen(false)}
        date={date}
        onConfirm={onDateConfirm}
      />
      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "80%",
    alignSelf: "center",
    paddingTop: 24,
  },
  input: {
    height: 40,
    borderRadius: 10,
    marginVertical: 12,
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
  buttonDisabled: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 2,
    backgroundColor: "#bdbdbd",
    marginTop: 16,
    opacity: 0.2,
  },
  errorText: {
    color: "red",
    marginBottom: 12,
  },
});
