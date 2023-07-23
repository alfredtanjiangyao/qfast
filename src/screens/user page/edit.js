import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/config";
import { getDocs, doc, collection, getDoc, deleteDoc } from "firebase/firestore";
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { format } from 'date-fns';
import * as React from 'react';
import { IconButton, MD3Colors } from 'react-native-paper';

const Edit = () => {
    // const [date, setDate] = useState('');
    // const [time, setTime] = useState('');
    // const [clinic, setClinic] = useState('');
    const [userDoc, setUserDoc] = useState(null);
    const [bookingData, setBookingData] = useState([]);
    const [dustbin, setDustbin] = useState(false);
    const [pressedIndex, setPressedIndex] = useState(null);
    const [userName, setUserName] = useState('');
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        //refer user doc
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = doc(collection(db, 'users'), user.uid);
                setUserDoc(userDoc);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    setUserName(docSnap.data().username);
                } else {
                    console.log("User document does not exist");
                }
            } else {
                setUserDoc(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Fetch the list of bookings
        if (userDoc) {
            const fetchBookings = async () => {
                try {
                    const col = collection(userDoc, 'booking');
                    const querySnapshot = await getDocs(col);
                    const bookingDataList = querySnapshot.docs.map((doc) => {
                        const data = doc.data()
                        data.docid = doc.id
                        return data
                    });

                    setBookingData(bookingDataList);

                } catch (error) {
                    console.log("Error fetching collections:", error);
                }
            };
            fetchBookings();
        }
    }, [userDoc]);
    //console.log(bookingData);

    const formatDate = (date) => {
        // format date function
        const obj = new Date(date.seconds * 1000);
        return format(obj, 'd-M-yyyy');
    }

    const dlt = (index) => {
        
        try {
            setDeleting(true);
            const updatedBookings = [...bookingData];
            updatedBookings.splice(index, 1);
            const docid = bookingData[index].docid;
            const userbookingdoc = doc(collection(userDoc, 'booking'), docid);
            deleteDoc(userbookingdoc);  //delete data from user
            const clinicbookingdoc = doc(collection(doc(collection(db, 'clinics'), bookingData[index].hospital), 'bookings'), userName)
            deleteDoc(clinicbookingdoc); //delete data from clinic
            setBookingData(updatedBookings);  // Remove the booking at the specified index
            setDustbin(false);
            setPressedIndex(null);
        }catch (error) {
            console.error("Error removing document: ", error);
          }
        }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Bookings </Text>
            <View style={styles.boxes}>
                {bookingData.map((bookingData, index) => (
                    <TouchableOpacity
                        style={[styles.box, { backgroundColor: pressedIndex === index ? 'tomato' : index % 2 === 0 ? 'lavender' : 'white' }]}
                        key={index}
                        onPress={() => {
                            setPressedIndex(index);
                            setDustbin(true);
                        }}>

                        <Text style={styles.hospital}>🏥 Hospital:   {bookingData.hospital}</Text>
                        <View style={styles.datetime}>
                            <View>
                                <Text style={styles.timeTitle}>Date: </Text>
                                <Text style={styles.time}>{formatDate(bookingData.date)}</Text>
                            </View>

                            <View style={styles.timecon}>
                                <Text style={styles.timeTitle}>Time:</Text>
                                <Text style={styles.time}>{bookingData.time}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
                {dustbin && (
                    <View style={styles.button}>
                        <IconButton
                            icon="delete"
                            iconColor={MD3Colors.error50}
                            size={30}
                            onPress={() => dlt(pressedIndex)}
                        />
                    </View>
                )}
            </View>
            <View style={styles.icon}>
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        backgroundColor: 'thistle',
        flex: 1,
    },
    box: {
        borderColor: 'black',
        borderWidth: 1,
        marginTop: 20,
        borderRadius: 6,
        height: 120,
        backgroundColor: 'white',
    },
    boxes: {
        flexDirection: 'column',
        marginHorizontal: 20,
        //alignItems: 'stretch',

    },
    title: {
        marginLeft: 20,
        fontSize: 25,
        fontStyle: 'italic',
        marginTop: 20,
        fontFamily: "Cochin",
        //fontWeight: '400',
        // color: 'white',
    },
    hospital: {
        marginLeft: 20,
        marginTop: 10,
        fontSize: 15
    },
    datetime: {
        flexDirection: 'row',
        //borderColor: 'black',
        //borderWidth: 1,
        marginTop: 20,
    },
    timecon: {
        //alignItems: 'flex-end',
        flex: 1,
        marginLeft: 50
    },
    timeTitle: {
        marginLeft: 20,
        marginTop: 10,

    },
    time: {
        marginLeft: 20,
        marginTop: 5,
        fontWeight: '200',
    },
    button: {
        alignItems: 'center'
    },

});
export default Edit;

// module.exports = edit;