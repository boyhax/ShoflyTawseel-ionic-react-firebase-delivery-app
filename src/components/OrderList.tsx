import React, {  useEffect, useRef, useState } from "react";

import {  collection, getDocs, getFirestore, query, where, doc, limit, orderBy, startAfter, getDoc, FieldPath, documentId  } from "firebase/firestore";
import OrderCard, { OrderProps } from "./OrderCard";
import { IonButton, IonChip, IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent, IonSearchbar, IonSpinner } from "@ionic/react";
import {  filter } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";
import { getAuth } from "firebase/auth";

const citiesList = require("../assets/cities.json")[0]["oman"]["ar"]

export default function OrderList(props:any) {
  const [isMounted, setIsMounted] = useState(true)
const [list,setList]=useState<null|Array<OrderProps>>(null)
  const [refreshing,setRefreshing] = useState(false)
  const [count,setCount] = useState(10)
  const [showFilter,setShowFilter] = useState(false)
  const [filterTo,setFilterTo] = useState<null|string>(null)
  const [filterFrom,setFilterFrom] = useState<null|string>(null)
  const IonRefresherElement = useRef<any>(null)
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const user =getAuth().currentUser
  useEffect(()=>{
    getData()
    setIsMounted(true)
  return () => {
    setIsMounted(false)
  }
  },[])
  
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
    setList([])
    getData();
}   
  async function getData() {
    // setRefreshing(true)
    const ref = collection(getFirestore(),"orders")
    var firstQuery = query(ref,orderBy("time","desc"))
    firstQuery = query(firstQuery,where("flagged","==",false))
    if (filterFrom!==null){
      firstQuery = query(firstQuery,where("from","==",filterFrom))
    }
    if (filterTo!==null){
      firstQuery = query(firstQuery,where("to","==",filterTo))
    }
    if(list &&list?.length){
      const lastItemID = list[list.length-1].id
      const docSnap = await getDoc(doc(getFirestore(), "orders/"+lastItemID));
      firstQuery = query(firstQuery,startAfter(docSnap))
    }
    
    try {
      var finalQuery= query(firstQuery,limit(count))
      const snapshot = await getDocs(finalQuery)
      
       var newList:any[]=[]
       if(list){
         newList = [...list]
       }
       snapshot.forEach((doc)=>{
          newList.push({id:doc.id,...doc.data()})
         })
         if(isMounted){
          setList(newList)
          setRefreshing(false)
          infiniteScrollRef.current!.complete()

         }
      
    
    } catch (error) {
      console.log('error :>> ', error);      
    }
    if(isMounted){
      setRefreshing(false)
      IonRefresherElement?.current!.complete()

    }
  } 
    
   
   
    function onEndRefresh(){
      getData()

      if(list){
          console.log("end refresh"+" new count :"+ list.length+ "+list.length")
          infiniteScrollRef.current!.complete()
        
      } 
    }

    useEffect(()=>{
       getData()
       
    },[count,filterFrom,filterTo])
    
  
  function toggleFilter(){
    setShowFilter(!showFilter)
  }

    return<IonContent className="center">

      <IonItem onClick={()=>toggleFilter()}>
        <IonIcon icon={filter}></IonIcon>
        <CitiePicker value={filterFrom} onItemPicked={(v)=>setFilterFrom(v)} 
        placeHolder={"من :"}/>
        <CitiePicker value={filterTo} onItemPicked={(v)=>setFilterTo(v)} 
        placeHolder={"الى :"}/>
      </IonItem>

    <IonRefresher ref={IonRefresherElement} slot="fixed" onIonRefresh={doRefresh} >
    <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
  </IonRefresher>
  
    
      {!!list && 
      <IonList  className='list'>
        {list.map((v,i)=>{
          return <IonItem key={i} >
              <OrderCard values={v} whatsapp message report onDeleted={()=>{delete list[i];setList(list)}}>
              </OrderCard>
          </IonItem>})}
        </IonList>}
          <IonInfiniteScroll
          ref={infiniteScrollRef}
          onIonInfinite={onEndRefresh}
          threshold="100px"
          disabled={isInfiniteDisabled}

        >
          <IonInfiniteScrollContent
            loadingSpinner="dots"
            loadingText="لايوجد مزيد من الطلبات"
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
    {!list && <IonSpinner name='lines' className='spinner'/>}
    
    </IonContent>
      }
const CitiePicker =(props:{value:string|null,onItemPicked:(v:string|null)=>void,placeHolder:string})=>{
  return<IonItem>
  <ListPicker 
   value={props.value} 
   data={Cities} 
   placeHolder={props.placeHolder} 
   onValueSet={(v)=>props.onItemPicked(v)}></ListPicker>
  </IonItem>
}