import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import MapPage from "./MapPage";
import {
  IonButton,
  IonContent,
  IonHeader,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import { TT } from "../components/utlis/tt";
import { useDriver } from "../hooks/useDriver";
import UserApplicationsList from "../components/UserApplicationsList";

export default function HomeDriver() {
  const [segment, setSegment] = useState("Map");

  const { driver, toggleStatus } = useDriver();
  if (!driver) {
    return (
      <Page menubutton>
        <IonContent
          fullscreen
          className={"flex flex-col items-center justify-start"}
        >
          <div className={"m-auto"}>
            <IonLabel>
              {TT("Do you Want To Register As Driver with us?")}
            </IonLabel>
            <IonButton>{TT("Yes")}</IonButton>
          </div>
        </IonContent>
      </Page>
    );
  }
  if (driver && driver.status === "pending") {
    return (
      <Page menubutton>
        <IonContent
          fullscreen
          className={"flex flex-col items-center justify-start"}
        >
          <div className={"flex h-full justify-center items-center p-6"}>
            <IonLabel className={"text-center self-auto"}>
              {TT(
                "your application still being verfied thank you for patience"
              )}
            </IonLabel>
          </div>
        </IonContent>
      </Page>
    );
  }
  if (driver && driver.status === "banned") {
    return (
      <Page menubutton>
        <IonContent
          fullscreen
          className={"flex flex-col items-center justify-start"}
        >
          <div className={"flex h-full justify-center items-center p-6"}>
            <IonLabel className={"text-center self-auto"}>
              {TT(
                "your are banned from our system please contact us for more information"
              )}
            </IonLabel>
          </div>
        </IonContent>
      </Page>
    );
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