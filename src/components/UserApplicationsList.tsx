import React, { useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent } from "@ionic/react";
import { filter as filterIcon } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import OrderCard from "./OrderCard";
import useOrders from "../hooks/useOrders";
import FilterUI from "./FilterUI";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserOrders from "../hooks/useUserOrders";
import useUserApplications from "../hooks/useUserApplications";


export default function UserApplicationsList(props: any) {
  const [list, setList] = useState<DocumentSnapshot<any>[]>([])
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [listMessage, setListMessage] = useState<any>(null)
  const orders = useUserApplications()



  function Refresh() {
  }
  



  
  return <div>
    


    <IonList  >

    <IonRefresher
      ref={IonRefresherElement}
      slot="fixed"
      onIonRefresh={Refresh} >
      <IonRefresherContent
        refreshingText="refreshing..."></IonRefresherContent>
    </IonRefresher>
    {orders.userApplications &&

      orders.userApplications.docs.map((v: DocumentSnapshot, i: any) => {

        if (!v["exists"]) {
          return ''
        }
        return <OrderCard orderDocSnap={v} key={i} report canApplyFor onRefresh={() => Refresh()} onDeleted={() => { delete list[i]; setList(list) }}>
        </OrderCard>
      })
    }
    {orders.loading && !orders.userApplications && <OrdersPlaceHolder></OrdersPlaceHolder>}

    

    </IonList>

   
    
  </div>
}



