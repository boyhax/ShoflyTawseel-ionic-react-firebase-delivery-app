import React, { useEffect, useRef, useState } from 'react';
import { IonAlert, IonAvatar, IonBackButton, IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonItem, IonLabel, IonList, IonPage, IonRouterLink, IonSlide, IonSlides, IonText, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { ellipsisHorizontal, ellipsisVertical, logoFacebook, logoInstagram, logoTwitter, logoVimeo, personCircle, search, share } from 'ionicons/icons';
import {getDocs,collection,getFirestore, query, limit} from "firebase/firestore"
import OrderCard,{OrderProps} from '../components/OrderCard';
const Tab1= () => {
  const [list,setList]=useState<null|typeof OrderProps[]>(null)
  useEffect(()=>{
    getData();
  },[])
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
    return (
    <IonPage>
      <IonHeader >
        <IonToolbar>
        <IonButtons slot="start">
          <IonBackButton />
        </IonButtons>
          <IonTitle slot='start'>ShoflyTawseel</IonTitle>
          <IonTitle slot='start'>Profile</IonTitle>
          
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar slot="start">
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
          {!!list && <IonList>{list.map((v,i)=>{
            return <IonItem key={i}><OrderCard values={v}></OrderCard></IonItem>})}</IonList>}
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon icon={share} />
          </IonFabButton>
          <IonFabList side="top">
          <IonFabButton><IonIcon icon={logoTwitter} /></IonFabButton>
          <IonFabButton><IonIcon icon={logoInstagram} /></IonFabButton>
          </IonFabList>
        </IonFab>
        <IonButton href="/tab3">go tab 3</IonButton>
        <IonToolbar color="secondary">
    <IonButtons slot="secondary">
      <IonButton href='/tab2'>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      <IonButton>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton>
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="danger">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonTitle>Dark Toolbar</IonTitle>
  </IonToolbar>
  <IonSlides pager={true} options={{
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
    </IonSlides>
          

      </IonContent>
    </IonPage>
  );
};

export default Tab1;



