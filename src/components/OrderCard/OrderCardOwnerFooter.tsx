import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import {
  IonIcon,
  IonButton,
  IonLabel,
  useIonAlert,
} from "@ionic/react";
import {
  trashOutline,
} from "ionicons/icons";
import React, {  } from "react";

import {
  mydb,
} from "../../api/firebaseMain";
import { orderProps, OrderStatus } from "../../types";
import "./OrderCard.css";
import { TT } from "../utlis/tt";

interface props extends ComponentProps {
  order: orderProps;
}
export var Currentplatform = "web";
Device.getInfo().then((v) => {
  Currentplatform = v.platform;
});

export default function OrderCardOwnerFooter({
  order,
}: props): React.ReactElement {
  const [alert,dissmissAlert] = useIonAlert()
  return (
    <div>
      <div className={"flex w-full  justify-between "}>
          <IonButton
          shape={'round'}
          color='danger'
            onClick={() => {
              alert({
                header: TT('Delete Order'),
                message: TT('Are you sure you want to delete this order?'),
                buttons: [
                  'Cancel',
                  { text: 'Delete', handler: () => {
                    mydb.deleteOrder(order);
                  } }
                ]
              })
              // mydb.deleteOrder(order);
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
