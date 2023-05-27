import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image} from 'react-native';
import  SignIn from './SignIn.js';


export default function App() {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
      <SignIn />
    </KeyboardAvoidingView>
  );
}
  
