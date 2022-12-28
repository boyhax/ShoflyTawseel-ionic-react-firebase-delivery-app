import {  IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { keyValue } from "../types";
import ListPicker from "./ListPicker";
import "./ListPicker.css"
import { Cities } from "./utlis/citiesUtlis";


interface Props {
  placeHolder: string,
  onValueSet: (value: keyValue ) => void |undefined
}
const CityPicker = ({  placeHolder, onValueSet }: Props) => {
  const modal: any = useRef(null)
  const data = [...Cities('ar'),...Cities('en')]
  useEffect(() => { })


  return <>
    <ListPicker 
    clear={'sss'}
    data={data} 
    placeHolder={placeHolder} 
    onValueSet={(e)=>{ onValueSet(e!)}}
    onSearchValueChange={(e)=>{}} ></ListPicker>
  
  </>
}
export default CityPicker


