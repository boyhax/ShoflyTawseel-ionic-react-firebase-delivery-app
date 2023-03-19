import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../providers/globalsProvider";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUserInfoPlaceHolder } from "../providers/firebaseMain";
import { Device } from "@capacitor/device";
import Page from "../components/Page";
import MapPage from "./MapPage";
import {
  IonAccordion,
  IonAccordionGroup,
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonSegment,
  IonSegmentButton,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import { golfOutline } from "ionicons/icons";
import { TT } from "../components/utlis/tt";
import { DriverStatus } from "../types";
import { useDriver } from "../hooks/useDriver";
import UserApplicationsList from "../components/UserApplicationsList";

export default function HomeDriver() {
  const [segment, setSegment] = useState("Map");

  const { driver, toggleStatus } = useDriver();
  if( !driver){
    return<Page menubutton>
      <IonContent fullscreen  className={'flex flex-col items-center justify-start'}>
        <IonLabel >{TT("Do you Want To Register As Driver with us?")}</IonLabel>
        <IonButton>{TT('Yes')}</IonButton>
      </IonContent>
    </Page> 
  }
  

  return (
    <Page menubutton>
      <IonHeader className={`flex justify-center`}>
        {/* <IonToggle /> */}
        {/* <IonIcon icon={golfOutline} /> */}
        {/* <IonLabel>{TT('status')}</IonLabel> */}
        {/* <IonNote >{TT(DriverStatus[driver.status])}</IonNote> */}

        {/* {driver && (
          <IonToggle
            disabled={
              ["pending", "banned"].includes(driver.status) ? true : false
            }
            // slot={""}
            checked={driver.working}
            onIonChange={toggleStatus}
          ></IonToggle>
        )} */}
      </IonHeader>
      <IonToolbar>
        <IonSegment
          value={segment}
          onIonChange={(s) => setSegment(s.detail.value!)}
        >
          <IonSegmentButton title={"Map"} value={"Map"}>
            Map
          </IonSegmentButton>
          <IonSegmentButton title={"Orders"} value={"Orders"}>
            Orders
          </IonSegmentButton>
        </IonSegment>
      </IonToolbar>
      <IonContent>
        {segment === "Map" && (
          <div className={` h-full w-full`}>
            <MapPage />
          </div>
        )}
        {segment === "Orders" && <UserApplicationsList />}
      </IonContent>
      
    </Page>
  );
}
