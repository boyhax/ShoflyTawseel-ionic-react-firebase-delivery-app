import React from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import HomeDriver from "./HomeDriver";
import HomeUser from "./HomeUser";
import useDriverUserMode from "../hooks/useDriverUserMode";
import { JsxElement } from "typescript";
import { useGlobals } from "../providers/globalsProvider";
import { userStore } from "../Stores/userStore";
import { useDriver } from "../hooks/useDriver";
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonLabel,
} from "@ionic/react";
import { TT } from "../components/utlis/tt";

const Home = () => {
  const { driverMode } = useDriverUserMode();

  return <div>{driverMode ? <HomeDriver /> : <HomeUser />}</div>;
};

export default Home;

function WithDriver(node: JSX.Element) {
  const { driver } = useDriver();
  if (!driver) {
    return (
      <Page menubutton>
        <IonContent fullscreen>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {TT("You Are Not Registered As Driver")}
              </IonCardTitle>
              <IonCardSubtitle>
                {TT("Do you Want To Register As Driver with us?")}
              </IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
            <IonButton>{TT("Yes")}</IonButton>
            </IonCardContent>
          </IonCard>
        </IonContent>
      </Page>
    );
  }
  return node;
}
