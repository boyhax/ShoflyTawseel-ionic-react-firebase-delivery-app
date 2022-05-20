import React, {  useEffect, useRef, useState } from "react";

import { addDoc, collection, getDocs, getFirestore, query, where,limitToLast, updateDoc, doc, limit, orderBy  } from "firebase/firestore";
import OrderCard, { OrderProps } from "./OrderCard";
import { IonContent, IonFab, IonFabButton, IonIcon, IonItem, IonList, IonRefresher, IonRefresherContent, IonSpinner } from "@ionic/react";
import { add } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"

export default function OrderList(props:any) {
const [list,setList]=useState<null|typeof OrderProps[]>(null)
  const [refreshing,setRefreshing] = useState(false)
  const [count,setCount] = useState(10)
  const [showFilter,setShowFilter] = useState(false)
  const [filterTo,setFilterTo] = useState<null|String>(null)
  const [filterFrom,setFilterFrom] = useState<null|String>(null)
  const IonRefresherElement = useRef(null)
  useEffect(()=>{
    getData();
  },[])
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
    getData()
    event.detail.complete()
}   
  async function getData() {
    setRefreshing(true)
    const ref = collection(getFirestore(),"orders")
    const fromQ = query(ref,where("flagged","==",false),
    where("from","==",filterFrom),
    orderBy("time","desc"))
    const toQ = query(ref,where("flagged","==",false),where("to","==",filterTo))
    const fromToQ = query(ref,where("flagged","==",false),where("to","==",filterTo),where("from","==",filterFrom))
    const nofilterQ = query(ref,orderBy("time","desc"),limit(count))

    const q = filterFrom?filterTo?fromToQ:fromQ:filterTo?toQ:nofilterQ
 
     const snapshot = await getDocs(q) 
     var newList:any[]=[]
     snapshot.forEach((doc)=>{
       if(!doc.data()["flagged"]){
        newList.push({id:doc.id,...doc.data()})
       }
       })
    setList(newList)
    setRefreshing(false)
  } 
    
    function onRefresh(){
      getData()
      console.log("on refresh")
    }
    function onEndRefresh(){
      if(filterFrom ===null && filterTo===null&& list!.length){
        if(count <= list!.length){
          setCount(count+10)
          console.log("end refresh")
        }
      } 
    }

    useEffect(()=>{
      getData()
      console.log("[count,filterFrom,filterTo] value refresh")
    },[count,filterFrom,filterTo])
    
  
  function toggleFilter(){
    setShowFilter(!showFilter)
  }

    return<IonContent className="center">
    <IonRefresher ref={IonRefresherElement} slot="fixed" onIonRefresh={doRefresh} onTouchEnd={(e)=>{console.log("end touch")}} >
    <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
  </IonRefresher>
  <IonContent  onIonScrollEnd={(e)=>{console.log("end")}}>
      {!!list && <IonList onScroll={(e)=>{console.log(e)}}  className='list'>{list.map((v,i)=>{
        return <IonItem key={i} fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}><OrderCard values={v}></OrderCard></IonItem>})}</IonList>}
    {!list && <IonSpinner name='lines' className='center'/>}
    </IonContent>
    </IonContent>
      }
