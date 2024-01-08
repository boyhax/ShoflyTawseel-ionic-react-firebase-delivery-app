import React, { useRef, useState } from "react";

import {
  IonButton,
  IonCard,
  IonChip,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSegment,
  IonSegmentButton,
  IonThumbnail,
} from "@ionic/react";
import { thumbsDown, thumbsDownOutline, thumbsUp, thumbsUpOutline } from "ionicons/icons";
import { RefresherEventDetail } from "@ionic/core";
import OrdersPlaceHolder from "./OrdersPLaceHolder";
import { mydb } from "../api/firebaseMain";
import { driverData, DriverStatus } from "../types";
import { TT } from "./utlis/tt";
import useCollectionPagination from "../hooks/useCollectionPagination";
import { collection, getFirestore, query, where } from "firebase/firestore";
import MinimalMaximizeImage from "./MinimalMaximizeImage";

export default function DriversList(props: any) {
  const [segment, setSegmt] = useState<"pending" | "active" | "inactive" | any>(
    "pending"
  );


  
  return (
    <div>
      <IonHeader className={'fixed mb-2'}>
      <IonSegment onIonChange={(e) => setSegmt(e.detail.value)} value={segment}>
        <IonSegmentButton value="active">active</IonSegmentButton>
        <IonSegmentButton value="pending">pending</IonSegmentButton>
        <IonSegmentButton value="inactive">inactive</IonSegmentButton>
      </IonSegment>
      </IonHeader>
      
        {segment === "pending" && <DriversListComponent type={DriverStatus.pending} />}
        {segment === "active" && <DriversListComponent type={DriverStatus.active} />}
        {segment === "banned" && <DriversListComponent type={DriverStatus.banned} />}

    </div>
  );
}

function DriversListComponent({type=DriverStatus.pending}) {
  function onEndRefresh(e: any) {
    !loading && hasMore && loadMore();

    setTimeout(() => {
      e.target.complete();
    }, 2000);
  }
  const IonRefresherElement = useRef<HTMLIonRefresherElement | any>();

  const [theQuery] = useState( query(
      collection(getFirestore(), "drivers"),
      where("status", "==", type)
    ))


  const { hasMore, items, loading, loadMore } = useCollectionPagination(
    theQuery,
    { limit: 10 }
  );
  function Refresh(event: CustomEvent<RefresherEventDetail>) {
    console.log("Begin async operation");
    // setTheQuery(theQuery);
    setTimeout(() => {
      console.log("Async operation has ended");
      event.detail.complete();
    }, 2000);
  }
  return (
    <IonList>
        <IonRefresher
          ref={IonRefresherElement}
          slot="fixed"
          onIonRefresh={Refresh}
        >
          <IonRefresherContent refreshingText="refreshing..."></IonRefresherContent>
        </IonRefresher>
        {items &&
        items.map((doc: any, i: any) => {
          let v = doc.data() as driverData;
          let id = doc.id;
          return driverCard(v, id, i);
        })}
        {loading && <OrdersPlaceHolder></OrdersPlaceHolder>}
        <IonInfiniteScroll
          onIonInfinite={onEndRefresh}
          threshold="100px"
          disabled={loading}
        >
          <IonInfiniteScrollContent
            loadingSpinner="dots"
            loadingText={TT("loading ..")}
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
      </IonList>
      
    
  );
}
const driverCard = (data: driverData, id: string, i = 1) => {
  return (
    <IonCard key={i}>
      <IonChip>driver_id {data.driver_id}</IonChip>
      <IonChip>user id {id}</IonChip>
      <div className={"grid grid-cols-2 lg:grid-cols-4"}>
        <div>
        <IonLabel>car_card_image</IonLabel>
          <MinimalMaximizeImage  src={data.car_card_image} alt={'car card image'}/>
        </div>
        <div >
        <IonLabel>car_image</IonLabel>
          <MinimalMaximizeImage  src={data.car_image} alt={'car card image'}/>
        </div>
        <div>
        <IonLabel>driving_license_image</IonLabel>
          <MinimalMaximizeImage  src={data.driving_license_image} alt={'car card image'}/>
        </div>
        <div>
          <IonLabel>driver_id_image</IonLabel>
          <MinimalMaximizeImage  src={data.driver_id_image} alt={'car card image'}/>
        </div>
        {/* <IonThumbnail className={"w-52 h-52"}>
          <img src={data.car_image} />{" "}
        </IonThumbnail>
        <IonThumbnail className={"w-52 h-52"}>
          <img src={data.driver_id_image} />{" "}
        </IonThumbnail>
        <IonThumbnail className={"w-52 h-52"}>
          <img src={data.driving_license_image} />{" "}
        </IonThumbnail> */}
      </div>
        <IonItem>
        <IonLabel>status: {' '}{data.status}</IonLabel>
      <IonButton
      shape={'round'}
        onClick={() => {
          hundleApprove(data);
        }}
      >
        <IonIcon icon={data.status==='active'?thumbsDownOutline:thumbsUpOutline} />
      </IonButton>
        </IonItem>
     
    </IonCard>
  );
};
function hundleApprove(doc: driverData) {
  console.log("approving driver");
  doc.status === DriverStatus.pending &&
    mydb.updateDriverData({ status: DriverStatus.active });
  doc.status === DriverStatus.active &&
    mydb.updateDriverData({ status: DriverStatus.pending });
}
