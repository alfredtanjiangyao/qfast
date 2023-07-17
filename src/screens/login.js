import React, { Component, useState, useEffect } from "react";
import "firebase/auth";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithCredential,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider, db } from "../firebase/config";
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
// import GoogleButton from "react-google-button";
// import {
//   GoogleSignin,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false,
    };
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  // configureGoogleSign() {
  //   GoogleSignin.configure({
  //     webClientId:
  //       "24806013722-7jpjdfk1dnfbn05trlmlicsma3p7a7e0.apps.googleusercontent.com",
  //     offlineAccess: true,
  //   });
  // }

  userLoginWithEmail = async () => {
    try {
      const { email, password } = this.state;

      if (!email || !password) {
        Alert.alert("Enter details to login!");
        return;
      }

      this.setState({ loading: true });

      const res = await signInWithEmailAndPassword(auth, email, password);

      Alert.alert("User logged-in successfully!");

      this.setState({
        loading: false,
        email: "",
        password: "",
      });

      this.props.navigation.navigate("Dashboard");

      // this.props.navigation.navigate("Booking");
    } catch (error) {
      if (error.code === "auth/user-not-found"){
        Alert.alert("Sign in error", "Please register your account");
      } else {
        Alert.alert("Sign in error", error.message);
      }
      this.setState({ loading: false });
      return;
    }
  };

  resetPasswordWithEmail = async (user) => {
    try {
      const email = user.email;

      await sendPasswordResetEmail(auth, email);

      Alert.alert("Password reset email sent!");
    } catch (error) {
      Alert.alert(error.message);
      this.setState({ loading: false });
      return;
    }
  };

  resetPassword = async () => {
    try {
      const { email } = this.state;

      if (!email) {
        Alert.alert("Enter details to reset password!");
        return;
      }

      this.setState({ loading: true });

      const usersCollectionRef = collection(db, "users");
      const userEmail = this.state.email;
      const queryUserEmailRef = query(
        usersCollectionRef,
        where("email", "==", userEmail)
      );
      const querySnapshot = await getDocs(queryUserEmailRef);

      if (querySnapshot.empty) {
        Alert.alert("User not authenticated", "Please sign up.");
        this.setState({ loading: false });
        return;
      }

      const userDoc = querySnapshot.docs[0];
      const user = userDoc.data();
      const userId = userDoc.id;

      // Send password reset email
      await this.resetPasswordWithEmail(user);

      await new Promise((resolve) => setTimeout(resolve, 5000));
      Alert.alert(
        "You haven't reset your password",
        "Please reset your password via email"
      );

      this.setState({ loading: false }); //interface回去login
    } catch (error) {
      Alert.alert("Error registering user:", error.message);
      this.setState({ loading: false });
      return;
    }
  };

  // userLoginWithGoogle = async () => {
  //   try {
  //     const result = await signInWithPopup(auth, googleProvider);

  //     const credential = GoogleAuthProvider.credentialFromResult(result);
  //     const token = credential.accessToken;
  //     const user = result.user;

  // this.setState({ loading: true });

  // Alert.alert("User logged-in successfully!");

  // this.props.navigation.navigate("Dashboard");
  //   } catch (error) {
  //     Alert.alert(error.message);
  //   }
  // };

  render() {
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

        <SafeAreaView>
          <Image
            source={{uri: 'https://i.pinimg.com/originals/2b/32/b5/2b32b59dbfc427812eef579985234524.gif'}}
            style={{ width: 300, height: 200, marginBottom: 50}}
          />

          <TextInput
            style={styles.TextInput}
            mode='outlined'
            label="Email"
            placeholderTextColor="#003f5c"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, "email")}
          />


          <TextInput
            style={[styles.TextInput, { marginTop: 5 }]}
            mode='outlined'
            //disabled: 'true'
            label="Password"
            placeholderTextColor="#003f5c"
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(val) => this.updateInputVal(val, "password")}
            maxLength={16}
          />
          <TouchableOpacity style={{ alignItems: 'flex-start' , marginTop: 3}} >
            <Text
              style={{ fontSize: 14, fontWeight: '300', color: 'blue' }}
              onPress={() => {
                this.resetPassword();
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity style={styles.loginBtn}>
              <Text
                style={{fontSize: 18, color: 'white'}}
                onPress={() => {
                  this.userLoginWithEmail();
                }}
              >
                Login 
              </Text>
            </TouchableOpacity>
          </View>


          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'center'}}>
            <Text style={{ fontSize: 13, fontWeight: '200' }}>Don't have an account?</Text>
            <TouchableOpacity style={styles.signUpBtn}
              onPress={() => this.props.navigation.navigate("Signup")}>
              <Text style={{ fontSize: 14, fontWeight: '300', color: 'blue' }}>  Sign up</Text>
            </TouchableOpacity>
          </View>


        </SafeAreaView>
      </KeyboardAvoidingView>
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
    //textAlign: 'left'
  },
  textInput: {
    fontWeight: "100",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  line: {
    flexDirection: "row",
    alignItems: "center",
  },
  loginBtn: {
    width: "50%",
    borderRadius: 10,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(100, 100, 150, 1)",
    marginVertical: 20,
    marginTop: 50
  },

  signUpBtn: {
    fontSize: 30
  },
  // googleButton: {
  //   backgroundColor: "white",
  //   borderRadius: 4,
  //   paddingHorizontal: 34,
  //   paddingVertical: 16,
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   alignItems: "center",
  // },
  // googleButtonText: {
  //   marginLeft: 16,
  //   fontSize: 18,
  //   fontWeight: "600",
  // },
  // googleIcon: {
  //   height: 24,
  //   width: 24,
  // },
});
