import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonRouterLink, IonInput, IonLabel } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import { ellipsisVertical, personCircle, searchCircle } from 'ionicons/icons';
import { Redirect } from 'react-router';
import { useGlobals } from '../providers/globalsProvider';
import { setuid } from 'process';
import { collection, doc, getDoc, getFirestore } from 'firebase/firestore';


const Profile: React.FC = () => {
    const{uid,setUid} = useGlobals()
    const[profile,setProfile] = useState<{}|null>(null)
    useEffect(()=>{
        if(uid>""){
            getProfile(uid)
        }
    },[])
    return (
    <IonPage>
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
      <IonContent>
        {profile && <IonContent>profile</IonContent>}
        {profile ==null && <IonContent><IonButton href='/SignIn'>SignIn first Please</IonButton></IonContent>}
<IonLabel>{profile}</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
async function getProfile(uid:String) {
    await getDoc(doc(getFirestore(),"users/"+uid)).then((v)=>{
        return v.data()
    },(err)=>{
        console.log(err)
    })
}