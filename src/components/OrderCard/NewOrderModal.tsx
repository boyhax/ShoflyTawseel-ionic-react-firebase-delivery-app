import {
  IonButton,
  useIonAlert,
  IonCardSubtitle,
  IonBadge,
  IonCardContent,
  IonLabel,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import React, { useMemo, useState } from "react";
import useMounted from "../../hooks/useMounted";

import { geoToLatlng, mydb } from "../../api/firebaseMain";
import { orderProps, OrderStatus } from "../../types";
import "./OrderCard.css";
import TwoPointMap from "../TwoPointMap";
import { prettyDate } from "../utlis/prettyDate";
import { TT } from "../utlis/tt";

export default function NewOrderView({
  order,
  onCancel,
  onAccept,
}: {
  order: orderProps;
  onCancel?: () => void;
  onAccept?: () => void;
}) {
  var date = order && prettyDate(new Date(order.time.seconds * 1000));

  const [showComment, setShowComment] = useState(false);

  const { mounted } = useMounted();

  const userApplied = useMemo(
    () => mydb.user && order.driver === mydb.user.uid,
    [order.driver]
  );

  const toggleComment = () => {
    setShowComment(!showComment);
  };
  const [presentAlert] = useIonAlert();

  async function hundleApply() {
    return mydb.applyForCard(order);
  }

  function _onCancel() {
    onCancel && onCancel();
  }
  function _onAccept() {
    hundleApply().then(() => {
      onAccept && onAccept();
      presentAlert(TT('orderAccepted'),[{text:TT('ok'),handler:()=>{}}])
    });
  }
  return (
    <div className={"fade-in "}>
      <IonToolbar>
        <IonButtons slot="start">
          <IonButton onClick={_onCancel}>cancel</IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton onClick={_onAccept}>Accept</IonButton>
        </IonButtons>
      </IonToolbar>

      <div>
        <div className="h-32 w-full">
          {order.geo && (
            <TwoPointMap
              id={order.id}
              onMap={() => {}}
              point1={geoToLatlng(order.geo.from)}
              point2={geoToLatlng(order.geo.to)}
            />
          )}
        </div>
        <div className="block m-1">
          {/* <IonCardTitle>{userInfo.name}</IonCardTitle> */}
          <IonCardSubtitle> {date}</IonCardSubtitle>
        </div>
        <IonCardContent onClick={() => toggleComment()}>
          {order.urgent && (
            <IonBadge className={" top-0 left-0"}>Urgent</IonBadge>
          )}
          {TT("description") +
            (showComment ? order.comment : order.comment.slice(0, 50) + "...")}
          <div className={"justify-self-stretch"}>
            <IonLabel>{OrderStatus[order.status]}</IonLabel>
          </div>
        </IonCardContent>
      </div>
    </div>
  );
}
