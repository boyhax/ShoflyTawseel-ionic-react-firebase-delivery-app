import React, { createContext, useContext, useState, useEffect } from "react";  
import { getAuth, onAuthStateChanged, updateProfile } from "firebase/auth";
import "./globalsProvider.css"
import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { Network } from '@capacitor/network';
import CreateProfile from "../pages/CreatProfile";
import { db, token } from "../App";
import { createNewProfileForThisUser, UpdateProfileForThisUser, UserProfile, UserProfileFromDoc } from "./firebaseMain";


const globalsContext = createContext<{
    user:boolean|undefined,
    profile:UserProfile|undefined,
    }>({user:false,profile:undefined});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<UserProfile>()
    const [online,setOnline] = useState<boolean>()
    const [profileLoadingComplete,setProfileLoadingComplete] = useState<boolean>(false)

    const uid=getAuth().currentUser?.uid

    const CurrentNetworkStatus = async () => {
      const status = await Network.getStatus();
      console.log('online :>> ', status.connected);
      setOnline(status.connected)
      Network.addListener('networkStatusChange', status => {
        setOnline(status.connected)
      });
    }

    useEffect(()=>{
      CurrentNetworkStatus()

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
        isProfileComplete()
        tokenUpdate()

      },[profile])

    function tokenUpdate() {
      if(user && profile && token){
        setDoc(doc(db,"fcmTokens",getAuth().currentUser?.uid!),{token:token}).then((v)=>{
          console.log(v)
        })
      }
    }
  
   function fetchProfile(){
    setProfileLoadingComplete(false)
    const uid = getAuth().currentUser!.uid
    console.log('uid :>> ', uid);
    const ref = doc(getFirestore(),"users/"+uid)
    return   onSnapshot(ref,(doc)=>{
        if(doc.exists()){
          const p:UserProfile = UserProfileFromDoc(doc)
          setProfile(p)
          
          console.log('profile :>> ', p);

        }else{
          createNewProfileForThisUser()
        }
        

        console.log('profile is complete :>> ', doc.exists());
        setProfileLoadingComplete(true)
      })
        
    
  }
      function isProfileComplete() {
          let res = (!!profile 
          && (!!profile.name && profile.name.length >= 5) 
         
          && (!!profile.phoneNumber && profile.phoneNumber.length >=8))
        }       
    if(user && profileLoadingComplete && profile ===undefined) {
        
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
