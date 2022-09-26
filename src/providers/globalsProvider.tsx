import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged } from "firebase/auth";
import "./globalsProvider.css"
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { Network } from '@capacitor/network';

export var userProfile:any = null
const globalsContext = createContext<{
    user:boolean|undefined,
    profile:any,
    }>({user:false,profile:null});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<null|Object|undefined>(undefined)
    const [online,setOnline] = useState<boolean|undefined>(undefined)
    
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
        if(!user){
          return
      }
        fetchProfile()
      },[user])
    
      
  
  async function fetchProfile(){
    
    const uid = getAuth().currentUser!.uid

    
    onSnapshot(doc(getFirestore(),"users/"+uid),(doc)=>{
      if(!doc.exists()){
        return
      }
      setProfile(doc.data())
      userProfile = doc.data()
      console.log('profile update :>> ', doc.data());
    })
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
