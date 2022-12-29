import { IonContent, IonIcon, IonInput, IonItem, IonLabel, IonList, IonModal, IonPopover, IonSearchbar, IonTabBar, IonTitle, IonToolbar, UseIonModalResult } from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { keyValue } from "../types";
import ListPicker from "./ListPicker";
import "./ListPicker.css"
import { Cities } from "./utlis/citiesUtlis";


interface Props {
  placeHolder: string,
  onValueSet: (value: keyValue) => void | undefined,
}
const data = [...Cities('ar'), ...Cities('en')]

const CityPicker = ({ placeHolder, onValueSet }: Props) => {
  const modal: any = useRef(null)
  const [searchValue, setSearchValue] = useState('')
  const [onFocos, setOnFocos] = useState(false)
  const [value, setValue] = useState<keyValue>()

  useEffect(() => { })


  return <>
    <IonInput placeholder={placeHolder}
    onIonFocus={()=>setOnFocos(true)}
    // onIonBlur={()=>setOnFocos(false)}
      clearInput={true}
      onIonChange={(e) => setSearchValue(e.detail.value!)}>

    </IonInput>
    
    {/* <IonModal  isOpen={onFocos} > */}
    <ListPicker
      value={value || { key: '', value: '' }}
      data={data}
      placeHolder={placeHolder}
      onValueSet={(e) => { onValueSet(e!) }}
      searchValue={searchValue}
    ></ListPicker>
    {/* </IonModal> */}

  </>
}
export default CityPicker


