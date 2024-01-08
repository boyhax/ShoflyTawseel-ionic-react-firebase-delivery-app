import React, { useRef } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import { IonCard, IonCardHeader, IonCardSubtitle, IonCardTitle, IonLabel, IonList } from "@ionic/react";
import OrderCard from "./OrderCard";
import { orderProps } from "../types";
import { userApplicationsStore } from "../api/firebaseMain";
import { TT } from "./utlis/tt";

export default function UserApplicationsList(props: any) {

  const orders = userApplicationsStore.useState(s=>s);

  

  return (
      <IonList>
        
        {orders&&
          orders.map((v: DocumentSnapshot, i: any) => {
            if (!v.exists() ) {
              return "";
            }
            return <OrderCard key={v.id} order={{id:v.id,...v.data()}as orderProps}/>
          })}
          {!orders.length&&
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
              {TT('No deliveries Found ')}
              </IonCardTitle>
              <IonCardSubtitle>
              {TT('check for new deliveries  ')}
              </IonCardSubtitle>
            </IonCardHeader>
          </IonCard>
          
          }
        
      </IonList>
  );
}
