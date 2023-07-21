import { getAuth } from "firebase/auth";
import { collection, getFirestore, query, where } from "firebase/firestore";
import * as React from "react";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import useLocalStorage from "./useLocalStorage";

export default function useLocations() {
  const [locations, setLocations] = useState<Location[]|any>([]);
  const [currentLocation, setCurrentLocation] = useState<Location|any>(defaultLocation);
  const user_id  = getAuth().currentUser?.uid;
  const [location] = useLocalStorage<Location>('location',defaultLocation)
  const [snap,loading, error] = useCollection(query(collection(getFirestore(), "locations"),where("user_id","==",user_id)));
  
  
  useEffect(() => {
    snap && !snap.empty && setLocations(snap.docs.map((doc) => doc.data() as Location));
    if(!snap || snap.empty) { setCurrentLocation(location) ; setLocations([location])};
  }, [snap]);

  return { locations, currentLocation,setCurrentLocation };
}
type Location = {
  id: number;
  user_id:string,
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  createdAt: string;
  updatedAt: string;
};
const defaultLocation = {id:0,user_id:'admin',name:'muscat',address:'oman, muscat',latitude:23.588,longitude:58.3829,createdAt:'',updatedAt:''} as Location;