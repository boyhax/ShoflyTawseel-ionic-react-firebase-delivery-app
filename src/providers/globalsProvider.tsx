import React, { createContext, useContext, useState, useEffect } from "react";  
import { getAuth, onAuthStateChanged, updateProfile, } from "firebase/auth";
import "./globalsProvider.css"
import { doc, DocumentSnapshot, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { Network } from '@capacitor/network';
import CreateProfile from "../pages/CreatProfile";
import { db, token } from "../App";
import { createNewProfileForThisUser, UpdateProfileForThisUser, UserProfileFromDoc } from "./firebaseMain";
import { UserProfile } from "../types";


const globalsContext = createContext<{
    user:boolean|undefined,
    profile:UserProfile|undefined,
    currentOrder:DocumentSnapshot|undefined,
    setCurrentOrder:(doc:DocumentSnapshot)=>void|undefined,
    }>({user:false,profile:undefined,currentOrder:undefined,setCurrentOrder:(v)=>undefined});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<UserProfile>()
    const [online,setOnline] = useState<boolean>()
    const [currentOrder,setCurrentOrder] = useState<DocumentSnapshot>()

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
          const p:any = UserProfileFromDoc(doc)
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
        
        return<globalsContext.Provider value={{user,profile,setCurrentOrder,currentOrder}}>
          {<CreateProfile onSave={()=>{}}></CreateProfile>}    
      </globalsContext.Provider>
    }

    return<globalsContext.Provider value={{user,profile,setCurrentOrder,currentOrder}}>
     {props.children}    
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}

export default GlobalProvider

