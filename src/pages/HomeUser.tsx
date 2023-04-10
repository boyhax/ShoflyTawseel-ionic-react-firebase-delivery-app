import React, {  } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import { IonContent, IonHeader, IonLabel, IonTitle, IonToolbar } from "@ionic/react";
import UserOrdersList from "../components/UserOrdersList";
import { TT } from "../components/utlis/tt";
import { userStore } from "../Stores/userStore";

export default function HomeUser() {
  const {user,profile} = userStore.useState()

  return (
    <Page menubutton>
      <IonHeader className={` flex flex-row items-center justify-center`}>
        <IonToolbar className={` flex flex-row items-center justify-center`}>
        <IonLabel  >{TT('My Orders')}</IonLabel>

        </IonToolbar>
        </IonHeader>
      <IonContent >
        
      <UserOrdersList />

      </IonContent>
    </Page>
  );
}
