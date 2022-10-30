import React, {  useEffect, useRef, useState } from "react";

import {  collection, getDocs, getFirestore, query, where, limit, orderBy, startAfter, DocumentSnapshot, DocumentData  } from "firebase/firestore";
import { IonContent, IonHeader, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonItem, IonLabel, IonRefresher, IonRefresherContent } from "@ionic/react";
import {  filter } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";
import { getAuth } from "firebase/auth";
import { intersection } from "../providers/firebaseMain";
import OrderCard from "./OrderCard";
import { useGlobals } from "../providers/globalsProvider";


export default function OrderList(props:any) {
  const [isMounted, setIsMounted] = useState(true)
const [list,setList]=useState<DocumentSnapshot<DocumentData>[]>([])
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
  const {profile}= useGlobals()

  useEffect(()=>{
    getNewList()
    setIsMounted(true)
  return () => {
    setIsMounted(false)
  }
  },[])
useEffect(()=>{
  getNewList()
  
},[profile])
  
  
 
    
   function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
      getNewList().finally(
        // ()=>event.detail.complete()
        )
}   
    async function getNewList(){
      // IonRefresherElement.current!.start()
      setRefreshing(true)
      const ref = collection(getFirestore(),"orders")
      var firstQuery = query(ref)
      firstQuery= query(firstQuery,orderBy("time","desc"))


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
          if(!isGoodOrder(doc.data(),profile)){
              return
            }
          newList.push({id:doc.id,...doc.data()})
          })
          const docs = snapshot.docs
          const newLastDoc = docs[docs.length -1]
          if(!isMounted){
            return
          }
          if( !snapshot.empty){
            setList(docs)
            setLastDoc(newLastDoc)
            setListQ(finalQuery)
          }
          if(snapshot.empty ){
            setList([])
            setLastDoc(null)
            setListMessage({text:"لايوجد طلبات توصيل حاليا",color:"green"})
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
            
            if(!isGoodOrder(doc.data(),profile)){
              return
            }
            newList.push({id:doc.id,...doc.data()})
            })
            const docs = snapshot.docs
            const newLastDoc = docs[docs.length -1]

            if( !snapshot.empty && isMounted){
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

    return<IonContent  >
      
      <IonHeader>
      <IonItem onClick={()=>toggleFilter()} dir={'rtl'}>
            <IonIcon icon={filter}></IonIcon>
            <CitiePicker value={filterFrom} onItemPicked={(v)=>setFilterFrom(v)} 
            placeHolder={"من :"}/>
            <CitiePicker value={filterTo} onItemPicked={(v)=>setFilterTo(v)} 
            placeHolder={"الى :"}/>
          </IonItem>
      </IonHeader>
      
    <IonRefresher ref={IonRefresherElement} slot="fixed"  onIonRefresh={doRefresh} >
    <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
  </IonRefresher>
  
    {!!list && 
      
      list.map((v:any,i:any)=>{
        
        if(!v["exists"]){
          return
        }
        return <OrderCard orderDocSnap={v} key={i}  report canApplyFor onRefresh={()=>Refresh()} onDeleted={()=>{delete list[i];setList(list)}}>
            </OrderCard>
      })
      }
      
        {!!listMessage &&<IonItem style={{display:"flex",flexDirection:"column"}}>
          <IonLabel color={listMessage.color}>{listMessage.text}</IonLabel>
          {/* <IonButton onClick={()=>{Refresh()}}>اعد المحاوله</IonButton> */}
          <IonLabel color="primary" onClick={(e)=>{
            setFilterFrom(null);
            setFilterTo(null);
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
const CitiePicker =(props:{value:string|null,onItemPicked:(v:string|null)=>void,placeHolder:string})=>{
  return<IonItem>
  <ListPicker 
   value={props.value} 
   data={Cities} 
   placeHolder={props.placeHolder} 
   onValueSet={(v)=>props.onItemPicked(v)}></ListPicker>
  </IonItem>
}

function isGoodOrder(data:any,profile:any){
  if(data!.reportsGot! ){
    if(data!.reportsGot.length!>=2){
      return false
    } 
    if(profile && profile.reportsDone! ){
      if(intersection(profile.reportsDone!,data.reportsGot!).length>0){
        return false
      }
    }}
         return true
}