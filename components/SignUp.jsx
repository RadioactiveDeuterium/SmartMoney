import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import reduxActions from "../redux/actions";

export default function SignUp({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [name, onChangeName] = useState("");
  const [email, onChangeEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);
  const [password, onChangePassword] = useState("");
  const [confirmPassword, onChangeConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const auth = useSelector((state) => state.firebaseReducer.auth);
  const db = useSelector((state) => state.firebaseReducer.db);

  const dispatch = useDispatch();

  useEffect(() => {
    setPasswordsMatch(password == confirmPassword);
  }, [password, confirmPassword]);

  useEffect(() => {
    setEmailValid(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email));
  }, [email]);

  useEffect(() => {
    setSubmitEnabled(
      passwordsMatch && emailValid && name !== "" && password !== ""
    );
  }, [passwordsMatch, emailValid, name]);

  const signUp = async () => {
    //Check if sign up criteria met
    var user;
    if (submitEnabled && !loading) {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          //Create user sucessful
          user = userCredential.user;
          //User created, init user data
          try {
            await setDoc(doc(db, "users", user.uid), {
              name: name,
            });
          } catch (e) {
            console.error("Error adding document: ", e);
          }
          //create intital data
          //get refs
          const userRef = doc(db, "users", user.uid);
          const userBudgetsRef = collection(userRef, "budgets");
          const userSavingsRef = collection(userRef, "savings");
          //set initial budgets
          addDoc(userBudgetsRef, { title: "Grocery", amount: 250 });
          addDoc(userBudgetsRef, { title: "Dining", amount: 100 });
          addDoc(userBudgetsRef, { title: "Utilities", amount: 200 });
          //set initial savings
          const date = new Date();
          addDoc(userSavingsRef, {
            title: "Retirement",
            goal: 1000000,
            date: date,
            returnRate: 4,
          });
          addDoc(userSavingsRef, {
            title: "Emergency Fund",
            goal: 2500,
            date: date,
            returnRate: 4,
          });
          //dispatch redux login
          await dispatch(reduxActions.userActions.loginUser(user.uid));
        })
        .then()
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode + ": " + errorMessage);
        });
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headline}>Smart Money</Text>
        {/* Name Input */}
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={onChangeName}
          placeholder="Name"
        />
        {/* Email Input */}
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={onChangeEmail}
          placeholder="Email"
        />
        {!emailValid && email !== "" ? (
          <Text style={styles.errorText}>Please enter a valid email!</Text>
        ) : null}
        {/* Password Input */}
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={onChangePassword}
          placeholder="Password"
        />
        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={onChangeConfirmPassword}
          placeholder="Confirm Password"
        />
        {!passwordsMatch ? (
          <Text style={styles.errorText}>Passwords must match!</Text>
        ) : null}
        {/* Submit Button */}
        <Pressable
          style={submitEnabled ? styles.button : styles.buttonDisabled}
        >
          <Text onPress={signUp}>Sign Up</Text>
        </Pressable>
        <Pressable
          style={styles.linkText}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.linkTextContent}>
            Already a user? Log in here.
          </Text>
        </Pressable>
      </View>
      {loading ? (
        <ActivityIndicator size="large" style={styles.loading} />
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    fontSize: 40,
    marginBottom: 12,
  },
  input: {
    height: 40,
    width: "80%",
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
  linkText: {
    paddingVertical: 12,
  },
  linkTextContent: {
    color: "#2196f3",
  },
  errorText: {
    color: "red",
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
