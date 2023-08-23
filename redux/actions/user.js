import { LOGIN_USER } from "../constants";
import { doc, getDoc } from "firebase/firestore";

const loginUser = (uid) => {
    return async(dispatch, getState) => {
        //get db object
        const state = getState();
        const db = state.firebaseReducer.db;
        //get users name
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);
        const name = docSnap.data().name;
        await dispatch({ type: LOGIN_USER, payload: { uid: uid, name: name } });
        console.log("user logged in: " + name);
    };
};

const userActions = {
    loginUser,
};

export default userActions;