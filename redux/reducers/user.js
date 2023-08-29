import {
    LOGIN_USER,
    REFRESH_BUDGETS,
    REFRESH_SAVINGS,
    SET_BUDGET_REF,
    SET_EDITING_REF,
    SET_SAVING_REF,
} from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    uid: null,
    userRef: null,
    name: null,
    budgetsRef: null,
    budgets: null,
    savingsRef: null,
    savings: null,
    editingRef: null,
    budgetDashboard: null,
    savingDashboard: null,
};

const userReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_USER, (state, action) => {
        state.loggedIn = true;
        state.uid = action.payload.uid;
        state.userRef = action.payload.userRef;
        state.name = action.payload.name;
        state.budgetsRef = action.payload.budgetsRef;
        state.budgets = action.payload.budgets;
        state.savingsRef = action.payload.savingsRef;
        state.savings = action.payload.savings;
    });
    builder.addCase(REFRESH_BUDGETS, (state, action) => {
        state.budgets = action.payload.budgets;
    });
    builder.addCase(REFRESH_SAVINGS, (state, action) => {
        state.savings = action.payload.savings;
    });
    builder.addCase(SET_EDITING_REF, (state, action) => {
        state.editingRef = action.payload.editingRef;
    });
    builder.addCase(SET_BUDGET_REF, (state, action) => {
        state.budgetDashboard = action.payload.budgetDashboard;
    });
    builder.addCase(SET_SAVING_REF, (state, action) => {
        state.savingDashboard = action.payload.savingDashboard;
    });
});

export default userReducer;