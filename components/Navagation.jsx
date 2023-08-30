import { StatusBar } from "expo-status-bar";
import { createStackNavigator } from "@react-navigation/stack";
import {
  NavigationContainer,
  createNavigationContainerRef,
} from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import reduxActions from "../redux/actions";
import { enGB, registerTranslation } from 'react-native-paper-dates'

import Login from "./Login";
import SignUp from "./SignUp";
import Home from "./Home";
import ManageBudgets from "./ManageBudgets";
import ManageSavings from "./ManageSavings";
import CreateSaving from "./CreateSaving";
import EditSaving from "./EditSaving";
import NewTransaction from "./NewTransaction";
import NewContribution from "./NewContribution";
import BudgetDashboard from "./BudgetDashboard";
import SavingDashboard from "./SavingDashboard";
import ViewAllTransactions from "./ViewAllTransactions";
import ViewAllContributions from "./ViewAllContributions";

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
          <Stack.Screen
            name="Budget Dashboard"
            component={BudgetDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Saving Dashboard"
            component={SavingDashboard}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="View All Transactions"
            component={ViewAllTransactions}
            options={{ headerTitleAlign: "center" }}
          />
          <Stack.Screen
            name="View All Contributions"
            component={ViewAllContributions}
            options={{ headerTitleAlign: "center" }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
