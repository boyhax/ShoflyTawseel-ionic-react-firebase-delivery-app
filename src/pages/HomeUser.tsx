import React, {  } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import { IonContent, IonHeader, IonTitle } from "@ionic/react";
import UserOrdersList from "../components/UserOrdersList";
import { TT } from "../components/utlis/tt";
import { userStore } from "../Stores/userStore";

export default function HomeUser() {
  const {user,profile} = userStore.useState()

  return (
    <Page menubutton>
      <IonHeader className={` flex flex-row items-center justify-start`}>
            <IonTitle className={'text-center'} >{TT('My Orders')}</IonTitle>
        </IonHeader>
      <IonContent >
        
      <UserOrdersList />

      </IonContent>
    </Page>
  );
}
