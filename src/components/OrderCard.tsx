import { ComponentProps, isPlatform } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonCardContent, IonCardTitle, IonTitle, IonBadge, IonText, IonRow, IonGrid, IonCol, IonChip, IonIcon, IonButton} from "@ionic/react";
import { doc, getDoc, getFirestore, } from "firebase/firestore";
import { chatboxEllipsesOutline, logoWhatsapp, send } from "ionicons/icons";
import React from "react";
import "./OrderCard.css"
const options:Object = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export type OrderProps={
id:string,
name:string,
from:string,
to:string,
uid:string,
number:string,
time: {seconds:1,nanoSecounds:1}
}
interface props extends ComponentProps{
values:  OrderProps
}
const SendSMSMessage = (phoneNumber:String, message:String) => {
    const separator = 'ios' ? '&' : '?'
    const url = `sms:${phoneNumber}${separator}body=${message}`
    window.open(url)
}
const OpenWhatsapp=(number:any)=>{
    window.open("http://wa.me/"+number)
}
export default ({values}:props)=>{
    var date =!!values.time? new Date(values.time.seconds*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(values.time.seconds*1000).toLocaleTimeString():null
    
return<IonCard className="card" >
    
    <IonChip className="BoldText" color="primary">{values.name}</IonChip>
    <IonChip className="BoldText" color="secondary">{"من: "+values.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+values.to}</IonChip>
    <IonChip >{date}</IonChip>
    <IonButton onClick={()=>SendSMSMessage(values.number,"السلام عليكم هل تحتاج مندوب توصيل ")} color="light" shape="round" >
        <IonIcon size="large" color="success" icon={chatboxEllipsesOutline} ></IonIcon>
    </IonButton>
    <IonButton  onClick={()=>OpenWhatsapp(values.number)} color="light" shape="round" ><IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>
    </IonCard>
    
}