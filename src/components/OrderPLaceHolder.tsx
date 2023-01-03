import React, { FunctionComponent, ReactComponentElement, useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonList, IonLoading, IonModal, IonPage, IonProgressBar, IonRefresher, IonRefresherContent, IonSpinner } from "@ionic/react";
import { filter as filterIcon } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import OrderCard from "./OrderCard";
import useOrders from "../hooks/useOrders";
import FilterUI from "./FilterUI";


export default function OrderPLaceHolder(props:any ):JSX.Element {
  const [list, setList] = useState<DocumentSnapshot<any>[]>([])
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [listMessage, setListMessage] = useState<any>(null)
  const {orders,loading,add,filter,reset,setFilter,update} = useOrders()
  const filterModal = useRef<any>()

  // orders.doFilter(filter.filter)

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');

    update(() => event.detail.complete())

  }

  function Refresh() {
    update(() => { })
  }
  function onEndRefresh(e: any) {
    add(10, () => e.target.complete())
  }



  const toggleFilterModal = (bo: boolean) => {
    bo ? filterModal.current.present() : filterModal.current.dismiss()
  }
  return <IonContent fullscreen={true}>
    <IonFab
     style={{ position: 'fixed' }}
     horizontal={'start'} vertical={'bottom'} >
      <IonFabButton onClick={() => toggleFilterModal(true)}>
        <IonIcon icon={filterIcon}></IonIcon>
      </IonFabButton>
    </IonFab>
    <IonModal ref={filterModal} id='filterModal' style={{ paddingRight: '70px', left: '0' }} >

      <IonContent  >
        <FilterUI onfilter={(v) => setFilter(v)} filter={filter}></FilterUI>
      </IonContent>

    </IonModal>

    {/* <IonList > */}
    <IonRefresher
      ref={IonRefresherElement}
      slot="fixed"
      onIonRefresh={doRefresh} >
      <IonRefresherContent
        refreshingText="refreshing..."></IonRefresherContent>
    </IonRefresher>
    {orders &&

      orders.map((v: DocumentSnapshot, i: any) => {

        if (!v["exists"]) {
          return ''
        }
        return <OrderCard orderDocSnap={v} key={i} report canApplyFor onRefresh={() => Refresh()} onDeleted={() => { delete list[i]; setList(list) }}>
        </OrderCard>
      })
    }
    <IonInfiniteScroll
      ref={infiniteScrollRef}
      onIonInfinite={onEndRefresh}
      threshold="100px"
      disabled={isInfiniteDisabled}>
      <IonInfiniteScrollContent
        loadingSpinner="dots"
        loadingText="بحث المزيد من الطلبات"
      ></IonInfiniteScrollContent>
    </IonInfiniteScroll>

    {/* </IonList> */}

    {!!listMessage && <IonItem style={{ display: "flex", flexDirection: "column" }}>
      <IonLabel color={listMessage.color}>{listMessage.text}</IonLabel>
      {/* <IonButton onClick={()=>{Refresh()}}>اعد المحاوله</IonButton> */}
      <IonLabel color="primary" onClick={(e) => {
        reset()
      }} >رجوع</IonLabel>

    </IonItem>
    }

  </IonContent>
}



