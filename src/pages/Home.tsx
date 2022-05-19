import React, { useEffect, useRef, useState } from 'react';
import { IonAlert, IonAvatar,IonRefresher, IonRefresherContent, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRouterLink, IonSlide, IonSlides, IonText, IonTitle, IonToolbar, IonSpinner } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';
import { add, ellipsisHorizontal, ellipsisVertical, logoFacebook, logoInstagram, logoTwitter, logoVimeo, personCircle, pulse, search, share } from 'ionicons/icons';
import {getDocs,collection,getFirestore, query, limit} from "firebase/firestore"
import OrderCard,{OrderProps} from '../components/OrderCard';
import { RefresherEventDetail } from '@ionic/core';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import OrderList from '../components/OrderList';
const Tab1= () => {
  
  const history = useHistory()


  const onSignIn =()=>{("/SignIn")}
    return (
    <IonPage>
           

      <IonHeader >
        {/* <IonToolbar>
          <IonTitle slot='start'>ShoflyTawseel</IonTitle>
          <IonIcon slot='end'size="large" color='blue' icon={personCircle} ></IonIcon>
        </IonToolbar> */}
        <IonToolbar color="secondary">
    <IonButtons slot="secondary">
      <IonButton href='/Profile'>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      {/* <IonButton onClick={onSignIn}>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton> */}
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="danger">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonTitle>ShoflyTawseel</IonTitle>
  </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar slot="start">
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <OrderList></OrderList>
        
  {/* <IonSlides pager={true} options={{
  initialSlide: 1,
  speed: 400,
}}>
      <IonSlide>
        <IonTitle>Slide 1</IonTitle>
      </IonSlide>
      <IonSlide>
        <IonTitle>Slide 2</IonTitle>
      </IonSlide>
      <IonSlide>
        <IonTitle>Slide 3</IonTitle>
      </IonSlide>
    </IonSlides> */}
          

      </IonContent>
      <IonFab vertical="bottom" horizontal="start" slot="float">
      <IonFabButton onClick={(e)=>{history.push("/SignIn")}}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
    </IonPage>
  );
};

export default Tab1;



