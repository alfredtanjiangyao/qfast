// components/dashboard.js
import React, { Component } from 'react';
import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image, Button, Alert, ActivityIndicator} from 'react-native';
import firebase from '../firebase/config';
import { getAuth, signOut } from "firebase/auth";
const auth = getAuth();

export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = { 
      uid: ''
    }
  }
  signOut = () => {
    signOut(auth).then(() => {
      this.props.navigation.navigate('Login')
    })
    .catch(error => this.setState({ errorMessage: error.message }))
  }  
  render() {
    return (
      <View style={styles.container}>
        <Text style = {styles.textStyle}>
          Hello, welcome to QFAST
        </Text>
        <TouchableOpacity style={styles.signUpBtn}>
          <Text style={styles.loginText}
          onPress={() => this.signOut()}
          >
          LOGOUT
          </Text> 
        </TouchableOpacity>   
      </View>
    );
  }
}
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     display: "flex",
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 35,
//     backgroundColor: '#fff'
//   },
//   textStyle: {
//     fontSize: 15,
//     marginBottom: 20
//   }
// });

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
    },

  loginText: {
    color: '#000000',
    marginTop: 0,
    textAlign: 'center'
    },
  
  textStyle:{
    color: '#FFFFFF',
    textAlign: 'center',
  }
  });