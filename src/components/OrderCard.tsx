import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import { IonCard, IonLabel,IonChip, IonIcon, IonButton, IonPopover, IonTextarea, IonSpinner, IonTitle, IonAvatar, IonImg, IonRow, IonGrid, useIonAlert} from "@ionic/react";
import { getAuth } from "firebase/auth";
import { doc, DocumentData, DocumentSnapshot, getFirestore, onSnapshot, } from "firebase/firestore";
import {  alertCircle, trashOutline, thumbsDownOutline, thumbsUpOutline, logoWhatsapp, chatboxEllipses, arrowBackOutline } from "ionicons/icons";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { db } from "../App";
import { applyForCard, deleteOrder, getUserInfoPlaceHolder, is_user_applied_to_card, makeOrderFromDoc, orderProps, removeApplicationToOrder, reportOrder, userInfo } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import "./OrderCard.css"
const options:Object = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };

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

const OrderCard= ({orderDocSnap,whatsapp,message,remove,report,canApplyFor,onDeleted,onRefresh}:props)=>{
    const [data,setData] = useState<orderProps>(makeOrderFromDoc(orderDocSnap))
    const id = orderDocSnap.id
    var date =!!data.time? new Date(data.time.seconds!*1000).toLocaleDateString("ar-om",options) + ' ⏲ '
    + new Date(data.time.seconds*1000).toLocaleTimeString():null
    const comment = typeof data.comment! =="string"?data.comment:"no comment"
    const popOver = useRef<any>(null)
    const [reporting,setReporting]=useState(false)
    const [reportWhy,setReportWhy]=useState<undefined|string>(undefined)
    const uid= getAuth().currentUser?.uid
    const {user,profile,setCurrentOrder} = useGlobals()
    const [userApplied,setApplied] = useState<boolean|undefined>(is_user_applied_to_card(uid!,data))
    const history=useHistory()
    const owner = data!.uid == uid
    const [userInfo,setUserInfo] = useState<userInfo>(getUserInfoPlaceHolder())
    const [showComment,setShowComment] = useState(false)
    useEffect(()=>{

        const unsub = onSnapshot(doc(getFirestore(),"orders/"+id),(doc)=>{
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
        setShowComment(!showComment)
    }
    const [presentAlert] = useIonAlert()
    async function _applyToOrder(){
        if(!user){
            presentAlert({message:"يرجى تسجيل الدخول اولا"})
            return
        }
        if(!userApplied){
            applyForCard(uid!,id,data.uid!)
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
        reportOrder(orderDocSnap,reportWhy)
        if(onRefresh){
            onRefresh()
            console.log("message")
        }

    }
    // console.log(userInfo)
return<IonCard dir={'rtl'} style={{display: 'flex'}} >
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

    <IonGrid >
        
        <IonRow>
            <IonAvatar style={{width: '50px',height: '50px',display: 'flex'}} onClick={()=>history.push("/profile/"+data.uid)}>
                <IonImg
                src={userInfo.photoURL}>
                </IonImg>
            </IonAvatar>
            <IonTitle  color="secondary" 
            style={{fontSize: 'small',justifySelf: 'center',border: '5px',borderWidth: '2px',verticalAlign: 'middle'}}>{userInfo.name}</IonTitle>
            <IonLabel  color="secondary" position="fixed" 
            style={{fontSize: 'small',margin: "5%",fontDisplay: 'small'}}>
                {date}
            </IonLabel>
            
        </IonRow>
    <IonRow>

    <IonChip  color="secondary">{"من: "+data.from}</IonChip>
    <IonIcon color={'primary'} size={'large'} icon={arrowBackOutline}></IonIcon>
    <IonChip  color="secondary">{"الى: "+data.to}</IonChip>
    
    </IonRow>
     <IonChip 
     color="secondary"
     onClick={()=>{
        if(owner){
            setCurrentOrder(orderDocSnap)
            history.push("/OrdersPage/"+orderDocSnap.id+"/applications")
        }
     }}>
        {"تم قبول الطلب: "}
         {data.applications.length} 
    </IonChip>
        
    
    <IonChip  color="secondary"
    onClick={()=>toggleComment()}>
        {"الوصف: "+(showComment?comment:comment.slice(0,50)+"...")}
        </IonChip>

    
    </IonGrid>

    <div style={{display:'grid',alignContent:'end'}} >
    {!owner && !!userInfo.phoneNumber && 
        <IonButton  
        onClick={()=>OpenWhatsapp(userInfo.phoneNumber)} 
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
    { owner && <IonButton fill="clear" onClick={()=>{deleteOrder(orderDocSnap);
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
        {/* {<IonButton fill="clear"  onClick={()=>{if(owner){history.push("/profile")}}} 
        color="dark" shape="round" >
        
        <IonIcon icon={handRightOutline}></IonIcon>
        
        <IonBadge slot="start">{data.applications.length}</IonBadge>
        </IonButton>} */}
        
    </div>
    </IonCard>
    
}
export default OrderCard