import React, { Component,useState } from 'react';
import 'firebase/auth';
import { FirebaseAuthProvider, IfFirebaseAuthed } from '@react-firebase/auth';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { auth, googleProvider, db } from '../firebase/config';

import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image, Button, Alert, ActivityIndicator} from 'react-native';

export default class Login extends Component {
  
  constructor() {
    super();
    this.state = { 
      email: '', 
      password: '',
      loading: false
    }
  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  }

  userLoginWithEmail = async () => {
    try {
    const {email, password} = this.state;

    if (!email || !password) {
        Alert.alert('Enter details to signin!')
        return;
    } else {
      this.setState({ loading: true,})

      const res = await signInWithEmailAndPassword(auth, email, password);

      console.log(res)
      console.log('User logged-in successfully!')

      this.setState({
        loading: false,
        email: '', 
        password: ''
      })

        this.props.navigation.navigate('Dashboard')
      } 
    }catch (error) {
        console.error('Sign in error', error);
        this.setState({ loading: false, });
        return;
    }
  }

  render() {
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
            secureTextEntry={true}
            onChangeText={(val) => this.updateInputVal(val, 'password')}
            maxLength={16}
          /> 
        </View>

        <TouchableOpacity style={styles.loginBtn}>
          <Text style={styles.loginText}
          onPress={() => {
            this.userLoginWithEmail();
          }}
          >
          LOGIN
          </Text> 
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpBtn}>
          <Text style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Signup')}
          >
          Don't have account? Click here to signup
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
    loginBtn: {
    width:"20%",
    borderRadius:25,
    height:50,
    alignItems:"center",
    justifyContent:"center",
    marginTop:40,
    backgroundColor:"#f0f8ff",
    },

    signUpBtn: {
      width:"80%",
      borderRadius:25,
      height:50,
      alignItems:"center",
      justifyContent:"center",
      marginTop:40,
      backgroundColor:"#f0f8ff",
  }
  
  });

