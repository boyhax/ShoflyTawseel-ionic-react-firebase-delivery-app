import React from "react";
import {
  IonBackButton,
  IonButtons,
  IonHeader,
  IonPage,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonCard,
  IonCardTitle,
  IonCardContent,
} from "@ionic/react";
import { useParams } from "react-router";
import Page from "../components/Page";
import { TT } from "../components/utlis/tt";

const Details: React.FC = () => {
  const parms = useParams();
  // console.log('parms :>> ', parms);
  return (
    <Page homeButton>
      <div className={"h-12"} />
      <IonContent>
        <IonList className={"divide-y-4"}>
          <IonCardTitle className={"m-5"}>
            {TT(`shofly tawseel welcomes you`)}{" "}
          </IonCardTitle>

          <div>
            <IonCardTitle>{TT(`decsription of shofly tawseel`)}</IonCardTitle>
            <IonCardContent>
              {TT(
                `shofly tawseel is person to person delivery app that
                 helps you to deliver your goods from one place to 
                 another anytime someone is available to deliver it`
              )}
            </IonCardContent>
          </div>
          <div>
            <IonCardTitle>{TT(`for user`)}</IonCardTitle>
            <IonCardContent>
              {TT(
                `it is very easy , just create an account and add your orders 
                choose the delivery time and location and wait for the 
                driver to see your order and contact you.if no one is available
                 you can choose to wait for the next available driver or cancel
                  your order`
              )}
            </IonCardContent>
          </div>
          <div>
            <IonCardTitle>{TT(`for Driver`)}</IonCardTitle>
            <IonCardContent>
              {TT(
                `after sign in as user ,from account page just do application
                 to be driver then wait until you are approved you need to
                  fill the form with valid and correct informations. after
                   you are approved start look up for orders in your area 
                   and contact the user to deliver
                 the order to the destination, you can see and choose the
                  orders
                 from map 
                 `
              )}
            </IonCardContent>
          </div>
        </IonList>
      </IonContent>
    </Page>
  );
};

export default Details;
