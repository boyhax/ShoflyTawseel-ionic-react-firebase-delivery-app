import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonCard,
  IonList,
  IonHeader,
  IonSegment,
  IonSegmentButton,
  IonToolbar,
} from "@ionic/react";
import { useGlobals } from "../providers/globalsProvider";
import { getAuth } from "firebase/auth";
import { useHistory, useParams } from "react-router";
import {
  DocumentSnapshot,
} from "firebase/firestore";
import Page from "../components/Page";
import OrdersSegmentComponent from "../components/OrdersSegmentComponent";
import OrderList from "../components/OrderList";
import UserOrdersList from "../components/UserOrdersList";
import UserApplicationsList from "../components/UserApplicationsList";

const OrdersPage: React.FC = () => {
  const { user, profile, currentOrder, setCurrentOrder } = useGlobals();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<DocumentSnapshot[]>();
  const [segment,setSegmt] = useState<any>('myOrders')
  const auth = getAuth();
  const { id, type }: any = useParams();
  const history = useHistory();
  useEffect(() => {}, []);
  useEffect(() => {}, [currentOrder]);

  return (
    <Page>
      <IonContent fullscreen>
      <IonHeader translucent mode={'ios'}>
        <IonToolbar>
          <IonSegment onIonChange={(e)=>setSegmt(e.detail.value)}  mode={'ios'} value={segment}>
            {/* <IonSegmentButton value="all">
              All
            </IonSegmentButton> */}
            <IonSegmentButton value="myOrders">
              My Orders
            </IonSegmentButton>
            <IonSegmentButton value="accepted">
              Accepted
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      {/* {segment ==='all' && <OrderList/>} */}
      {segment ==='accepted' && <UserApplicationsList/>}
      {segment ==='myOrders' && <UserOrdersList/>}
      </IonContent>
    </Page>
  );
};

export default OrdersPage;
