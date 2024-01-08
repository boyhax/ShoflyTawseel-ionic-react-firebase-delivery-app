import React, { useEffect, useState } from "react";
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
  where,
} from "firebase/firestore";
import { mydb } from "../api/firebaseMain";
import {
  IonBackButton,
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
  IonLabel,
  IonMenuButton,
  IonMenuToggle,
  IonNote,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { chevronBackOutline, notificationsOutline } from "ionicons/icons";
import { TT } from "../components/utlis/tt";
import { useGlobals } from "../providers/globalsProvider";

export default function Notifications(props: any) {
  const { user } = useGlobals();
  const router = useIonRouter()
  const [data, loading, error] = useCollectionDataOnce(
    query(
      collection(getFirestore(), "notifications/"),
      where("user_id", "==", user?.uid),
      orderBy("time", "asc")
    )
  );

  return (
    <Page>
      <IonHeader translucent style={{ direction: "ltr" }} collapse={"fade"}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={()=>router.goBack()}>
              <IonIcon icon={chevronBackOutline}/>
            </IonButton>
            {/* <IonBackButton /> */}
          </IonButtons>
          <IonTitle>{TT("Notifications")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        {data &&
          data?.map((item: any) => {
            return (
              <IonCard key={item.id}>
                <IonCardHeader>
                  <IonCardSubtitle>{item.time}</IonCardSubtitle>
                  <IonCardTitle>{item.title}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>{item.body}</IonCardContent>
              </IonCard>
            );
          })}
        {!data && (
          <IonCard>
            <IonCardHeader>
              {/* <IonCardSubtitle>{item.time}</IonCardSubtitle> */}
              {/* <IonCardTitle>{item.title}</IonCardTitle> */}
            </IonCardHeader>
            <IonCardContent>{"No Notifications Found"}</IonCardContent>
          </IonCard>
        )}
      </IonContent>
    </Page>
  );
}
