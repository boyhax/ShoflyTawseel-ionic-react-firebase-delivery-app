import React, { useEffect, useRef, useState } from "react";

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

export default function DriversList(props: any) {
  const [list, setList] = useState<driverData[]>([]);
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();
  const history = useHistory();
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [loading, setLoading] = useState<any>(true);
  const { mounted } = useMounted();
  const [segment, setSegmt] = useState<"pending" | "active" | "inactive" | any>(
    "pending"
  );

  function doRefresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
  }

  function Refresh() {
    setLoading(true);
    try {
      mydb
        .getDrivers({ from: null, status: segment }, setLastDoc)
        .then((v: any) => {
          mounted && setList(v);
        });
    } catch (error) {}
    setLoading(false);
  }
  

  useEffect(() => {
    Refresh();
  }, []);
  useEffect(() => {
    Refresh();
  }, [segment]);

  useEffect(() => {
    console.log("drivers list :>> ", list);
  }, [list]);
  function onEndRefresh(e: any) {
    setLoading(true);
    try {
      mydb
        .getDrivers({ from: lastDoc, status: segment }, setLastDoc)
        .then((v: any) => {
          mounted && setList(v);
        });
    } catch (error) {}
    setLoading(false);
    setTimeout(() => {
      e.target.complete()
    }, 2000);
  }
  function hundleApprove(id: string) {
    
      console.log('approving driver')
      mydb.ApproveDriver(id).then((v: any) => {
        mounted && setList(list.filter((v: any) => v.id !== id));
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
          onIonRefresh={doRefresh}
        >
          <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
        </IonRefresher>

        {list &&
          list.map((v: driverData, i: any) => {
            return (
              <IonCard key={v.id}>
                {/* <IonAvatar>
                  <IonImg src={}></IonImg>
                </IonAvatar> */}
                <IonLabel>{}</IonLabel>
                <IonChip>carNumber {v.carNumber}</IonChip>
                <IonChip>carType {v.carType}</IonChip>

                <IonChip> carYear{v.carYear}</IonChip>
                <IonChip>identity {v.identity}</IonChip>
                <IonNote>status {v.status}</IonNote>
                <IonButton onClick={()=>{v.id && hundleApprove(v.id)}}>
                  <IonIcon icon={thumbsUp} />
                </IonButton>
              </IonCard>
            );
          })}
        {loading && !list && <OrdersPlaceHolder></OrdersPlaceHolder>}
        <IonInfiniteScroll
      onIonInfinite={onEndRefresh}
      threshold="100px"
      disabled={loading}>
      <IonInfiniteScrollContent
        loadingSpinner="dots"
        loadingText={TT('loading ..')}
      ></IonInfiniteScrollContent>
    </IonInfiniteScroll>
      </IonList>
    </div>
  );
}
