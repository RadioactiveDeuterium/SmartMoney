import { LOGIN_USER, REFRESH_BUDGETS, REFRESH_SAVINGS, SET_EDITING_REF } from "../constants";
import { doc, getDoc, getDocs, collection, getDocFromServer, getDocsFromServer } from "firebase/firestore";

const loginUser = (uid) => {
    return async(dispatch, getState) => {
        //get db object
        const state = getState();
        const db = state.firebaseReducer.db;

        //get users name
        const userRef = doc(db, "users", uid);
        const userSnap = await getDoc(userRef);
        const name = userSnap.data().name;

        //get user budgets
        let budgets = [];
        const budgetsRef = collection(userRef, "budgets");
        const budgetsSnapshot = await getDocs(budgetsRef);
        budgetsSnapshot.forEach(async(doc) => {
            let transactions = [];
            const transactionsRef = collection(doc.ref, "transactions");
            const transactionsSnapshot = await getDocs(transactionsRef);
            transactionsSnapshot.forEach((doc) => {
                console.log(doc.data());
                transactions.push({ ref: doc.ref, ...doc.data() });
            })
            budgets.push({ ref: doc.ref, transactionsRef: transactionsRef, transactions: transactions, ...doc.data() });
        });

        //get user savings
        let savings = [];
        const savingsRef = collection(userRef, "savings");
        const savingsSnapshot = await getDocs(savingsRef);
        savingsSnapshot.forEach((doc) => {
            savings.push({ ref: doc.ref, ...doc.data() });
        });

        //set data
        await dispatch({
            type: LOGIN_USER,
            payload: {
                uid: uid,
                name: name,
                budgetsRef: budgetsRef,
                budgets: budgets,
                savingsRef: savingsRef,
                savings: savings,
            },
        });
        console.log("user logged in: " + name);
    };
};

const refreshBudgets = () => {
    return async(dispatch, getState) => {
        const state = getState();
        //get user budgets
        let budgets = [];
        const budgetsRef = state.userReducer.budgetsRef;
        const budgetsSnapshot = await getDocs(budgetsRef);
        budgetsSnapshot.forEach(async(doc) => {
            budgets.push({ ref: doc.ref, ...doc.data() });
        });

        //set data
        await dispatch({
            type: REFRESH_BUDGETS,
            payload: { budgets: budgets },
        });
    };
};

const refreshSavings = () => {
    return async(dispatch, getState) => {
        const state = getState();
        //get user savings
        let savings = [];
        const savingsRef = state.userReducer.savingsRef;
        const savingsSnapshot = await getDocs(savingsRef);
        savingsSnapshot.forEach((doc) => {
            savings.push({ ref: doc.ref, ...doc.data() });
        });

        //set data
        await dispatch({
            type: REFRESH_SAVINGS,
            payload: { savings: savings },
        });
    };
};

const setEditingRef = (ref) => {
    return async(dispatch, getState) => {
        //set data
        await dispatch({
            type: SET_EDITING_REF,
            payload: { editingRef: ref },
        });
    };
}

const userActions = {
    loginUser,
    refreshBudgets,
    refreshSavings,
    setEditingRef,
};

export default userActions;