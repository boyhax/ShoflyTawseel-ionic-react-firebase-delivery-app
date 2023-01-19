import React, { useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonFab, IonFabButton, IonIcon, IonList, 
  IonRefresher, IonRefresherContent } from "@ionic/react";
import { addOutline } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import OrderCard from "./OrderCard";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserOrders from "../hooks/useUserOrders";
import { useHistory } from "react-router";


export default function UserOrdersList(props: any) {
  const [list, setList] = useState<DocumentSnapshot<any>[]>([])
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const orders = useUserOrders()
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
    {orders.orders &&

      orders.orders.docs.map((v: DocumentSnapshot, i: any) => {

        if (!v["exists"]) {
          return ''
        }
        return <OrderCard orderDocSnap={v} key={i} report canApplyFor onRefresh={() => Refresh()} onDeleted={() => { delete list[i]; setList(list) }}>
        </OrderCard>
      })
    }
    {orders.loading && !orders.orders && <OrdersPlaceHolder></OrdersPlaceHolder>}

   
    </IonList>

   
    
  </div>
}



