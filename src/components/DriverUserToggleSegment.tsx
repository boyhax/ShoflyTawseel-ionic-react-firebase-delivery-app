import React, {  } from "react";

import {
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import useDriverUserMode from "../hooks/useDriverUserMode";

export default function DriverUserToggleSegment(props: any) {
  const{driverMode,toggleMode} = useDriverUserMode()

  return (
    <IonToolbar >
                
    <IonSegment value={driverMode?'Driver':"User"} onIonChange={toggleMode}>
    <IonSegmentButton title={'User'} value={'User'}>User</IonSegmentButton>
    <IonSegmentButton title={'Driver'} value={'Driver'}>Driver</IonSegmentButton>
    </IonSegment>
  </IonToolbar>
  );
}
