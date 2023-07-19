import { useEffect, useState } from "react";
import { db, auth } from "./src/firebase/config";
import { getDocs, doc, collection, getDoc, deleteDoc } from "firebase/firestore";
import { View, Text, Button, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { format } from 'date-fns';
import * as React from 'react';
import { IconButton, MD3Colors } from 'react-native-paper';

const View = () => {
    const [collections, setCollections] = useState([]);
    const [hospital, setHospital] = useState("");
    const [bookDate, setBookDate] = useState(null);
    const [bookTime, setBookTime] = useState("");
    const [bookingRef, setBookingRef] = useState(null); // refer to the clinic docs booking col
    const [availableSlots, setAvailableSlots] = useState([]);
    const [timeSlots, setTimeSlots] = useState([]);
    const navigation = useNavigation();
    const [maxSlot, setMaxSlot] = useState(0);
    const [startTime, setStartTime] = useState();
    const [endTime, setEndTime] = useState();
    const colRef = collection(db, "clinics");
    const [userDoc, setUserDoc] = useState(null); // refer to the user email doc
    const [email, setEmail] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        
    }
}
//Using Hooks vs Using Classes