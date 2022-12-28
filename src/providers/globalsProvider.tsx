import React, { createContext, useContext, useState, useEffect } from "react";  
import { getAuth, onAuthStateChanged, updateProfile, } from "firebase/auth";
import "./globalsProvider.css"
import { doc, DocumentSnapshot, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { Network } from '@capacitor/network';
import CreateProfile from "../pages/CreatProfile";
import { db, token } from "../App";
import { createNewProfileForThisUser, UpdateProfileForThisUser, UserProfileFromDoc } from "./firebaseMain";
import { UserProfile } from "../types";
import { useIonAlert } from "@ionic/react";
import useOnline from "../hooks/useOnline";
import { randomAvatarUrl } from "../components/Avatar";
import useSignTools from "../hooks/useSignTools";

interface Props {
    user:boolean|undefined,
    profile:UserProfile|undefined,
    currentOrder:DocumentSnapshot|undefined,
    setCurrentOrder:(doc:DocumentSnapshot)=>void|undefined,
    online:boolean,
    presentAlert:any,dissmissAlert:()=>void
    
}
const initialProps:Props={
    user:false,
    profile:undefined,
    currentOrder:undefined,
    setCurrentOrder:(v:any)=>undefined,
    online:false,
    presentAlert:'',
    dissmissAlert:()=>'',

}
const globalsContext = createContext<Props>(initialProps);

const GlobalProvider:React.FC =(props)=>{
    const [user,setUser] = useState<boolean|undefined>(undefined)
    const [profile,setProfile] = useState<UserProfile>()
    const [currentOrder,setCurrentOrder] = useState<DocumentSnapshot>()

    const [profileLoadingComplete,setProfileLoadingComplete] = useState<boolean>(false)

    const uid=getAuth().currentUser?.uid
    const {getEmail,getPhone} = useSignTools()
    const {online} = useOnline()


    
    const [presentAlert,dissmissAlert] = useIonAlert()

    useEffect(()=>{

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
  
    function  fetchProfile(){
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
          hundleNoProfileCreatedYet()
          
        }
        async function hundleNoProfileCreatedYet(){
          const user  = getAuth().currentUser!
          const name = user.displayName || ("User"+user.uid.slice(0,5) )
          const number:string= user.phoneNumber || await getPhone() || ""
          const email:string = (user.emailVerified && user.email) || await getEmail() ||""
          const photo = randomAvatarUrl()
          createNewProfileForThisUser(name,number,email,photo)
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
    const toProvide:Props = {user,profile,
      setCurrentOrder,
      currentOrder,
      online,
      presentAlert,
      dissmissAlert}



    return<globalsContext.Provider value={toProvide}>
     {props.children}    
    </globalsContext.Provider>
}
export const useGlobals=()=>{
    return useContext(globalsContext)
}

export default GlobalProvider

