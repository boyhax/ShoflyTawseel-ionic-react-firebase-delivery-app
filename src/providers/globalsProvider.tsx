import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged,getAdditionalUserInfo } from "firebase/auth";
import "./globalsProvider.css"
import { doc, getDoc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { Network } from '@capacitor/network';
import CreateProfile from "../pages/CreatProfile";
import { db, token } from "../App";

export type userProfile ={
  name:string
}
const globalsContext = createContext<{
    user:boolean|undefined,
    profile:any,
    }>({user:false,profile:null});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<any>(null)
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
        if((profile || profile===undefined) && user){
          isProfileComplete()
        }
        if(profile && token){
          setDoc(doc(db,"fcmTokens",getAuth().currentUser?.uid!),{token:token}).then((v)=>{
            console.log(v)
          })
        }

      },[profile])
      
  
   function fetchProfile(){
    setProfile(null)
    const uid = getAuth().currentUser!.uid
    console.log('uid :>> ', uid);
    const ref = doc(getFirestore(),"users/"+uid)
    return   onSnapshot(ref,(doc)=>{
      
        setProfile(doc.data())
        console.log('profile :>> ', doc.data());
      })
        
    
  }
      function isProfileComplete() {
          let res = (!!profile 
          && (!!profile.name && profile.name.length >= 5) 
          &&!!profile.email
          && (!!profile.phoneNumber && profile.phoneNumber.length >=8))
          setProfileNotComplete(!res) 
        }       
    if(user && (profileNotComplete || profile ===undefined)) {
        
        return<globalsContext.Provider value={{user,profile}}>
          {<CreateProfile onSave={()=>{}}></CreateProfile>}    
      </globalsContext.Provider>
    }

    return<globalsContext.Provider value={{user,profile}}>
     {props.children}    
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
