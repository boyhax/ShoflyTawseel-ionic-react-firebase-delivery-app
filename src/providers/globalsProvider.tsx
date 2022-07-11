import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getProfile } from "./firebaseMain";
import "./globalsProvider.css"
import LoadingScreen from "../pages/LoadingScreen";
import { doc, getDoc, getFirestore } from "firebase/firestore";

        
const globalsContext = createContext<{user:boolean|undefined,
    profile:any,
    updateProfile:()=>void}>({user:false,profile:null,updateProfile:()=>{}});

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
        updateProfile()
      },[user])
    
      
  
  async function updateProfile(){
    if(!user){
        return
    }
    const uid = getAuth().currentUser!.uid
    const p = await getDoc(doc(getFirestore(),"users/"+uid))
    console.log('p :>> ', p.data());
    setProfile(p.data())
  }
const[timeout,isTimeout] = useState(false)
  const loading =( user === undefined)
    // if(!timeout){
    //     return<LoadingScreen onClose={()=>isTimeout(true)}></LoadingScreen>
    // }
    
    return<globalsContext.Provider value={{user,profile,updateProfile}}>
        {props.children}
        
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}
export default GlobalProvider

