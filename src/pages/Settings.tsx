import React, { useCallback, useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import HomeDriver from "./HomeDriver";
import HomeUser from "./HomeUser";
import useDriverUserMode from "../hooks/useDriverUserMode";
import {
  useCollectionDataOnce,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  getFirestore,
  orderBy,
  query,
} from "firebase/firestore";
import { mydb } from "../api/firebaseMain";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToggle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  moonOutline,
  notificationsOutline,
  sunnyOutline,
} from "ionicons/icons";
import { TT } from "../components/utlis/tt";
import { languageStore } from "../App";

export default function Settings(props: any) {
  const { lang } = languageStore.useState();
  const router = useIonRouter();
  const goLocations = () => router.push("locations");
  let dark = true;
  const toggleLanguage = useCallback(() => {
    languageStore.update((s) => {
      return { lang: s.lang === "en" ? "ar" : "en" };
    });
  }, []);
  return (
    <Page>
      <IonHeader translucent style={{ direction: "ltr" }}>
        <IonToolbar>
          <IonMenuButton slot="start"></IonMenuButton>
          <IonTitle>{TT("Settings")}</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={dark ? sunnyOutline : moonOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonList>
          <IonItem style={{ direction: "ltr" }}>
            <IonLabel>{TT("language")}</IonLabel>
            <IonNote slot="end">{lang}</IonNote>
            <IonToggle onIonChange={toggleLanguage}></IonToggle>
          </IonItem>
          <IonItem onClick={goLocations}  style={{ direction: "ltr" }}>
            <IonLabel>{TT("Locations")}</IonLabel>
            <IonNote slot="end">{TT('change')}</IonNote>
          </IonItem>
        </IonList>
      </IonContent>
    </Page>
  );
}
