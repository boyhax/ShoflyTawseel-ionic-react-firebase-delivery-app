import React, { ComponentProps, FC, useEffect, useState } from "react";
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle, IonToast } from "@ionic/react";
import { createNewProfile, updateUserProfile } from "../providers/firebaseMain";
import { getAuth } from "firebase/auth";
import { useGlobals } from "../providers/globalsProvider";
import Input from "../components/Input";
import { useHistory } from "react-router";
import { onSnapshot } from "firebase/firestore";
import { TT } from "../components/utlis/tt";

 export default (props:any)=>{
    const {profile} = useGlobals()

     const [name,setName]= useState<any>(profile?profile.name!?profile.name:"":"")
     const [phone,setPhone]= useState<any>(profile?profile.phoneNumber!?profile.phoneNumber:"":"")
     const [email,setEmail]= useState<any>(profile?profile.email!?profile.email:"":"")
     const [message,setMessage] = useState("")

     useEffect(()=>{
         
        
     },[profile])

     const history = useHistory()
     
     function variablesOK(){
         if(!name){
            return false
         }
         if(!phone){
            return false
         }
         if(!email){
            return false
         }
        return true
     }
     function onSave(){
         if(!variablesOK()){
            setMessage("please fill all ")
             return 
         }
        if(!profile){
            createNewProfile(getAuth().currentUser!.uid,{
                name:name,
                email:email,
                phone:phone
            }).then((value) => {
                console.log("new profile created")
            })
        }else{
            updateUserProfile(getAuth().currentUser!.uid,{
                name:name,
                email:email,
                phoneNumber:phone
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
        onIonChange={(e)=>e.detail.value!.length>=5?setName(e.detail.value):setMessage(TT("please make name with more than 4 alphabits"))} 
        placeholder='name'></IonInput>
        
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Email</IonLabel>
        <IonInput 
        value={email}
        onIonChange={(e)=>setEmail(e.detail.value)} 
        placeholder='Email' 
        type="email"></IonInput>
        
      </IonItem>
      <IonItem>
        <IonLabel position="floating">Phone Number</IonLabel>
        <IonInput 
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
