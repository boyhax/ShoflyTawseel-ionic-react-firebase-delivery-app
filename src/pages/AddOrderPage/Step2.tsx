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
import {
  arrowForwardOutline,
  locateSharp,
  locationSharp,
  pinSharp,
} from "ionicons/icons";
import { Map } from "leaflet";
import * as React from "react";
import { useMemo } from "react";
import { newOrderStore, useNewOrder } from ".";
import OrderPointsCard from "../../components/OrderPointsCard";
import TwoPointMap from "../../components/TwoPointMap";
import { geoToLatlng } from "../../api/firebaseMain";
import { newOrderProps, OrderCatagorie, OrderCatagories } from "../../types";

const Step2: React.FC = (props) => {
  const { order, uploadOrder, setOrder } = useNewOrder();
  const [fromAddress, setFromAddress] = React.useState("");
  const [toAddress, setToAddress] = React.useState("");
  const [comment, setComment] = React.useState("");
  const [urgent, setUrgent] = React.useState(false);
  const [type, setType] = React.useState<OrderCatagorie>("SmallObjects");
  const {fromPoint,toPoint} =useMemo(()=>{
    console.log('geo in step 2',order.geo)
    let fromPoint = geoToLatlng(order.geo?.from!),
    toPoint = geoToLatlng(order.geo?.to!);
    return {fromPoint,toPoint}
  },[order])
  
  function validateAndSubmit() {
    const o: newOrderProps = {
      address: {
        from: fromAddress,
        to: toAddress,
      },
      comment: comment!,
      urgent: urgent,
      type: type!,
      geo: order.geo!,
      from: order.from!,
      to: order.to!,
    };
    setOrder(o);
    uploadOrder(o);
  }

  return (
    <IonContent fullscreen>
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          validateAndSubmit();
        }}
      >
        <OrderPointsCard point1={order.from} point2={order.to}/>
        <IonCard className={'w-full h-[150px]'}>
          {order.geo &&<TwoPointMap  onMap={()=>{}} 
          point1={fromPoint} 
          point2={toPoint}></TwoPointMap>}
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
            Submit Order 
          </IonButton>
        </IonFooter>
      </form>
    </IonContent>
  );
};
export default Step2;
