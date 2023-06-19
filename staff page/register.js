import { db } from '../src/firebase/config';
import { collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { View, Text, TimePickerAndroid, StyleSheet, KeyboardAvoidingView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TextInput, Button, Dialog } from 'react-native-paper';


// register new hospital 
const register = () => {
    const [clinicName, setClinicName] = useState('');
    const [maxSlot, setmaxSlot] = useState('');
    const [show, setShow] = useState(false);
    const [startTime, setStartTime] = useState(new Date().setHours(10, 0, 0, 0));
    const [endTime, setEndTime] = useState(new Date().setHours(22, 0, 0, 0));
    const [showStartTimePicker, setShowStartTimePicker] = useState(true);
    const [showEndTimePicker, setShowEndTimePicker] = useState(true);
    // const [isFinish, setIsFinish] = useState(false);

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
                alert('Data saved successfully!');

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
        <View style={{ flex: 1 }}>

            {!show && (<KeyboardAvoidingView style={styles.container} behavior="padding">
                <TextInput
                    style={styles.textInput}
                    label="Hospital name"
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
export default register;