import React, { useRef, useState } from 'react';
import { IonAvatar, IonButton, IonButtons, IonContent, IonFab, IonFabButton,
   IonHeader, IonIcon, IonPage,
     IonTitle,
     IonToolbar } from '@ionic/react';
import './Home.css';
import { add, menuOutline, personCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import OrderList from '../components/OrderList';
import AddOrder from '../components/AddOrder';
import MainMenu from '../components/MainMenu';
const Tab1= () => {
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  const menuRef = useRef<any>()
  function onAddOrder(){
    setAddOrder(!addOrder)
  }
  function toggleMenu(){
    menuRef.current?.toggle()
  }
  
    return (
    <IonPage>
      <MainMenu menuRef={menuRef}></MainMenu>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle slot='primary' onClick={()=>history.push("/home")}>ShoflyTawseel</IonTitle>
          <IonButtons slot="start">            
            <IonButton onClick={()=>toggleMenu()}>
                <IonIcon slot="icon-only" icon={menuOutline} />
            </IonButton>
            <IonButton onClick={()=>history.push("/Profile")}>
              {user && profile ?profile.photoURL!==null?
              <IonAvatar>
                <img alt='user profile' src={profile.photoURL}></img>
              </IonAvatar>:
              <IonIcon slot="icon-only" icon={personCircle} />
              :<IonIcon slot="icon-only" icon={personCircle} />}
    
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



