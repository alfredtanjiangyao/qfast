// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/login';
import Signup from './src/screens/signup2';
import Dashboard from './src/screens/dashboard';
import 'firebase/auth';
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import "firebase/auth";
import Booking from "./booking";
import Home from "./staff page/home";
import Register from "./staff page/register";;
import Edit from './edit';

// export default function App() {
//   return (
//   );
// }

const Stack = createStackNavigator();



function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{
        headerTitleAlign: "center",
        headerStyle: {
          backgroundColor: "#3740FE",
        },
        headerTintColor: "#fff",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: "Signup" }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={[{ title: "Login" }, { headerLeft: null }]}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
        options={[{ title: "Dashboard" }, { headerLeft: null }]}
      />
      <Stack.Screen
        name="Booking"
        component={Booking} />
      <Stack.Screen
        name="Register"
        component={Register} />
      <Stack.Screen
        name="Home"
        component={Home} />
      <Stack.Screen
        name="Edit"
        component={Edit} />
    </Stack.Navigator>
  );
}
export default function App() {
  
  
  return (
    <NavigationContainer >
      <MyStack />
    </NavigationContainer>
  );
}
