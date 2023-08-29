import {
    LOGIN_USER,
    REFRESH_BUDGETS,
    REFRESH_SAVINGS,
    SET_EDITING_REF,
} from "../constants";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

const getBudgets = async(budgetsRef) => {
    let budgets = [];
    const budgetsSnapshot = await getDocs(budgetsRef);
    const documents = budgetsSnapshot.docs;
    for (const doc of documents) {
        let transactions = [];
        let currentSum = 0;
        const transactionsRef = collection(doc.ref, "transactions");
        const transactionsSnapshot = await getDocs(transactionsRef);
        transactionsSnapshot.forEach((doc) => {
            transactions.push({ ref: doc.ref, ...doc.data() });
            currentSum += Number(doc.data().amount);
        });
        budgets.push({
            ref: doc.ref,
            transactionsRef: transactionsRef,
            transactions: transactions,
            current: currentSum,
            ...doc.data(),
        });
    }
    return budgets;
};

const getSavings = async(savingsRef) => {
    let savings = [];
    const savingsSnapshot = await getDocs(savingsRef);
    const documents = savingsSnapshot.docs;
    for (const doc of documents) {
        let contributions = [];
        let currentSum = 0;
        const contributionsRef = collection(doc.ref, "contributions");
        const contributionsSnapshot = await getDocs(contributionsRef);
        contributionsSnapshot.forEach((doc) => {
            contributions.push({ ref: doc.ref, ...doc.data() });
            currentSum += Number(doc.data().amount);
        });
        savings.push({
            ref: doc.ref,
            contributionsRef: contributionsRef,
            contributions: contributions,
            current: currentSum,
            ...doc.data(),
        });
    }
    return savings;
};

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
        const budgetsRef = collection(userRef, "budgets");
        const budgets = await getBudgets(budgetsRef);

        //get user savings
        const savingsRef = collection(userRef, "savings");
        const savings = await getSavings(savingsRef);

        //set data
        await dispatch({
            type: LOGIN_USER,
            payload: {
                uid: uid,
                name: name,
                userRef: userRef,
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
        console.log("refreshing budgets");
        const state = getState();
        const budgetsRef = state.userReducer.budgetsRef;
        const budgets = await getBudgets(budgetsRef);

        //set data
        await dispatch({
            type: REFRESH_BUDGETS,
            payload: { budgets: budgets },
        });
    };
};

const refreshSavings = () => {
    return async(dispatch, getState) => {
        console.log("refreshing savings")
        const state = getState();
        const savingsRef = state.userReducer.savingsRef;
        const savings = await getSavings(savingsRef);

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
};

const userActions = {
    loginUser,
    refreshBudgets,
    refreshSavings,
    setEditingRef,
};

export default userActions;