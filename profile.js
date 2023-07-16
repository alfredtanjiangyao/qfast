import {
  View,
  Text,
  Button,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useEffect, useState } from "react";
import { db, auth } from "./src/firebase/config";

import {
  collection,
  onSnapshot,
  addDoc,
  query,
  where,
  getDocs,
  listCollections,
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import Dashboard from "./src/screens/dashboard";
import { useFonts } from 'expo-font';
import { onAuthStateChanged } from "firebase/auth";
import { roundToNearestMinutes } from "date-fns";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user){
        setUserId(user.uid);
        setEmail(user.email);
      }
    }
  )}, []);

  useEffect(() => {
    const fetchData = async (email) => {
      try {
        const usersCollectionRef = collection(db, "users");
        const queryUserEmailRef = query(
          usersCollectionRef,
          where("email", "==", email)
        );
        const querySnapshot = await getDocs(queryUserEmailRef);

        const userData = querySnapshot.docs[0].data();
        const username = userData.username;
        setUsername(username);
        console.log(username);

      } catch (error) {
        alert(error.message);
      }
    };

    fetchData(email);
  }, [email]);



  const [fontsLoaded] = useFonts({
    'Caprasimo-Regular': require('./assets/font/Caprasimo-Regular.otf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.whole}>
      {/* <View style={styles.container}>
        <View style={styles.line}>
          <View style={{ flex: 1, height: 1.5, backgroundColor: "black" }} />
        </View>
      </View> */}

      <View style={styles.container2}>
        <View style={styles.object}>
          <Text style={styles.TextInput}>Username</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInputForPlaceholder}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              defaultValue={username}
              editable={false}
            // value={this.state.email}
            // onChangeText={(val) => this.updateInputVal(val, "email")}
            />
          </View>
        </View>
      </View>

      <View style={styles.container3}>
        <View style={styles.object}>
          <Text style={styles.TextInput}>Email</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInputForPlaceholder}
              placeholderTextColor="#003f5c"
              defaultValue={email}
              editable={false}
            // value={this.state.email}
            // onChangeText={(val) => this.updateInputVal(val, "email")}
            />
          </View>
        </View>
      </View>

      <View style={styles.container2}>
        <View style={styles.object}>
          <Text style={styles.TextInput}>Contact</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInputForPlaceholder}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              defaultValue="Contact"
            // value={this.state.email}
            // onChangeText={(val) => this.updateInputVal(val, "email")}
            />
          </View>
        </View>
      </View>

      <View style={styles.container3}>
        <View style={styles.object}>
          <Text style={styles.TextInput}>Gender</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInputForPlaceholder}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              defaultValue="Male or Female"
            // value={this.state.email}
            // onChangeText={(val) => this.updateInputVal(val, "email")}
            />
          </View>
        </View>
      </View>

      <View style={styles.container2}>
        <View style={styles.object}>
          <Text style={styles.TextInput}>Birthdate</Text>
          <View style={styles.inputView}>
            <TextInput
              style={styles.TextInputForPlaceholder}
              placeholder="Email"
              placeholderTextColor="#003f5c"
              defaultValue="example@example.com"
            // value={this.state.email}
            // onChangeText={(val) => this.updateInputVal(val, "email")}
            />
          </View>
        </View>
      </View>

      <View style={styles.container}>
        <TouchableOpacity >
          <Text
            style={styles.submitText}
            onPress={() => {
            }}
          >
            Submit
          </Text>
        </TouchableOpacity>

        {/* <Button title="Submit" color="black"
              onPress={() => {
              }}
            >
        </Button> */}

      </View>

      <View style={styles.container2}>
        <TouchableOpacity >
          <Text
            style={styles.submitText}
            onPress={() => {
            }}
          >
            Log Out
          </Text>
        </TouchableOpacity>

        {/* <Button title="Log out" color="black"
              onPress={() => {
              }}
            >
        </Button> */}

      </View>


    </View>
  );
};
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  whole: {
    backgroundColor: "mistyrose",
    flex: 1,
    alignItems: "stretch",
    justifyContent: "center",
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 30,
    marginHorizontal: 20,
  },
  container3: {
    justifyContent: "center",
    marginVertical: 10,
    marginHorizontal: 20,
  },
  container2: {
    justifyContent: "center",
    marginVertical: -10,
    marginHorizontal: 20,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  object: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "baseline",
  },
  TextInput: {
    fontWeight: "300",
    height: 50,
    flex: 1,
    padding: 13,
    marginLeft: 20,
    fontWeight: "bold",
    marginLeft: 5,
  },
  TextInputForPlaceholder: {
    fontWeight: "200",
    height: 50,
    flex: 1,
    padding: 13,
    marginLeft: 20,
  },
  text: {
    textAlign: "left",
    marginBottom: 10,
    marginTop: 16,
    fontWeight: "200",
    fontSize: 15,
  },
  submitText: {
    textAlign: "center",
    alignItems: "center",
    marginBottom: 0,
    marginTop: 0,
    fontWeight: "200",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: 'Caprasimo-Regular',
  },
  button: {
    bottom: 10,
    width: "20%",
    borderWidth: 1,
    borderRadius: 15,
    padding: 7,
    backgroundColor: "white",
    marginTop: "auto",
  },
  submitButton: {
    alignSelf: "center",
    width: "20%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#f0f8ff",
  },
});

export default Profile;

/1