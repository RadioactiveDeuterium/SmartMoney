import DropDownPicker from "react-native-dropdown-picker";
import { useState, useEffect, useCallback } from "react";
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { DatePickerModal } from "react-native-paper-dates";
import { addDoc, collection } from "firebase/firestore";
import reduxActions from "../redux/actions";

export default function NewContribution({ navigation }) {
  const dispatch = useDispatch();
  const savings = useSelector((state) => state.userReducer.savings);
  const uid = useSelector((state) => state.userReducer.uid);
  const [canCreate, setCanCreate] = useState(false);
  const [loading, setLoading] = useState(false);
  // dropdown
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [dropdownItems, setDropdownItems] = useState([]);
  // date picker
  const [dateModalOpen, setDateModalOpen] = useState(false);
  const [date, setDate] = useState(new Date());
  // other inputs
  const [amount, setAmount] = useState("");
  const [isAmountValid, setIsAmountValid] = useState(false);

  useEffect(() => {
    if (savings) {
      const values = [];
      for (const saving of savings) {
        values.push({
          id: saving.title,
          label: saving.title,
          value: saving.ref,
        });
      }
      setDropdownItems(values);
    }
  }, [savings]);

  const onDateConfirm = useCallback(
    (params) => {
      setDateModalOpen(false);
      setDate(params.date);
    },
    [setDateModalOpen, setDate]
  );

  const saveContribution = async () => {
    if (canCreate) {
      setLoading(true);
      const contributionsRef = collection(dropdownValue, "contributions");
      await addDoc(contributionsRef, {
        amount: amount,
        date: date,
      });
      dispatch(reduxActions.userActions.refreshSavings());
      setLoading(false);
      navigation.navigate("Home");
    }
  };

  useEffect(() => {
    setIsAmountValid(/^[0-9]+$/.test(amount));
    setCanCreate(isAmountValid && dropdownValue !== null);
  }, [amount, isAmountValid, dropdownValue]);

  return (
    <>
      <View style={styles.container}>
        {/* Budget Dropdown */}
        <Text style={styles.label}>Category:</Text>
        <DropDownPicker
          open={dropdownOpen}
          value={dropdownValue}
          items={dropdownItems}
          setOpen={setDropdownOpen}
          setValue={setDropdownValue}
          setItems={setDropdownItems}
          placeholder="Select a Goal"
        />
        {/* Amount */}
        <Text style={styles.label}>Amount ($):</Text>
        <TextInput
          style={styles.input}
          placeholder="$19.99"
          value={amount}
          onChangeText={setAmount}
        />
        {!isAmountValid && amount !== "" ? (
          <Text style={styles.errorText}>Enter a valid number</Text>
        ) : null}
        {/* Date */}
        <Text style={styles.label}>Date:</Text>
        <TextInput
          style={styles.input}
          placeholder="Date"
          onPressOut={() => setDateModalOpen(true)}
          value={date.toDateString()}
        />
        {/* Save button */}
        <Pressable style={canCreate ? styles.button : styles.buttonDisabled}>
          <Text onPress={saveContribution}>Save</Text>
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
    borderWidth: 1,
    padding: 10,
  },
  label: {
    marginVertical: 12,
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
    marginTop: 12,
  },
});
