// sy firebase
import { View, Text, Button, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useEffect, useState } from 'react';
import { db } from './src/firebase/config';
import { collection, onSnapshot, addDoc, query, where, getDocs } from 'firebase/firestore';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import Dashboard from './src/screens/dashboard';



const Home = () => {
  const [bookDate, setBookDate] = useState(null);
  const [bookTime, setBookTime] = useState('');
  const [bookingData, setBookingData] = useState([]);
  const bookingRef = collection(db, 'bookings');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const navigation = useNavigation();


  useEffect(() => {
    const unsubscribe = onSnapshot(bookingRef, (docSnapshot) => {
      const updatedBookingData = docSnapshot.data;
      setBookingData(updatedBookingData);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const currentDate = new Date();
    const now = currentDate.getTime();
    if (bookDate) {
      // Fetch available slots based on the selected date
      const fetchAvailableSlots = (date) => {
        const startTime = new Date(date);
        startTime.setHours(10, 0, 0, 0); // Set the start time to 10 am

        const endTime = new Date(date);
        endTime.setHours(23, 30, 0, 0); // Set the end time to 12 am (midnight) the next day

        const slots = [];

        // Iterate over the time range with a 30-minute interval
        let currentTime = startTime;
        while (currentTime <= endTime) {
          if (currentTime.getTime() >= now) {
            const formattedTime = currentTime.toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            });
            slots.push(formattedTime);
          }

          // Increment the time by 30 minutes
          currentTime = new Date(currentTime.getTime() + 30 * 60 * 1000);
        }

        return slots;
      };

      const fetchedSlots = fetchAvailableSlots(bookDate);
      setAvailableSlots(fetchedSlots);
    }
    setBookTime('');
  }, [bookDate]);
  async function isSlotAvailable(dt, tm) {
    console.log('Date:', dt);
    console.log('Time:', tm);
    const formattedDate = dt.substring(0, 10);
    const q = query(bookingRef, where("date", "==", formattedDate), where("time", "==", tm));
    const snapshot = await getDocs(q);

    // Check if the number of bookings for the slot is less than 5
    const isAvailable = snapshot.size < 5;
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
  };

  return (
    <View style={{ flexGrow: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        <Text style={styles.text}>Select a date:</Text>
        <View >
          <CalendarPicker
            onDateChange={(date) => {
              const formattedDate = moment(date).format('YYYY-MM-DD'); // Format the date as needed
              setBookDate(formattedDate);
            }}
            textStyle={{
              fontFamily: 'Cochin',
              color: '#000000'
            }}
            selectedDayStyle={{
              backgroundColor: '#87cefa'
            }} />
        </View>
        <View >
          <View style={{ flexGrow: 1 }}>
            <Text style={styles.text}>Slots Available :</Text>

            <ScrollView style={styles.scrollcontainer}>
              <View style={styles.timeSlotTable}>
                {bookDate && (availableSlots.map((eachTime, index) => (
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