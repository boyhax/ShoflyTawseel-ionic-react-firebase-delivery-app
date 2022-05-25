import React, {  useEffect, useRef, useState } from "react";

import { addDoc, collection, getDocs, getFirestore, query, where,limitToLast, updateDoc, doc, limit, orderBy, startAt, startAfter  } from "firebase/firestore";
import OrderCard, { OrderProps } from "./OrderCard";
import { IonButton, IonChip, IonContent, IonFab, IonFabButton, IonIcon, IonInfiniteScroll, IonInfiniteScrollContent, IonInput, IonItem, IonLabel, IonList, IonModal, IonRefresher, IonRefresherContent, IonSearchbar, IonSpinner } from "@ionic/react";
import { add, close, filter, remove, removeCircleSharp } from "ionicons/icons";
import { RefresherEventDetail } from '@ionic/core';
import "./OrderList.css"

const citiesList = require("../assets/cities.json")[0]["oman"]["ar"]

export default function OrderList(props:any) {
const [list,setList]=useState<null|typeof OrderProps[]>(null)
  const [refreshing,setRefreshing] = useState(false)
  const [count,setCount] = useState(10)
  const [showFilter,setShowFilter] = useState(false)
  const [showCitiesOptionsModal,setShowCitiesOptionsModal] = useState(false)
  const [filterTo,setFilterTo] = useState<null|string>(null)
  const [filterFrom,setFilterFrom] = useState<null|string>(null)
  const [CitieOptionTarget,setCitieOptionTarget] = useState<null|String>(null)
  const [optionInput,setOptionInput] = useState<String>("")
  const optionsModal = useRef(null)
  const IonRefresherElement = useRef(null)
  const [data, setData] = useState<string[]>([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  useEffect(()=>{
    getData();

  },[])
  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log('Begin async operation');
    getData();
    event.detail.complete()
}   
  async function getData() {
    setRefreshing(true)
    const ref = collection(getFirestore(),"orders")
    var firstQuery = query(ref,orderBy("time","desc"))
    firstQuery = query(firstQuery,where("flagged","==",false))
    if (filterFrom!==null){
      firstQuery = query(firstQuery,where("from","==",filterFrom))
    }
    if (filterTo!==null){
      firstQuery = query(firstQuery,where("to","==",filterTo))
    }
    // if(list==[]){
    //   firstQuery=query(firstQuery,startAfter(list[list.length-1]["uid"]))
    // }else{

    // }

    var finalQuery= query(firstQuery,limit(count))
    const snapshot = await getDocs(finalQuery) 
     var newList:any[]=[]
     snapshot.forEach((doc)=>{
        newList.push({id:doc.id,...doc.data()})
       })
    setList(newList)
    setRefreshing(false)
  } 
    
    function onRefresh(){
      getData()
      console.log("on refresh")
    }
    function onEndRefresh(){
      if(list!.length){
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
        
        <IonItem ><IonChip onClick={()=>showCitiesOption("from")} >من:  {filterFrom!}</IonChip>
          {filterFrom  &&  <IonIcon icon={removeCircleSharp} onClick={()=>{setFilterFrom(null)}}></IonIcon>}        </IonItem>
        <IonItem><IonChip onClick={()=>showCitiesOption("to")} >الى :{filterTo!}</IonChip>
        {filterTo && <IonIcon icon={removeCircleSharp} onClick={()=>{setFilterTo(null)}}></IonIcon>}        </IonItem>
      </IonItem>
      
      {/* {false && <IonItem><IonLabel onClick={()=>showCitiesOption("from")} >من:  {filterFrom!}</IonLabel>
      <IonLabel onClick={()=>showCitiesOption("to")} >الى :{filterTo!}</IonLabel></IonItem>} */}
      
      <IonModal  ref={optionsModal} isOpen={CitieOptionTarget === null?false:true}>
        
        <IonContent>
          <IonItem><IonLabel>{CitieOptionTarget==="to"?"من: ":"الى :"}</IonLabel>
          <IonChip><IonLabel>{CitieOptionTarget==="to"?filterTo:filterFrom}</IonLabel></IonChip>
        <IonInput placeholder="أبحث..."  onIonChange={(e)=>{onOptionTextChange(e.detail.value!)}}></IonInput>
        <IonIcon icon={close} onClick={()=>{onOptionRemove()}}></IonIcon>
        <IonButton onClick={()=>setCitieOptionTarget(null)}><IonLabel >close</IonLabel></IonButton>
        </IonItem>
      
      <IonList>{citiesList.map((value:any, index:Number) => 
      {
        if(value >= optionInput){return <IonItem className={value === (CitieOptionTarget==="to"?filterTo:filterFrom)?"choosed_item":""} key={value} onClick={()=>onOptionPicked(value)}>{value}</IonItem>
      }
        })}</IonList>
      
      </IonContent></IonModal>
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
          onIonInfinite={onEndRefresh}
          threshold="100px"
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
    {!list && <IonSpinner name='lines' className='center'/>}
    
    </IonContent>
      }
