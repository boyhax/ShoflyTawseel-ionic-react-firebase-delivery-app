import React, {  useEffect, useRef, useState } from "react";

import {  collection, getDocs, getFirestore, query, where, limit, orderBy, startAfter  } from "firebase/firestore";
import { IonButton, IonContent, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonSpinner } from "@ionic/react";
import {  filter } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";
import { getAuth } from "firebase/auth";
import { orderProps } from "../providers/firebaseMain";
import OrderCard from "./OrderCard";


export default function OrderList(props:any) {
  const [isMounted, setIsMounted] = useState(true)
const [list,setList]=useState<null|Array<orderProps>>(null)
  const [refreshing,setRefreshing] = useState(false)
  const [count,setCount] = useState(10)
  const [showFilter,setShowFilter] = useState(false)
  const [filterTo,setFilterTo] = useState<null|string>(null)
  const [filterFrom,setFilterFrom] = useState<null|string>(null)
  const IonRefresherElement = useRef<any>(null)
  const infiniteScrollRef = useRef<any>(null)
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  const [lastDoc,setLastDoc] = useState<any>(null)
  const [listQ,setListQ]= useState<any>(null)
  const [listMessage,setListMessage] = useState<any>(null)
  const user =getAuth().currentUser

  useEffect(()=>{
    getNewList()
    setIsMounted(true)
  return () => {
    setIsMounted(false)
  }
  },[])
  
  
 
    
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
    getNewList()
}   
    async function getNewList(){
      setRefreshing(true)
      const ref = collection(getFirestore(),"orders")
      var firstQuery = query(ref)
      firstQuery= query(firstQuery,orderBy("time","desc"))
      firstQuery = query(firstQuery,where("flagged","==",false))

      if (filterFrom){
        firstQuery = query(firstQuery,where("from","==",filterFrom))
      }
      if (filterTo){
        firstQuery = query(firstQuery,where("to","==",filterTo))
      }
      try {
        firstQuery = query(firstQuery,limit(count))
        var finalQuery= firstQuery
        const snapshot = await getDocs(finalQuery)
        var newList:any[]=[]
        snapshot.forEach((doc)=>{
            newList.push({id:doc.id,...doc.data()})
          })
          const docs = snapshot.docs
          const newLastDoc = docs[docs.length -1]
          if(isMounted && !snapshot.empty){
            setList(newList)
            setLastDoc(newLastDoc)
            setListQ(finalQuery)
          }
          if(snapshot.empty){
            setList(null)
            setLastDoc(null)
            setListMessage({text:"no orders found",color:"green"})
          }else{
            setListMessage(null)
            infiniteScrollRef.current!.complete()

          }
      } catch (error) {
        console.log('error :>> ', error);      
      }
      if(isMounted){
        setRefreshing(false)
        IonRefresherElement?.current!.complete()
        infiniteScrollRef.current!.complete()
      }
    }
      async function getMoreList(){
        setRefreshing(true)
       var firstQuery = listQ
       firstQuery = query(firstQuery,startAfter(lastDoc))
        try {
          
          firstQuery = query(firstQuery,limit(count))
          var finalQuery= firstQuery
          const snapshot = await getDocs(finalQuery)
          var newList:any[]=[]
          snapshot.forEach((doc:any)=>{
            newList.push({id:doc.id,...doc.data()})
            })
            const docs = snapshot.docs
            const newLastDoc = docs[docs.length -1]
            if(isMounted && !snapshot.empty){
              setList([...list!,...newList])
              setLastDoc(newLastDoc)
            }
           
        } catch (error) {
          console.log('error :>> ', error);      
        }
        if(isMounted){
          setRefreshing(false)
          infiniteScrollRef.current!.complete()
        }
      } 
      function Refresh() {
        getNewList() 
      }
    function onEndRefresh(){
      getMoreList()
    }

    useEffect(()=>{
       getNewList()
       console.log("filter")
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

    <IonRefresher ref={IonRefresherElement} slot="fixed"  onIonRefresh={doRefresh} >
    <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
  </IonRefresher>
  
    
      {!!list && 
      <IonList  className='list'>
        {list.map((v,i)=>{
          return <IonItem key={i} >
              <OrderCard order={v} whatsapp message report onDeleted={()=>{delete list[i];setList(list)}}>
              </OrderCard>
          </IonItem>})}
        </IonList>}
        {!!listMessage &&<IonItem style={{display:"flex",flexDirection:"column"}}>
          <IonLabel color={listMessage.color}>{listMessage.text}</IonLabel>
          <IonButton onClick={()=>{Refresh()}}>اعد المحاوله</IonButton>
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
    {refreshing && <IonSpinner color="blue" name='lines' className='spinner'/>}
    
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