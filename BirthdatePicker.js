import {
  Alert,
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
  updateDoc,
} from "firebase/firestore";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";
import { Picker } from "@react-native-picker/picker";
import { useFonts } from "expo-font";
import { onAuthStateChanged } from "firebase/auth";
import { roundToNearestMinutes, set } from "date-fns";
import { IconButton, MD3Colors } from "react-native-paper";
import Profile from "./profile";

const BirthdatePicker = () => {
  const [birthdate, setBirthdate] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setEmail(user.email);
      }
    });
  }, []);

  const saveUserData = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const queryUserEmailRef = query(
        usersCollectionRef,
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(queryUserEmailRef);

      const userId = querySnapshot.docs[0].id;
      const userDocRef = doc(usersCollectionRef, userId);

      await updateDoc(userDocRef, {
        birthdate: birthdate,
      });

      if (birthdate !== "") {
        Alert.alert("Your birthdate is ", birthdate);
      } else {
        Alert.alert("Please enter your birthdate!", "");
      }
      // navigation.navigate("Profile");
    } catch (error) {
      alert(error.message);
      console.log("1");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.object}>
        <View>
          <CalendarPicker
            onDateChange={(date) => {
              const selectedDate = moment(date);
              const currentDate = moment();
              if (selectedDate.isAfter(currentDate)) {
                alert("Please select your actual birthdate!");
                return;
              }
              const formattedDate = selectedDate.format("YYYY-MM-DD");
              setBirthdate(formattedDate);
            }}
            textStyle={{
              fontFamily: "Cochin",
              color: "#000000",
            }}
            selectedDayStyle={{
              backgroundColor: "#87cefa",
            }}
          />
        </View>

        <View style={styles.doneButton}>
          <TouchableOpacity>
            <Text style={styles.submitText} onPress={saveUserData}>
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    flex: 1,
  },
  object: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  doneButton: {
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 50,
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
    fontFamily: "Caprasimo-Regular",
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

export default BirthdatePicker;