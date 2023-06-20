// components/dashboard.js
import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, Image, Button, Dimensions } from 'react-native';
import Swiper from 'react-native-swiper';
import { getAuth, signOut } from "firebase/auth";
import { IconButton, MD3Colors } from 'react-native-paper';

const auth = getAuth();


export default class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      uid: ''
    }
  }
  signOut = () => { /////logout button function
    signOut(auth).then(() => {
      this.props.navigation.navigate('Login')
    })
      .catch(error => this.setState({ errorMessage: error.message }))
  }

  render() {
    const images = [
      'https://i.pinimg.com/originals/ea/7f/2d/ea7f2dd47969349da148ea0b4ec56815.gif',
      'https://cdn.dribbble.com/users/1894420/screenshots/13451478/media/78c49f99bd43529bb5df7ae50052158c.gif'

      // Add more images here
    ];


    return (
      <View style={styles.container}>
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
        <View style = {styles.buttoncon}>
        <IconButton
          icon={({ color, size }) => (
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/hospital.png')} style={styles.icon} />
            </View>
          )}
          style = {styles.hospital}
          //iconColor={MD3Colors.error50}
          size={200}
          mode = 'contained-tonal'
          onPress={() => console.log('Pressed')}
        />
        <IconButton
          icon={({ color, size }) => (
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/book.png')} style={styles.icon} />
            </View>
          )}
          style = {styles.book}
          iconColor={MD3Colors.error50}
          size={100}
          mode = 'contained-tonal'
          onPress={() => console.log('Pressed')}
        />
        </View>
        <View style = {styles.buttoncon}>
        <IconButton
          icon={({ color, size }) => (
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/edit.png')} style={styles.icon} />
            </View>
          )}
          style = {styles.edit}
          iconColor={MD3Colors.error50}
          size={100}
          mode = 'contained-tonal'
          onPress={() => console.log('Pressed')}
        />
        <IconButton
          icon={({ color, size }) => (
            <View style={styles.iconContainer}>
              <Image source={require('../../assets/profile.png')} style={styles.icon} />
            </View>
          )}
          style = {styles.profile}
          iconColor={MD3Colors.error50}
          size={100}
          mode = 'contained-tonal'
          onPress={() => console.log('Pressed')}
        />
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  carouselContainer: {
    //flex:2,
    justifyContent: 'flex-start',
    height: windowHeight * 0.3, // Adjust the height as needed
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    //flex:1,
    width: windowWidth,
    height: windowHeight * 0.3, // Adjust the height as needed
  },
  title: {
    fontWeight: 5,
    marginBottom: 10,
    color: 'white'
  },
  buttoncon: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    //backgroundColor: 'navy',
    marginHorizontal: 20
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
    width: "20%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    backgroundColor: "#f0f8ff",
  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#f0f8ff",
  },

  loginText: {
    color: '#000000',
    marginTop: 0,
    textAlign: 'center'
  },

  textStyle: {
    color: '#FFFFFF',
    textAlign: 'center',
  }
});