import React, { useEffect, useRef, useState } from "react";

import { doc, DocumentSnapshot } from "firebase/firestore";
import {
  IonAvatar,
  IonButton,
  IonCard,
  IonChip,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonRoute,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonTitle,
} from "@ionic/react";
import { addOutline, thumbsUp } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import OrderCard from "./OrderCard";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import useUserOrders from "../hooks/useUserOrders";
import { useHistory } from "react-router";
import { makeOrderFromDoc, mydb } from "../providers/firebaseMain";
import { UserProfile } from "../types";
import useMounted from "../hooks/useMounted";

export default function DriversList(props: any) {
  const [list, setList] = useState<UserProfile[]>([]);
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();
  const history = useHistory();
  const [lastDoc, setLastDoc] = useState<any>(null);
  const [statusType, setStatusType] = useState<any>("active");
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
  function onEndRefresh(e: any) {
    mydb
      .getDrivers({ from: lastDoc, status: segment }, setLastDoc)
      .then((v: any) => {
        mounted && setList([...list, ...v]);
      });
    setTimeout(() => {
      e.target.complete();
    }, 2000);
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
  function hundleApprove(v: any) {
    
      console.log('approving driver')
      mydb.ApproveDriver(v.id).then((v: any) => {
        delete list[v];
        mounted && setList(list);
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
          list.map((v: UserProfile, i: any) => {
            return (
              <IonCard>
                <IonAvatar>
                  <IonImg src={v.photoURL}></IonImg>
                </IonAvatar>
                <IonLabel>{v.name}</IonLabel>
                <IonChip>{v.driverData.carNumber}</IonChip>
                <IonChip>{v.driverData.carType}</IonChip>

                <IonChip>{v.driverData.carYear}</IonChip>
                <IonChip>{v.driverData.identity}</IonChip>
                <IonNote>{v.status}</IonNote>
                <IonButton onClick={()=>hundleApprove(v)}>
                  <IonIcon icon={thumbsUp} />
                </IonButton>
              </IonCard>
            );
          })}
        {loading && !list && <OrdersPlaceHolder></OrdersPlaceHolder>}
      </IonList>
    </div>
  );
}
