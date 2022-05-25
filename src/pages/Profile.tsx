import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonRouterLink, IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonAccordionGroup, IonAccordion, IonList } from '@ionic/react';
import { ellipsisVertical, personCircle, searchCircle } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import "./Profile.css"

const Profile: React.FC = () => {
    const {user} = useGlobals()
    const[profile,setProfile] = useState<{}|undefined>(undefined)
    console.log(profile)
    const auth= getAuth()
    
    useEffect(()=>{
      if(user){
         getProfile(auth.currentUser!.uid,(p)=>{setProfile(p)})
      }
  },[user]);

    
    return (
    <IonPage >
      <IonHeader>
      <IonToolbar color="secondary">
    <IonButtons slot="primary">
    
      <IonButton color="danger">
        <IonIcon slot="icon-only" icon={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonRouterLink href='/home'><IonTitle color='light' >ShoflyTawseel</IonTitle></IonRouterLink>
    
  </IonToolbar>
      </IonHeader>
      
        {/* {!!user && <IonTitle>profile</IonTitle>} */}
        {!!user && <IonButton onClick={()=>{auth.signOut();setProfile(undefined)}}><IonTitle>تسجيل الخروج</IonTitle></IonButton>}
        

        {!user && <IonContent><IonButton href='/SignIn'>SignIn first Please</IonButton></IonContent>}
      {user && auth.currentUser?.displayName==="" && <IonCard className='profileCard'><IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined} >يجب ان تضيف معلومات حسابك</IonItem>
        </IonCard>}
        {user && <ProfileEdit></ProfileEdit>}
      
    </IonPage>
  );
};

export default Profile;
async function getProfile(uid:String,onValue:(profile:any)=>any) {
   const p =await getDoc(doc(getFirestore(),"users/"+uid)).then((v)=>{
     onValue(v.data())
   })
}
const ProfileEdit:React.FC=(props)=>{
  const auth= getAuth()
  const user = auth.currentUser

  return<IonAccordionGroup>
  <IonAccordion value="colors">
    <IonItem slot="header" fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}>
      <IonLabel>معلومات المستخدم</IonLabel>
    </IonItem>

    <IonList slot="content">
      <IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}>
        <IonLabel>الاسم</IonLabel>
        <IonInput placeholder='name' onIonChange={(e)=>{
          if(user !==null){
            updateProfile(user,{displayName:e.detail.value})
          }
        }} value={auth.currentUser?.displayName}></IonInput>
        <IonButton><IonLabel>حفظ</IonLabel></IonButton>
      </IonItem>
      <IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}>
        <IonLabel>الرقم</IonLabel>
        <IonLabel >{auth.currentUser?.phoneNumber}</IonLabel>
      </IonItem>
      
    </IonList>
  </IonAccordion></IonAccordionGroup>
}