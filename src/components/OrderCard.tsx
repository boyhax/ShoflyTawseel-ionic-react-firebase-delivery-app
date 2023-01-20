import { Device } from "@capacitor/device";
import { ComponentProps } from "@ionic/core";
import {
  IonLabel,
  IonChip,
  IonIcon,
  IonButton,
  IonPopover,
  IonTextarea,
  IonSpinner,
  IonAvatar,
  IonImg,
  IonRow,
  IonGrid,
  useIonAlert,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCol,
  IonCard,
  IonContent,
  IonButtons,
  IonToolbar,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import {
  alertCircle,
  trashOutline,
  thumbsDownOutline,
  thumbsUpOutline,
  logoWhatsapp,
  chatboxEllipses,
  arrowBackOutline,
  watchOutline,
  timeOutline,
  chatboxOutline,
  alertCircleOutline,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";

import {
  applyForCard,
  db,
  deleteOrder,
  getUserInfoPlaceHolder,
  is_user_applied_to_card,
  makeOrderFromDoc,
  removeApplicationToOrder,
  reportOrder,
} from "../providers/firebaseMain";
import { useGlobals } from "../providers/globalsProvider";
import { cardStyle } from "../styles";
import { orderProps, userInfo } from "../types";
import "./OrderCard.css";
import { citienames } from "./utlis/citiesUtlis";
import { prettyDate } from "./utlis/prettyDate";

const options: Object = {
  weekday: "long",
  year: "numeric",
  month: "numeric",
  day: "numeric",
};

interface props extends ComponentProps {
  orderDocSnap: DocumentSnapshot<DocumentData>;
  whatsapp?: any;
  message?: any;
  remove?: any;
  report?: any;
  canApplyFor?: any;
  onDeleted?: () => void;
  onRefresh?: () => void;
}
export var Currentplatform = "web";
Device.getInfo().then((v) => {
  Currentplatform = v.platform;
});
const SendSMSMessage = (phoneNumber: String, message: String) => {
  const separator = Currentplatform == "ios" ? "&" : "?";
  const url = `sms:${phoneNumber}${separator}body=${message}`;
  window.open(url);
};
const OpenWhatsapp = (number: any) => {
  window.open("http://wa.me/" + number);
};

const OrderCard = ({
  orderDocSnap,
  whatsapp,
  message,
  remove,
  report,
  canApplyFor,
  onDeleted,
  onRefresh,
}: props) => {
  const [data, setData] = useState<orderProps>(makeOrderFromDoc(orderDocSnap));
  const id = orderDocSnap.id;
  moment.locale("ar");
  var date = prettyDate(new Date(data.time.seconds * 1000));

  const comment =
    typeof data.comment! == "string" ? data.comment : "no comment";
  const popOver = useRef<any>(null);
  const [reporting, setReporting] = useState(false);
  const [reportWhy, setReportWhy] = useState<undefined | string>(undefined);
  const uid = getAuth().currentUser?.uid;
  const { user, profile, setCurrentOrder } = useGlobals();
  const [userApplied, setApplied] = useState<boolean | undefined>(
    is_user_applied_to_card(uid!, data)
  );
  const history = useHistory();
  const owner = data!.uid === uid;
  const [userInfo, setUserInfo] = useState<userInfo>(getUserInfoPlaceHolder());
  const [showComment, setShowComment] = useState(false);
  // const order = useOrder(id)
  const from = citienames[Number(data.from)];
  const to = citienames[Number(data.to)];
  useEffect(() => {
    const unsub = onSnapshot(doc(getFirestore(), "orders/" + id), (doc) => {
      let d = makeOrderFromDoc(doc);
      setData(d);
      setApplied(is_user_applied_to_card(uid!, d));
    });
    var unsub2 = () => {};
    if (data.uid === uid && profile) {
      setUserInfo({
        name: profile.name,
        photoURL: profile.photoURL,
        phoneNumber: profile.phoneNumber,
      });
    } else {
      unsub2 = onSnapshot(doc(db, "users", data.uid), (doc) => {
        let d: userInfo = {
          name: doc.data()!.name,
          phoneNumber: doc.data()!.phoneNumber,
          photoURL: doc.data()!.photoURL!,
        };
        setUserInfo(d);
      });
    }

    return () => {
      unsub();
      unsub2();
    };
  }, []);

  const toggleComment = () => {
    setShowComment(!showComment);
  };
  const [presentAlert] = useIonAlert();

  async function _applyToOrder() {
    if (!user) {
      presentAlert({ message: "يرجى تسجيل الدخول اولا" });
      return;
    }
    if (!userApplied) {
      applyForCard(uid!, id, data.uid!);
      setApplied(undefined);
    } else {
      const info = data.applications.find((value) => {
        return value.byUser === uid;
      });
      if (info) {
        removeApplicationToOrder(info, orderDocSnap);
        setApplied(undefined);
      } else {
        console.log("no application found on order ");
      }
    }
  }
  function onReport() {
    reportOrder(orderDocSnap, reportWhy);
    if (onRefresh) {
      onRefresh();
      console.log("message");
    }
  }

  return (
    <div>
      {owner && (
        <p className="relative z-10 bg-sky-500 w-fit bottom-0 px-4 py-1 text-sm font-bold text-white rounded-tl-lg rounded-br-xl">
          {" "}
          My order
        </p>
      )}
      <div
        className={`flex mx-1 my-1 rounded-lg ${owner ? "mt-3" : ""}
        flex-col justify-center items-center shadow-md   max-w-[450px]`}
      >
        <div className="flex w-full items-center justify-between">
          <IonAvatar
            className="w-12 h-12"
            onClick={() => history.push("/profile/" + data.uid)}
          >
            <IonImg src={userInfo.photoURL}></IonImg>
          </IonAvatar>
          <IonLabel color="dark" className={" mx-2 text-center"}>
            {userInfo.name}
          </IonLabel>
          <IonLabel
            className={"ml-auto mb-auto font-thin text-sm"}
            color="dark"
          >
            <IonIcon icon={timeOutline} />
            {date}
          </IonLabel>
        </div>

        <div className="flex w-full items-center justify-around flex-row-reverse">
          <IonChip color="secondary">{from}</IonChip>
          <IonIcon
            color={"primary"}
            size={"large"}
            icon={arrowBackOutline}
          ></IonIcon>
          <IonChip color="secondary">{to}</IonChip>
          {/* top header date time */}
        </div>
        <div className={"flex w-full justify-evenly"}>
          <IonLabel
            color="dark"
            onClick={() => {
              if (owner) {
                setCurrentOrder(orderDocSnap);
                history.push(
                  "/OrdersPage/" + orderDocSnap.id + "/applications"
                );
              }
            }}
          >
            {"تم قبول الطلب: "}
            {data.applications.length}
          </IonLabel>

          <IonLabel color="dark" onClick={() => toggleComment()}>
            {"الوصف: " + (showComment ? comment : comment.slice(0, 50) + "...")}
          </IonLabel>
        </div>

        <div className={"flex w-full justify-between "}>
          <div>
            {!owner && (
              <IonButton
                className={"self-end"}
                onClick={() => {
                  _applyToOrder();
                }}
              >
                {userApplied !== undefined && (
                  <IonIcon
                    slot={"icon-only"}
                    icon={userApplied ? thumbsDownOutline : thumbsUpOutline}
                  ></IonIcon>
                )}
                {userApplied === undefined && <IonSpinner></IonSpinner>}
                {userApplied !== undefined
                  ? userApplied
                    ? "un accept"
                    : "accept"
                  : ""}
              </IonButton>
            )}
          </div>
          <div>
            {owner && (
              <IonButton
                fill="clear"
                onClick={() => {
                  deleteOrder(orderDocSnap);
                  if (typeof onDeleted == "function") {
                    onDeleted();
                  }
                }}
                color="light"
                shape="round"
              >
                <IonIcon
                  size="large"
                  color="success"
                  icon={trashOutline}
                ></IonIcon>
              </IonButton>
            )}
            {!owner && (
              <IonButton
                fill="clear"
                onClick={() => setReporting(!reporting)}
                color="dark"
                shape="round"
              >
                <IonIcon
                  size="large"
                  color="success"
                  icon={alertCircleOutline}
                ></IonIcon>
                {/* إبلاغ */}
              </IonButton>
            )}
            {!owner && (
              <IonButtons>
                {!owner && (
                  <IonButton
                    fill="clear"
                    onClick={() => history.push("/chat/" + data.uid)}
                    color="dark"
                    shape="round"
                  >
                    <IonIcon
                      size="large"
                      color="success"
                      icon={chatboxEllipses}
                    ></IonIcon>
                    chat
                  </IonButton>
                )}
                {!owner && !!userInfo.phoneNumber && (
                  <IonButton
                    onClick={() => OpenWhatsapp(userInfo.phoneNumber)}
                    color="light"
                    shape="round"
                    fill="clear"
                    size="small"
                  >
                    <IonIcon
                      size="large"
                      color="success"
                      icon={logoWhatsapp}
                    ></IonIcon>
                  </IonButton>
                )}
              </IonButtons>
            )}
          </div>
        </div>
      </div>

      {/* //messengers popover */}

      <IonPopover isOpen={reporting}>
        <IonLabel slot="primary">اذكر السبب</IonLabel>

        <IonTextarea
          onIonChange={(e) => {
            setReportWhy(e.detail.value!);
          }}
        ></IonTextarea>

        <IonButton
          onClick={(e) => {
            setReporting(false);
            onReport();
          }}
        >
          submit
        </IonButton>
      </IonPopover>
    </div>
  );
};
export default OrderCard;
