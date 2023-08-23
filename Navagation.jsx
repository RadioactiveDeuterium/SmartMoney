import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import reduxActions from "./redux/actions";

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";

export default function Navigation() {
  const dispatch = useDispatch();
  const Stack = createStackNavigator();

  const initialized = useSelector((state) => state.firebaseReducer.initialized);
  const loggedIn = useSelector((state) => state.userReducer.loggedIn);
  const navigationRef = createNavigationContainerRef();

  useEffect(() => {
    if (!initialized) dispatch(reduxActions.firebaseActions.initFirebase());
  }, [dispatch, initialized]);

  useEffect(() => {
    if (loggedIn) navigationRef.navigate("Home");
  }, [loggedIn]);

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Home"
            component={Home}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
