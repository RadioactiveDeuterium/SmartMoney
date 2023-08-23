import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import reduxActions from "../redux/actions";

export default function Login({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [email, onChangeEmail] = useState("");
  const [password, onChangePassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const auth = useSelector((state) => state.firebaseReducer.auth);
  const dispatch = useDispatch();

  const login = async () => {
    if (!loading) {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          // Signed in
          const user = userCredential.user;
          await dispatch(reduxActions.userActions.loginUser(user.uid));
        })
        .catch((error) => {
          const errorCode = error.code;
          setErrorMessage(error.message);
        });
      setLoading(false);
    }
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headline}>Smart Money</Text>
        {/* Email Field */}
        <TextInput
          style={styles.input}
          value={email}
          placeholder="Email"
          onChangeText={onChangeEmail}
        />
        {/* Password Field */}
        <TextInput
          style={styles.input}
          value={password}
          placeholder="Password"
          onChangeText={onChangePassword}
        />
        {/* Error Field */}
        {errorMessage !== "" ? (
          <Text style={styles.errorText}>{errorMessage}</Text>
        ) : null}
        {/* Submuit Button */}
        <Pressable style={styles.button} onPress={login}>
          <Text>Login</Text>
        </Pressable>
        <Pressable
          style={styles.linkText}
          onPress={() => navigation.navigate("SignUp")}
        >
          <Text style={styles.linkTextContent}>Not a user yet? Sign up!</Text>
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
    marginTop: 4,
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
  errorText: {
    color: "red",
    marginBottom: 12,
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
