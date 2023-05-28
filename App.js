// import { StatusBar } from 'expo-status-bar';
// import React, { useState } from 'react';
// import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image} from 'react-native';
// import  SignIn from './SignIn.js';


// export default function App() {
//   return (
//     <KeyboardAvoidingView style={{flex: 1}} behavior="padding">
//       <SignIn />
//     </KeyboardAvoidingView>
//   );
// }

// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/login';
import Signup from './src/screens/signup';
import Dashboard from './src/screens/dashboard';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image} from 'react-native';

const Stack = createStackNavigator();
function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Signup"
      screenOptions={{
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: '#3740FE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen 
        name="Signup" 
        component={Signup} 
        options={{ title: 'Signup' }}
      />       
      <Stack.Screen 
        name="Login" 
        component={Login} 
        options={[
          { title: 'Login' },
          { headerLeft: null }
        ]}
      />
      <Stack.Screen 
       name="Dashboard" 
       component={Dashboard} 
       options={[
         { title: 'Dashboard' },
         {headerLeft: null} 
       ]}
      />
    </Stack.Navigator>
  );
}
export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}