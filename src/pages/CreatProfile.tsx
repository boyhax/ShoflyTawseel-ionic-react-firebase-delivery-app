import React, {  FC, useEffect, useState } from "react";
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToast } from "@ionic/react";
import {  updateUserProfile } from "../providers/firebaseMain";
import { getAuth } from "firebase/auth";
import { useGlobals } from "../providers/globalsProvider";
import { useHistory } from "react-router";
import { onSnapshot } from "firebase/firestore";
import { TT } from "../components/utlis/tt";
import { randomAvatarUrl } from "../components/Avatar";

 const CreateProfile= (props:any)=>{
    const {profile} = useGlobals()

     const [name,setName]= useState<any>(profile?profile.name!?profile.name:"":"")
     const [phone,setPhone]= useState<any>(profile?profile.phoneNumber!?profile.phoneNumber:"":"")
     const [email,setEmail]= useState<any>(profile?profile.email!?profile.email:"":"")
     const [message,setMessage] = useState("")
     const [photoURL,setPhotoURL] = useState(randomAvatarUrl())
     
     const history = useHistory()
     
     function variablesOK(){
         if(!name){
            return false
         }
        return true
     }
     function onSave(){
         if(!variablesOK()){
            setMessage("please fill all ")
             return 
         }
        if(profile ===undefined){
            console.log('new Profile shall be made ');
        }else{
            updateUserProfile(getAuth().currentUser!.uid,{
                name:name,
            }).then((value) => {
                let v = props.onSave()?props.onSave():()=>{}
                setMessage("updated seccesfuly")
            })
        }
        
     }
     
    return<IonPage>
        <IonHeader style={{height:50}}>
        <IonTitle >يجب كتابة معلومات حسابك</IonTitle>
        </IonHeader>
        <IonContent>
        <IonItem>
        <IonLabel position="floating">name</IonLabel>
        <IonInput 
        value={name}
        onIonChange={(e)=>setName(e.detail.value)} 
        placeholder='name'></IonInput>
        
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Email</IonLabel>
        <IonInput 
        disabled={true}
        value={email}
        onIonChange={(e)=>setEmail(e.detail.value)} 
        placeholder='Email' 
        type="email"></IonInput>
        
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Phone Number</IonLabel>
        <IonInput 
            disabled={true}
            value={phone}
            onIonChange={(e)=>setPhone(e.detail.value)} 
            placeholder='Number' 
            type="tel"
            maxlength={8}
            ></IonInput>
        
      </IonItem>
      <IonButton onClick={()=>onSave()} >Save Profile</IonButton>
        </IonContent>
        <IonToast isOpen={!!message} 
        message={message} 
        duration={1500} 
        onDidDismiss={()=>setMessage("")}></IonToast>
      </IonPage>
  }

  export default CreateProfile
