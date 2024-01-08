import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import Page from "../components/Page";
import {
  IonAlert,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonList,
  IonMenuButton,
  IonMenuToggle,
  IonModal,
  IonNote,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  useIonRouter,
} from "@ionic/react";
import {
  chatboxEllipsesOutline,
  chevronBack,
  menuOutline,
  notificationsOutline,
} from "ionicons/icons";
import { TT } from "../components/utlis/tt";
import useNearOrders from "../hooks/useNearOrders";
import OrderCard from "../components/OrderCard";
import {
  collection,
  getCountFromServer,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useGlobals } from "../providers/globalsProvider";
import { useChat } from "../providers/chatProvider";
import { LeafLetMap } from "./GetLocationOnMap";
import OrdersMap from "../components/ordersMap";

const Home = () => {
  const { user } = useGlobals();

  const { items: nearOrders, loading, error, searchNear } = useNearOrders();
  const [counts, setCounts] = useState({
    orders: 0,
    deliveris: 0,
    messages: 0,
  });
  const router = useIonRouter();
  const { unreadMessages } = useChat();
  const goDriverPage = () => router.push("driver");
  const goNotificationPage = () =>
    router.push("notifications", "forward", "replace");
  const goDriver = () => router.push("driver", "forward");
  const goChatPage = () => router.push("chat", "forward");
  const goUser = () => router.push("/user", "forward");
  const bounds: any = useRef(null);
  const themap: any = useRef(null);

  useEffect(() => {
    getCounts();
  }, []);

  useEffect(() => {
    themap && nearOrders.forEach((value, index, array) => {});
  }, [nearOrders]);
  async function getCounts() {
    if (!user) return;
    const orders = await getCountFromServer(
      query(collection(getFirestore(), "orders"), where("uid", "==", user.uid))
    ).then((d) => d.data().count);
    const deliveris = await getCountFromServer(
      query(
        collection(getFirestore(), "orders"),
        where("driver", "==", user.uid)
      )
    ).then((d) => d.data().count);
    const messages = await getCountFromServer(
      query(
        collection(getFirestore(), "messages"),
        where("user_to", "==", user.uid)
      )
    ).then((d) => d.data().count);
    setCounts({
      orders,
      deliveris,
      messages,
    });
  }
  return (
    <Page>
      <IonHeader
        className={
          "h-20 bg-[var(--ion-color-primary)] rounded-b-lg  shadow-lg "
        }
      >
        <div className={"flex justify-between mx-auto"}>
          <IonMenuToggle>
            <IonButton fill={"clear"} color={"light"}>
              <IonIcon icon={menuOutline} />
            </IonButton>
          </IonMenuToggle>
          <IonButtons className={"p-2"}>
            <IonButton
              size={"small"}
              color={"light"}
              onClick={goNotificationPage}
            >
              <IonIcon icon={notificationsOutline} />
            </IonButton>
            <IonButton size={"small"} color={"light"} onClick={goChatPage}>
              <IonIcon icon={chatboxEllipsesOutline} />
              <div
                className={
                  "absolute top-[-1px] right-[-1px]  rounded-full text-white w-3 h-3 "
                }
              >
                {unreadMessages}
              </div>
            </IonButton>
          </IonButtons>
          <IonTitle color={"light"} className={"font-bold text-2xl "}>
            {TT("Shofly Tawseel")}
          </IonTitle>
        </div>
      </IonHeader>
      <IonContent fullscreen>
        <div className={"grid grid-cols-2 px-2 pt-5"}>
          <IonCard onClick={goUser}>
            <IonCardHeader>
              <IonNote>{TT("orders")}</IonNote>
            </IonCardHeader>
            <IonCardContent className={"flex justify-center"}>
              <IonLabel className={"m-auto text-7xl font-bold "}>
                {counts.orders}
              </IonLabel>
            </IonCardContent>
          </IonCard>
          <IonCard onClick={goDriver}>
            <IonCardHeader>
              <IonNote>{TT("deliveries")}</IonNote>
            </IonCardHeader>
            <IonCardContent className={"flex justify-center"}>
              <IonLabel className={"m-auto text-7xl font-bold "}>
                {counts.deliveris}
              </IonLabel>
            </IonCardContent>
          </IonCard>
        </div>
        <IonCard>
          <IonCardHeader>
            <IonCardSubtitle onClick={goDriverPage} className={"ion-padding"}>
              {TT("see orders near you")}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonRouterLink routerLink={"/map"}>
            <div className={"w-full h-36"}>
              <OrdersMap />
            </div>
          </IonRouterLink>
        </IonCard>
      </IonContent>
    </Page>
  );
};

export default Home;
