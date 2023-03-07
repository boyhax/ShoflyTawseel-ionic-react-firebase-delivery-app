import React, { useRef } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonFab, IonFabButton, IonIcon, IonList, 
  IonRefresher, IonRefresherContent, IonSkeletonText } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import OrderCard from "./OrderCard";
import { useHistory } from "react-router";
import { makeOrderFromDoc, userOrdersStore } from "../providers/firebaseMain";


export default function UserOrdersList(props: any) {
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const orders = userOrdersStore.useState(s=>s)
  const history = useHistory()

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');


  }

  function Refresh() {
  }
  function onEndRefresh(e: any) {
    setTimeout(() => {
      e.target.complete()
    }, 2000);
  }



  
  return <div>
    <IonFab  className={'fixed top-[10%] right-[5%] flex-row top-5  '}  >
      <IonFabButton id='filterToggler'
      className={'ml-auto'}
      onClick={()=>{history.push('addorder')}}
      >
        <IonIcon icon={addOutline}></IonIcon>
      </IonFabButton>
    </IonFab>


    <IonList  >

    <IonRefresher
      ref={IonRefresherElement}
      slot="fixed"
      onIonRefresh={doRefresh} >
      <IonRefresherContent
        refreshingText="refreshing..."></IonRefresherContent>
    </IonRefresher>
    {orders &&

      orders.map((v: DocumentSnapshot, i: any) => {

        if (!v.exists()) {
          return <div><IonSkeletonText></IonSkeletonText></div>
        }
        return <OrderCard order={makeOrderFromDoc(v)} key={v.id} />
      })
    }
    {/* {orders.loading && !orders.orders && <OrdersPlaceHolder></OrdersPlaceHolder>} */}

   
    </IonList>

   
    
  </div>
}



