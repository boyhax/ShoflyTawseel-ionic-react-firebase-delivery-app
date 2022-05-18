import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonCardContent, IonCardTitle, IonTitle, IonBadge, IonText, IonRow, IonGrid, IonCol, IonChip, IonIcon, IonButton} from "@ionic/react";
import { logoWhatsapp } from "ionicons/icons";
import React from "react";
import "./OrderCard.css"
const options:Object = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export const OrderProps={
id:String,
name:String,
from:String,
to:String,
uid:String,
time: {seconds:1,nanoSecounds:1}
}
interface props extends ComponentProps{
values:typeof OrderProps
}
export default ({values}:props)=>{
    var date =!!values.time? new Date(values.time.seconds*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(values.time.seconds*1000).toLocaleTimeString():null
       
return<IonCard className="card" >
    
    <IonChip className="BoldText" color="primary">{values.name}</IonChip>
    <IonChip className="BoldText" color="secondary">{"من: "+values.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+values.to}</IonChip>
    <IonChip >{date}</IonChip>
    <IonButton onClick={()=>console.log("whatsapp")} color="light" shape="round" ><IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>
    <IonButton onClick={()=>console.log("whatsapp")} color="light" shape="round" ><IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>
    </IonCard>
    
}