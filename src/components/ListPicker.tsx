import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { keyValue } from "../types";
import "./ListPicker.css"


interface Props {
  data: keyValue[],
  placeHolder: string,
  onValueSet: (value: keyValue | undefined) => void
  value:keyValue,
  searchValue:string
}
const ListPicker = ({ data,
  placeHolder, 
  onValueSet,
  value ,
  searchValue}: Props) => {

  useEffect(() => { })

  return <IonContent>
    

    <IonContent>
      <IonList>{data.map((_value: keyValue, index) => {
        return <IonItem
          color={_value.key === value.key ? 'primary' : 'light'}
          key={index}
          onClick={() => { onValueSet(_value); }}>
          {_value.value}
        </IonItem>

      })}</IonList>

    </IonContent>
  </IonContent>
}
export default ListPicker



