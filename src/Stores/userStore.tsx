import { LatLng } from 'leaflet';
import { Store } from 'pullstate';
import { mydb } from '../providers/firebaseMain';
import { driverData, UserProfile } from '../types';
import {Geolocation} from'@capacitor/geolocation'

interface Props{
    user:boolean,
    profile:UserProfile|undefined,
    address:{
        geo:LatLng,
        name:string
    }|null,
    driverData:driverData|null,
}
const initialProps:Props={
    user:false,
    profile:undefined,
    address:null,
    driverData:null,
}

export const userStore = new Store(initialProps)

Geolocation.getCurrentPosition( { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }).then(
    (position) => {
        userStore.update(s=>{
            s.address={geo:new LatLng(position.coords.latitude,position.coords.longitude)
                ,name:''}})   
        },
);


export function useProfile(){
    async function setStatus(state:any){
        await mydb.updateProfile({status:state})
        userStore.update(s=>{s.profile!.status=state})
    }
    return{setStatus}
}
export function useDriver(){
    const {profile}=userStore.useState()

    async function setStatus(state:any){
        await mydb.updateProfile({status:state})
        userStore.update(s=>{s.profile!.status=state})
    }
    const driver = profile?.driverData
     mydb.getDriverData()
    function toggleStatus(){
        setStatus(profile?.status==="active" ? "inactive":"active")
  
    }
    
    function updateDriverData(data:object){
        mydb.updateProfile({driverData:{...driver!, ...data}})
    }
    return{driver ,toggleStatus,setStatus,updateDriverData}
}