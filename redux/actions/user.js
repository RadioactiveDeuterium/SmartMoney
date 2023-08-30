import {
    LOGIN_USER,
    REFRESH_BUDGETS,
    REFRESH_SAVINGS,
    SET_BUDGET_REF,
    SET_EDITING_REF,
    SET_SAVING_REF,
    SET_VIEW_CBNS,
    SET_VIEW_TXNS,
} from "../constants";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";

const decrementMonth = (month, year, i) => {
    const newMonth = month - i;
    const newYear = year;
    if (newMonth <= 0) {
        newMonth = 12 - newMonth;
        newYear = year - 1;
    }
    return [newMonth, newYear];
}

const createBudgetData = (transactions) => {
    // budgets will be categorized by month
    // last 6 months of detailed data will be avaliable in the app
    // start by determing the current month + year and work back
    const today = new Date();
    const currMonth = today.getMonth();
    const currYear = today.getFullYear();

    let budgetDetails = [];
    for (let i = 0; i < 6; i++) {
        //calc month to fetch budgets from
        const [newMonth, newYear] = decrementMonth(currMonth, currYear, i);
        let monthlyTransactions = [];
        let monthlyTotal = 0;
        for (const txn of transactions) {
            const txnDate = txn.date.toDate();
            if (txnDate.getMonth() == newMonth && txnDate.getFullYear() == newYear) {
                monthlyTransactions.push(txn);
                monthlyTotal += Number(txn.amount);
            }
        }
        budgetDetails.push({ month: newMonth, year: newYear, transactions: monthlyTransactions, monthlyTotal: monthlyTotal });
    }
    return budgetDetails;
}

const createSavingData = (contributions) => {
    const today = new Date();
    const currMonth = today.getMonth();
    const currYear = today.getFullYear();

    let savingsDetails = [];
    for (let i = 0; i < 6; i++) {
        //calc month to fetch budgets from
        const [newMonth, newYear] = decrementMonth(currMonth, currYear, i);
        let monthlyContributions = [];
        let monthlyTotal = 0;
        for (const cbn of contributions) {
            const cbnDate = cbn.date.toDate();
            if (cbnDate.getMonth() == newMonth && cbnDate.getFullYear() == newYear) {
                monthlyContributions.push(cbn);
                monthlyTotal += Number(cbn.amount);
            }
        }
        savingsDetails.push({ month: newMonth, year: newYear, contributions: monthlyContributions, monthlyTotal: monthlyTotal });
    }
    return savingsDetails;
}

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
        const details = createBudgetData(transactions);
        budgets.push({
            ref: doc.ref,
            transactionsRef: transactionsRef,
            transactions: transactions,
            current: currentSum,
            monthlyBreakdown: details,
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
        const details = createSavingData(contributions)
        savings.push({
            ref: doc.ref,
            contributionsRef: contributionsRef,
            contributions: contributions,
            current: currentSum,
            monthlyBreakdown: details,
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

const setBudgetDashboard = (budget) => {
    return async(dispatch, getState) => {
        //set data
        console.log('set dashboard')
        await dispatch({
            type: SET_BUDGET_REF,
            payload: { budgetDashboard: budget },
        });
    };
};

const setSavingDashboard = (saving) => {
    return async(dispatch, getState) => {
        //set data
        console.log('set dashboard')
        await dispatch({
            type: SET_SAVING_REF,
            payload: { savingDashboard: saving },
        });
    };
};

const setViewTransactions = (transactions) => {
    return async(dispatch, getState) => {
        //set data
        console.log('set view transactions')
        await dispatch({
            type: SET_VIEW_TXNS,
            payload: { viewTransactions: transactions },
        });
    };
};

const setViewContributions = (contributions) => {
    return async(dispatch, getState) => {
        //set data
        console.log('set view contributions')
        console.log(contributions);
        await dispatch({
            type: SET_VIEW_CBNS,
            payload: { viewContributions: contributions },
        });
    };
};

const userActions = {
    loginUser,
    refreshBudgets,
    refreshSavings,
    setEditingRef,
    setBudgetDashboard,
    setSavingDashboard,
    setViewTransactions,
    setViewContributions,
};

export default userActions;