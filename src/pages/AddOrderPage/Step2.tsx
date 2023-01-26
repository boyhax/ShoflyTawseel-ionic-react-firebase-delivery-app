import {
  IonIcon,
  IonCard,
  IonLabel,
  IonTitle,
  IonImg,
  IonItem,
  IonCheckbox,
  IonTextarea,
  IonFooter,
  IonButton,
} from "@ionic/react";
import { arrowForwardOutline } from "ionicons/icons";
import * as React from "react";
import { newOrderStore } from ".";
import { OrderCatagories } from "../../types";

const Step2: React.FC = (props) => {
  const { order, submit } = newOrderStore.useState();

  return (
    <div className={"w-full h-full"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit()
        }}
      >
        <IonCard
          style={{
            display: "flex",
            justifyContent: "center",
            justifyItems: "space-between",
          }}
        >
          {/* pick up point */}
          <div>
            <IonLabel position={"floating"}>Pick up point</IonLabel>
            <IonTitle>{order.from.value}</IonTitle>
          </div>
          {/* drop point */}
          <IonIcon
            style={{ verticalAlign: "middle", padding: "4px" }}
            size={"large"}
            icon={arrowForwardOutline}
          ></IonIcon>
          <div>
            <IonLabel position={"floating"}>Drop point</IonLabel>
            <IonTitle>{order.to.value}</IonTitle>
          </div>
        </IonCard>
        <div
          style={{
            display: "flex",
            justifyItems: "space-between",
            justifyContent: "center",
            alignItems: "space-evenly",
          }}
        >
          {OrderCatagories &&
            OrderCatagories.map((value, index, array) => {
              return (
                <div
                  onClick={() =>
                    newOrderStore.update((s) => {
                      s.order = { ...s.order, type: value.value };
                    })
                  }
                  key={index}
                  style={{
                    margin: "5px",
                    width: "60px",
                    height: "auto",
                    borderRadius: "10px",
                    border: "5px",
                    backgroundColor:
                      order && order.type === value.value
                        ? "var(--ion-color-primary)"
                        : "var(--ion-color-light)",
                  }}
                >
                  <IonImg style={{ flex: 1 }} src={value.icon} />
                  <IonLabel style={{ fontSize: "0.7em" }}>
                    {value.name}
                  </IonLabel>
                </div>
              );
            })}
        </div>

        <div>
          <IonItem>
            <IonLabel>Is it Urgent? </IonLabel>
            <IonCheckbox
              placeholder={"Is Order Urgent?"}
              onIonChange={(v) => {
                newOrderStore.update((s) => {
                  s.order = { ...s.order, urgent: v.detail.value };
                });
              }}
            ></IonCheckbox>
          </IonItem>

          <IonCard>
            <IonTextarea
              // onIonChange={v => setComment(v.detail.value!)}
              placeholder={"Please write any discreption.. "}
            ></IonTextarea>
          </IonCard>
        </div>

        <IonFooter style={{ display: "flex", justifyContent: "center" }}>
          <IonButton shape={"round"} type="submit">
            Submit Order 👍
          </IonButton>
        </IonFooter>
      </form>
    </div>
  );
};
export default Step2;
