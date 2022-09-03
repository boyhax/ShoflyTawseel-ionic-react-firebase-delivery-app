import { ComponentProps } from "@ionic/core";
import { IonContent , IonTitle, IonHeader, IonToolbar, IonList, IonItem, IonMenu, IonButtons, IonButton, IonIcon, IonRippleEffect} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {  closeOutline,  } from "ionicons/icons";
import React, {   useEffect,  } from "react";
import { useHistory } from "react-router";
import { useGlobals } from "../providers/globalsProvider";
import "./MainMenu.css"

interface props extends ComponentProps{
    menuRef?:any
}

export default (Props:props)=>{
    const {user} = useGlobals()
    function close(){
        Props.menuRef.current.close()
    }
    useEffect(()=>{
        //  menu.current!.toggle()
    })
    const history = useHistory()
    const SignInButton = <IonButton onClick={()=>history.push("SignIn")}>Sign In</IonButton>
    const SignOutButton = <IonButton color="danger" onClick={()=>getAuth().signOut()} >Sign Out</IonButton>
    
return<IonMenu  side="start" ref={Props.menuRef} >
    <IonHeader>
        <IonToolbar color="danger" >
            <IonTitle slot="start">Menu</IonTitle>
            <IonButtons slot="end">
                <IonButton onClick={(e)=>close()}>
                    <IonIcon icon={closeOutline}></IonIcon>
                </IonButton>
            </IonButtons>
        </IonToolbar>
    </IonHeader>
    <IonContent >
        <IonList >
            
            <IonItem className="item" onClick={()=>history.push("Profile")}>Profile
            <IonRippleEffect></IonRippleEffect>
</IonItem>
            <IonItem className="item" onClick={()=>history.push("OrdersPage")}>My Orders
            <IonRippleEffect></IonRippleEffect>
</IonItem>
            {/* <IonItem onClick={()=>history.push("Settings")}>Settings</IonItem> */}
            <IonItem className="item" onClick={()=>history.push("Details")}>Info
            <IonRippleEffect></IonRippleEffect>
</IonItem>
            {user?SignOutButton:SignInButton}
        </IonList>
    </IonContent>
</IonMenu>
    
}