import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getProfile } from "./firebaseMain";
import { IonContent, IonLabel, IonPage, IonSpinner } from "@ionic/react";
import "./globalsProvider.css"
const globalsContext = createContext<{user:boolean,profile:any}>({user:false,profile:null});

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState(false)
    const [profile,setProfile] = useState<any>(null)
    const[loading,setLoading] = useState(true)
    const uid=getAuth().currentUser?.uid
    useEffect(()=>{
        onAuthStateChanged(getAuth(),(user)=>{
            console.log('user  :>> ', !!user );
            setUser(!!user)
            
    })},[])
  useEffect(()=>{
      if(user){

      getProfile(uid!).then((v)=>{
        if(v.exists()){
            console.log('profile exist :>> ',":",uid, v.data());
            setProfile(profile)
            
        }else{
            console.log('profile dont exist :>> ',":",uid);
        }
        setLoading(false)

    })
  }},[user])
    if(loading){
        return<IonPage className="loadingPage">
            <div>
            <IonLabel>Loading...</IonLabel>
            <IonSpinner></IonSpinner>
            </div>
            {/* {window.ne} */}
        </IonPage>
    }
    
    return<globalsContext.Provider value={{user,profile}}>
        {props.children}
        
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}
export default GlobalProvider

