import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const App = () => {
    const [isRegPressed, setIsRegPressed] = useState(false);
    const [isViewPressed, setIsViewPressed] = useState(false);
    const navigation = useNavigation();
    const regPress = () => {
        setIsRegPressed(true);
        navigation.navigate('Register');
        setIsRegPressed(false);
    };
    const  viewPress = () => {
        setIsViewPressed(true);
        setIsViewPressed(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.bluebox} >
                <View style = {styles.boxContent}>
                <Image source={{ uri: 'https://cdn.dribbble.com/users/749470/screenshots/6165180/media/e3a38918a4fb2f8eb2c4930bf05ff4f2.gif' }}
                    style={styles.image} />
                <Text style={styles.text}>
                    Click the 'Register' button below to add a new hospital to our booking app.
                    Register now to expand your reach and offer your services to our app users.</Text>
                <TouchableOpacity style={[styles.button, isRegPressed && styles.regbuttonPressed]} onPress={regPress}>
                    <Text style={styles.buttonText}>Register</Text>
                </TouchableOpacity>
            </View>
            </View>
            <View style={styles.pinkbox} >
            <View style = {styles.boxContent}>
                <Image source={{ uri: 'https://univassist.com/wp-content/uploads/2020/11/UnivAssist-Event-Calender_LOOP.gif' }}
                    style={styles.image} />
                <Text style={styles.text}>
                    Click the 'View' button below to access and view the booking data for your hospital..</Text>
                <TouchableOpacity style={[styles.button, isViewPressed && styles.viewbuttonPressed]} onPress={viewPress}>
                    <Text style={styles.buttonText}>View</Text>
                </TouchableOpacity>
                </View>
            </View>
        </View>
    );

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    boxContent: {
        flex: 1,
        alignItems: 'center',
        marginVertical: 100,
        //backgroundColor: 'maroon'
      },
    bluebox: {
        flex: 1,
        backgroundColor: 'skyblue',
        alignItems: 'center',
        justifyContent: 'center',
        
    },
    pinkbox: {
        flex: 1,
        backgroundColor: 'pink',
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        textAlign: 'justify',
        marginVertical: 50,
        marginHorizontal: 20,
        fontFamily: 'Cochin',
        fontSize: 15
    },
    image: {
        width: 200, 
        height: 200 
    },
    buttoncon: {
        marginBottom:40,
        //alignItems:'flex-end',
    },
    button: {
        borderWidth: 2,
        borderColor: 'white',
        backgroundColor: 'transparent',
        padding: 10,
        paddingHorizontal: 50,
        borderRadius: 7,
        alignItems: 'center',
        marginVertical: 10,
        bottom: 20,
        position: 'absolute',
    },
    buttonText: {
        color: 'white',
        fontWeight: '600'
    },
    regbuttonPressed: {
        backgroundColor: 'pink',
    },
    viewbuttonPressed: {
        backgroundColor: 'skyblue',
    },
});
export default App;
