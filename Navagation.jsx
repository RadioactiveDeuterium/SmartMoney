import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import reduxActions from "./redux/actions";
import { enGB, registerTranslation } from 'react-native-paper-dates'

import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Home from "./components/Home";
import ManageBudgets from "./components/ManageBudgets";
import ManageSavings from "./components/ManageSavings";
import CreateSaving from "./components/CreateSaving";
import EditSaving from "./components/EditSaving";
import NewTransaction from "./components/NewTransaction";
import NewContribution from "./components/NewContribution";

export default function Navigation() {
  const dispatch = useDispatch();
  const Stack = createStackNavigator();

  const initialized = useSelector((state) => state.firebaseReducer.initialized);
  const loggedIn = useSelector((state) => state.userReducer.loggedIn);
  const navigationRef = createNavigationContainerRef();

  useEffect(() => {
    if (!initialized) dispatch(reduxActions.firebaseActions.initFirebase());
    registerTranslation('en-GB', enGB)
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
          <Stack.Screen
            name="Manage Budgets"
            component={ManageBudgets}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Manage Savings"
            component={ManageSavings}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Create Goal"
            component={CreateSaving}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="Edit Goal"
            component={EditSaving}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="New Transaction"
            component={NewTransaction}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="New Contribution"
            component={NewContribution}
            options={{ headerTitleAlign: "center" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
