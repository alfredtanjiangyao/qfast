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
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from "react-native";
// import GoogleButton from "react-google-button";
// import {
//   GoogleSignin,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
import Home from "../../staff page/home";
import Booking from "../../booking";

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
        Alert.alert("Enter details to signin!");
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

      navigation.navigate("Dashboard");

      // this.props.navigation.navigate("Booking");
    } catch (error) {
      Alert.alert("Sign in error", error.message);
      this.setState({ loading: false });
      return;
    }
  };

  resetPasswordWithEmail = async () => {
    try {
      const { email } = this.state;

      if (!email) {
        Alert.alert("Enter details to reset password!");
        return;
      }

      this.setState({ loading: true });

      const res = await sendPasswordResetEmail(auth, email);

      Alert.alert("Password reset email sent!");

      this.setState({ 
        loading: false, 
        email: "",
        password: "",
      });



      this.props.navigation.navigate("Home");

    } catch (error) {
      Alert.alert(error.message);
      this.setState({ loading: false });
      return;
    }
  }

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

  // userLoginWithGoogle = async () => {
  //   try {
  //     // Get the Google user details
  //     await GoogleSignin.hasPlayServices();
  //     const idToken = await GoogleSignin.signIn();

  //     // Authenticate with Firebase
  //     const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  //     await signInWithCredential(auth, googleCredential);

  //     Alert.alert("User signed in successfully with Google!");

  //     this.setState({ loading: true });

  //     this.props.navigation.navigate("Dashboard");
  //   } catch (error) {
  //     if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //       // User cancelled the sign-in flow
  //       console.log("User cancelled the sign-in flow");
  //     } else if (error.code === statusCodes.IN_PROGRESS) {
  //       // Sign-in flow is already in progress
  //       console.log("Sign-in flow is already in progress");
  //     } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //       // Play services not available or outdated
  //       console.log("Play services not available or outdated");
  //     } else {
  //       // Some other error happened
  //       console.log("Error:", error);
  //     }
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
      <SafeAreaView style={styles.container}>
        <Image
          source={require("../../assets/Qfast.png")}
          style={{ width: 300, height: 300 }}
        />

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, "email")}
          />
        </View>

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            value={this.state.password}
            secureTextEntry={true}
            onChangeText={(val) => this.updateInputVal(val, "password")}
            maxLength={16}
          />
        </View>

        <TouchableOpacity style={styles.loginBtn}>
          <Text
            style={styles.loginText}
            onPress={() => {
              this.userLoginWithEmail();
            }}
          >
            LOGIN
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpBtn}>
          <Text
            style={styles.loginText}
            onPress={() => this.props.navigation.navigate("Signup")}
          >
            Don't have account? Click here to signup
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpBtn}>
          <Text
            style={styles.loginText}
            onPress={() => this.resetPasswordWithEmail()}
          >
            Forgot password
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.googleButton}>
          <Image
            style={styles.googleIcon}
            source={{
              uri: "https://i.ibb.co/j82DCcR/search.png",
            }}
          />
          <Text
            style={styles.googleButtonText}
            onPress={() => {
              this.userLoginWithGoogle();
            }}
          >
            Sign in with Google
          </Text>
        </TouchableOpacity> */}



      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
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
    fontWeight: "200",
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },

  loginBtn: {
    width: "20%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 0,
    backgroundColor: "#f0f8ff",
  },

  signUpBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#f0f8ff",
  },
  googleButton: {
    backgroundColor: "white",
    borderRadius: 4,
    paddingHorizontal: 34,
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  googleButtonText: {
    marginLeft: 16,
    fontSize: 18,
    fontWeight: "600",
  },
  googleIcon: {
    height: 24,
    width: 24,
  },
});
