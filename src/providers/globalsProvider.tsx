import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./globalsProvider.css"
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";
import { Network } from '@capacitor/network';
import CreateProfile from "../pages/CreatProfile";
import { Redirect } from "react-router";

export var userProfile:any = null
const globalsContext = createContext<{
    user:boolean|undefined,
    profile:any,
    }>({user:false,profile:null});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<any|undefined>(null)
    const [online,setOnline] = useState<boolean|undefined>(undefined)
    const [profileNotComplete,setProfileNotComplete] = useState<boolean>(false)

    const uid=getAuth().currentUser?.uid

    const logCurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      console.log('online :>> ', status);
      setOnline(status.connected)
    }

    useEffect(()=>{
      logCurrentNetworkStatus()
      Network.addListener('networkStatusChange', status => {
        console.log('Network status changed', status);
        setOnline(status.connected)
      });
      return onAuthStateChanged(getAuth(),(user)=>{
                console.log('user  :>> ', !!user );
                setUser(!!user)
        },(err)=>{
            console.log(err,"error in user sign in check")

        })
        
        
      },[])

      useEffect(()=>{
        if(user){
          const unsub = fetchProfile()
          return ()=>{unsub()}
      }
      },[user])

    useEffect(()=>{
        if(profile === undefined || !!profile){
          isProfileComplete()
        }
      },[profile])
      
  
   function fetchProfile(){
    const uid = getAuth().currentUser!.uid

    console.log('uid :>> ', uid);
    
    const ref = doc(getFirestore(),"users/"+uid)
    return   onSnapshot(ref,(doc)=>{
        setProfile(doc.data())
        
      })
        
    
  }
function isProfileComplete() {
    let res = (!!profile 
    && (!!profile.name && profile.name.length >= 5) 
    &&!!profile.email
    && (!!profile.phoneNumber && profile.phoneNumber.length >=8))
      console.log('profile is complete? :>> ', res);
    setProfileNotComplete(!res) 
}
    
    return<globalsContext.Provider value={{user,profile}}>
      {profileNotComplete && <CreateProfile onSave={()=>{}}></CreateProfile>}
    {!profileNotComplete && props.children}        
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}

export default GlobalProvider

// moved to cloud functions
// function generateName(){
//   const str= "abcdefghijklmnopqrstuvwxyz"
//   const num = "1234567890"
//   const mix = str+num
//   const newName = shuffle(mix).slice(0,10)
//   console.log('newName :>> ', newName);
//   return newName
// }
// const shuffle = (str:string) => str.split('').sort(()=>Math.random()-.5).join('');
