import React, { useRef, useState } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonChip, IonItem, IonItemOption, IonItemOptions, IonList, IonRefresher, IonRefresherContent } from "@ionic/react";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserApplications from "../hooks/useUserApplications";
import ApplicationCard from "./ApplicationCard";
import { ApplicationProps } from "../types";

export default function UserApplicationsList(props: any) {
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();

  const orders = useUserApplications();

  function Refresh() {
    orders.update();
  }

  return (
    <div className={'overflow-hidden'}>
      <div className={'overflow-auto gap-2 divide-y-2 flex flex-col'}>
        <IonRefresher
          ref={IonRefresherElement}
          slot="fixed"
          onIonRefresh={Refresh}
        >
          <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
        </IonRefresher>
        {orders.userApplications &&
          orders.userApplications.map((v: DocumentSnapshot, i: any) => {
            if (!v.exists() ) {
              return "";
            }
            const data :ApplicationProps|any= {id:v.id,...v.data()}
            return <ApplicationCard key={v.id} data={data}/>
          })}
        {orders.loading && !orders.userApplications && (
          <OrdersPlaceHolder></OrdersPlaceHolder>
        )}
      </div>
    </div>
  );
}
