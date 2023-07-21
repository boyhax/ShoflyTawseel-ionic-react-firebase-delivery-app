import React, { useEffect } from "react";

import {
  collection,
  DocumentData,
  documentId,
  DocumentSnapshot,
  FirestoreDataConverter,
  getFirestore,
  orderBy,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
  WithFieldValue,
} from "firebase/firestore";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonList,
  IonLoading,
  IonProgressBar,
  IonSkeletonText,
} from "@ionic/react";
import { addOutline } from "ionicons/icons";
import OrderCard from "./OrderCard";
import { useHistory } from "react-router";
import mydb, { makeOrderFromDoc, userOrdersStore } from "../api/firebaseMain";
import {
  useCollectionDataOnce,
  useCollectionOnce,
} from "react-firebase-hooks/firestore";
import { orderProps } from "../types";
import { useGlobals } from "../providers/globalsProvider";
import useUserHooks from "../hooks/userHooks";
import { userStore } from "../Stores/userStore";

const orderConverter: FirestoreDataConverter<orderProps> = {
  toFirestore(order: WithFieldValue<orderProps>): DocumentData {
    return { ...order };
  },
  fromFirestore(
    snapshot: QueryDocumentSnapshot,
    options: SnapshotOptions
  ): orderProps {
    const data = snapshot.data(options);
    return {
      ...(data as orderProps),
      id: snapshot.id,
    };
  },
};

export default function UserOrdersList(props: any) {
  const orders = userOrdersStore.useState((s) => s);
  const history = useHistory();
  const {user} = userStore.useState()
  const [data, loading, error] = useCollectionOnce(
    query(
      collection(getFirestore(), "orders/"),
      where("uid", "==", user?user.uid:''),
      orderBy("time", "desc")
    )
  );
  useEffect(() => {
    console.log("orders", data);
  }, [data]);

  return (
    <div>
      
      {loading && (
        <IonList>
          <IonProgressBar />
          <IonSkeletonText animated style={{ width: "100%", height: "100%" }} />
        </IonList>
      )}
      <IonList className={"grid lg:grid-cols-3 md:grid-cols-2"}>
        {orders ? (
          orders.map((v: any, i: any) => {
            return <OrderCard order={makeOrderFromDoc(v)} key={v.id} />;
          })
        ) : (
          <></>
        )}
        
      </IonList>
    </div>
  );
}
