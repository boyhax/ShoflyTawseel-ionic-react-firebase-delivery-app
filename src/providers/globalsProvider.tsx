import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getProfile } from "./firebaseMain";
import { IonContent, IonLabel, IonPage, IonSpinner, IonTitle } from "@ionic/react";
import "./globalsProvider.css"
import LoadingScreen from "../pages/LoadingScreen";
const globalsContext = createContext<{user:boolean|undefined,profile:any}>({user:false,profile:null});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<null|Object|undefined>(undefined)
    const uid=getAuth().currentUser?.uid
    useEffect(()=>{
        try {
            return onAuthStateChanged(getAuth(),(user)=>{
                console.log('user  :>> ', !!user );
                setUser(!!user)
                
        },(err)=>{
            console.log(err,"error in user sign in check")

        })      
        } catch (error) {
          console.log("error in user sign in check: ",error)  
        }
      },[])
  useEffect(()=>{
      if(user){

      getProfile(uid!).then((v)=>{
        if(v.exists()){
            console.log('profile exist :>> ',":",uid, v.data());
            setProfile(v.data())
            
        }else{
            console.log('profile dont exist :>> ',":",uid);
            setProfile(null)
        }
    })
  }},[user])
//   useEffect(()=>{
//     console.log('profile :>> ', profile);

//       if(profile &&user){
//         setLoading(false)
//         }
//       }
//   ,[profile,user])
const[timeout,isTimeout] = useState(false)
  const loading =( user === undefined)
    // if(!timeout){
    //     return<LoadingScreen onClose={()=>isTimeout(true)}></LoadingScreen>
    // }
    
    return<globalsContext.Provider value={{user,profile}}>
        <IonTitle>hello</IonTitle>
        {props.children}
        
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}
export default GlobalProvider

