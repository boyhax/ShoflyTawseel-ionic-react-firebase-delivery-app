import React, { useRef } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonLabel, IonList } from "@ionic/react";
import OrderCard from "./OrderCard";
import { orderProps } from "../types";
import { userApplicationsStore } from "../api/firebaseMain";
import { TT } from "./utlis/tt";

export default function UserApplicationsList(props: any) {

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
          <div className={'flex justify-center items-center '}>
            <IonLabel >{TT('empty list \n')}</IonLabel>

          </div>
          }
        
      </IonList>
  );
}
