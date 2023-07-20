// components/signup.js
import React, { Component, useState } from "react";
import firebase from "../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  fetchSignInMethodsForEmail,
  sendEmailVerification,
  handleCodeInApp,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase/config";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
} from "firebase/firestore";

import { StatusBar } from "expo-status-bar";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
import { TextInput } from 'react-native-paper';

export default class Signup extends Component {
  constructor() {
    super();

    //state is an object
    //set initial state
    this.state = {
      username: "",
      email: "",
      password: "",
      loading: false,
    };
  }

  updateInputVal = (val, prop) => {
    const userState = this.state;
    userState[prop] = val;
    this.setState(userState);
  };
  
  //check the availibility of username
  checkUsernameAvailability = async () => {
    try {
      const username = this.state.username;
      const usersCollectionRef = collection(db, "users");
      const queryUsernameRef = query(
        usersCollectionRef,
        where("username", "==", username)
      );
      const querySnapshot = await getDocs(queryUsernameRef);

      if (querySnapshot.size > 0) {
        return false;
      } else {
        return true;
      }
    } catch (error) {
      Alert.alert(error.message);
      return false;
    }
  };

  //check the availability of email
  checkEmailAvailability = async () => {
    try {
      const usersCollectionRef = collection(db, "users");
      const userEmail = this.state.email;
      const queryUserEmailRef = query(
        usersCollectionRef,
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(queryUserEmailRef);

      if (querySnapshot.size > 0) {
        return false;
      }
      return true;
    } catch (error) {
      Alert.alert(error.message);
      return false;
    }
  };

  verificationEmail = async (user) => {
    try {
      const email = user.email;

      const actionCodeSettings = {
        handleCodeInApp: true,
        url: `https://noreply@qfast-77dbc.firebaseapp.com/?email=${email}`, // Replace with your app's verification URL
      };

      await sendEmailVerification(user, actionCodeSettings);

      Alert.alert("Email Verification sent! Check your mailbox", "");
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  registerUserUsingEmail = async () => {
    try {
      const { username, email, password } = this.state;

      if (!username || !email || !password) {
        Alert.alert("Missing Information", "Please fill in all the fields.");
        return;
      }

      if (password.length < 8) {
        Alert.alert(
          "Invalid Password",
          "Password should be at least 8 characters long."
        );
        return;
      }

      // Check username availability
      const isUsernameAvailable = await this.checkUsernameAvailability();
      if (!isUsernameAvailable) {
        Alert.alert("Username taken", "Please choose a different username.");
        return;
      }

      // Check email availability
      const isEmailAvailable = await this.checkEmailAvailability();
      if (!isEmailAvailable) {
        Alert.alert("This email has been registered", "");
        return;
      }

      // Proceed with user registration
      this.setState({ loading: true });

      //save as same document but different field
      const res = await createUserWithEmailAndPassword(auth, email, password);
      const usersCollectionRef = collection(db, "users");
      const userDocRef = doc(usersCollectionRef, res.user.uid);

      const user = auth.currentUser;

      await this.verificationEmail(user);

      var count = 1;

      while (!user.emailVerified) {
        if (count === 1) {
          await new Promise(resolve => setTimeout(resolve, 5000));
          Alert.alert("Email not verified", "Please verify your email.");
        }
        await user.reload();
        count++;
      }

      await setDoc(userDocRef, {
        username: username,
        email: email,
        verified: false,
        contact: "",
        gender: "",
        birthdate: "",
        // password: password,
      });

      Alert.alert("User registered successfully!", "");

      this.setState({
        username: "",
        email: "",
        password: "",
        loading: false,
      });

      this.props.navigation.navigate("Dashboard");
    } catch (error) {
      Alert.alert("Error registering user:", error.message);
      this.setState({ loading: false });
      return;
    }
  };

  //render usually for UI
  //render is the entry point
  render() {
    //loading is false initially(due to the constructor)
    if (this.state.loading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }

    return (
      <KeyboardAvoidingView
      style={[{ flex: 1 }, styles.container]}
      behavior="position">

      <SafeAreaView style={styles.container}>
        <Image
          source={{uri: "https://i.pinimg.com/originals/2b/32/b5/2b32b59dbfc427812eef579985234524.gif"}}
          style={{ width: 300, height: 200, marginBottom: 50}}
        />

        <View >
          <TextInput
          mode='outlined'
            style={styles.TextInput}
            label="Username"
            value={this.state.username} //store the value filled by the user to username
            onChangeText={(val) => this.updateInputVal(val, "username")}
          />
        </View>

        <View>
          <TextInput
          mode='outlined'
            style={styles.TextInput}
            label="Email"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, "email")}
          />
        </View>

        <View>
          <TextInput
            style={styles.TextInput}
            mode='outlined'
            label="Password"
            placeholderTextColor="#003f5c"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, "password")}
            maxLength={16}
          />
        </View>

        <TouchableOpacity style={styles.signUpBtn}>
          <Text
            style={{fontSize: 15, color: 'white'}}
            onPress={() => {
              this.registerUserUsingEmail();
            }}
          >
            Sign up
          </Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'center'}}>
          <Text style={{ fontSize: 13, fontWeight: '200' }}>Already signed up?  </Text>
        <TouchableOpacity style={styles.loginBtn}>
          <Text
            style={{ fontSize: 14, fontWeight: '300', color: 'blue' }}
            onPress={() => this.props.navigation.navigate("Login")}
          >
            Login
          </Text>
        </TouchableOpacity>
        </View>
      </SafeAreaView></KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontWeight: 5,
    marginBottom: 10,
    color: "white",
  },

  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "left",
  },

  TextInput: {
    borderColor: 'grey',
    borderRadius: 5,
    width: 300,
    paddingLeft: 5,
    fontWeight: "200",
  },

  signUpBtn: {
    width: "50%",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(100, 100, 150, 1)",
    marginVertical: 20,
    marginTop: 50
  },

});

// namespace is not allowed! when typing email
// specific error(use alert)
