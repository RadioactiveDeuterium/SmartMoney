import { INIT_FIREBASE } from "../constants";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
    apiKey: "AIzaSyDj16_g0e78T6GpYTqfkXrnMZopxOKHm4U",
    authDomain: "smartmoney-b8ec8.firebaseapp.com",
    projectId: "smartmoney-b8ec8",
    storageBucket: "smartmoney-b8ec8.appspot.com",
    messagingSenderId: "89494191137",
    appId: "1:89494191137:web:dc89040f392b6e673f7760",
    measurementId: "G-MEDXD3KLV8",
};

const initFirebase = () => {
    return async(dispatch, getState) => {
        const app = initializeApp(firebaseConfig);
        const db = getFirestore(app);
        const auth = initializeAuth(app, {
            persistence: getReactNativePersistence(ReactNativeAsyncStorage),
        });
        await dispatch({
            type: INIT_FIREBASE,
            payload: { app: app, auth: auth, db: db },
        });
        console.log("firebase initialized");
    };
};

const firebaseActions = {
    initFirebase,
};

export default firebaseActions;