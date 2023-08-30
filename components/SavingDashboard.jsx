import {
  View,
  StyleSheet,
  StatusBar,
  Text,
  Dimensions,
  Pressable,
  Image
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { mapMonthValueToWord } from "../utils";
import ProgressCircle from "react-native-progress-circle";
import { BarChart } from "react-native-chart-kit";
import { monthDiff } from "../utils";
import reduxActions from "../redux/actions";

export default function SavingDashboard({ navigation }) {
  const dispatch = useDispatch();
  const saving = useSelector((state) => state.userReducer.savingDashboard);
  const [percentage, setPercentage] = useState(0);
  const [saved, setSaved] = useState(0);
  const [total, setTotal] = useState(0);
  const [average, setAverage] = useState('')
  const [estimate, setEstimate] = useState('');
  const [timeToGoal, setTimeToGoal] = useState('');
  const [tip, setTip] = useState('');
  const [chartLabels, setChartLabels] = useState([]);
  const [chartValues, setChartValues] = useState([]);

  // Populate arrays for charts + dropdown
  useEffect(() => {
    const monthlyBreakdown = saving.monthlyBreakdown;
    let chartVals = [];
    let chartLabs = [];
    let average = 0;
    let averageCount = 0;
    for (const object of monthlyBreakdown) {
      chartLabs.push(mapMonthValueToWord(object.month));
      chartVals.push(object.monthlyTotal);
      if (object.monthlyTotal > 0) {
        average += object.monthlyTotal;
        averageCount++;
      }
    }
    average = Math.round(average / averageCount);
    const remainingToSave = saving.goal - saving.current;
    const timeEstimate = Math.round(remainingToSave/average);
    setAverage(average);
    setEstimate(timeEstimate + " Months")
    setChartLabels(chartLabs.reverse());
    setChartValues(chartVals.reverse());
  }, [saving]);

  // Set and calculate displayed values
  useEffect(() => {
    if (saving) {
      setPercentage(
        Math.round(
          (Number(saving.current) / Number(saving.goal)) * 100
        )
      );
      setSaved(saving.current);
      setTotal(saving.goal);
      const today = new Date();
      const goalDate = saving.date.toDate();
      const remaining = monthDiff(today, goalDate)
      if (remaining >= 0) {
        setTimeToGoal(remaining + " Months Remaining");
      } else {
        setTimeToGoal("Goal Expired");
      }
    }
  }, [saving]);

  useEffect(() => {
    if (timeToGoal < estimate) {
      setTip("Uh Oh, looks like you are not on track to complete your goal on schedule. Try increasing your monthly contributions.");
    } else {
      setTip("Great work, you are on track to reach your goal on time!")
    }
  })

  const viewAllCbns = () => {
    dispatch(reduxActions.userActions.setViewContributions(saving.contributions));
    navigation.navigate("View All Contributions");
  }

  return (
    <>
      {/* Progress */}
      <View style={styles.container}>
        <Text style={styles.title}>{saving.title}</Text>
        <View style={styles.progress}>
          <ProgressCircle
            percent={percentage}
            radius={70}
            borderWidth={16}
            color={percentage < 100 ? "#ff303e" : "#70ff57"}
            shadowColor="#999"
            bgColor="#fff"
          >
            <Text style={styles.progressText}>{percentage}%</Text>
          </ProgressCircle>
        </View>
        <Text style={styles.progressSubText}>
          {timeToGoal}
        </Text>
        <Text style={styles.progressSubText2}>
          ${saved}/${total}
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
        style={{}}
      />
      <Pressable style={styles.contributionsContainer} onPress={viewAllCbns}>
        <Text style={styles.contributionsText}>View Contributions</Text>
        <Image
        style={styles.image}
        source={require("../assets/right-arrow.png")}
      />
      </Pressable>
      <View style={styles.infoContainer}>
        <View style={styles.infoLeft}>
          <Text style={styles.infoMainText}>${average}</Text>
          <Text style={styles.infoSubText}>Average{"\n"}Monthly{"\n"}Contribution</Text>
        </View>
        <View style={styles.infoRight}>
          <Text style={styles.infoMainText}>{estimate}</Text>
          <Text style={styles.infoSubText}>Until{"\n"}Estimated{"\n"}Completion</Text>
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.tipText}>{tip}</Text>
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
    marginTop: 12,
  },
  progressSubText2: {
    fontSize: 26,
    textAlign: "center",
    marginVertical: 12,
  },
  image: {
    width: 20,
    height: 20,
    marginLeft: 6,
    marginVertical: 10
  },
  contributionsContainer: {
    flexDirection: 'row',
    backgroundColor: "lightgray",
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    width: '90%',
    alignSelf: 'center',
    marginTop: 10
  },
  contributionsText: {
    fontSize: 24
  },
  infoContainer: {
    backgroundColor: "lightgray",
    borderRadius: 20,
    width: '90%',
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: 12
  },
  infoLeft: {
    width: '50%',
    borderRightWidth: 2,
    paddingLeft: 8,
    paddingVertical: 2
  },
  infoRight: {
    width: '50%',
    paddingLeft: 8,
    paddingVertical: 2
  },
  infoMainText: {
    fontSize: 26
  },
  infoSubText: {
    fontSize: 16
  },
  tipText: {
    paddingHorizontal: 8,
    paddingVertical: 6
  }
});
