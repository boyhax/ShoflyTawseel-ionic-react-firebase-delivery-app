import React, {  } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import {
  useCollectionDataOnce,
} from "react-firebase-hooks/firestore";
import {
  collection,
  getFirestore,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonLabel,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import { add, addOutline, addSharp, chevronBackOutline } from "ionicons/icons";
import { TT } from "../components/utlis/tt";
import { useGlobals } from "../providers/globalsProvider";

export default function Locations(props: any) {
  const { user } = useGlobals();
  const router = useIonRouter()
  const [data, loading, error] = useCollectionDataOnce(
    query(
      collection(getFirestore(), "locations/"),
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
              <IonCardSubtitle>{TT("No Locations Found")}</IonCardSubtitle>
              <IonCardTitle>
              <IonButton fill={'outline'}>
              <IonIcon icon={addSharp}/>
              {/* <IonLabel>
              {TT("ADD")}
              </IonLabel> */}
              </IonButton>
              </IonCardTitle>
            </IonCardHeader>
            {/* <IonCardContent>{TT("No Locations Found")}</IonCardContent> */}
          </IonCard>
        )}
      </IonContent>
    </Page>
  );
}
