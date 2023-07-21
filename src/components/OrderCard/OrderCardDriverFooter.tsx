import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import {
  IonIcon,
  IonButton,
  useIonAlert,
  IonButtons,
  IonLabel,
  IonSelect,
  IonSelectOption,
  useIonActionSheet,
  useIonLoading,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  logoWhatsapp,
  chatboxOutline,
  alertCircleOutline,
  closeOutline,
} from "ionicons/icons";
import React, { useMemo, useState } from "react";
import { useHistory } from "react-router";

import {
  mydb,
  reportOrder,
  userApplicationsStore,
} from "../../api/firebaseMain";
import { useChat } from "../../providers/chatProvider";
import { userStore } from "../../Stores/userStore";
import { orderProps, OrderStatus } from "../../types";
import { TT } from "../utlis/tt";
import "./OrderCard.css";

interface props extends ComponentProps {
  order: orderProps;
}
export var Currentplatform = "web";
Device.getInfo().then((v) => {
  Currentplatform = v.platform;
});
const OpenWhatsapp = (number: any) => {
  window.open("http://wa.me/" + number);
};
export default function OrderCardDriverFooter({
  order,
}: props): React.ReactElement {
  const history = useHistory();
  const {getChatIdWithUser} = useChat()
  const goChatWithUser = ()=>getChatIdWithUser(order.uid).then((v)=>{v && history.push(`/chat/${v}`)});

  const [presentAlert] = useIonAlert();
  const [present, dissmis] = useIonActionSheet();
  const [showloading, hideloading] = useIonLoading();

  return (
    <div className={"flex w-full  justify-between "}>
      <IonButton
        color={"danger"}
        shape={"round"}
        onClick={async () => {
          await presentAlert(TT("sure you want to cancel delivery?"), [
            {
              text: "Yes",
              handler(value) {
                mydb.removeApplicationToOrder(order);
              },
            },
            {
              text: "No",
            },
          ]);
        }}
      >
        <IonIcon slot={"icon-only"} icon={closeOutline}></IonIcon>
      </IonButton>

      <IonButtons className={"flex flex-end justify-end"}>
        <IonButton
          fill="clear"
          color="dark"
          shape="round"
          id={`reportButton ${order.id}`}
        >
          <IonIcon
            size="small"
            color="success"
            icon={alertCircleOutline}
          ></IonIcon>
          {/* إبلاغ */}
        </IonButton>

        <IonButton
          fill="clear"
          onClick={goChatWithUser}
          color="dark"
          shape="round"
        >
          <IonIcon size="small" color="success" icon={chatboxOutline}></IonIcon>
        </IonButton>

        {order.phoneNumber && (
          <IonButton
            onClick={() => {
              OpenWhatsapp(order.phoneNumber);
            }}
            color="light"
            shape="round"
            fill="clear"
            size="small"
          >
            <IonIcon size="small" color="success" icon={logoWhatsapp}></IonIcon>
          </IonButton>
        )}
      </IonButtons>
      <IonSelect
        interface="action-sheet"
        mode={'ios'}
        value={order.status}
        onIonChange={(v) => {
          showloading();
          mydb
            .updateOrderStatus(order, v.detail.value)
            .finally(() => {
              hideloading();
            });
        }}
      >
        <IonSelectOption value={OrderStatus.DriverAsigned}>
          {OrderStatus.DriverAsigned}
        </IonSelectOption>
        <IonSelectOption value={OrderStatus.DriverOnWayToCollect}>
          {OrderStatus.DriverOnWayToCollect}
        </IonSelectOption>
        <IonSelectOption value={OrderStatus.DriverOnWayToDeliver}>
          {OrderStatus.DriverOnWayToDeliver}
        </IonSelectOption>
        <IonSelectOption value={OrderStatus.Done}>
          {OrderStatus.Done}
        </IonSelectOption>
      </IonSelect>
    
    </div>
  );
}
