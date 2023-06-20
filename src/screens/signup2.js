// components/signup.js
import React, { Component, useState } from 'react';
import firebase from '../firebase/config';
import {createUserWithEmailAndPassword, signInWithPopup, signOut, fetchSignInMethodsForEmail, sendEmailVerification, handleCodeInApp} from "firebase/auth";
import { auth, googleProvider, db } from '../firebase/config';
import { doc, getDoc, collection, query, where, getDocs, setDoc  } from 'firebase/firestore';

import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image, Button, Alert, ActivityIndicator} from 'react-native';

export default class Signup extends Component {
  
  constructor() {
    super();

    //state is an object
    //set initial state 
    this.state = { 
      username: '',
      email: '', 
      password: '',
      loading: false
    }
  }
  
  updateInputVal = (val, prop) => {
    const userState = this.state;
    userState[prop] = val;
    this.setState(userState);
  }

  //check the availibility of username
  checkUsernameAvailability = async () => {

    try {
      const username = this.state.username;
      const usernameCollectionRef = collection(db, 'usernames');
      const usernameDocRef = doc(usernameCollectionRef, username);
      const usernameDocSnapshot = await getDoc(usernameDocRef);

      console.log(usernameDocSnapshot.data());

      if (usernameDocSnapshot.exists()) {
        Alert.alert('Username taken', 'Please choose a different username.');
        return false;
      } else { return true; }
    } catch (error) {
      console.error('Error checking username availability:', error);
      return false;
    }
  };

  //check the availability of email
  checkEmailAvailability = async () => {
  
    try {
        const usersCollectionRef = collection(db, "users");
        const userEmail = this.state.email;
        const queryUserEmailRef = query(usersCollectionRef, where("email", "==", userEmail));
        const querySnapshot = await getDocs(queryUserEmailRef);
        
        if (querySnapshot.size > 0) {
          return false;
        }
        return true;
      } catch (error) {
        console.error('Error checking email availability:', error);
        return false;
      }
  };

  verificationEmail = async () => {
    try {
      await auth.currentUser.sendEmailVerification({
        handleCodeInApp: true,
        url: 'qfast-77dbc.firebaseapp.com',
      });

      console.log('Email Verification sent! Check your mailbox');
    } catch (error) {
      console.error('Error sending email verification:', error);
    }
  };  

  registerUserUsingEmail = async () => {
    try {

      const {username, email, password} = this.state;

      if (!username || !email || !password) {
          Alert.alert('Missing Information', 'Please fill in all the fields.');
          return;
      }
  
      if (password.length < 8) {
          Alert.alert('Invalid Password', 'Password should be at least 8 characters long.');
          return;
      }
  
      // Check username availability
      const isUsernameAvailable = await this.checkUsernameAvailability();
      if (!isUsernameAvailable) {
          Alert.alert('This username has been used', 'Please fill in another one.');
          return;
      }
  
      // Check email availability
      const isEmailAvailable = await this.checkEmailAvailability();
      if (!isEmailAvailable) {
          Alert.alert('This email has been registered', '');
          return;
      }
  
      // Proceed with user registration
      this.setState({ loading: true, });

      const res = await createUserWithEmailAndPassword(auth, email, password);

      const usersCollectionRef = collection(db, "users");

      const userDocRef = doc(usersCollectionRef, res.user.uid);

      // const userDocRef = doc(db, 'users', res.user.uid);

      await setDoc(userDocRef, {
          username: username,
          email: email,
          password: password,
      });

      await this.verificationEmail();
      
      console.log('User registered successfully!');

      this.setState({
          username: '',
          email: '', 
          password: '',
          loading: false
      })

      this.props.navigation.navigate('Dashboard');

      } catch (error) {
          console.error('Error registering user:', error);
          this.setState({ loading: false, });
          return;
      }

  };

  //render usually for UI
  //render is the entry point 
  render() {

    //loading is false initially(due to the constructor)
    if(this.state.loading){
      return(
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E"/>
        </View>
      )
    }

    return (
      <SafeAreaView style = {styles.container}>
      <Image source={require('../../assets/Qfast.png')}
        style={{width: 300, height: 300}} 
        />
        
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Username"
            placeholderTextColor="#003f5c"
            value={this.state.username} //store the value filled by the user to username
            onChangeText={(val) => this.updateInputVal(val, 'username')}
          /> 
        </View> 

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Email"
            placeholderTextColor="#003f5c"
            value={this.state.email}
            onChangeText={(val) => this.updateInputVal(val, 'email')}
          /> 
        </View> 

        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            value={this.state.password}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            maxLength={16}
          /> 
        </View>

        <TouchableOpacity style={styles.signUpBtn}> 
          <Text style={styles.loginText}
          onPress={() => {
            this.registerUserUsingEmail();
          }}
          >
          SIGNUP
          </Text> 
        </TouchableOpacity>   
  
        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Login')}
          >
          Already Registered? Click here to login
          </Text> 
        </TouchableOpacity>
      
    </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#000000', 
      alignItems: 'center',
      justifyContent: 'center',
      },

  title:{
      fontWeight: 5,
      marginBottom: 10,
      color: 'white'
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
      fontWeight: '200',
      height: 50,
      flex: 1,
      padding: 10,
      marginLeft: 20,
    },

  signUpBtn: {
    width:"20%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    backgroundColor:"#f0f8ff",
    },

  loginBtn: {
      width:"80%",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      backgroundColor:"#f0f8ff",
    }

   
  });