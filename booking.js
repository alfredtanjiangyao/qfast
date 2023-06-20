
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useEffect, useState } from 'react';
import { db } from './src/firebase/config';
import { collection, onSnapshot, addDoc, query, where, getDocs, listCollections, doc, getDoc } from 'firebase/firestore';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import Dashboard from './src/screens/dashboard';



const Home = () => {
  const [collections, setCollections] = useState([]);
  const [hospital, setHospital] = useState('');
  const [bookDate, setBookDate] = useState(null);
  const [bookTime, setBookTime] = useState('');
  const [bookingRef, setBookingRef] = useState(null); // refer to the clinic docs booking col
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const navigation = useNavigation();
  const [maxSlot, setMaxSlot] = useState(0);
  const [startTime, setStartTime] = useState();
  const [endTime, setEndTime] = useState();
  const colRef = collection(db, 'clinics');
  useEffect(() => {
    // Fetch the list of Clinics docs
    const fetchCollections = async () => {
      try {
        const querySnapshot = await getDocs(colRef);
        const documents = querySnapshot.docs.map((doc) => doc.id);
        setCollections(documents);
      } catch (error) {
        console.log('Error fetching collections:', error);
      }
    };
    fetchCollections();
  }, []);

  useEffect(() => {
    if (bookDate) {
      // Fetch available slots based on the selected date
      const fetchAvailableSlots = (date) => {

        const slots = [];

        // Iterate over the time range with a 30-minute interval
        const currentDate = new Date();
        const now = currentDate;
        let currentTime = new Date();
        currentTime.setHours(startTime.getHours(), startTime.getMinutes(), 0, 0);
        currentTime.setFullYear(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());
        endTime.setFullYear(bookDate.getFullYear(), bookDate.getMonth(), bookDate.getDate());
        while (currentTime <= endTime) {
          if (currentTime >= now) {

            const formattedTime = currentTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });
            slots.push(formattedTime);
          }

          // Increment the time by 30 minutes
          currentTime.setMinutes(currentTime.getMinutes() + 30);
        }
        console.log(slots);
        return slots;
      };

      const fetchedSlots = fetchAvailableSlots(bookDate);
      setAvailableSlots(fetchedSlots);
    }
    setBookTime('');
  }, [bookDate, hospital, endTime]);
  async function isSlotAvailable(dt, tm) {
    console.log('Date:', dt);
    console.log('Time:', tm);
    //const formattedDate = dt.substring(0, 10);
    const q = query(bookingRef, where("date", "==", dt), where("time", "==", tm));
    const snapshot = await getDocs(q);
    console.log(maxSlot);
    // Check if the number of bookings for the slot is less than 5
    const isAvailable = snapshot.size < maxSlot;
    console.log(snapshot.size);
    return isAvailable;

  };
  useEffect(() => {
    const fetchData = async () => {
      const resolvedData = [];
      //console.log(bookDate);
      for (const eachTime of availableSlots) {
        const isAvailable = await isSlotAvailable(bookDate, eachTime);
        resolvedData.push(isAvailable);
      }
      setTimeSlots(resolvedData);
    }
    fetchData();
  }, [bookDate, availableSlots]);

  // update info when picker changes
  useEffect(() => {
    const fetchData = async () => {

      if (hospital) {
        try {
          const docRef = doc(colRef, hospital);
          const docSnap = await getDoc(docRef);
          const maxSlotValue = docSnap.data().maxSlot;
          setMaxSlot(maxSlotValue);
          const startTimeValue = docSnap.data().startTime;
          setStartTime(startTimeValue.toDate());
          const endTimeValue = docSnap.data().endTime;
          setEndTime(endTimeValue.toDate());
          setBookingRef(collection(docRef, 'bookings'));
        } catch (error) {
          console.error('Error retrieving document:', error);
        }
      }
    };
    fetchData();
  }, [hospital]);


  const handlePickerChange = (itemValue) => {
    setHospital(itemValue);
  };
  const handleSubmit = () => {
    const newBookingData = {
      date: bookDate,
      time: bookTime,
    };
    addDoc(bookingRef, newBookingData)
      .then(() => {
        console.log('Booking data saved successfully!');
      })
      .catch((error) => {
        console.error('Error saving booking data:', error);
      });
    alert('Booking submitted successfully!');
    navigation.navigate('Dashboard');
    setBookDate('');
    setBookTime('');
    setHospital('');
  };

  return (
    <View style={{ flexGrow: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <View>
          <Picker
            selectedValue={hospital}
            onValueChange={handlePickerChange}
          >
            <Picker.Item label="Select a hospital" value="" />
            {collections.map((clinics, index) => (
              <Picker.Item key={index} label={clinics} value={clinics} />
            ))}
          </Picker>
        </View>
        <Text style={styles.text}>Select a date:</Text>

        {hospital && (<View >
          <CalendarPicker
            onDateChange={(date) => {
              const formattedDate = moment(date).toDate(); // Format the date as needed
              setBookDate(formattedDate);
            }}
            textStyle={{
              fontFamily: 'Cochin',
              color: '#000000'
            }}
            selectedDayStyle={{
              backgroundColor: '#87cefa'
            }} />
        </View>)}
        <View >
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.text}>Slots Available :</Text>

            <ScrollView style={styles.scrollcontainer}>
              <View style={styles.timeSlotTable}>
                {bookDate && hospital && (availableSlots.map((eachTime, index) => (
                  <View key={eachTime}>
                    {timeSlots[index] ? (
                      <TouchableOpacity
                        onPress={() => setBookTime(eachTime)}
                        style={[
                          styles.timeSlot,
                          availableSlots[index] === bookTime ? styles.selectedSlot : null,
                        ]}
                      >
                        <Text style={styles.timeSlotText}>{eachTime}</Text>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.timeSlot, styles.unavailableSlot]}>
                        <Text style={styles.timeSlotText}>{eachTime}</Text>
                      </View>
                    )}
                  </View>
                )))}

              </View>
            </ScrollView>
          </View>
        </View>
        {bookTime && (<View style={styles.button}>
          <Button title="Book" onPress={handleSubmit} />
        </View>)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginVertical: 30,
    marginHorizontal: 20,
    //flexGrow :1
  },
  scrollcontainer: {
    maxHeight: 340,
    backgroundColor: 'oldlace',
    borderRadius: 20,
  },
  text: {
    textAlign: 'left',
    marginBottom: 10,
    marginTop: 16,
    fontWeight: '200',
    fontSize: 15
  },
  timeSlotTable: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  timeSlot: {
    width: 130,
    height: 40,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5
  },
  unavailableSlot: {
    backgroundColor: 'lightgray',
  },
  selectedSlot: {
    backgroundColor: 'lightskyblue',
  },
  timeSlotText: {
    fontSize: 13,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    borderWidth: 2,
    borderRadius: 10,
    padding: 5,
    backgroundColor: 'white',

  }
});

export default Home;