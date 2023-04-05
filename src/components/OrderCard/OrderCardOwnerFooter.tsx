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
} from "ionicons/icons";
import React, { useEffect, useMemo, useState } from "react";
import useMounted from "../../hooks/useMounted";

import {
  getUserInfoPlaceHolder,
  mydb,
  reportOrder,
} from "../../api/firebaseMain";
import { userStore } from "../../Stores/userStore";
import { orderProps, OrderStatus, userInfo } from "../../types";
import "./OrderCard.css";
import { prettyDate } from "./../utlis/prettyDate";
import { useHistory } from "react-router";
import { TT } from "../utlis/tt";

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
export default function OrderCardOwnerFooter({
  order,
}: props): React.ReactElement {
  return (
    <div>
      <div className={"flex w-full  justify-between "}>
          <IonButton
          shape={'round'}
          color='danger'
            onClick={() => {
              mydb.deleteOrder(order);
            }}
          >
            <IonIcon size="small" color="light" icon={trashOutline}></IonIcon>
          </IonButton>
        
        <IonLabel className={' text-justify self-center mx-5'}>
        {TT(OrderStatus[ order.status]) }
      </IonLabel>
      </div>
      
    </div>
  );
}
