import {
  IonButton,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
} from "@ionic/react";
import { location as locationIcon } from "ionicons/icons";
import { LatLng, Map } from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import { keyValue } from "../types";
import { LeafLetMap } from "./utlis/LeafLetMap";

interface Props extends React.ThHTMLAttributes<Element> {
  placeHolder: string;
  onValueSet: (value: LatLng) => void;
  clear?: boolean;
}

const GeoPointPicker = ({ placeHolder, onValueSet, clear }: Props) => {
  const [value, setValue] = useState<LatLng>();

  const [map, setMap] = useState<Map>();
  
  const modalRef:any = useRef()

  const closeModal=()=>{
    modalRef.current.dismiss()
  }
  function submit(){
     map && onValueSet(map.getCenter()) 
     map &&  setValue(map.getCenter())

    closeModal()
  }
 

  return (
    <>
      <IonItem   id={placeHolder + "LocationSelector"}
 >
        <p  >{placeHolder}</p>
        <p
        className={'text-gray-600'}
        slot={'end'}
        > { value?String(value): 'not selected'}
        </p>
      
      </IonItem>

      {/* //list popover */}
      <IonModal ref={modalRef} trigger={placeHolder + "LocationSelector"}>
        <IonItem
          className={
            "bg-blend-exclusion absolute z-[2000] w-full justify-between"
          }
        >
          <IonButton 
          onClick={closeModal}
           id={placeHolder + "LocationSelector"}>close</IonButton>

          <IonLabel className={"text-gray-400 text-center"}>
            {placeHolder}
          </IonLabel>

          <IonButton  onClick={submit}>Submit</IonButton>

        </IonItem>
        <LeafLetMap onMap={setMap}>
          <div className={"pointer-events-none flex w-full h-full"}>
            <div className={'m-auto text-4xl text-blue-400 translate-y-[-18]'}>
            <IonIcon icon={locationIcon}/>
            </div>

          </div>
        </LeafLetMap>
      </IonModal>
    </>
  );
};
export default GeoPointPicker;
