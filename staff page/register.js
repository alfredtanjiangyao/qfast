import { db } from '../src/firebase/config';
import { collection, addDoc, getDoc, doc, setDoc} from 'firebase/firestore';
import { useState } from 'react';
import { View, Text, TextInput, Button, TimePickerAndroid, StyleSheet, Animated } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

// register new hospital 
const page1 = () => {
    const [clinicName, setClinicName] = useState('');
    const [maxSlot, setmaxSlot] = useState('');
    const [show, setShow] = useState(false);
    const [startTime, setStartTime] = useState(new Date().setHours(10, 0, 0, 0));
    const [endTime, setEndTime] = useState(new Date().setHours(22, 0, 0, 0));
    const [showStartTimePicker, setShowStartTimePicker] = useState(true);
    const [showEndTimePicker, setShowEndTimePicker] = useState(true);
    const [isFinish, setIsFinish] = useState(false);

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
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            {!show && (<View>
                <TextInput

                    placeholder="Enter hospital name"
                    value={clinicName}
                    onChangeText={setClinicName}
                />
                <Button title="Next" onPress={nextSubmit} />
            </View>)}
            {show && (<View>
                <TextInput
                    placeholder="Enter max slot"
                    value={maxSlot}
                    onChangeText={setmaxSlot}
                />
                <Text> Start Time: </Text>
                {showStartTimePicker && (
                    <DateTimePicker
                        value={new Date(startTime)}
                        mode="time"
                        display="default"
                        onChange={handleStartTimeChange}
                    />
                )}
                <Text> End Time: </Text>
                {showEndTimePicker && (
                    <DateTimePicker
                        value={new Date(endTime)}
                        mode="time"
                        display="default"
                        onChange={handleEndTimeChange}
                    />
                )}
                <Button title="finish" onPress={handleSubmit} />
            </View>)}
        </View>
    )
}
export default page1;