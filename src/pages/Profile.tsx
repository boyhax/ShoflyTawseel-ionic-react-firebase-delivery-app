import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonRouterLink, IonInput, IonLabel, IonItem, IonCard, IonCardContent } from '@ionic/react';
import { ellipsisVertical, personCircle, searchCircle } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
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
      <IonContent className='center' >
        {!!user && <IonTitle>profile</IonTitle>}
        {!!user && <IonButton onClick={()=>{auth.signOut();setProfile(undefined)}}><IonTitle>تسجيل الخروج</IonTitle></IonButton>}
        {user && profile===undefined && <IonCard className='profileCard'><IonItem >يجب ان تضيف معلومات حسابك</IonItem>
        <ProfileEdit></ProfileEdit></IonCard>}

        {!user && <IonContent><IonButton href='/SignIn'>SignIn first Please</IonButton></IonContent>}
      </IonContent>
      <IonTitle>{JSON.stringify(profile)}</IonTitle>
      
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
  return<IonCardContent>edit profile</IonCardContent>
}