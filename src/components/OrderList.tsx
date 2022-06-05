import React, {  useEffect, useRef, useState } from "react";

import { addDoc, collection, getDocs, getFirestore, query, where,limitToLast, updateDoc, doc, limit, orderBy, startAt, startAfter  } from "firebase/firestore";
import OrderCard, { OrderProps } from "./OrderCard";
import { IonButton, IonChip, IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent, IonSearchbar, IonSpinner } from "@ionic/react";
import { add, close, filter, remove, removeCircleSharp } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"
import ListPicker from "./ListPicker";
import { Cities } from "./utlis/citiesUtlis";
import { stringify } from "querystring";

const citiesList = require("../assets/cities.json")[0]["oman"]["ar"]

export default function OrderList(props:any) {
const [list,setList]=useState<null|Array<OrderProps>>(null)
  const [refreshing,setRefreshing] = useState(false)
  const [count,setCount] = useState(10)
  const [showFilter,setShowFilter] = useState(false)
  const [showCitiesOptionsModal,setShowCitiesOptionsModal] = useState(false)
  const [filterTo,setFilterTo] = useState<null|string>(null)
  const [filterFrom,setFilterFrom] = useState<null|string>(null)
  const [CitieOptionTarget,setCitieOptionTarget] = useState<null|String>(null)
  const [optionInput,setOptionInput] = useState<String>("")
  const optionsModal = useRef(null)
  const IonRefresherElement = useRef<any>(null)
  const infiniteScrollRef = useRef<any>(null)
  const [data, setData] = useState<string[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  useEffect(()=>{
    getData();

  },[])
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
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
    
    try {
      var finalQuery= query(firstQuery,limit(count))
      const snapshot = await getDocs(finalQuery) 
       var newList:any[]=[]
       snapshot.forEach((doc)=>{
          newList.push({id:doc.id,...doc.data()})
         })
      setList(newList)
    
    } catch (error) {
      console.log('error :>> ', error);      
    }
        setRefreshing(false)
    IonRefresherElement.current!.complete()
  } 
    
    function onRefresh(){
      getData()
      console.log("on refresh")
    }
    function onEndRefresh(){
      if(list){
        if(count <= list!.length){
          setCount(count+10)
          console.log("end refresh"+" new count :"+count+", list length: "+list.length)
          infiniteScrollRef.current!.complete()
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
function showCitiesOption(target:String){
  
  // optionsModal.current?.toggle()
  setCitieOptionTarget(target)
}
function onOptionTextChange(value:String){
  setOptionInput(value)
  
}
function onOptionPicked(value:string){
  if(CitieOptionTarget ==="from"){
    setFilterFrom(value)
  }else{
    setFilterTo(value)
  }
}
function getModalInputValue(){
  if(CitieOptionTarget ==="from"){
    return filterFrom
  }else if(CitieOptionTarget ==="to"){
    return filterTo
  }else{
    return ""
  }
}
function onOptionRemove(){
  if(CitieOptionTarget ==="from"){
    setFilterFrom(null)
  }else{
    setFilterTo(null)
  }
}
    return<IonContent className="center">

      <IonItem onClick={()=>toggleFilter()}>
        <IonIcon icon={filter}></IonIcon>
        <CitiePicker value={filterFrom} onItemPicked={(v)=>setFilterFrom(v)} 
        placeHolder={"من :"}/>
        <CitiePicker value={filterTo} onItemPicked={(v)=>setFilterTo(v)} 
        placeHolder={"الى :"}/>
      </IonItem>

    <IonRefresher ref={IonRefresherElement} slot="fixed" onIonRefresh={doRefresh} onTouchEnd={(e)=>{console.log("end touch")}} >
    <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
  </IonRefresher>
  
    
      {!!list && 
      <IonList  className='list'>
        {list.map((v,i)=>{
          return <IonItem key={i} fill={undefined} shape={undefined} 
            counter={undefined} counterFormatter={undefined}>
              <OrderCard values={v}></OrderCard>
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