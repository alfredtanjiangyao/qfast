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
import React, { useEffect, useState } from "react";
import { useFocusEffect } from '@react-navigation/native';
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
import { useNavigation } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { onAuthStateChanged } from "firebase/auth";
import BirthdatePicker from "./BirthdatePicker";
import "firebase/auth";

const Profile = () => {
  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [contact, setContact] = useState("");
  const [birthdate, setBirthdate] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        setEmail(user.email);
      }
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersCollectionRef = collection(db, "users");
        const queryUserEmailRef = query(
          usersCollectionRef,
          where("email", "==", email)
        );
        const querySnapshot = await getDocs(queryUserEmailRef);

        const userData = querySnapshot.docs[0];
        const user = userData.data();

          const username = user.username;
          setUsername(username);

          console.log(username);

          const gender = user.gender;
          setGender(gender);

          console.log(gender);

          const contact = user.contact;
          setContact(contact);

          console.log(contact);

          const birthdate = user.birthdate;
          setBirthdate(birthdate);

          console.log(birthdate);

        
        // const userData = querySnapshot.docs[0].data();
        // const username = userData.username;
        // setUsername(username);

        // const gender = userData.gender;
        // setGender(gender);

        // const contact = userData.contact;
        // setContact(contact);

        // const birthdate = userData.birthdate;
        // setBirthdate(birthdate);

        console.log(username);
        console.log(gender);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData(email);
  }, []);

  const checkBirthDate = async () => {
    const usersCollectionRef = collection(db, "users");
    const queryUserEmailRef = query(
      usersCollectionRef,
      where("email", "==", email)
    );
    const querySnapshot = await getDocs(queryUserEmailRef);

    // const userData = querySnapshot.docs[0];
    // const userBirthdate = userData.get("birthdate");
    // const userData = querySnapshot.docs[0].data();
    // const userBirthdate = userData.birthdate;

    if(querySnapshot.empty){
      return
    }
    const userData = querySnapshot.docs[0].data();

    if(userData){
      const userBirthdate = userData.birthdate;
      setBirthdate(userBirthdate);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', async () => {
      await checkBirthDate();
    });
  
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
      });
    } catch (error) {
      alert(error.message);
      console.log("1");
    }
  };

  const [fontsLoaded] = useFonts({
    "Caprasimo-Regular": require("./assets/font/Caprasimo-Regular.otf"),
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
                navigation.navigate("BirthdatePicker");
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
          <Text style={styles.submitText} onPress={() => {}}>
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
