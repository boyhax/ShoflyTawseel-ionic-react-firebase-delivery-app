import React, { } from "react";

import { DocumentSnapshot } from "firebase/firestore";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  
  IonSkeletonText,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import OrderCard from "./OrderCard";
import { useHistory } from "react-router";
import { makeOrderFromDoc, userOrdersStore } from "../api/firebaseMain";

export default function UserOrdersList(props: any) {
  const orders = userOrdersStore.useState((s) => s);
  const history = useHistory();

  

  return (
    <div>
      <IonFab horizontal={'start'} vertical='bottom'>
        <IonFabButton
          id="filterToggler"
          className={"ml-auto"}
          onClick={() => {
            history.push("addorder");
          }}
        >
          <IonIcon icon={addOutline}></IonIcon>
        </IonFabButton>
      </IonFab>

      <IonList>
        
        {orders &&
          orders.map((v: DocumentSnapshot, i: any) => {
            if (!v.exists()) {
              return (
                <div>
                  <IonSkeletonText></IonSkeletonText>
                </div>
              );
            }
            return <OrderCard order={makeOrderFromDoc(v)} key={v.id} />;
          })}
        {/* {orders.loading && !orders.orders && <OrdersPlaceHolder></OrdersPlaceHolder>} */}
      </IonList>
    </div>
  );
}
