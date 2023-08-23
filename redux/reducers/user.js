import { LOGIN_USER } from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    loggedIn: false,
    uid: null,
    name: null,
};

const userReducer = createReducer(initialState, (builder) => {
    builder.addCase(LOGIN_USER, (state, action) => {
        state.loggedIn = true;
        state.uid = action.payload.uid;
        state.name = action.payload.name;
    });
});

export default userReducer;