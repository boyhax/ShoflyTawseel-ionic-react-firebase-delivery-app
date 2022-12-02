import React, { useEffect, useRef, useState } from "react";

import { collection, getDocs, getFirestore, query, where, limit, orderBy, startAfter, DocumentSnapshot } from "firebase/firestore";
import { IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonRefresher, IonRefresherContent, IonSpinner } from "@ionic/react";
import { filter } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";
import { getAuth } from "firebase/auth";
import { intersection, orderFilter } from "../providers/firebaseMain";
import OrderCard from "./OrderCard";
import { useGlobals } from "../providers/globalsProvider";
import useOrders from "../hooks/useOrders";


export default function OrderList(props: any) {
  const [isMounted, setIsMounted] = useState(true)
  const [list, setList] = useState<DocumentSnapshot<any>[]>([])
  const [refreshing, setRefreshing] = useState(false)
  const [count, setCount] = useState(10)
  const [showFilter, setShowFilter] = useState(false)
  const [filterTo, setFilterTo] = useState<{ key: string, value: string }>()
  const [filterFrom, setFilterFrom] = useState<{ key: string, value: string }>()
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>()
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [lastDoc, setLastDoc] = useState<any>(null)
  const [listQ, setListQ] = useState<any>(null)
  const [listMessage, setListMessage] = useState<any>(null)
  const user = getAuth().currentUser
  const { profile } = useGlobals()
  const orders = useOrders()

  
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
    getNewList().finally(
      ()=>event.detail.complete()
    )
    orders.update(()=>event.detail.complete())

  }
  async function getNewList() {
    setRefreshing(true)
    const ref = collection(getFirestore(), "orders")
    var firstQuery = query(ref)
    firstQuery = query(firstQuery, orderBy("time", "desc"))


    if (filterFrom) {
      firstQuery = query(firstQuery, where("from", "==", filterFrom))
    }
    if (filterTo) {
      firstQuery = query(firstQuery, where("to", "==", filterTo))
    }

    try {
      firstQuery = query(firstQuery, limit(count))
      var finalQuery = firstQuery
      const snapshot = await getDocs(finalQuery)

      const docs = snapshot.docs
      const newLastDoc = docs[docs.length - 1]
      if (!isMounted) {
        return
      }
      if (!snapshot.empty) {
        setList(docs)
        setLastDoc(newLastDoc)
        setListQ(finalQuery)
      }
      if (snapshot.empty) {
        setList([])
        setLastDoc(null)
        setListMessage({ text: "لايوجد طلبات توصيل حاليا", color: "green" })
      } else {
        setListMessage(null)
        infiniteScrollRef.current!.complete()

      }
    } catch (error) {
      console.log('error :>> ', error);
    }
    if (isMounted) {
      setRefreshing(false)
      IonRefresherElement?.current?.complete()
      infiniteScrollRef.current!.complete()
    }
  }
  async function getMoreList() {
    setRefreshing(true)
    var firstQuery = listQ
    firstQuery = query(firstQuery, startAfter(lastDoc))
    try {

      firstQuery = query(firstQuery, limit(count))
      var finalQuery = firstQuery
      const snapshot = await getDocs(finalQuery)
      if (snapshot.empty) {
        return
      }
      const docs = snapshot.docs
      const newLastDoc = docs[docs.length - 1]

      if (!snapshot.empty && isMounted && docs.length) {
        setList([...list!, ...docs])
        setLastDoc(newLastDoc)
      }

    } catch (error) {
      console.log('error :>> ', error);
    }
    if (isMounted) {
      setRefreshing(false)
      infiniteScrollRef.current!.complete()
    }
  }
  function Refresh() {
    orders.update(()=>{})
  }
  function onEndRefresh() {
    orders.add(10)
  }

  useEffect(() => {
    var filt:orderFilter = {to:undefined,from:undefined,name:undefined,limit:10};
    if (filterFrom){filt.from = filterFrom.value}
    if (filterTo){filt.to = filterTo.value}
    orders.doFilter(filt)
  }, [filterFrom, filterTo])


  function toggleFilter() {
    setShowFilter(!showFilter)
  }

  return <IonContent  >

    <IonHeader>
      <IonItem onClick={() => toggleFilter()} dir={'rtl'}>
        <IonIcon icon={filter}></IonIcon>
        <CitiePicker value={filterFrom?.value!} onItemPicked={(v) => setFilterFrom(v)}
          placeHolder={"من :"} />
        <CitiePicker value={filterTo?.value!} onItemPicked={(v) => setFilterTo(v)}
          placeHolder={"الى :"} />
      </IonItem>
    </IonHeader>
    {refreshing && <IonSpinner style={{ left: '48%' }} name={'dots'} ></IonSpinner>}
    <IonRefresher ref={IonRefresherElement} slot="fixed" onIonRefresh={doRefresh} >
      <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
    </IonRefresher>

    {/* {!!list &&

      list.map((v: any, i: any) => {

        if (!v["exists"]) {
          return
        }
        return <OrderCard orderDocSnap={v} key={i} report canApplyFor onRefresh={() => Refresh()} onDeleted={() => { delete list[i]; setList(list) }}>
        </OrderCard>
      })
    } */}
    {orders.orders &&

      orders.orders.map((v: DocumentSnapshot, i: any) => {

        if (!v["exists"]) {
          return ''
        }
        return <OrderCard orderDocSnap={v} key={i} report canApplyFor onRefresh={() => Refresh()} onDeleted={() => { delete list[i]; setList(list) }}>
        </OrderCard>
      })
    }

    {!!listMessage && <IonItem style={{ display: "flex", flexDirection: "column" }}>
      <IonLabel color={listMessage.color}>{listMessage.text}</IonLabel>
      {/* <IonButton onClick={()=>{Refresh()}}>اعد المحاوله</IonButton> */}
      <IonLabel color="primary" onClick={(e) => {
        setFilterFrom(undefined);
        setFilterTo(undefined);
      }} >رجوع</IonLabel>

    </IonItem>
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

  </IonContent>
}
const CitiePicker = (props: { value: string, onItemPicked: (v: { value: string, key: string }) => void, placeHolder: string }) => {
  return <IonItem>
    <ListPicker
      value={props.value}
      data={Cities}
      placeHolder={props.placeHolder}
      onValueSet={(v) => props.onItemPicked(v!)}></ListPicker>
  </IonItem>
}

function isGoodOrder(data: any, profile: any) {
  if (data!.reportsGot!) {
    if (data!.reportsGot.length! >= 2) {
      return false
    }
    if (profile && profile.reportsDone!) {
      if (intersection(profile.reportsDone!, data.reportsGot!).length > 0) {
        return false
      }
    }
  }
  return true
}