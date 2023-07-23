import { db, auth } from '../../firebase/config';
import { collection, addDoc, getDoc, doc, setDoc, updateDoc } from 'firebase/firestore';
import { View, Text, StyleSheet, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, Button, Dialog } from 'react-native-paper';
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';


// register new hospital 
const Register = () => {
    const [userRef, setUserRef] = useState(null);
    const [clinicName, setClinicName] = useState('');
    const [maxSlot, setmaxSlot] = useState('');
    const [show, setShow] = useState(false);
    const [startTime, setStartTime] = useState(new Date().setHours(10, 0, 0, 0));
    const [endTime, setEndTime] = useState(new Date().setHours(22, 0, 0, 0));
    const [showStartTimePicker, setShowStartTimePicker] = useState(true);
    const [showEndTimePicker, setShowEndTimePicker] = useState(true);
    const [registered, setRegistered] = useState(false);
    const navigation = useNavigation();
    // const [isFinish, setIsFinish] = useState(false);
    useEffect(() => {
        //refer to user doc 
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                setUserRef(doc(collection(db, 'users'), user.uid));
                const userRef = doc(collection(db, 'users'), user.uid);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.hasOwnProperty('registeredClinic')) {
                        console.log(userData.registeredClinic)
                        const clinicRef = await getDoc(doc(collection(db, 'clinics'), userData.registeredClinic));
                        setRegistered(true);
                        if (clinicRef.exists) {
                            const clinicData = clinicRef.data();
                            const startTime = clinicData.startTime.toDate(); // Assuming startTime is a Firestore Timestamp
                            const formattedStartTime = startTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
                            setStartTime(formattedStartTime);
                            const endTime = clinicData.endTime.toDate(); // Assuming startTime is a Firestore Timestamp
                            const formattedEndTime = endTime.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
                            setEndTime(formattedEndTime);
                            setmaxSlot(clinicData.maxSlot);
                            setClinicName(userData.registeredClinic)
                        }
                    } else {
                        console.log("User has not registered any clinic");
                    }
                } else {
                    console.log("User document does not exist");
                }
                console.log(registered)
            }
        });
        return () => unsubscribe();
    }, []);


    const nextSubmit = async () => {
        try {
            // Query the 'clinics' collection for documents with matching names
            const clinicsCollectionRef = collection(db, 'clinics');
            const docRef = doc(clinicsCollectionRef, clinicName);
            const docSnapshot = await getDoc(docRef);
            // Check if any matching documents exist
            console.log(docSnapshot.data());
            if (docSnapshot.exists()) {
                console.log(`A clinic with the name already exists.`);
                alert('Name already exists');
            } else {

                setShow(true);
            };
        } catch (error) {
            console.error('Error checking clinic name:', error);
        }
    }

    const handleSubmit = async () => {
        if (maxSlot !== '') {
            const data = {
                maxSlot: maxSlot,
                startTime: startTime,
                endTime: endTime

            }
            try {
                const colRef = collection(db, 'clinics');
                const docRef = doc(colRef, clinicName);
                await setDoc(docRef, data);
                await updateDoc(userRef, { registeredClinic: clinicName });
                alert('Data saved successfully!');
                navigation.navigate("Dashboard");

            }
            catch (error) {
                console.error('Error adding clinic:', error);
            }
        } else {
            alert('Please Enter Your Maximum Slot');
        }
    }
    const handleStartTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setStartTime(selectedTime);
        }
    };

    const handleEndTimeChange = (event, selectedTime) => {
        if (selectedTime) {
            setEndTime(selectedTime);
        }
    };
    return (
            <View style = {styles.container}>
                {registered && <View style={{flex: `1`, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginBottom: 20, fontStyle:'italic'}}>You have already registered a clinic</Text>
                    <View style = {{}}>
                    <Text style={styles.text}> Registered Clinic :      {clinicName}</Text>
                    <Text style={styles.text}> Start Time :        {startTime}</Text>
                    <Text style={styles.text}> End Time :          {endTime}</Text>
                    <Text style={styles.text}> Maximum Occupancy per Slot:   {maxSlot}</Text>
                    </View>
                </View>}
           
            { !registered && !show && (<KeyboardAvoidingView style={styles.container} behavior="padding">
                <TextInput
                    style={styles.textInput}
                    label="Clinic name"
                    value={clinicName}
                    onChangeText={setClinicName}
                />
                {clinicName && (<View style={styles.next}>
                    <Button mode="elevated" onPress={nextSubmit} >
                        Next
                    </Button>
                </View>)}
            </KeyboardAvoidingView>)}
            <View style={styles.container}>
                {show && (<View style={styles.content}>
                    <Dialog.Title style={{ fontFamily: "Georgia-BoldItalic" }}>{clinicName}</Dialog.Title>
                    <TextInput
                        style={styles.textInput}
                        label="Max slot"
                        value={maxSlot}
                        onChangeText={setmaxSlot}
                    />

                    <Text style={styles.timetitle}> Start Time: </Text>
                    {showStartTimePicker && (
                        <DateTimePicker
                            value={new Date(startTime)}
                            mode="time"
                            display="default"
                            onChange={handleStartTimeChange}
                        />
                    )}
                    <Text style={styles.timetitle}> End Time: </Text>
                    {showEndTimePicker && (
                        <DateTimePicker
                            value={new Date(endTime)}
                            mode="time"
                            display="default"
                            onChange={handleEndTimeChange}
                        />
                    )}

                    <Button style={styles.finish} mode="elevated" onPress={handleSubmit} >
                        Finish
                    </Button>
                </View>)}
            </View>
             </View>

    )
}
const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        backgroundColor: 'seashell',
        paddingBottom: 20,

    },
    content: {
        //justifyContent: 'center',
        alignItems: 'flex-start',
        flexGrow: 1,
        //flex: 1,
        // backgroundColor: 'white',
        marginHorizontal: 30,
        marginVertical: 30
    },
    text: {
        textAlign: 'left',
        marginTop: 10,
        fontWeight: 300
    },
    textInput: {
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'grey',
        borderRadius: 5,
        width: 300,
        height: 50,
        paddingLeft: 5,
        //textAlign: 'left'
    },
    next: {
        marginTop: 40,

    },
    finish: {
        bottom: 20,
        position: 'absolute',
        alignItems: 'flex-end'
    },
    timetitle: {
        fontWeight: 200,
        marginTop: 40,
        marginBottom: 20
    }
})
export default Register;
