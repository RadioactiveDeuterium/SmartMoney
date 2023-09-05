import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Dimensions,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import DropDownPicker from "react-native-dropdown-picker";
import { mapMonthValueToWord } from "../utils";
import ProgressCircle from "react-native-progress-circle";
import { BarChart } from "react-native-chart-kit";
import reduxActions from "../redux/actions";

export default function BudgetDashboard({ navigation }) {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.userReducer.budgetDashboard);
  const [activeMonthData, setActiveMonthData] = useState(null);
  const [percentage, setPercentage] = useState(0);
  const [spent, setSpent] = useState(0);
  const [total, setTotal] = useState(0);
  const [chartLabels, setChartLabels] = useState([]);
  const [chartValues, setChartValues] = useState([]);
  const [recents, setRecents] = useState([]);
  const [tip, setTip] = useState("");

  // dropdown
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [monthDropdownValue, setMonthDropdownValue] = useState(null);
  const [monthDropdownItems, setMonthDropdownItems] = useState([]);

  // Populate arrays for charts + dropdown
  useEffect(() => {
    const monthlyBreakdown = budget.monthlyBreakdown;
    let monthDropdownValues = [];
    let chartVals = [];
    let chartLabs = [];
    for (const object of monthlyBreakdown) {
      monthDropdownValues.push({
        label: mapMonthValueToWord(object.month),
        value: monthlyBreakdown.indexOf(object),
      });
      chartLabs.push(mapMonthValueToWord(object.month));
      chartVals.push(object.monthlyTotal);
    }
    setMonthDropdownItems(monthDropdownValues);
    setMonthDropdownValue(0);
    setChartLabels(chartLabs.reverse());
    setChartValues(chartVals.reverse());
  }, [budget]);

  // Populate recent transactions
  useEffect(() => {
    if (budget.transactions) {
      let recentTxns = budget.transactions.slice(0, 3);
      setRecents(recentTxns);
    }
  }, [budget]);

  // Handle month switching
  useEffect(() => {
    if (budget.monthlyBreakdown) {
      setActiveMonthData(budget.monthlyBreakdown[monthDropdownValue]);
    }
  }, [monthDropdownValue]);

  // Set percentage + update displayed values
  useEffect(() => {
    if (activeMonthData) {
      setPercentage(
        Math.round(
          (Number(activeMonthData.monthlyTotal) / Number(budget.amount)) * 100
        )
      );
      setSpent(activeMonthData.monthlyTotal);
      setTotal(budget.amount);
    }
  }, [activeMonthData]);

  useEffect(() => {
    if (percentage <= 100) {
      setTip("Looks like you are under you budget. Good work!");
    } else {
      setTip(
        "Uh oh, looks like you are over you budget, try to cut back on spending next month."
      );
    }
  });

  const viewAllTxns = () => {
    dispatch(reduxActions.userActions.setViewTransactions(budget.transactions));
    navigation.navigate("View All Transactions");
  };

  return (
    <>
      {/* Progress */}
      <View style={styles.container}>
        <DropDownPicker
          open={monthDropdownOpen}
          value={monthDropdownValue}
          items={monthDropdownItems}
          setOpen={setMonthDropdownOpen}
          setValue={setMonthDropdownValue}
          setItems={setMonthDropdownItems}
          style={styles.dropdown}
        />
        <Text style={styles.title}>{budget.title}</Text>
        <View style={styles.progress}>
          <ProgressCircle
            percent={percentage}
            radius={70}
            borderWidth={16}
            color={percentage > 100 ? "#ff303e" : "#70ff57"}
            shadowColor="#999"
            bgColor="#fff"
          >
            <Text style={styles.progressText}>{percentage}%</Text>
          </ProgressCircle>
        </View>
        <Text style={styles.progressSubText}>
          ${spent}/${total}
        </Text>
      </View>
      {/* Chart */}
      <BarChart
        data={{
          labels: chartLabels,
          datasets: [
            {
              data: chartValues,
            },
          ],
        }}
        width={Dimensions.get("window").width}
        height={200}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: "#2196f3",
          backgroundGradientFrom: "#2196f3",
          backgroundGradientTo: "#2196f3",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
        bezier
        fromZero
        style={{}}
      />
      {/* Recent transactions */}
      <View style={styles.lowerContainer}>
        <Text style={styles.recentText}>Recent Transactions:</Text>
        {recents.map((item) => {
          return (
            <View
              style={styles.recentContainer}
              key={item.amount + item.merchant}
            >
              <Text style={styles.recentText}>${item.amount}&nbsp;</Text>
              <Text style={styles.recentText}>{item.merchant}&nbsp;</Text>
              <Text style={styles.recentTextGrow}>
                {item.date.toDate().toDateString()}
              </Text>
            </View>
          );
        })}
        <Pressable style={styles.viewAll} onPress={viewAllTxns}>
          <Text style={styles.viewAllText}>View All ➡</Text>
        </Pressable>
        <View style={styles.infoContainer}>
          <Text style={styles.tipText}>{tip}</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    alignSelf: "center",
    paddingTop: StatusBar.currentHeight + 12,
    backgroundColor: "#2196f3",
    width: "100%",
    minHeight: "35%",
  },
  dropdown: {
    width: "30%",
    minWidth: 150,
    alignSelf: "center",
    borderWidth: 0,
    backgroundColor: "#2196f3",
    padding: 0,
    margin: 0,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    width: "100%",
    marginVertical: 6,
  },
  progress: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressText: {
    fontSize: 26,
    fontWeight: "bold",
  },
  progressSubText: {
    fontSize: 26,
    textAlign: "center",
    marginVertical: 12,
  },
  recentContainer: {
    flexDirection: "row",
    width: "100%",
    alignSelf: "center",
    marginVertical: 6,
  },
  recentText: {
    fontSize: 20,
  },
  recentTextGrow: {
    fontSize: 20,
    flexGrow: 1,
    textAlign: "right",
  },
  lowerContainer: {
    marginTop: 6,
    width: "90%",
    alignSelf: "center",
  },
  viewAllText: {
    fontSize: 20,
  },
  infoContainer: {
    backgroundColor: "lightgray",
    borderRadius: 20,
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    marginTop: 12,
  },
  tipText: {
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
});
