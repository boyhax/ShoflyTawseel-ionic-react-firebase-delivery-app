import React, { useRef } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonRefresher, IonRefresherContent } from "@ionic/react";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserApplications from "../hooks/useUserApplications";
import OrderCard from "./OrderCard";
import { orderProps } from "../types";
import { userApplicationsStore } from "../providers/firebaseMain";

export default function UserApplicationsList(props: any) {
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();

  const orders = userApplicationsStore.useState(s=>s);

  

  return (
    <div className={'overflow-hidden'}>
      <div className={'overflow-auto gap-2 divide-y-2 flex flex-col'}>
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
        
      </div>
    </div>
  );
}
