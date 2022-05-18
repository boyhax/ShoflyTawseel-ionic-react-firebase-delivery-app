import React, { useEffect, useRef, useState } from 'react';
import { IonAlert, IonAvatar,IonRefresher, IonRefresherContent, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRouterLink, IonSlide, IonSlides, IonText, IonTitle, IonToolbar, IonSpinner } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { add, ellipsisHorizontal, ellipsisVertical, logoFacebook, logoInstagram, logoTwitter, logoVimeo, personCircle, pulse, search, share } from 'ionicons/icons';
import {getDocs,collection,getFirestore, query, limit} from "firebase/firestore"
import OrderCard,{OrderProps} from '../components/OrderCard';
import { RefresherEventDetail } from '@ionic/core';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { setuid } from 'process';
const Tab1= () => {
  
  const [list,setList]=useState<null|typeof OrderProps[]>(null)
  useEffect(()=>{
    getData();
  },[])
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
    setTimeout(() => {
      console.log('Async operation has ended');
      event.detail.complete();
    }, 2000);
}   
  async function getData() {
  const col=collection(getFirestore(),"orders")
  const q = query(col,limit(10))
  const data = await getDocs(col)
  var newList:any[]=[]
  data.forEach((doc)=>{
    newList.push({id:doc.id,...doc.data()})
  })
  setList(newList)
  } 


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
        <IonRefresher slot="fixed" onIonRefresh={doRefresh} >
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>
          {!!list && <IonList className='list'>{list.map((v,i)=>{
            return <IonItem key={i}><OrderCard values={v}></OrderCard></IonItem>})}</IonList>}
        {!list && <IonSpinner name='lines' className='center'/>}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon icon={add} />
          </IonFabButton>
          
        </IonFab>
        
        
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
    </IonPage>
  );
};

export default Tab1;



