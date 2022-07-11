import React, { createContext, useContext, useState, useEffect, FC } from "react";  
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getProfile, updateUserProfile } from "./firebaseMain";
import "./globalsProvider.css"
import LoadingScreen from "../pages/LoadingScreen";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";

        
const globalsContext = createContext<{
    user:boolean|undefined,
    profile:any,
    }>({user:false,profile:null});

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
        fetchProfile()
      },[user])
    
      
  
  async function fetchProfile(){
    if(!user){
        return
    }
    const uid = getAuth().currentUser!.uid
    
    const p = await getDoc(doc(getFirestore(),"users/"+uid))

    console.log('p :>> ', p.data());
    if(p.exists()){
      if(p.data()["name"]==""){
        updateUserProfile(uid,{name:generateName()})
        fetchProfile()
      }
    }
    setProfile(p.data())
    onSnapshot(doc(getFirestore(),"users/"+uid),(doc)=>{
      setProfile(doc.data())
    })
  }
const[timeout,isTimeout] = useState(false)
  const loading =( user === undefined)
    // if(!timeout){
    //     return<LoadingScreen onClose={()=>isTimeout(true)}></LoadingScreen>
    // }
    
    return<globalsContext.Provider value={{user,profile}}>
        {props.children}
        
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}
export default GlobalProvider

function generateName(){
  const str= "abcdefghijklmnopqrstuvwxyz"
  const num = "1234567890"
  const mix = str+num
  const newName = shuffle(mix).slice(0,10)
  console.log('newName :>> ', newName);
  return newName
}
const shuffle = (str:string) => str.split('').sort(()=>Math.random()-.5).join('');
