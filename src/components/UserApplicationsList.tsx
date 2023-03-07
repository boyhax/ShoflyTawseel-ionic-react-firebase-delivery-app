import React, { useRef } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonContent, IonItem, IonLabel, IonList, IonRefresher, IonRefresherContent, IonTitle, IonToolbar } from "@ionic/react";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserApplications from "../hooks/useUserApplications";
import OrderCard from "./OrderCard";
import { orderProps } from "../types";
import { userApplicationsStore } from "../providers/firebaseMain";
import { TT } from "./utlis/tt";

export default function UserApplicationsList(props: any) {
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();

  const orders = userApplicationsStore.useState(s=>s);

  

  return (
      <IonList>
        {/* <IonRefresher
          ref={IonRefresherElement}
          slot="fixed"
          onIonRefresh={Refresh}
        >
          <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
        </IonRefresher> */}
        {orders&&
          orders.map((v: DocumentSnapshot, i: any) => {
            if (!v.exists() ) {
              return "";
            }
            return <OrderCard key={v.id} order={{id:v.id,...v.data()}as orderProps}/>
          })}
          {!orders.length&&
          <IonToolbar className={'flex justify-center '}>
            <IonTitle >{TT('NoJobsYet')}</IonTitle>

          </IonToolbar>
          }
        
      </IonList>
  );
}
