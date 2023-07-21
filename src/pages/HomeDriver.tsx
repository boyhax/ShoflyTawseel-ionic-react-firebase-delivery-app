import React, { useState } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import MapPage from "./MapPage";
import {
  IonContent,
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import UserApplicationsList from "../components/UserApplicationsList";
import DriverRoute from "../routes/DriverRoute";
import { TT } from "../components/utlis/tt";
import OrdersMap from "../components/ordersMap";

export default function HomeDriver() {
  const [segment, setSegment] = useState("Map");

  return (
    <DriverRoute>
      <Page menubutton>
        <IonHeader translucent collapse={'fade'}>
        <IonToolbar>
          <IonSegment
            value={segment}
            onIonChange={(s) => setSegment(s.detail.value!)}
          >
            <IonSegmentButton title={"Map"} value={"Map"}>
              {TT("Map")}
            </IonSegmentButton>
            <IonSegmentButton title={"Orders"} value={"Orders"}>
              {TT("Deliveries")}
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
        </IonHeader>
        
        <IonContent>
          {segment === "Map" && (
            <div className={` h-full w-full`}>
              <OrdersMap />
            </div>
          )}
          {segment === "Orders" && <UserApplicationsList />}
        </IonContent>
      </Page>
    </DriverRoute>
  );
}
