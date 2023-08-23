import { INIT_FIREBASE } from "../constants";
import { createReducer } from "@reduxjs/toolkit";

const initialState = {
    initialized: false,
    app: null,
    auth: null,
    db: null,
};

const firebaseReducer = createReducer(initialState, (builder) => {
    builder.addCase(INIT_FIREBASE, (state, action) => {
        state.initialized = true;
        state.app = action.payload.app;
        state.auth = action.payload.auth;
        state.db = action.payload.db;
    });
});

export default firebaseReducer;