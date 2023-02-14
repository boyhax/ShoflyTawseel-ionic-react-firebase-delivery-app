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
  IonInput,
  IonThumbnail,
  IonContent,
} from "@ionic/react";
import { arrowForwardOutline, locateSharp, locationSharp, pinSharp } from "ionicons/icons";
import * as React from "react";
import { newOrderStore, useNewOrder } from ".";
import { newOrderProps, OrderCatagorie, OrderCatagories } from "../../types";

const Step2: React.FC = (props) => {
  const { order,uploadOrder,setOrder  } = useNewOrder();
  const [fromAddress, setFromAddress] = React.useState("");
  const [toAddress, setToAddress] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [urgent, setUrgent] = React.useState(false);
  const [type, setType] = React.useState<OrderCatagorie>('SmallObjects');

  function validateAndSubmit() {
    const o:newOrderProps = {
      address:{
        from:fromAddress,
        to:toAddress
      },
      comment:comment!,
      urgent:urgent,
      type:type!,
      geo:order.geo!,
      from:order.from!,
      to:order.to!
    }
    setOrder(o)
    uploadOrder(o)
  }
  
  return (
    <IonContent className={"w-full h-full"}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          validateAndSubmit()
        }}
      >
        <IonCard className={'flex flex-col gap-2 divide-x-2  divide-red-300 justify-center'}>
          {/* pick up point */}
          <div className={'flex justify-center'}>
            <IonLabel>{order.from}</IonLabel>
            <IonIcon icon={locationSharp}/>
          </div>
          {/* drop point */}
          
          <div className={'flex justify-center'}>
            <IonTitle>{order.to}</IonTitle>
            <IonIcon icon={pinSharp}/>
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
          {/* {OrderCatagories &&
            OrderCatagories.map((value, index, array) => {
              return (
                <div
                onClick={() => setType(value.value)}
                  key={index}
                  className={`flex flex-col h-28 text-clip m-4 rounded-xl 
                  justify-self-stretch text-justify
                  ${type === value.value &&"bg-blue-200 text-white" } `}
                 
                >
                  <IonThumbnail>
                    <IonImg  src={value.icon} />
                  </IonThumbnail>

                  <IonLabel className={'text-sm text-center'}>
                    {value.name}
                  </IonLabel>
                </div>
              );
            })} */}
        </div>

        <div>
          <IonItem>
            <IonLabel>Is it Urgent? </IonLabel>
            <IonCheckbox
              placeholder={"Is Order Urgent?"}
              onIonChange={(v) => {
                setUrgent(v.detail.value || false);
              }}
            ></IonCheckbox>
          </IonItem>
          <IonItem>
            <IonLabel position={"stacked"}>pick up point address</IonLabel>
            <IonInput
              onIonChange={(v) => setFromAddress(v.detail.value || "")}
              placeholder={"Write building, floor, street.."}
            />
          </IonItem>
          <IonItem>
            <IonLabel position={"stacked"}>drop point address</IonLabel>
            <IonInput
              onIonChange={(v) => setFromAddress(v.detail.value || "")}
              placeholder={"Write building, floor, street.."}
            />
          </IonItem>
          {/* <IonCard> */}
          <IonTextarea
            onIonChange={(v) => setComment(v.detail.value || "")}
            placeholder={"Please write any discreption.. "}
          ></IonTextarea>
          {/* </IonCard> */}
        </div>

        <IonFooter style={{ display: "flex", justifyContent: "center" }}>
          <IonButton shape={"round"} type="submit">
            Submit Order 👍
          </IonButton>
        </IonFooter>
      </form>
    </IonContent>
  );
};
export default Step2;
