import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  IonButton,
  IonCard,
  IonChip,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
} from "@ionic/react";
import { thumbsUp } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import { useHistory } from "react-router";
import { mydb } from "../api/firebaseMain";
import { driverData } from "../types";
import useMounted from "../hooks/useMounted";
import { TT } from "./utlis/tt";
import useCollectionPagination from "../hooks/useCollectionPagination";
import {
  collection,
  getFirestore,
  query,
  Query,
  where,
} from "firebase/firestore";

export default function DriversList(props: any) {
  // const [list, setList] = useState<driverData[]>([]);
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();
  const history = useHistory();
  const [lastDoc, setLastDoc] = useState<any>(null);
  // const [loading, setLoading] = useState<any>(true);
  const { mounted } = useMounted();
  const [segment, setSegmt] = useState<"pending" | "active" | "inactive" | any>(
    "pending"
  );
  const [theQuery, setTheQuery] = useState(
    query(collection(getFirestore(), "drivers"), where("status", "==", segment))
  );

  const { documents, getMore, hasMore, loading } = useCollectionPagination(
    theQuery,
    10
  );
  function Refresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
    setTheQuery(theQuery);
    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }
  useEffect(() => {
    setTheQuery(
      query(
        collection(getFirestore(), "drivers"),
        where("status", "==", segment)
      )
    );
  }, [segment]);

  useEffect(() => {
    console.log("drivers list :>> ", documents);
  }, [documents]);

  function onEndRefresh(e: any) {
    !loading && hasMore && getMore();

    setTimeout(() => {
      e.target.complete();
    }, 2000);
  }
  function hundleApprove(id: string) {
    console.log("approving driver");
    mydb.ApproveDriver(id).then((v: any) => {
      // mounted && setList(list.filter((v: any) => v.id !== id));
    });
  }
  return (
    <div>
      <IonSegment onIonChange={(e) => setSegmt(e.detail.value)} value={segment}>
        <IonSegmentButton value="active">active</IonSegmentButton>
        <IonSegmentButton value="pending">pending</IonSegmentButton>
        <IonSegmentButton value="inactive">inactive</IonSegmentButton>
      </IonSegment>
      <IonList>
        <IonRefresher
          ref={IonRefresherElement}
          slot="fixed"
          onIonRefresh={Refresh}
        >
          <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
        </IonRefresher>

        {documents &&
          documents.map((doc:any, i: any) => {
            let v = doc.data();
            return (
              <IonCard key={i}>
                
                <IonChip>carNumber {v.carNumber}</IonChip>
                <IonChip>carType {v.carType}</IonChip>

                <IonChip> carYear{v.carYear}</IonChip>
                <IonChip>identity {v.identity}</IonChip>
                <IonNote>status {v.status}</IonNote>
                <IonButton
                  onClick={() => {
                     hundleApprove(doc.id);
                  }}
                >
                  <IonIcon icon={thumbsUp} />
                </IonButton>
              </IonCard>
            );
          })}
        {loading && <OrdersPlaceHolder></OrdersPlaceHolder>}
        <IonInfiniteScroll
          onIonInfinite={onEndRefresh}
          threshold="100px"
          disabled={loading}
        >
          <IonInfiniteScrollContent
            loadingSpinner="dots"
            loadingText={TT("loading ..")}
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonList>
    </div>
  );
}
