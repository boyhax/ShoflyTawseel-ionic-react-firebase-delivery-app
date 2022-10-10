import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonContent ,IonChip, IonIcon, IonButton, IonPopover, IonTextarea, IonSpinner, IonCardHeader, IonTitle, IonBadge, IonFab, IonFabButton, IonItem, IonAvatar, IonImg, IonRow, IonCol, IonThumbnail} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { doc, DocumentData, DocumentSnapshot, getFirestore, onSnapshot, } from "firebase/firestore";
import {  alertCircle, trashOutline, thumbsDownOutline, thumbsUpOutline, chatboxEllipsesOutline, logoWhatsapp, chatboxEllipses, handRightOutline } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../App";
import { applyForCard, deleteOrder, getUserInfoPlaceHolder, hands_up, is_user_applied_to_card, makeOrderFromDoc, orderProps, removeApplicationToOrder, reportOrder, userInfo } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import "./OrderCard.css"
import { TT } from "./utlis/tt";
const options:Object = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

interface props extends ComponentProps{
orderDocSnap:DocumentSnapshot<DocumentData>
whatsapp?:any,
message?:any,
remove?:any,
report?:any,
canApplyFor?:any
onDeleted?:()=>void,
onRefresh?:()=>void,
}
export var Currentplatform = "web";
Device.getInfo().then((v)=>{
Currentplatform = v.platform
})
const SendSMSMessage = (phoneNumber:String, message:String) => {
    const separator = Currentplatform=='ios' ? '&' : '?'
    const url = `sms:${phoneNumber}${separator}body=${message}`
    window.open(url)
}
const OpenWhatsapp=(number:any)=>{
    window.open("http://wa.me/"+number)
}

export default ({orderDocSnap,whatsapp,message,remove,report,canApplyFor,onDeleted,onRefresh}:props)=>{
    const [data,setData] = useState<orderProps>(makeOrderFromDoc(orderDocSnap))
    var date =!!data.time? new Date(data.time.seconds!*1000).toLocaleDateString("ar-om",options) + ' في ' + new Date(data.time.seconds*1000).toLocaleTimeString():null
    const comment = typeof data.comment! =="string"?data.comment:"no comment"
    const popOver = useRef<any>(null)
    const [reporting,setReporting]=useState(false)
    const [reportWhy,setReportWhy]=useState<undefined|string>(undefined)
    const uid= getAuth().currentUser?.uid
    const {user,profile} = useGlobals()
    const [userApplied,setApplied] = useState<boolean|undefined>(is_user_applied_to_card(uid!,data))
    const history=useHistory()
    const owner = data!.uid == uid
    const [userInfo,setUserInfo] = useState<userInfo>(getUserInfoPlaceHolder())
    
    useEffect(()=>{

        const unsub = onSnapshot(doc(getFirestore(),"orders/"+data.id),(doc)=>{
            let d= makeOrderFromDoc(doc)
            setData(d)
            setApplied(is_user_applied_to_card(uid!,d))

         }
        )
        var unsub2 = ()=>{}
        if(data.uid === uid && profile){
            setUserInfo({
                name:profile.name,
                photoURL:profile.photoURL,
                phoneNumber:profile.phoneNumber
            })
        }else{
           
            unsub2 = onSnapshot(doc(db,"users",data.uid),(doc)=>{
                let d:userInfo={
                    name:doc.data()!.name,
                    phoneNumber:doc.data()!.phoneNumber,
                    photoURL:doc.data()!.photoURL!,
                } 
                setUserInfo(d)
                
            })
        }
        
        return ()=>{
            unsub();
            unsub2();
    }},[])
    
    const toggleComment=()=>{
        popOver.current!.present()
    }
    async function _applyToOrder(){
        if(!user){
            alert("يرجى تسجيل الدخول اولا")
            return
        }
        if(!userApplied){
            applyForCard(uid!,data.id!,data.uid!)
            setApplied(undefined)
        }else{
            const info = data.applications.find((value)=>{return value.byUser ===uid})
            if(info){
                removeApplicationToOrder(info,orderDocSnap)
                setApplied(undefined)
            }else{
                console.log("no application found on order ")
            }
        }
    }
    function onReport(){
        reportOrder(data,reportWhy)
        if(onRefresh){
            onRefresh()
            console.log("message")
        }

    }
    // console.log(userInfo)
return<IonCard className="card" color="tertiary" >
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

    <div className="content" >
        
        <IonRow>
            <IonAvatar>
                <IonImg
                src={userInfo.photoURL}>
                </IonImg>
            </IonAvatar>
            <IonCol>
            <IonLabel  color="secondary" style={{fontSize: 20}}>{userInfo.name}</IonLabel>
            <IonLabel  color="secondary" position="fixed" style={{fontSize: 'small',margin: "5%"}}>
                {date}
            </IonLabel>
            </IonCol>
            
        </IonRow>
    
    <IonChip className="BoldText" color="secondary">{"من: "+data.from}</IonChip>
    <IonChip className="BoldText" color="secondary">{"الى: "+data.to}</IonChip>
    
     {/* <IonChip 
     className="BoldText" 
     color="secondary"
     onClick={()=>{
        if(owner){
            history.push("/profile")
        }
     }}>
        {"قبول الطلب: "}
         {data.applications.length}        
    </IonChip> */}
        
    
    <IonChip className="BoldText" color="secondary"
    onClick={()=>toggleComment()}>
        <IonPopover ref={popOver} >
        <IonContent >{comment?comment:TT("no comment")}</IonContent></IonPopover>
        {"الوصف: "+comment.slice(0,10)+"..."}
        </IonChip>

    
    </div>

    <IonItem >
        <IonRow>

        
    
    {!owner && !!data.number && 
        <IonButton  
        onClick={()=>OpenWhatsapp(data.number)} 
        color="light" shape="round" fill="clear" size="small">
        <IonIcon size="large" color="success" icon={logoWhatsapp} ></IonIcon>
        </IonButton>}
    {!owner && 
        <IonButton  
        onClick={()=>{_applyToOrder()}} 
        color="dark" 
        fill="clear" >
        {userApplied!==undefined && 
        <IonIcon 
            color="success" 
            icon={ userApplied?thumbsDownOutline:thumbsUpOutline} ></IonIcon>}
        {userApplied===undefined && <IonSpinner></IonSpinner>}
        {userApplied!==undefined? userApplied?"un accept":"accept":""}
    </IonButton>}
    { owner && <IonButton  onClick={()=>{deleteOrder(data);
        if(typeof onDeleted =="function")
        {onDeleted()}
        }} 
        color="light" shape="round" >
        <IonIcon size="large" color="success" icon={trashOutline} ></IonIcon>
    </IonButton>}
    { !owner && <IonButton fill="clear"  onClick={()=>setReporting(!reporting)} 
        color="dark" shape="round" >
        <IonIcon size="large" color="success" icon={alertCircle} ></IonIcon>
        إبلاغ
        </IonButton>}
        { !owner && <IonButton fill="clear"  onClick={()=>history.push("/chats/"+data.uid)} 
        color="dark" shape="round" >
        <IonIcon size="large" color="success" icon={chatboxEllipses} ></IonIcon>
        chat
        </IonButton>}
        {<IonButton fill="clear"  onClick={()=>{if(owner){history.push("/profile")}}} 
        color="dark" shape="round" >
        
        <IonIcon icon={handRightOutline}></IonIcon>
        
        <IonBadge slot="start">{data.applications.length}</IonBadge>
        </IonButton>}
        
        </IonRow>
    </IonItem>
    </IonCard>
    
}