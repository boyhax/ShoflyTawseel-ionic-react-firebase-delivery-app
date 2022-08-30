import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonCardContent, IonCardTitle, IonTitle, IonBadge, IonText, IonRow, IonGrid, IonCol, IonChip, IonIcon, IonButton, IonBreadcrumb, IonPopover, IonModal, IonTextarea, IonSpinner} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { doc, getDoc, getFirestore, } from "firebase/firestore";
import { chatboxEllipsesOutline, logoWhatsapp, alertCircle, removeCircle, send, trashBinOutline, trashOutline, thumbsDownOutline, thumbsUpOutline } from "ionicons/icons";
import React, { useRef, useState } from "react";
import { applyForCard, deleteOrder, is_user_applied_to_card, orderProps, removeApplicationToOrder, reportOrder } from "../providers/firebaseMain";
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
    var date =!!order.time? new Date(order.time.seconds!*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(order.time.seconds*1000).toLocaleTimeString():null
    const comment = typeof order.comment! =="string"?order.comment:"no comment"
    const popOver = useRef<any>(null)
    const [reporting,setReporting]=useState(false)
    const [reportWhy,setReportWhy]=useState<undefined|string>(undefined)
    const uid= getAuth().currentUser?.uid
    const [userApplied,setApplied] = useState<boolean|undefined>(order.appliedUsers?is_user_applied_to_card(uid!,order):false)
    

    const toggleComment=()=>{
        popOver.current!.present()
    }
    async function _applyToOrder(){
        if(!uid){
            alert("يرجى تسجيل الدخول اولا")
            return
        }
        setApplied(undefined)
        if(!userApplied){
            applyForCard(uid!,order.id!).finally(()=>{
                setApplied(true)
            })
        }else{
            removeApplicationToOrder(uid!,order.id!).finally(()=>{
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
return<IonCard className="card row" >
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
    <IonChip className="BoldText" color="secondary">{order.name}</IonChip>
    <IonChip className="BoldText" color="secondary">{"من: "+order.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+order.to}</IonChip>
    {order.appliedUsers && <IonChip className="BoldText" color="secondary">{"قبول الطلب: "+order.appliedUsers.length}</IonChip>
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
    {/* {message &&<IonButton onClick={()=>SendSMSMessage(order.number,"السلام عليكم هل تحتاج مندوب توصيل ")} color="light" shape="round" >
        <IonIcon size="large" color="success" icon={chatboxEllipsesOutline} ></IonIcon>
    </IonButton>}
    {whatsapp && <IonButton  onClick={()=>OpenWhatsapp(order.number)} color="light" shape="round" ><IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
    </IonButton>} */}
    {canApplyFor && <IonButton  onClick={()=>{_applyToOrder()}} color="light" shape="round" >
        {userApplied!==undefined && <IonIcon 
        size="large" 
        color="success" 
        icon={ userApplied?thumbsDownOutline:thumbsUpOutline} ></IonIcon>}
        {userApplied===undefined && <IonSpinner></IonSpinner>}
    </IonButton>}
    { remove && <IonButton  onClick={()=>{deleteOrder(order);
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