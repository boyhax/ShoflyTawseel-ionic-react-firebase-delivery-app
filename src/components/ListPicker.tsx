import { IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { keyValue } from "../types";
import "./ListPicker.css"


interface Props {
  data: keyValue[],
  placeHolder: string,
  onSearchValueChange: (v: string) => void,
  onValueSet: (value: keyValue | undefined) => void
  clear?: string
}
const ListPicker = ({ data, placeHolder, onValueSet, onSearchValueChange, clear }: Props) => {
  const [searchValue, setSearchValue] = useState<null | string>(null)
  const [value, setValue] = useState<keyValue>()
  const modal: any = useRef(null)

  useEffect(() => { })

  const hundleClear = () => onValueSet(undefined)
  const hundleSearch = (e: any) => {
    setSearchValue(e.detail.value!);
    onSearchValueChange(e.detail.value!)
  }


  return <IonContent>
    <IonItem>
      <IonLabel>{placeHolder}</IonLabel>

      <IonInput placeholder="Search .." onIonChange={hundleSearch}></IonInput>
      {clear && <IonButton onClick={hundleClear}>CLEAR</IonButton>
      }    </IonItem>

    <IonContent>
      <IonList>{data.sort((a, b) => sortFunction(a.value, b.value, searchValue || "")).map((_value: keyValue, index) => {
        return <IonItem
          color={_value === value ? 'primary' : 'light'}
          key={index}
          onClick={() => { onValueSet(_value); setValue(_value) }}>
          {_value.value}
        </IonItem>

      })}</IonList>

    </IonContent>
  </IonContent>
}
export default ListPicker


const sortFunction = (a: string, b: string, value: string) => {
  const A: string = a.toLowerCase();
  const B: string = b.toLowerCase();
  return B.indexOf(value || "")! - A.indexOf(value || "")!
}
