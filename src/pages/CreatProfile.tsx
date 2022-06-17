import React, { FC, useEffect, useState } from "react";
import { IonButton, IonContent, IonHeader, IonInput, IonItem, IonLabel, IonPage, IonTitle } from "@ionic/react";
import { createNewProfile, updateUserProfile } from "../providers/firebaseMain";
import { getAuth } from "firebase/auth";
import { useGlobals } from "../providers/globalsProvider";
import Input from "../components/Input";
import { useHistory } from "react-router";

 const CreateProfile:FC=(props)=>{
     const [name,setName]= useState<any>(null)
     const [phone,setPhone]= useState<any>(null)
     const [email,setEmail]= useState<any>(null)
     const {profile} = useGlobals()
     console.log('profile :>> ', profile);
     useEffect(()=>{
         console.log("message")
        if(profile !==null){
            history.push("/")
        }
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
             return 1
         }
        if(!profile){
            createNewProfile(getAuth().currentUser!.uid,{
                name:name,
                email:email,
                phone:phone
            }).then((value) => {
                goHome()

            })
        }else{
            updateUserProfile(getAuth().currentUser!.uid,{
                name:name,
                email:email,
                phone:phone
            }).then((value) => {
                goHome()
            })
        }
        
     }
     function goHome(){
        history.push("/")
     }
    return<IonPage>
        <IonHeader style={{height:50}}>
        <IonTitle >يجب كتابة معلومات حسابك</IonTitle>
        </IonHeader>
        <IonContent>
        <IonItem>
        <IonLabel>name</IonLabel>
        <IonInput onIonChange={(e)=>setName(e.detail.value)} placeholder='name'></IonInput>
        
      </IonItem>
      <IonItem>
        <IonLabel>Email</IonLabel>
        <IonInput onIonChange={(e)=>setEmail(e.detail.value)} placeholder='Email' type="email"></IonInput>
        
      </IonItem>
      <IonItem>
        <IonLabel>Phone Number</IonLabel>
        <IonInput onIonChange={(e)=>setPhone(e.detail.value)} placeholder='Number' type="number" maxlength={8}></IonInput>
        
      </IonItem>
      <Input onChange={(v)=>console.log('v :>> ', v)}  placeHolder="name" title="Name" check={(e)=>{return e=="t"?true:false}}></Input>
      <IonButton onClick={()=>onSave()} >Save Profile</IonButton>
        </IonContent>
      </IonPage>
  }
  export default CreateProfile