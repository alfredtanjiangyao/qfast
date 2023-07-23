import {
  Alert,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import { db, auth } from "../../firebase/config";

import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { onAuthStateChanged, updateCurrentUser } from "firebase/auth";
import BirthdatePicker from "./BirthdatePicker";
import "firebase/auth";

import { LogBox } from "react-native";

LogBox.ignoreLogs([
  "Non-serializable values were found in the navigation state",
]);
LogBox.ignoreLogs(["Require cycle:"]);
LogBox.ignoreLogs(["Maximum update depth exceeded"]);
LogBox.ignoreLogs(["Sending `onAnimatedValueUpdate`"]);

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const navigation = useNavigation();

  const fetchData = async (userEmail) => {
    try {
      console.log("fetchdataemail" + userEmail);
      const usersCollectionRef = collection(db, "users");
      const queryUserEmailRef = query(
        usersCollectionRef,
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(queryUserEmailRef);

      console.log("2");

      if (querySnapshot.empty) {
        console.log("User Data2:");
        return; // No documents found, handle the case accordingly
      }

      const userData = querySnapshot.docs[0]?.data();

      console.log("3");

      if (userData) {
        const email = userData.email;
        setEmail(email);

        const username = userData.username;
        setUsername(username);

        const gender = userData.gender;
        setGender(gender);

        const contact = userData.contact;
        setContact(contact);

        const birthdate = userData.birthdate;
        setBirthdate(birthdate);

        console.log("4");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        const userId = user.uid;
        const userEmail = user.email;
        setUserId(userId);
        setEmail(userEmail);

        console.log("1");

        fetchData(userEmail);
      }
    });
  }, []);

  const checkBirthDate = async (userEmail) => {
    console.log("5");
    const usersCollectionRef = collection(db, "users");
    const queryUserEmailRef = query(
      usersCollectionRef,
      where("email", "==", userEmail)
    );
    const querySnapshot = await getDocs(queryUserEmailRef);

    if (querySnapshot.empty) {
      console.log("wrong");
      return;
    }
    const userData = querySnapshot.docs[0]?.data();

    if (userData) {
      const userBirthdate = userData.birthdate;
      setBirthdate(userBirthdate);
    }

    console.log("6");
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", async () => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const userId = user.uid;
          const userEmail = user.email;
          setUserId(userId);
          setEmail(userEmail);

          checkBirthDate(userEmail);
        }
      });
    });

    console.log("7");

    return unsubscribe;
  }, [navigation]);

  const checkGenderInput = () => {
    if (gender === "Male" || gender === "Female") {
    } else {
      Alert.alert("Please insert your gender properly.");
      setGender("");
    }
  };

  const saveUserData = async () => {
    try {
      console.log("9");
      if (contact === "" || gender === "" || birthdate === "") {
        Alert.alert("Please enter all details", "");
        console.log("9");
        return;
      }
      const usersCollectionRef = collection(db, "users");
      const queryUserEmailRef = query(
        usersCollectionRef,
        where("email", "==", email)
      );
      const querySnapshot = await getDocs(queryUserEmailRef);

      const userId = querySnapshot.docs[0].id;
      const userDocRef = doc(usersCollectionRef, userId);

      await updateDoc(userDocRef, {
        contact: contact,
        gender: gender,
        birthdate: birthdate,
        profileCompleted: true,
      });
      console.log("8");
      Alert.alert("Your profile has been completed", "");
    } catch (error) {
      alert(error.message);
    }
  };

  const signOut = async () => {
    try {
      await signOut(auth);
      setTimeout(() => {
        navigation.navigate("Login");
      }, 1000); 
    } catch (error) {
      console.log(error);
    }
  };

  const [fontsLoaded] = useFonts({
    "Caprasimo-Regular": require("../../../assets/font/Caprasimo-Regular.otf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.whole}>
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
              placeholder="Contact"
              placeholderTextColor="#003f5c"
              defaultValue={contact}
              value={contact}
              onChangeText={(val) => {
                const numericValue = val.replace(/[^0-9]/g, "");
                const truncatedValue = numericValue.slice(0, 8);
                setContact(truncatedValue);
              }}
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
              placeholder="Male or Female"
              placeholderTextColor="#003f5c"
              defaultValue={gender}
              value={gender}
              onChangeText={(val) => setGender(val)}
              onBlur={checkGenderInput}
            />
          </View>
        </View>
      </View>

      <View style={styles.container2}>
        <View style={styles.object}>
          <Text style={styles.TextInput}>Birthdate</Text>
          <View style={styles.inputView}>
            <TouchableOpacity
              style={styles.inputView}
              onPress={async () => {
                navigation.navigate("BirthdatePicker", { navigation });
              }}
            >
              {birthdate ? (
                <Text style={styles.TextInputForPlaceholder}>{birthdate}</Text>
              ) : (
                <Text style={styles.TextInputForPlaceholder}>
                  Select Birthdate
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* // placeholder="Email"
              // placeholderTextColor="#003f5c"
              // defaultValue="example@example.com"
            // value={this.state.email}
            // onChangeText={(val) => this.updateInputVal(val, "email")} */}

      <View style={styles.container}>
        <TouchableOpacity>
          <Text style={styles.submitText} onPress={saveUserData}>
            Submit
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container2}>
        <TouchableOpacity>
          <Text style={styles.submitText} onPress={signOut}>
            Log Out
          </Text>
        </TouchableOpacity>
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
    fontFamily: "Caprasimo-Regular",
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

//store data in our database after clicking the submit button
