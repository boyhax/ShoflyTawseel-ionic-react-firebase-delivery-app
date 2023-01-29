import React, { useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonItem, IonItemOption, IonItemOptions, IonList, IonRefresher, IonRefresherContent } from "@ionic/react";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserApplications from "../hooks/useUserApplications";

export default function UserApplicationsList(props: any) {
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();

  const orders = useUserApplications();

  function Refresh() {
    orders.update();
  }

  return (
    <div>
      <IonList>
        <IonRefresher
          ref={IonRefresherElement}
          slot="fixed"
          onIonRefresh={Refresh}
        >
          <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
        </IonRefresher>
        {orders.userApplications &&
          orders.userApplications.docs.map((v: DocumentSnapshot, i: any) => {
            if (!v["exists"]) {
              return "";
            }
            return <IonItem>
              
              <IonItemOptions>
              <IonItemOption>it is Done</IonItemOption>
                <IonItemOption>Cancel</IonItemOption>
              </IonItemOptions>
            </IonItem>;
          })}
        {orders.loading && !orders.userApplications && (
          <OrdersPlaceHolder></OrdersPlaceHolder>
        )}
      </IonList>
    </div>
  );
}
