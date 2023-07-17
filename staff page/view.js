import { db, auth } from "../src/firebase/config";
import { useEffect, useState } from "react";
import { getDocs, doc, collection, getDoc, deleteDoc, query, where } from "firebase/firestore";
import { View, Text, StyleSheet, TouchableOpacity, Button } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";


const StaffView = () => {
    //const [email, setEmail] = useState('');
    const [regClinic, setRegClinic] = useState('');
    const [date, setDate] = useState(new Date());
    date.setHours(0, 0, 0, 0);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const [slot, setSlot] = useState([]);
    const [numArray, setNumArray] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [userData, setUserData] = useState([]);
    const [selectedTime, setSelectedTime] = useState();


    useEffect(() => {
        //refer user's registered clinic 
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userDoc = doc(collection(db, 'users'), user.uid);
                const docSnap = await getDoc(userDoc);
                if (docSnap.exists()) {
                    const userData = docSnap.data();
                    if (userData.hasOwnProperty('registeredClinic')) {
                        setRegClinic(userData.registeredClinic);
                    } else {
                        console.log("User has not registered any clinic");
                        setRegClinic('');
                    }
                } else {
                    console.log("User document does not exist");
                }
            } else {
                console.log('no user');
                setRegClinic('');
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        //fetch start time end time 
        const fetchTime = async () => {
            if (regClinic) {
                try {
                    const docRef = doc(collection(db, 'clinics'), regClinic);
                    const docSnap = await getDoc(docRef);
                    const startTimeValue = docSnap.data().startTime;
                    setStartTime(startTimeValue.toDate());
                    const endTimeValue = docSnap.data().endTime;
                    setEndTime(endTimeValue.toDate());
                } catch (error) {

                }

            }
        }
        fetchTime();
    }, [regClinic, date]);


    useEffect(() => {
        // fetch time slots
        if (startTime && endTime) {
            let slots = [];
            let currentTime = startTime;
            currentTime.setHours(
                startTime.getHours(),
                startTime.getMinutes(),
                0,
                0
            );
            currentTime.setFullYear(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );

            endTime.setFullYear(
                date.getFullYear(),
                date.getMonth(),
                date.getDate()
            );
            while (currentTime <= endTime) {
                const formattedTime = currentTime.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                });
                slots.push(formattedTime);
                // Increment the time by 30 minutes
                currentTime.setMinutes(currentTime.getMinutes() + 30);
            }
            setSlot(slots);
        }
    }, [endTime, date]);
    async function showNum(dt, tm) {
        // count size of each slot
        const q = query(
            collection(doc(collection(db, 'clinics'), regClinic), 'bookings'),
            where("date", ">=", dt),
            where("date", "<", new Date(dt.getTime() + 24 * 60 * 60 * 1000)), // Add 24 hours to cover a full day
            where("time", "==", tm)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
    }
    useEffect(() => {
        //check number of each slot

        const fetchData = async () => {
            const resolvedData = [];
            for (const eachTime of slot) {
                const num = await showNum(date, eachTime);
                resolvedData.push(num);
            }
            setNumArray(resolvedData);
        };
        fetchData();
    }, [date, slot]);

    const onTouch = async (tm) => {
        setModalVisible(true);
        setSelectedTime(tm);
        const q = query(
            collection(doc(collection(db, 'clinics'), regClinic), 'bookings'),
            where("date", ">=", date),
            where("date", "<", new Date(date.getTime() + 24 * 60 * 60 * 1000)), // Add 24 hours to cover a full day
            where("time", "==", tm)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            let dataArray = [];
            snapshot.forEach((doc) => {
                const userData = doc.data();
                // Show the modal
                const data = {
                    id : doc.id,
                    email: userData.email
                }
                dataArray.push(data);
            });
            setUserData(dataArray);
        } else {
            console.log('No matching user data found');
        }
    }

    return (
        <View style={styles.whole}>
            <View style={styles.container}>
                <Text style={{ fontSize: 17, fontWeight: 200, color: 'white' }}>Registered Clinic:</Text>
                <View style={styles.centeredContainer}>
                    <Text style={{ fontSize: 25, fontWeight: 500, fontStyle: 'italic' }}>{regClinic}</Text>
                </View>
                <Text style={{ fontSize: 17, fontWeight: 200, marginTop: 20, color: 'white' }}>Date:</Text>
                <View style={styles.con}>

                    <DateTimePicker
                        value={date}
                        mode="date"
                        display="default"
                        onChange={(event, date) => {
                            if (date) {
                                const formattedDate = moment(date).toDate();
                                formattedDate.setHours(0, 0, 0, 0);
                                setDate(formattedDate);
                            }
                        }}
                    />
                </View>

                <Text style={{ fontSize: 17, fontWeight: 200, marginTop: 20, color: 'white' }}>Bookings:</Text>

                <View style={styles.table}>
                    <View style={styles.timeSlotTable}>
                        {slot.map((eachTime, index) => {
                            if (numArray[index] > 0) {
                                return (
                                    <View key={eachTime}>
                                        <TouchableOpacity
                                            onPress={() => onTouch(eachTime)}
                                            style={[styles.timeSlot, 
                                                    slot[index] == selectedTime
                                                        ? styles.selectedSlot
                                                        : null]}
                                        >
                                            <Text style={styles.timeSlotText}>
                                                {eachTime}
                                            </Text>
                                            <Text>
                                                {numArray[index]}
                                            </Text>

                                        </TouchableOpacity>



                                    </View>
                                )
                            }
                            else {
                                return null;
                            }
                        })}
                        {isModalVisible && (
                            <View style={styles.msg}>
                                <Text style = {styles.dataTitle}>User Info:</Text>
                                {userData.map((data) => {
                                    return (
                                    <Text key={data.id} style = {styles.data}>
                                        {data.id}: {data.email}</Text>
                                    )
                                })}
                                <Button
                                    title="Close"
                                    onPress={() => {
                                        setSelectedTime();
                                        return setModalVisible(false);
                                    }}
                                >
                                </Button>
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </View>
    )
};
const styles = StyleSheet.create({
    whole: {
        flex: 1,
        backgroundColor: 'rosybrown',
    },
    container: {
        flex: 1,

        marginTop: 20,
        //backgroundColor: 'pink',
        marginHorizontal: 20
    },
    centeredContainer: {
        alignItems: 'center',
        backgroundColor: 'mistyrose',
        marginTop: 20,
        borderRadius: 6,
    },
    con: {
        marginTop: 20,
        alignItems: 'center',
        //backgroundColor: 'white'
    },

    timeSlotTable: {
        justifyContent: "center",
        flexDirection: "row",
        flexWrap: "wrap",
    },
    timeSlotText: {
        fontSize: 13,
    },
    timeSlot: {
        width: 100,
        height: 60,
        borderWidth: 1.5,
        borderRadius: 6,
        borderColor: "white",
        justifyContent: "center",
        alignItems: "center",
        margin: 5,
    },
    selectedSlot: {
        backgroundColor: "mistyrose",
      },
    msg: {
        //flex: 1,
        position: 'relative',
        //backgroundColor: 'white',
        justifyContent: 'center',
        borderRadius: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.5)'
    },
    data: {
        textAlign: 'left',
        marginHorizontal: 10,
        marginTop: 5,
        
        //alignItems: 'flex-start'
    },
    dataTitle: {
        marginTop: 10,
        marginHorizontal: 10,
        marginBottom: 10,
        fontWeight: '500',
        fontStyle: 'italic'
    },

});
export default StaffView;