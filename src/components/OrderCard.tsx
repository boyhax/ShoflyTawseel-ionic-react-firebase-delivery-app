import { ComponentProps, isPlatform } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonCardContent, IonCardTitle, IonTitle, IonBadge, IonText, IonRow, IonGrid, IonCol, IonChip, IonIcon, IonButton} from "@ionic/react";
import { doc, getDoc, getFirestore, } from "firebase/firestore";
import { chatboxEllipsesOutline, logoWhatsapp, alertCircle, removeCircle, send, trashBinOutline, trashOutline } from "ionicons/icons";
import React from "react";
import { deleteOrder, reportOrder } from "../providers/firebaseMain";
import "./OrderCard.css"
const options:Object = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

export type OrderProps={
id:string,
name:string,
from:string,
to:string,
uid:string,
number:string,
time: {seconds:1,nanoSecounds:1},
reports?:String[],
reportsCounts?:Number,
comment:string
}
interface props extends ComponentProps{
values:  OrderProps,
whatsapp?:any,
message?:any,
remove?:any,
report?:any,
onDeleted?:()=>void,

}
const SendSMSMessage = (phoneNumber:String, message:String) => {
    const separator = 'ios' ? '&' : '?'
    const url = `sms:${phoneNumber}${separator}body=${message}`
    window.open(url)
}
const OpenWhatsapp=(number:any)=>{
    window.open("http://wa.me/"+number)
}
export default ({values,whatsapp,message,remove,report,onDeleted}:props)=>{
    var date =!!values.time? new Date(values.time.seconds*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(values.time.seconds*1000).toLocaleTimeString():null
    
return<IonCard className="card row" >
    <div><IonChip className="BoldText" color="primary">{values.name}</IonChip>
    <IonChip className="BoldText" color="secondary">{"من: "+values.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+values.to}</IonChip>
    <IonChip className="BoldText" color="secondary">
        {"الوصف: "+values.comment.slice(0, 30)+"..."}
        </IonChip>

    <IonChip >{date}</IonChip>
    </div>
    <div>
    {message &&<IonButton onClick={()=>SendSMSMessage(values.number,"السلام عليكم هل تحتاج مندوب توصيل ")} color="light" shape="round" >
        <IonIcon size="large" color="success" icon={chatboxEllipsesOutline} ></IonIcon>
    </IonButton>}
    {whatsapp && <IonButton  onClick={()=>OpenWhatsapp(values.number)} color="light" shape="round" ><IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>}
    { remove && <IonButton  onClick={()=>deleteOrder(values)} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={trashOutline} ></IonIcon>
    </IonButton>}
    { report && <IonButton  onClick={()=>reportOrder(values,()=>onDeleted)} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={alertCircle} ></IonIcon>
    </IonButton>}
    
    </div>
    </IonCard>
    
}