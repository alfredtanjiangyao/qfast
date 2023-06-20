// // components/signup.js
// import React, { Component } from 'react';
// import firebase from '../firebase/config';
// import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
// const auth = getAuth();

// import { StatusBar } from 'expo-status-bar';
// import { KeyboardAvoidingView ,SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Text, View, Image, Button, Alert, ActivityIndicator} from 'react-native';

// export default class Signup extends Component {
  
//   constructor() {
//     super();
//     this.state = { 
//       displayName: '',
//       email: '', 
//       password: '',
//       isLoading: false
//     }
//   }
//   updateInputVal = (val, prop) => {
//     const state = this.state;
//     state[prop] = val;
//     this.setState(state);
//   }
//   registerUser = () => {
//     if(this.state.email === '' && this.state.password === '') {
//       Alert.alert('Enter details to signup!')
//     } else {
//       this.setState({
//         isLoading: true,
//       })
//       createUserWithEmailAndPassword(auth,this.state.email, this.state.password)
//       .then((res) => {
//         res.user.updateProfile({
//           displayName: this.state.displayName
//         })
//         console.log('User registered successfully!')
//         this.setState({
//           isLoading: false,
//           displayName: '',
//           email: '', 
//           password: ''
//         })
//         this.props.navigation.navigate('Login')
//       })
//       .catch(error => this.setState({ errorMessage: error.message }))      
//     }
//   }
//   render() {
//     if(this.state.isLoading){
//       return(
//         <View style={styles.preloader}>
//           <ActivityIndicator size="large" color="#9E9E9E"/>
//         </View>
//       )
//     }    
//     return (
//       <SafeAreaView style = {styles.container}>
//       <Image source={require('../../assets/Qfast.png')}
//         style={{width: 300, height: 300}} 
//         />
//           <View style={styles.inputView}>
//           <TextInput
//             style={styles.TextInput}
//             placeholder="Email"
//             placeholderTextColor="#003f5c"
//             value={this.state.email}
//             onChangeText={(val) => this.updateInputVal(val, 'email')}
//           /> 
//         </View> 
//         <View style={styles.inputView}>
//           <TextInput
//             style={styles.TextInput}
//             placeholder="Password"
//             placeholderTextColor="#003f5c"
//             value={this.state.password}
//             onChangeText={(val) => this.updateInputVal(val, 'password')}
//             maxLength={16}
//           /> 
//         </View>

//         <TouchableOpacity style={styles.signUpBtn}>
//           <Text style={styles.loginText}
//           onPress={() => this.props.navigation.navigate('Dashboard')}
//           >
//           SIGNUP
//           </Text> 
//         </TouchableOpacity>   
  
//         <TouchableOpacity style={styles.loginBtn}>
//           <Text style={styles.loginText}
//           onPress={() => this.props.navigation.navigate('Login')}
//           >
//           Already Registered? Click here to login
//           </Text> 
//         </TouchableOpacity>
      
//     </SafeAreaView>
//     );
//   }
// }
// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     display: "flex",
// //     flexDirection: "column",
// //     justifyContent: "center",
// //     padding: 35,
// //     backgroundColor: '#fff'
// //   },
// //   inputStyle: {
// //     width: '100%',
// //     marginBottom: 15,
// //     paddingBottom: 15,
// //     alignSelf: "center",
// //     borderColor: "#ccc",
// //     borderBottomWidth: 1
// //   },
// //   loginText: {
// //     color: '#3740FE',
// //     marginTop: 25,
// //     textAlign: 'center'
// //   },
// //   preloader: {
// //     left: 0,
// //     right: 0,
// //     top: 0,
// //     bottom: 0,
// //     position: 'absolute',
// //     alignItems: 'center',
// //     justifyContent: 'center',
// //     backgroundColor: '#fff'
// //   }
// // });

// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//       backgroundColor: '#000000', 
//       alignItems: 'center',
//       justifyContent: 'center',
//       },
//   title:{
//       fontWeight: 5,
//       marginBottom: 10,
//       color: 'white'
//     },
//     inputView: {
//       backgroundColor: "#FFC0CB",
//       borderRadius: 30,
//       width: "70%",
//       height: 45,
//       marginBottom: 20,
//       alignItems: "left",
//     },
//     TextInput: {
//       fontWeight: '200',
//       height: 50,
//       flex: 1,
//       padding: 10,
//       marginLeft: 20,
//     },
//     signUpBtn: {
//     width:"20%",
//     borderRadius:25,
//     height:50,
//     alignItems:"center",
//     justifyContent:"center",
//     marginTop:40,
//     backgroundColor:"#f0f8ff",
//     },
//     loginBtn: {
//       width:"80%",
//       borderRadius:25,
//       height:50,
//       alignItems:"center",
//       justifyContent:"center",
//       marginTop:40,
//       backgroundColor:"#f0f8ff",
//     }

   
//   });

//   // return (
//   //   <View style={styles.container}>  
//   //     <TextInput
//   //       style={styles.inputStyle}
//   //       placeholder="Name"
//   //       value={this.state.displayName}
//   //       onChangeText={(val) => this.updateInputVal(val, 'displayName')}
//   //     />      
//   //     <TextInput
//   //       style={styles.inputStyle}
//   //       placeholder="Email"
//   //       value={this.state.email}
//   //       onChangeText={(val) => this.updateInputVal(val, 'email')}
//   //     />
//   //     <TextInput
//   //       style={styles.inputStyle}
//   //       placeholder="Password"
//   //       value={this.state.password}
//   //       onChangeText={(val) => this.updateInputVal(val, 'password')}
//   //       maxLength={15}
//   //       secureTextEntry={true}
//   //     />   
//   //     <Button
//   //       color="#3740FE"
//   //       title="Signup"
//   //       onPress={() => this.registerUser()}
//   //     />
//   //     <Text 
//   //       style={styles.loginText}
//   //       onPress={() => this.props.navigation.navigate('Login')}>
//   //       Already Registered? Click here to login
//   //     </Text>                          
//   //   </View>
//   // );