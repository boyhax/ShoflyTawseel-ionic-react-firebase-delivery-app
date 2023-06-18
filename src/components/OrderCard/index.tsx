import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import {
  IonButton,
  IonPopover,
  IonTextarea,
  useIonAlert,
  IonCardTitle,
  IonCardHeader,
  IonCardSubtitle,
  IonCard,
  IonBadge,
  IonCardContent,
  IonLabel,
  IonItemDivider,
} from "@ionic/react";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router";
import useMounted from "../../hooks/useMounted";

import {
  db,
  geoToLatlng,
  getUserInfoPlaceHolder,
  mydb,
  reportOrder,
} from "../../api/firebaseMain";
import { useGlobals } from "../../providers/globalsProvider";
import { orderProps, OrderStatus, userInfo } from "../../types";
import "./OrderCard.css";
import OrderCardDriverFooter from "./OrderCardDriverFooter";
import OrderCardOwnerFooter from "./OrderCardOwnerFooter";
import TwoPointMap from "../TwoPointMap";
import { prettyDate } from "../utlis/prettyDate";
import { TT } from "../utlis/tt";
import OrderCardUserFooter from "./OrderCardUserFooter";
import { userStore } from "../../Stores/userStore";
import { timeAgo } from "../../lib/timeAgo";
import Comment from "../Comment";

interface props extends ComponentProps {
  order: orderProps;
}
export var Currentplatform = "web";
Device.getInfo().then((v) => {
  Currentplatform = v.platform;
});

const OrderCard = ({ order }: props) => {
  var date = order && timeAgo(new Date(order.time.seconds * 1000));

  const [reportWhy, setReportWhy] = useState<string>("");
  const uid = mydb.user? mydb.user.uid: "";
  const {user,profile} = userStore.useState()
  const role = useMemo(()=>getRole(order),[order])
  const [userInfo, setUserInfo] = useState<userInfo>(getUserInfoPlaceHolder());
  const [showComment, setShowComment] = useState(false);
  
  const { mounted } = useMounted();
  function getRole(order:orderProps){
    let role = "user"
    if(order.uid === uid){
      role = "owner"
    }
    if(order.driver === uid){
      role = "driver"
    }
    return role

  }
  

  useEffect(() => {
    if (order.uid === uid && profile) {
      mounted &&
        setUserInfo({
          name: profile.name,
          photoURL: profile.photoURL,
          phoneNumber: profile.phoneNumber,
        });
    } else {
      getDoc(doc(db, "users", order.uid)).then((doc) => {
        let d: userInfo = {
          name: doc.data()!.name,
          phoneNumber: doc.data()!.phoneNumber,
          photoURL: doc.data()!.photoURL!,
        };
        mounted && setUserInfo(d);
      });
    }

    return () => {};
  }, []);

  const toggleComment = () => {
    setShowComment(!showComment);
  };
  const [presentAlert] = useIonAlert();

  
  function Report(why: string) {
    reportOrder(order.id, why);
  }
  
  return (
    <IonCard mode={"md"} >
      <div className="h-32 w-full">
        {order.geo &&<TwoPointMap
          id={order.id}
          onMap={() => {}}
          point1={geoToLatlng(order.geo.from)}
          point2={geoToLatlng(order.geo.to)}
        />}
      </div>
      <IonCardHeader 
      className="flex w-full items-center justify-between"
      >
        <IonCardTitle>{userInfo.name}</IonCardTitle>
        <IonCardSubtitle style={{direction: 'ltr'}}> {date}</IonCardSubtitle>
      </IonCardHeader>
      <IonCardContent >
        {order.urgent && (
          <IonBadge className={" top-0 left-0"}>Urgent</IonBadge>
        )}
        {/* //# comment component start minimal and maxemize on click */}
        {TT('description') }
        <Comment text={order.comment??''}/>
        
         {/* <div  className={'w-full'}>
         <IonLabel>
            {  OrderStatus[order.status]}
          </IonLabel>
         </div> */}
          
      </IonCardContent>
      <div className="h-px mx-3 my-2 bg-gray-200  dark:bg-gray-500"/>

      {role==='owner' && <OrderCardOwnerFooter order={order}/>}
      {role==='driver' && <OrderCardDriverFooter order={order}/>}
      {role==='user' && <OrderCardUserFooter order={order}/>}
      {/* //messengers popover */}
      

      <IonPopover trigger={`reportButton ${order.id}`}>
        <form
          onSubmit={() => {
            Report(reportWhy);
          }}
          className="flex items-center flex-col"
        >
          <IonTextarea
            placeholder={"why..."}
            required
            onIonChange={(e) => {
              setReportWhy(e.detail.value!);
            }}
          ></IonTextarea>
          <IonButton type={"submit"}>Send</IonButton>
        </form>
      </IonPopover>
    </IonCard>
  );
};
export default OrderCard;
