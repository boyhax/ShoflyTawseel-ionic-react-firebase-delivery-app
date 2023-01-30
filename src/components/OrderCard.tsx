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
  useIonAlert,
  IonButtons,
} from "@ionic/react";
import { getAuth } from "firebase/auth";
import {
  deleteDoc,
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import {
  trashOutline,
  thumbsDownOutline,
  thumbsUpOutline,
  logoWhatsapp,
  arrowBackOutline,
  timeOutline,
  chatboxOutline,
  alertCircleOutline,
} from "ionicons/icons";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHistory } from "react-router";

import {
  applyForCard,
  db,
  deleteOrder,
  getGeoCode,
  getUserInfoPlaceHolder,
  makeOrderFromDoc,
  mydb,
  reportOrder,
} from "../providers/firebaseMain";
import geoFirestore from "../providers/geofirestore";
import { useGlobals } from "../providers/globalsProvider";
import { orderProps, userInfo } from "../types";
import "./OrderCard.css";
import { citienames } from "./utlis/citiesUtlis";
import { prettyDate } from "./utlis/prettyDate";


interface props extends ComponentProps {
  order: orderProps;

}
export var Currentplatform = "web";
Device.getInfo().then((v) => {
  Currentplatform = v.platform;
});
const OpenWhatsapp = (number: any) => {
  window.open("http://wa.me/" + number);
};
const OrderCard = ({order}: props) => {

  
  var date =order && prettyDate(new Date(order.time.seconds * 1000));
  const [mounted, setMounted] = useState(true);


  const [deleted, setDeleted] = useState(false);
  const [reportWhy, setReportWhy] = useState<string>('');
  const uid = getAuth().currentUser?.uid;
  const { user, profile,userApplications } = useGlobals();
  const history = useHistory();
  const owner = order!.uid === uid;
  const [userInfo, setUserInfo] = useState<userInfo>(getUserInfoPlaceHolder());
  const [showComment, setShowComment] = useState(false);
  const [to, setTo] = useState('');
  const [from, setFrom] = useState('');

  useEffect(() => {
    // getFrom();getTo();
    checkUserApplied();
    return()=>{setMounted(false)}
  }, []);
  async function getFrom(){
    // const p = await getGeoCode(order.geo.from);
    // console.log('from=>',p)
    geoFirestore.getCity(order.geo.from,(v)=>{
      console.log(v)
      setFrom(v)  
    })
    // setFrom(p?p.formatted_address:'')
  }
  async function getTo(){
    // const p = await getGeoCode(order.geo.to);
    // setTo(p?p.formatted_address:'')
  }

  const [userApplied,setUserApplied] = useState<boolean>()

    async function checkUserApplied(){
      setUserApplied(undefined)
    if(mydb.user){
      const app = await mydb.is_user_applied_to_card(mydb.user.uid,order.id)
      mounted && setUserApplied(app)
      return
    }else{

    }  
    mounted && setUserApplied(false)

  }

  useEffect(() => {
    
    if (order.uid === uid && profile) {
      mounted && setUserInfo({
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


    return () => {
    };
  }, []);

  const toggleComment = () => {
    setShowComment(!showComment);
  };
  const [presentAlert] = useIonAlert();

  async function _applyToOrder() {
    setUserApplied(undefined)
    if (!userApplied) {
      await applyForCard(uid!, order.id, order.uid!).then((d)=>{
        mounted && setUserApplied(true)
      });
    } else {
        await mydb.removeApplicationToOrder( order.id).then((d)=>{
          mounted && setUserApplied(false)
        });;
    }
  }
  function Report(why:string) {
    reportOrder(order.id, why);
  }
  if(deleted){
    return<></>
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
            onClick={() => history.push("/profile/" + order.uid)}
          >
            <IonImg src={userInfo.photoURL}></IonImg>
          </IonAvatar>
          <IonLabel color="dark" className={" mx-2 text-center"}>
            {userInfo.name}
          </IonLabel>
          <IonLabel
            color="dark"
          >
            {date}
          </IonLabel>
        </div>

        <div className="flex w-full items-center justify-around flex-row-reverse">
          <IonChip color="secondary">{order.from}</IonChip>
          <IonIcon
            color={"primary"}
            size={"large"}
            icon={arrowBackOutline}
          ></IonIcon>
          <IonChip color="secondary">{order.to}</IonChip>
          {/* top header date time */}
        </div>
        <div className={"flex w-full justify-evenly"}>
          

          <IonLabel color="dark" onClick={() => toggleComment()}>
            {"الوصف: " + (showComment ? order.comment : order.comment.slice(0, 50) + "...")}
          </IonLabel>
        </div>

        <div className={"flex w-full  justify-between "}>
          {!owner && (
            <IonButton
            disabled={!user}
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
          <IonButtons className={"flex flex-end justify-end"}>
            {owner && (
              <IonButton
                fill="clear"
                onClick={() => {
                  deleteOrder(order.id);
                  setDeleted(true)
                }}
              >
                <IonIcon
                  size="small"
                  color="primary"
                  icon={trashOutline}
                ></IonIcon>
              </IonButton>
            )}
            {!owner && (
              <IonButton
                fill="clear"
                // onClick={() => setReporting(!reporting)}
                color="dark"
                shape="round"
                id={`reportButton ${order.id}`}
              >
                <IonIcon
                  size="small"
                  color="success"
                  icon={alertCircleOutline}
                ></IonIcon>
                {/* إبلاغ */}
              </IonButton>
            )}
            {!owner && (
              <IonButton
                fill="clear"
                onClick={() => history.push("/chat/" + order.uid)}
                color="dark"
                shape="round"
              >
                <IonIcon
                  size="small"
                  color="success"
                  icon={chatboxOutline}
                ></IonIcon>
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
                  size="small"
                  color="success"
                  icon={logoWhatsapp}
                ></IonIcon>
              </IonButton>
            )}
          </IonButtons>
        </div>
      </div>

      {/* //messengers popover */}

      <IonPopover trigger={`reportButton ${order.id}`}>
        <form onSubmit={() => {
            Report(reportWhy);
          }}
          className='flex items-center flex-col'
          >
        <IonTextarea
        placeholder={'why...'}
        required
          onIonChange={(e) => {
            setReportWhy(e.detail.value!);
          }}
        ></IonTextarea>
        <IonButton
        type={'submit'}>
          Send
        </IonButton>
        </form>

       

        
      </IonPopover>
    </div>
  );
};
export default OrderCard;
