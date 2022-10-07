import { IonAlert, IonButton, IonCard, IonContent, IonIcon, IonItem, IonLabel, IonModal, IonSpinner, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { closeCircle } from "ionicons/icons";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { db } from "../App";
import { addNewTripCard, orderProps } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";
import MyMap from "./utlis/Map";



interface Props   {
    isOpen:boolean  ,
    setOpen:(v:boolean)=>void
} 

const AddOrder=({isOpen,setOpen}:Props)=>{
    const [from,setFrom]= useState<null|string>(null)
    const [to,setTo]= useState<null|string>(null)
    const [comment,setComment]= useState<string>("")
    const [err,setErr]= useState<{message:string,color:"red"|"blue"}|undefined>(undefined)
    const [loading,setLoading]= useState(false)
    const [map,setMap]= useState(false)
    const [location,setLocation]= useState<any>(null)

    const history = useHistory()
    const {profile,user} = useGlobals()
    const auth = getAuth()
    const uid = auth.currentUser?.uid
    
    function onAddPressed(){
        if(!user){
            console.log('profile name :>> ', profile);
            setErr({message:"يرجى تسجيل الدخول اولا",color:"red"}) 
            return           
        }
        from?
            to?
                addTrip()
                :setErr({message:"اضف الوجهه التي تريد ارسال الاغراظ لها",color:"red"})
        :setErr({message:"اضف الوجهه التي تريد ارسال الاغراظ منها",color:"red"})
    }
    async function addTrip(){
        setLoading(true)
        try {
            const newId = await addDoc(collection(db,"orders"),{})
            const newOrder:orderProps = {
                from:from!,
                to:to!,
                number:auth.currentUser?.phoneNumber!,
                uid:uid!,
                time:new Date(),
                comment:comment,
                applications:[],
                reports:[],
                id:newId.id,
            }
            await setDoc(doc(db,"orders",newId.id),newOrder)
            setErr({message:"تم أضافة الطلب",color:"blue"})
            setLoading(false)

        } catch (error) {
            console.log('error :>> ', error);
            setErr({message:"لم يتم أضافة الطلب بسبب عدم تسجيل دخولك ",color:"red"})
            setLoading(false)
        }
       
    }
    function showMap(){
        setMap(true)
    }
    return <IonModal isOpen={isOpen}>
        <IonAlert
          isOpen={!!err}
          onDidDismiss={() => setErr(undefined)}
          
        //   header={'Alert'}
        //   subHeader={'Subtitle'}
          message={err?.message}
          buttons={['OK']}

        />
        <IonContent>
            <IonToolbar>
                <IonButton onClick={(e)=>setOpen(false)}>أغلق
                    <IonIcon icon={closeCircle}></IonIcon>
                </IonButton>
            </IonToolbar>
            <IonTitle>يمكنك اضافه طلبك هنا</IonTitle>
            {!user && <IonLabel>بعد تسجيلك الدخول اولا</IonLabel>}
            {!user && <IonButton onClick={(e)=>{
                setOpen(false)
                history.push("/SignIn")}}>تسجيل الدخول</IonButton>}

            <IonItem>
                <ListPicker 
                data={Cities} 
                placeHolder={"من :"} 
                value={from} 
                onValueSet={(v)=>setFrom(v)}/>
                <IonButton onClick={()=>{showMap()}}>use location</IonButton>
                <IonModal isOpen={map}>
                    <IonButton onClick={()=>setMap(false)}>close</IonButton>
                    {/* <MyMap onLocationSet={((l)=>{setLocation(l)})}/> */}
                </IonModal>
                <IonLabel>{String(location)}</IonLabel>
            </IonItem>
            <IonItem>
                <ListPicker 
                data={Cities} 
                placeHolder={"الى :"} 
                value={to} 
                onValueSet={(v)=>setTo(v)}/>
            </IonItem>
            <IonCard>
                <IonLabel position='fixed'>ملاحضات</IonLabel>
            <IonTextarea
            
            style={{
                fontfamily:"baloo",
                direction:"rtl" ,
            }}
            spellCheck={true}
            maxlength={200}
            placeholder="اكتب ملاحضات عن اغراض التوصيل" 
            onIonChange={(v)=>setComment(v.detail.value?v.detail.value:"")} 
            debounce={5}></IonTextarea>
            </IonCard>
            {loading?
            <IonSpinner></IonSpinner>:
            <IonButton onClick={()=>onAddPressed()} >اضافه</IonButton>
        }
            </IonContent>
        
    </IonModal>
}
export default AddOrder