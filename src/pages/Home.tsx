import React, { useState } from 'react';
import { IonButton, IonButtons, IonContent, IonFab, IonFabButton,
   IonHeader, IonIcon, IonLabel, IonPage,
     IonTitle,
     IonToolbar } from '@ionic/react';
import './Home.css';
import { add, informationCircle, personCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import OrderList from '../components/OrderList';
import AddOrder from '../components/AddOrder';
const Tab1= () => {
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  function onAddOrder(){
    setAddOrder(!addOrder)
  }
  
    return (
    <IonPage>
      <IonHeader >
        <IonToolbar color="secondary">
        <IonTitle slot='start' onClick={()=>history.push("/home")}>ShoflyTawseel</IonTitle>
    <IonButtons slot="end">
    <IonLabel>{user?profile?profile.name!:profile==undefined?"signing in..":"":""}</IonLabel>
    <IonButton onClick={()=>history.push("/Profile")}>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      <IonButton onClick={()=>history.push("/details")}>
        <IonIcon slot="icon-only" icon={informationCircle} />
      </IonButton>
    </IonButtons>
  </IonToolbar>
      </IonHeader>
      <IonContent>
        <OrderList></OrderList>
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



