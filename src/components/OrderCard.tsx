import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonChip, IonIcon, IonButton, IonPopover, IonTextarea, IonSpinner} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { doc, getFirestore, onSnapshot, } from "firebase/firestore";
import {  alertCircle, trashOutline, thumbsDownOutline, thumbsUpOutline, chatboxEllipsesOutline, logoWhatsapp } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { applyForCard, deleteOrder, is_user_applied_to_card, orderProps, removeApplicationToOrder, reportOrder } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import "./OrderCard.css"
const options:Object = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

interface props extends ComponentProps{
order: orderProps ,
whatsapp?:any,
message?:any,
remove?:any,
report?:any,
canApplyFor?:any
onDeleted?:()=>void,
onRefresh?:()=>void
}
const SendSMSMessage = (phoneNumber:String, message:String) => {
    const separator = 'ios' ? '&' : '?'
    const url = `sms:${phoneNumber}${separator}body=${message}`
    window.open(url)
}
const OpenWhatsapp=(number:any)=>{
    window.open("http://wa.me/"+number)
}
export default ({order,whatsapp,message,remove,report,canApplyFor,onDeleted,onRefresh}:props)=>{
    const [data,setData] = useState<any>(order)
    var date =!!data.time? new Date(data.time.seconds!*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(data.time.seconds*1000).toLocaleTimeString():null
    const comment = typeof data.comment! =="string"?data.comment:"no comment"
    const popOver = useRef<any>(null)
    const [reporting,setReporting]=useState(false)
    const [reportWhy,setReportWhy]=useState<undefined|string>(undefined)
    const uid= getAuth().currentUser?.uid
    const {user} = useGlobals()
    const [userApplied,setApplied] = useState<boolean|undefined>(data.appliedUsers?is_user_applied_to_card(uid!,data):false)
    useEffect(()=>{
        const unsub = onSnapshot(doc(getFirestore(),"orders/"+data.id),(doc)=>{
            setData(doc.data())
        })
        return unsub
    })
    const toggleComment=()=>{
        popOver.current!.present()
    }
    async function _applyToOrder(){
        if(!user){
            alert("يرجى تسجيل الدخول اولا")
            return
        }
        setApplied(undefined)
        if(!userApplied){
            applyForCard(uid!,data.id!).finally(()=>{
                setApplied(true)
            })
        }else{
            removeApplicationToOrder(uid!,data.id!).finally(()=>{
                setApplied(false)
            })
        }
    }
    function onReport(){
        reportOrder(order,reportWhy)
        if(onRefresh){
            onRefresh()
            console.log("message")
        }

    }
return<IonCard className="card row" color="tertiary">
    <IonPopover isOpen={reporting}>
        <IonLabel slot="primary">اذكر السبب</IonLabel>
        <IonTextarea onIonChange={(e)=>{
            setReportWhy(e.detail.value!)
        }}>

        </IonTextarea>
        <IonButton onClick={(e)=>{
            setReporting(false);
            onReport()
        }}>submit</IonButton>
    </IonPopover>
    <div >
    <IonChip className="BoldText" color="secondary">{data.name}</IonChip>
    <IonChip className="BoldText" color="secondary">{"من: "+data.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+data.to}</IonChip>
    {data.appliedUsers && <IonChip className="BoldText" color="secondary">{"قبول الطلب: "+data.appliedUsers.length}</IonChip>
}
    <IonChip className="BoldText" color="secondary"
    onClick={()=>toggleComment()}>
        <IonPopover ref={popOver} >
        <IonContent >{comment}</IonContent></IonPopover>
        {"الوصف: "+comment.slice(0,10)+"..."}
        </IonChip>

    <IonChip >{date}</IonChip>
    </div>
    <div className="iconsContainer">
    {message &&
        <IonButton 
            onClick={()=>
                SendSMSMessage(order.number,"السلام عليكم هل تحتاج مندوب توصيل ")} 
            color="light" shape="round" >
        <IonIcon size="large" 
        color="success" 
        icon={chatboxEllipsesOutline} >
        </IonIcon>
    </IonButton>}
    {whatsapp && <IonButton  
    onClick={()=>OpenWhatsapp(order.number)} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>}
    {canApplyFor && 
    <IonButton  
        onClick={()=>{_applyToOrder()}} 
        color="light" 
        shape="round" >
        {userApplied!==undefined && <IonIcon 
            size="large" 
            color="success" 
            icon={ userApplied?thumbsDownOutline:thumbsUpOutline} ></IonIcon>}
        {userApplied===undefined && <IonSpinner></IonSpinner>}
    </IonButton>}
    { remove && <IonButton  onClick={()=>{deleteOrder(data);
    if(typeof onDeleted =="function")
    {onDeleted()}
}} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={trashOutline} ></IonIcon>
    </IonButton>}
    { report && <IonButton  onClick={()=>setReporting(!reporting)} 
    color="light" shape="round" >
        <IonIcon size="large" color="success" icon={alertCircle} ></IonIcon>
    
    إبلاغ</IonButton>}
    
    </div>
    </IonCard>
    
}