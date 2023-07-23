import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { db, auth } from '../src/firebase/config';
import { collection, addDoc, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';

const Home = () => {
    const [isRegPressed, setIsRegPressed] = useState(false);
    const [isViewPressed, setIsViewPressed] = useState(false);
    const navigation = useNavigation();
    const [show, setShow] = useState(false);
    const [clinicName, setClinicName] = useState('');
    const [contact, setContact] = useState('');
    const [address, setAddress] = useState('');
    const[email, setEmail] = useState('');

    const reqcol = collection(db, 'request');

    const regPress = () => {
        setIsRegPressed(true);
        navigation.navigate('Register');
        setIsRegPressed(false);
    };
    const viewPress = () => {
        setIsViewPressed(true);
        navigation.navigate('StaffView');
        setIsViewPressed(false);
    };

    useEffect(() => {
        // Get the current user from Firebase Authentication
        const verifyUser = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = doc(collection(db, 'users'), user.uid);
                const docSnap = await getDoc(userDoc);
                const userData = docSnap.data();
                setEmail(userData.email);
                if (docSnap.exists() && userData.verified) {
                    // User is verified, allow access to the staff home page
                    console.log('User is verified');
                    setShow(true);
                } else {
                    // User is not verified, show a message or restrict access
                    console.log('User is not verified');
                }
            } else {
                // User is not authenticated, handle accordingly
                console.log('User is not authenticated');
            }
        })

        verifyUser();
    }, []);

    const handleSubmit = () => {
        const data = {
            clinicName: clinicName,
            contact: contact,
            address: address,
        }
        if (!clinicName || !contact || !address) {
            alert('Please fill in all the required details')
        } else {
            setDoc(doc(reqcol, email), data);
            alert("Request submitted successfully!");
            setClinicName('');
            setContact('');
            setAddress('')
        }

    }

    return (
        <View style={{ flex: 1 }} >
            {!show && <View style={{ backgroundColor: 'white', flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 20, fontWeight: '500' }}>Register as a Clinic Authority</Text>
                    <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>
                        <TextInput
                            style={styles.TextInput}
                            mode='outlined'
                            label="Clinic Name"
                            placeholderTextColor="#003f5c"
                            value={clinicName}
                            onChangeText={setClinicName}
                        />
                        <TextInput
                            style={styles.TextInput}
                            mode='outlined'
                            label="Clinic Contact Number"
                            placeholderTextColor="#003f5c"
                            value={contact}
                            onChangeText={setContact}
                        />
                        <TextInput
                            style={styles.TextInput}
                            mode='outlined'
                            label="Clinic Address"
                            placeholderTextColor="#003f5c"
                            value={address}
                            onChangeText={setAddress}
                        />
                        <Text style={{ fontWeight: 300, marginTop: 50 }}>Please note that the email used for login will be considered as the official clinic email.</Text>
                        <Button style={{ marginTop: 25, width: '50%', }} mode="elevated" onPress={handleSubmit} >
                            Submit Request
                        </Button>
                    </View>
                </View>
            </View>}
            {show && <View style={styles.container}>
                <View style={styles.bluebox} >
                    <View style={styles.boxContent}>
                        <Image source={{ uri: 'https://cdn.dribbble.com/users/749470/screenshots/6165180/media/e3a38918a4fb2f8eb2c4930bf05ff4f2.gif' }}
                            style={styles.image} />
                        <Text style={styles.text}>
                            Click the 'Register' button below to add a new clinic to our booking app.
                            Register now to expand your reach and offer your services to our app users.</Text>
                        <TouchableOpacity style={[styles.button, isRegPressed && styles.regbuttonPressed]} onPress={regPress}>
                            <Text style={styles.buttonText}>Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.pinkbox} >
                    <View style={styles.boxContent}>
                        <Image source={{ uri: 'https://cdn.dribbble.com/users/1732368/screenshots/13778314/media/51fafa43ac484f1ec4084ba20c854a1b.gif' }}
                            style={styles.image} />
                        <Text style={styles.text}>
                            Click the 'View' button below to access and view the booking data for your hospital..</Text>
                        <TouchableOpacity style={[styles.button, isViewPressed && styles.viewbuttonPressed]} onPress={viewPress}>
                            <Text style={styles.buttonText}>View</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>}

        </View>
    );

};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    TextInput: {
        borderColor: 'grey',
        borderRadius: 5,
        width: 300,
        paddingLeft: 5,
        fontWeight: "200",
        marginTop: 20
        //textAlign: 'left'
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
        marginBottom: 40,
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
export default Home;
