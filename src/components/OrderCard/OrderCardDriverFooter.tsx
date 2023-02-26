import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import {
  IonIcon,
  IonButton,
  IonSpinner,
  useIonAlert,
  IonButtons,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  trashOutline,
  thumbsDownOutline,
  thumbsUpOutline,
  logoWhatsapp,
  chatboxOutline,
  alertCircleOutline,
} from "ionicons/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import useMounted from "../../hooks/useMounted";

import {
  getUserInfoPlaceHolder,
  mydb,
  reportOrder,
} from "../../providers/firebaseMain";
import  {userStore} from "../../Stores/userStore";
import { orderProps, userInfo } from "../../types";
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
  const [deleted, setDeleted] = useState(false);
  const uid = getAuth().currentUser?.uid;
  const { user, } = userStore.useState((s) => s);
  const history = useHistory();
  

  const userApplied = useMemo(
    () => mydb.user && order.driver === mydb.user.uid,
    [order.driver]
  );

  

  const [presentAlert] = useIonAlert();

  async function hundleApply() {
    if (!userApplied) {
      await mydb.applyForCard(order);
    } else {
      await mydb.removeApplicationToOrder(order);
    }
  }
  function Report(why: string) {
    reportOrder(order.id, why);
  }
  if (deleted) {
    return <></>;
  }
  return (
      <div className={"flex w-full  justify-between "}>
        
          <IonButton disabled={!user} onClick={hundleApply}>
            {userApplied !== undefined && (
              <IonIcon
                slot={"icon-only"}
                icon={userApplied ? thumbsDownOutline : thumbsUpOutline}
              ></IonIcon>
            )}
            {userApplied === undefined && <IonSpinner></IonSpinner>}
            {userApplied !== undefined
              ? userApplied
                ? "un accept"
                : "accept"
              : ""}
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
              onClick={() => history.push("/chat/" + order.uid)}
              color="dark"
              shape="round"
            >
              <IonIcon
                size="small"
                color="success"
                icon={chatboxOutline}
              ></IonIcon>
            </IonButton>
          
           {order.phoneNumber && (
            <IonButton
              onClick={() => { OpenWhatsapp(order.phoneNumber)}}
              color="light"
              shape="round"
              fill="clear"
              size="small"
            >
              <IonIcon
                size="small"
                color="success"
                icon={logoWhatsapp}
              ></IonIcon>
            </IonButton>)}
          
        </IonButtons>
      </div>
  );
}
