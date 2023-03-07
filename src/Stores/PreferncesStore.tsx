import { LatLng } from 'leaflet';
import { Store } from 'pullstate';
import { mydb } from '../providers/firebaseMain';
import { driverData, UserProfile } from '../types';
import {Geolocation} from'@capacitor/geolocation'
import { User } from 'firebase/auth';
import { Preferences } from '@capacitor/preferences';


const initialProps={
    user:null,
    profile:undefined,
    address:null,
    driver:null,
}

export const PreferencesStore = new Store(initialProps)



export function usePreferences(){
   
    return{}
}
