import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonCardContent, IonCardTitle, IonTitle, IonBadge, IonText, IonRow, IonGrid, IonCol, IonChip, IonIcon, IonButton, IonBreadcrumb, IonPopover} from "@ionic/react";
import { doc, getDoc, getFirestore, } from "firebase/firestore";
import { chatboxEllipsesOutline, logoWhatsapp, alertCircle, removeCircle, send, trashBinOutline, trashOutline } from "ionicons/icons";
import React, { useRef } from "react";
import { deleteOrder, orderProps, reportOrder } from "../providers/firebaseMain";
import "./OrderCard.css"
const options:Object = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };


interface props extends ComponentProps{
order: orderProps ,
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
export default ({order,whatsapp,message,remove,report,onDeleted}:props)=>{
    var date =!!order.time? new Date(order.time.seconds!*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(order.time.seconds*1000).toLocaleTimeString():null
    const comment = typeof order.comment! =="string"?order.comment:"no comment"
    const popOver = useRef<any>(null)
    const toggleComment=()=>{
        popOver.current!.present()
    }
return<IonCard className="card row" >
    <div><IonChip className="BoldText" color="primary">{order.name}</IonChip>
    <IonChip className="BoldText" color="secondary">{"من: "+order.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+order.to}</IonChip>
    <IonChip className="BoldText" color="secondary"
    onClick={()=>toggleComment()}>
        <IonPopover ref={popOver}  
        >
        <IonText >{comment}</IonText></IonPopover>
        {"الوصف: "+comment.slice(0,5)+"..."}
        </IonChip>

    <IonChip >{date}</IonChip>
    </div>
    <div>
    {message &&<IonButton onClick={()=>SendSMSMessage(order.number,"السلام عليكم هل تحتاج مندوب توصيل ")} color="light" shape="round" >
        <IonIcon size="large" color="success" icon={chatboxEllipsesOutline} ></IonIcon>
    </IonButton>}
    {whatsapp && <IonButton  onClick={()=>OpenWhatsapp(order.number)} color="light" shape="round" ><IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>}
    { remove && <IonButton  onClick={()=>deleteOrder(order)} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={trashOutline} ></IonIcon>
    </IonButton>}
    { report && <IonButton  onClick={()=>reportOrder(order,()=>onDeleted)} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={alertCircle} ></IonIcon>
    </IonButton>}
    
    </div>
    </IonCard>
    
}