// components/dashboard.js
import React, { Component } from 'react';
import { useEffect, useState } from "react";
import { TouchableOpacity, StyleSheet, Text, View, Image, Button, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { getAuth, signOut } from "firebase/auth";
import { IconButton, MD3Colors } from 'react-native-paper';
import { collection, doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/config';

const auth = getAuth();



export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      uid: "",
      userName: "", // Initialize userName in the state
      errorMessage: ""
    };
  }
  componentDidMount() {
    const { setUserName } = this;
    // Set up listener for changes in authentication state
    auth.onAuthStateChanged(async (user) => {
      if (user) {
        // User is logged in
        const userDoc = doc(collection(db, 'users'), user.uid);
        const docSnap = await getDoc(userDoc);
        if (docSnap.exists()) {
          setUserName(docSnap.data().username);
        } else {
          console.log("User document does not exist");
        }
        //this.setUserName(username);
      }
    });
  }
  setUserName = (name) => {
    this.setState({ userName: name });
  };

  signOut = () => { /////logout button function
    signOut(auth).then(() => {
      this.props.navigation.navigate('Login')
    })
      .catch(error => this.setState({ errorMessage: error.message }))
  }


  render() {
    const { userName } = this.state;
    const images = [
      'https://i.pinimg.com/originals/ea/7f/2d/ea7f2dd47969349da148ea0b4ec56815.gif',
      'https://cdn.dribbble.com/users/1894420/screenshots/13451478/media/78c49f99bd43529bb5df7ae50052158c.gif',
      'https://media.istockphoto.com/id/1141047691/vector/patients-people-waiting-for-doctor-in-line-doctor-office-medicine-aid-clinic-concept-vector.jpg?s=612x612&w=0&k=20&c=xcJsm3gqfEGsYrYkFoerTQyO1NKTMd9olVXrnh5t2GE='

      // Add more images here
    ];
    const staffPress = () => {
      this.props.navigation.navigate('Home');
    };
    const bookPress = () => {
      this.props.navigation.navigate('Booking');
    };

    const editPress = () => {
      this.props.navigation.navigate('Edit');
    };

    const profilePress = () => {
      this.props.navigation.navigate('Profile');
    }

    // const profilePress = () => {
    //   this.props.navigation.navigate('Home');
    // };

    return (
      <View style={styles.container}>
        <View style={styles.titlecon}>
          <Text style={styles.title}>
            Welcome{"\n"}
            <Text style={styles.username}>  {userName}</Text>
          </Text>
        </View>
        <View style={styles.carouselContainer}>
          <Swiper
            showsButtons={true}
            autoplay={true}
            autoplayTimeout={5}
            loop={true}
          >
            {images.map((image, index) => (
              <View key={index} style={styles.imageContainer}>
                <Image source={{ uri: image }} style={styles.image} resizeMode="cover" />
              </View>
            ))}

          </Swiper>
        </View>
        <View style={styles.buttoncon}>
          <View style={styles.buttonrow}>
            <IconButton
              icon={({ color, size }) => (
                <View style={styles.iconContainer}>
                  <Image source={require('../../assets/hospital.png')} style={styles.icon} />
                </View>
              )}
              style={styles.hospital}
              //iconColor={MD3Colors.error50}
              size={200}
              mode='contained-tonal'
              onPress={staffPress}
            />
            <IconButton
              icon={({ color, size }) => (
                <View style={styles.iconContainer}>
                  <Image source={require('../../assets/book.png')} style={styles.icon} />
                </View>
              )}
              style={styles.book}
              iconColor={MD3Colors.error50}
              size={100}
              mode='contained-tonal'
              onPress={bookPress}
            />
          </View>

          <View style={styles.buttonrow}>
            <IconButton
              icon={({ color, size }) => (
                <View style={styles.iconContainer}>
                  <Image source={require('../../assets/edit.png')} style={styles.icon} />
                </View>
              )}
              style={styles.edit}
              iconColor={MD3Colors.error50}
              size={100}
              mode='contained-tonal'
              onPress={editPress}
            />
            <IconButton
              icon={({ color, size }) => (
                <View style={styles.iconContainer}>
                  <Image source={require('../../assets/profile.png')} style={styles.icon} />
                </View>
              )}
              style={styles.profile}
              iconColor={MD3Colors.error50}
              size={100}
              mode='contained-tonal'
              onPress={profilePress}
            />
          </View>
        </View>
      </View>

    );
  }
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: 'lightsteelblue'
    // marginHorizontal: 20
  },
  titlecon: {
    alignSelf: 'flex-start',
    textAlign: 'left',
    flexDirection: 'row',
    marginHorizontal: 20
  },
  title: {
    fontStyle: 'normal',
    marginVertical: 10,
    
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'Cochin',
  },
  username: {
    fontStyle: 'italic',
    fontSize: 23,
    marginHorizontal: 20,
  },
  carouselContainer: {
    //flex:2,
    justifyContent: 'flex-start',
    height: windowHeight * 0.25, // Adjust the height as needed
    marginTop: 10
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    //flex:1,
    width: windowWidth,
    height: windowHeight * 0.25, // Adjust the height as needed
  },

  buttoncon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: 'navy',
    marginVertical: 20
  },
  buttonrow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  hospital: {
    backgroundColor: 'lightcyan',
    width: 170,
    height: 170,
    borderRadius: 20
  },
  book: {
    backgroundColor: 'lightgoldenrodyellow',
    width: 170,
    height: 170,
    borderRadius: 20
  },
  edit: {
    backgroundColor: 'lavender',
    width: 170,
    height: 170,
    borderRadius: 20
  },
  profile: {
    backgroundColor: 'mistyrose',
    width: 170,
    height: 170,
    borderRadius: 20
  },
  iconContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    // resizeMode: 'contain',
    height: 160,
    width: 160
  },
});
