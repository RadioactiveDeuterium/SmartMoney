import { StyleSheet, Text, View, StatusBar, Image } from "react-native";
import { useSelector } from "react-redux";

export default function Home({ navigation }) {
  const name = useSelector((state) => state.userReducer.name);

  return (
    <View style={styles.container}>
      {/* Status Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.welcomeText}>Good Morning,</Text>
          <Text style={styles.nameText}>{name}</Text>
        </View>
        <Image
          style={styles.image}
          source={require("../assets/profile-default.png")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight,
  },
  topBar: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  welcomeText: {
    fontSize: 14,
  },
  nameText: {
    fontSize: 30,
    marginTop: -8,
    marginLeft: -1,
  },
  image: {
    width: 50,
    height: 50,
    marginRight: 0,
    marginLeft: "auto",
  },
});
