import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonButtons, IonLabel, IonItem, IonList, IonSpinner, IonBackButton, IonSegment, IonSegmentButton, IonGrid, IonRow, IonAvatar, IonImg, IonHeader } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, DocumentData, DocumentSnapshot, getDoc, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import OrderCard from '../components/OrderCard';
import { useHistory, useParams } from 'react-router';
import { getProfile } from '../providers/firebaseMain';


 const ProfileID: React.FC = (props) => {
    const[userProfile,setUserProfile] = useState<any>(null)
    const [content,setContent]=useState<"orders"|"deliver"|"editProfile">("orders")
    const [pickAvatar,setPickAvatar] = useState(false)
    const parms:any = useParams()
    const id = parms.id
    const history =useHistory()
    const uid = id
    useEffect(()=>{
      getProfile(id).then((snap)=>{
        snap.exists()?setUserProfile(snap.data()):setUserProfile(undefined)
      })
  },[]);
  
   
    
    return (
    <IonPage >
      
      <IonHeader>
      <IonItem>
          <IonGrid >
            <IonRow>
              <IonRow>
                <IonAvatar>
                    <IonImg src={
                      !!userProfile.photoURL?userProfile.photoURL
                        :require("../assets/avatarPlaceHolder.png")}>
                      
                  </IonImg>
                  </IonAvatar>
                  <IonTitle>{userProfile.name}</IonTitle>

              </IonRow>
              </IonRow>
          </IonGrid>
          <IonBackButton defaultHref='/'></IonBackButton>

        </IonItem>
        </IonHeader>
      {content !=="editProfile" &&<IonSegment  value={content}>
        <IonSegmentButton value="orders" onClick={()=>setContent('orders')}>
          <IonLabel>orders</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="deliver" onClick={()=>setContent('deliver')}>
          <IonLabel>deliver</IonLabel>
        </IonSegmentButton>
      </IonSegment>}

      

   
      
      {!!userProfile && content ==="deliver"&& 
          <IonContent>
            {/* <ProfileApplicationsList uid={uid}/> */}
        </IonContent>}
      
    </IonPage>
  );
};

export default ProfileID
