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
import React, { useEffect, useMemo, useState } from "react";
import useMounted from "../../hooks/useMounted";

import {
  getUserInfoPlaceHolder,
  mydb,
  reportOrder,
} from "../../api/firebaseMain";
import { userStore } from "../../Stores/userStore";
import { orderProps, userInfo } from "../../types";
import "./OrderCard.css";
import { prettyDate } from "./../utlis/prettyDate";
import { useHistory } from "react-router";

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

  const { user, driver } = userStore.useState((s) => s);
  const history = useHistory()
  const [userInfo, setUserInfo] = useState<userInfo>(getUserInfoPlaceHolder());


  const userApplied = useMemo(
    () => mydb.user && order.driver === mydb.user.uid,
    [order.driver]
  );

  useEffect(() => {}, []);


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
  
  return (<div className={"flex w-full  justify-between "}>
        
  

<IonButtons className={"flex flex-end justify-end"}>
  
    <IonButton
      fill="clear"
      onClick={() => {
        mydb.deleteOrder(order);
      }}
    >
      <IonIcon
        size="small"
        color="primary"
        icon={trashOutline}
      ></IonIcon>
    </IonButton>
  
   
  
</IonButtons>
</div>
  );
}
