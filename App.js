// App.js
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/login';
import Signup from './src/screens/signup';
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
import Booking from "./booking";
import Home from "./staff page/home";
import Register from "./staff page/register";;
import Edit from './edit';
import StaffView from './staff page/view';
import Profile from './profile';
import BirthdatePicker from './BirthdatePicker';

import * as BackgroundFetch from 'expo-background-fetch';
import { BackgroundFetchResult } from 'expo-background-fetch';
// import { registerTaskAsync, BackgroundFetchResult } from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';

const BACKGROUND_FETCH_TASK = 'background-fetch';

const Stack = createStackNavigator();

// Register the background task using TaskManager.defineTask
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async (taskData) => backgroundTask(taskData));

// BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
//   minimumInterval: 10, // The minimum time interval (in seconds) for the background task to run (e.g., every 60 seconds)
// });

BackgroundFetch.setMinimumIntervalAsync(10);

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  try {
    const user = auth.currentUser;
    if (user && !user.emailVerified) {
      // Perform the email verification check here
      await user.reload();
      if (user.emailVerified) {
        // Email is verified, update the UI or take necessary actions
        console.log('Email is verified.');
      }
    }

    return BackgroundFetchResult.NewData;
  } catch (error) {
    console.error('Background task error:', error);
    return BackgroundFetchResult.Failed;
  }
});

BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
  minimumInterval: 10, // The minimum time interval (in seconds) for the background task to run (e.g., every 60 seconds)
});

// const backgroundTask = async (taskData) => {
  // try {
  //   const user = auth.currentUser;
  //   if (user && !user.emailVerified) {
  //     // Perform the email verification check here
  //     await user.reload();
  //     if (user.emailVerified) {
  //       // Email is verified, update the UI or take necessary actions
  //       console.log('Email is verified.');
  //     }
  //   }

  //   return BackgroundFetchResult.NewData;
  // } catch (error) {
  //   console.error('Background task error:', error);
  //   return BackgroundFetchResult.Failed;
  // }
// };

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      //initialRouteName="Home"
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
      <Stack.Screen
        name="StaffView"
        component={StaffView} />
        <Stack.Screen
        name="Profile"
        component={Profile} />
      <Stack.Screen
        name="BirthdatePicker"
        component={BirthdatePicker} />
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
