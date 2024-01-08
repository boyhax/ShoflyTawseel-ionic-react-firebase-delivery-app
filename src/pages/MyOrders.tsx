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
import { userStore } from "../Stores/userStore";

const OrdersPage: React.FC = () => {
  const {user,profile} = userStore.useState()
  const {  currentOrder, setCurrentOrder } = useGlobals();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<DocumentSnapshot[]>();
  const [segment,setSegmt] = useState<any>('all')
  const auth = getAuth();
  const { id, type }: any = useParams();
  const history = useHistory();
  useEffect(() => {}, []);
  useEffect(() => {}, [currentOrder]);

  return (
    <Page>
      <IonContent fullscreen>
      
      <UserOrdersList/>
      </IonContent>
    </Page>
  );
};

export default OrdersPage;
