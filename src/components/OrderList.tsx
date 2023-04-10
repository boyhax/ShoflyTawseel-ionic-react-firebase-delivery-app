import React, { useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonButton, IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent } from "@ionic/react";
import { filter as filterIcon } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import OrderCard from "./OrderCard";
import useOrders from "../hooks/useOrders";
import FilterUI from "./FilterUI";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import { makeOrderFromDoc } from "../api/firebaseMain";
import { TT } from "./utlis/tt";


export default function OrderList(props: any) {
  const [list, setList] = useState<DocumentSnapshot<any>[]>([])
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [listMessage, setListMessage] = useState<any>(null)
  const orders = useOrders()


  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');

    orders.update(() => event.detail.complete())

  }

  function Refresh() {
    orders.update(() => { })
  }
  function onEndRefresh(e: any) {
    orders.add(10, () => e.target.complete())
    setTimeout(() => {
      e.target.complete()
    }, 2000);
  }



  
  return <div>
    <IonFab >
      <IonFabButton id='filterToggler'
      className={'ml-auto'}>
        <IonIcon icon={filterIcon}></IonIcon>
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

      orders.orders.map((v: DocumentSnapshot, i: any) => {

        if (!v["exists"]) {
          return ''
        }
        return <OrderCard order={makeOrderFromDoc(v)} key={i}  />
      })
    }
    {orders.loading && !orders.orders && <OrdersPlaceHolder></OrdersPlaceHolder>}

    <IonInfiniteScroll
      ref={infiniteScrollRef}
      onIonInfinite={onEndRefresh}
      threshold="100px"
      disabled={isInfiniteDisabled}>
      <IonInfiniteScrollContent
        loadingSpinner="dots"
        loadingText={TT('loading ..')}
      ></IonInfiniteScrollContent>
    </IonInfiniteScroll>

    </IonList>

    {/* {!orders.loading && !orders.orders && <IonItem style={{ display: "flex", flexDirection: "column" }}>
      <IonLabel color={listMessage.color}>{listMessage.text}</IonLabel>
      <IonButton onClick={()=>{Refresh()}}>اعد المحاوله</IonButton>
      <IonLabel color="primary" onClick={(e) => {
        orders.reset()
      }} >رجوع</IonLabel>

    </IonItem>
    } */}
    <IonModal keepContentsMounted trigger={'filterToggler'}  id='filterModal' style={{ paddingRight: '70px', left: '0' }} >

        <FilterUI onfilter={(v) => orders.setFilter(v)} filter={orders.filter}></FilterUI>

    </IonModal>
  </div>
}



