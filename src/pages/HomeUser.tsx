import React, {  } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import { IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonLabel, IonTitle, IonToolbar, useIonRouter } from "@ionic/react";
import UserOrdersList from "../components/UserOrdersList";
import { TT } from "../components/utlis/tt";
import { userStore } from "../Stores/userStore";
import { addOutline } from "ionicons/icons";

export default function HomeUser() {
  const {user,profile} = userStore.useState()
  const router = useIonRouter();
  return (
    <Page menubutton>
      <IonHeader translucent collapse={'fade'} >
        <IonToolbar >
        <IonTitle>{TT('My Orders')}</IonTitle>
        </IonToolbar>
        </IonHeader>
      <IonContent >
      
      <UserOrdersList />

      </IonContent>
      <IonFab horizontal={"start"} vertical="bottom">
        <IonFabButton
          className={"ml-auto"}
          onClick={() => {
            router.push("addorder");
          }}
        >
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>
    </Page>
  );
}
