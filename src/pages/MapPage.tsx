import React, {  } from "react";
import {
  IonBackButton,
  IonContent, IonHeader, IonToolbar,
} from "@ionic/react";
import OrdersMap from "../components/ordersMap";
import Page from "../components/Page";
import { BackButton } from "../components/utlis/buttons";


export default function MapPage () {
  return (
    <Page>
      <IonHeader translucent collapse={'fade'}>
          <IonToolbar>
            <BackButton/>
          </IonToolbar>
          
        </IonHeader>
      <IonContent fullscreen>
        
        <OrdersMap />
      </IonContent>
    </Page>
  );
};
