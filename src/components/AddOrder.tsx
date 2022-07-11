import { IonAlert, IonButton, IonCard, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonText, IonTextarea, IonTitle, IonToolbar } from "@ionic/react";
import { getAuth } from "firebase/auth";
import { closeCircle } from "ionicons/icons";
import React, { FC, PropsWithChildren, useEffect, useState } from "react";
import { useHistory } from "react-router";
import { addNewTripCard } from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";



interface Props   {
    isOpen:boolean  ,
    setOpen:(v:boolean)=>void
} 

const AddOrder=({isOpen,setOpen}:Props)=>{
    const [from,setFrom]= useState<null|string>(null)
    const [to,setTo]= useState<null|string>(null)
    const [comment,setComment]= useState<null|string|undefined>(undefined)
    const [err,setErr]= useState<{message:string,color:"red"|"blue"}|undefined>(undefined)
    const [loading,setLoading]= useState(false)
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
            const newId = await addNewTripCard({
                from:from!,
                to:to!,
                number:auth.currentUser?.phoneNumber!,
                name:profile.name,
                uid:uid!,
                time:new Date(),
                flagged:false,
                comment:comment,
            })
            setErr({message:"تم أضافة الطلب",color:"blue"})
            setLoading(false)

        } catch (error) {
            console.log('error :>> ', error);
            setErr({message:"لم يتم أضافة الطلب بسبب عدم تسجيل دخولك ",color:"red"})
            setLoading(false)
        }
       
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
            onIonChange={(v)=>setComment(v.detail.value)} 
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