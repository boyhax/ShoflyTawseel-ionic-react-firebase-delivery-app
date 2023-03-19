import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useGlobals } from "../providers/globalsProvider";
import * as L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getUserInfoPlaceHolder } from "../providers/firebaseMain";
import { Device } from "@capacitor/device";
import Page from "../components/Page";
import MapPage from "./MapPage";
import OrderList from "../components/OrderList";
import { IonContent, IonHeader, IonLabel, IonTitle, IonToolbar } from "@ionic/react";
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
