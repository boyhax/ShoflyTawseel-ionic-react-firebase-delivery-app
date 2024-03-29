import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import {
  IonIcon,
  IonButton,
  IonSpinner,
  useIonAlert,
  IonButtons,
  IonLabel,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  trashOutline,
  thumbsDownOutline,
  thumbsUpOutline,
  logoWhatsapp,
  chatboxOutline,
  alertCircleOutline,
  checkmarkOutline,
} from "ionicons/icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import useMounted from "../../hooks/useMounted";

import {
  getUserInfoPlaceHolder,
  mydb,
  reportOrder,
} from "../../api/firebaseMain";
import { userStore } from "../../Stores/userStore";
import { DriverStatus, orderProps, OrderStatus, userInfo } from "../../types";
import { TT } from "../utlis/tt";
import "./OrderCard.css";
import { useChat } from "../../providers/chatProvider";

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
  const { user, driver } = userStore.useState((s) => s);
  const history = useHistory();
  const {getChatIdWithUser} = useChat()
  const goChatWithUser = ()=>getChatIdWithUser(order.uid).then((v)=>{v && history.push(`/chat/${v}`)});

  const userApplied = useMemo(
    () => mydb.user && order.driver === mydb.user.uid,
    [order.driver]
  );

  

  async function hundleApply() {
    if (!userApplied) {
      await mydb.applyForCard(order);
    } else {
      await mydb.removeApplicationToOrder(order);
    }
  }
  
  
  return (
    <div className={"flex w-full  justify-between "}>
        
         {driver && driver.status ===DriverStatus.active && <IonButton disabled={!user} onClick={hundleApply}>
            {userApplied !== undefined && (
              <IonIcon
              color={'sucsess'}
                slot={"icon-only"}
                icon={checkmarkOutline}
              ></IonIcon>
            )}
            {userApplied === undefined && <IonSpinner></IonSpinner>}
            
          </IonButton>}
        
        <IonButtons className={"flex flex-end justify-end"}>
          
            
          
          
            <IonButton
              fill="clear"
              onClick={goChatWithUser}
              color="dark"
              shape="round"
            >
              <IonIcon
                size="small"
                color="success"
                icon={chatboxOutline}
              ></IonIcon>
            </IonButton>
          
           {order["phoneNumber"] && 
            <IonButton
              onClick={() => OpenWhatsapp(order["phoneNumber"])}
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
            </IonButton>}
          
        </IonButtons>
      </div>
  );
}
