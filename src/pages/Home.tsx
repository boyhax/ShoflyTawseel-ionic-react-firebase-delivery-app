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
import AddOrder from '../components/AddOrder';
import CreateProfile from './CreatProfile';
const Tab1= () => {
  const {user,profile}= useGlobals()
  const history = useHistory()

const [addOrder,setAddOrder] = useState(false)
  const onSignIn =()=>{("/SignIn")}
  function onAddOrder(){
    setAddOrder(!addOrder)
  }
  // if(user && !profile){
  //   return<CreateProfile></CreateProfile>
  // }
    return (
    <IonPage>
           

      <IonHeader >
       
        <IonToolbar color="secondary">
        <IonTitle slot='primary'>ShoflyTawseel</IonTitle>
    <IonButtons slot="end">
    <IonButton onClick={()=>history.push("/Profile")}>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      {/* <IonButton color="danger">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton> */}
    </IonButtons>
  </IonToolbar>
      </IonHeader>
      <IonContent>
      
        
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
          <AddOrder isOpen={addOrder} setOpen={(v)=>setAddOrder(v)}/>

      </IonContent>
      <IonFab vertical="bottom" horizontal="start" slot="float">
      <IonFabButton onClick={(e)=>{onAddOrder()}}>
        <IonIcon icon={add} />
      </IonFabButton>
    </IonFab>
    </IonPage>
  );
};

export default Tab1;



