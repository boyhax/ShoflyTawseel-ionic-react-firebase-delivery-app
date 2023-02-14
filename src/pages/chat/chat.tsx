import React, { FC, useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonPage,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonInput,
  IonLabel,
  IonItem,
  IonAccordionGroup,
  IonAccordion,
  IonList,
  IonSpinner,
  IonBackButton,
  IonSlides,
  IonSlide,
  IonCard,
  IonCardTitle,
  IonAvatar,
  IonImg,
  IonButton,
  IonIcon,
  IonFooter,
  IonGrid,
  IonCol,
  IonText,
  IonPopover,
} from "@ionic/react";
import { useGlobals } from "../../providers/globalsProvider";
import {
  addDoc,
  collection,
  doc,
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  FieldValue,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
  serverTimestamp,
  setDoc,
  Timestamp,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { Redirect, useHistory, useParams } from "react-router";
import { TT } from "../../components/utlis/tt";
import {
  attachOutline,
  chevronBack,
  imageOutline,
  locationOutline,
  sendOutline,
} from "ionicons/icons";

import "./chat.css";
import Page from "../../components/Page";
import { db, mydb } from "../../providers/firebaseMain";
import { Camera, CameraResultType, Photo } from "@capacitor/camera";

interface MessageProps {
  time: any;
  text: string;
  type: string;
  data: any;
  from: string;
  isRead?: boolean;
}
export default function Chat(props: any) {
  const { user, profile } = useGlobals();
  const [loading, setLoading] = useState(true);
  const [chatDocSnap, setChatDocSnap] =
    useState<null | QueryDocumentSnapshot<DocumentData>>(null);
  const [refreshing, setRefreshing] = useState(true);
  const [isMounted, setIsMounted] = useState(true);
  const [chatInput, setChatInput] = useState<string>("");
  const uid = getAuth().currentUser?.uid;

  const [Messages, setMessages] = useState<MessageProps[]>([]);
  const auth = getAuth();
  const params: any = useParams();
  const history = useHistory();
  const { doc } = props;
  const inputRef: any = useRef();
  const chatContainer: any = useRef();

  useEffect(() => {
    const unsub = getData();
    return () => {
      if (!!unsub) {
        unsub();
      }
    };
  }, []);
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);
  useEffect(() => {
    scrollToBottom();
  }, [Messages]);

  function getData() {
    setRefreshing(true);

    return onSnapshot(
      query(collection(doc.ref, "messages"), orderBy("time", "asc")),
      (snap) => {
        console.log("messages snap :>> ", snap);

        if (isMounted && !snap.empty) {
          let messages: MessageProps[] = [];
          snap.forEach((v) => {
            const m = v.data();
            messages.push({
              time: m.time,
              text: m.text,
              type: m.type,
              data: m.data,
              from: m.from,
            });
          });
          setMessages(messages);
        }
        setRefreshing(false);
      }
    );
  }
  function scrollToBottom() {
    chatContainer.current.scrollToBottom(500);
  }
  function onSendMessage() {
    const text = chatInput;
    const from = getAuth().currentUser?.uid;

    let newMessage = {
      time: new Date(),
      from: from,
      data: null,
      type: "text",
      text: text,
      isRead: false,
    };
    addDoc(collection(db, "chats/" + doc.id, "/messages"), newMessage);
    // let messages = !!Messages?Messages:[]
    // messages.push(newMessage)
    // setMessages(messages)
    setChatInput("");
  }
  async function sendPhoto(photo: Photo) {
    const text = chatInput;
    const from = getAuth().currentUser?.uid;
    let photourl = await mydb.uploadPhoto(
      photo.base64String ?? "",
      `${from}/${new Date()}.png`
    );
    let newMessage = {
      time: new Date(),
      from: from,
      data: photourl,
      type: "picture",
      text: text,
      isRead: false,
    };
    addDoc(collection(db, "chats/" + doc.id, "/messages"), newMessage);
  }
  return (
    <Page>
      <IonContent ref={chatContainer} >
        <div className={'flex flex-col gap-2 w-full '}>
        {!!Messages &&
          Messages.map((value: MessageProps, key: any) => {
            return (
              <MessageBubble
                owner={value.from === uid}
                messageData={value}
                key={key}
              ></MessageBubble>
            );
          })}
        </div>
        
      </IonContent>
      <IonFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
        >
          <IonItem>
            <IonButton
              fill="clear"
              type={"submit"}
              // onClick={()=>onSendMessage()}
            >
              <IonIcon size="large" icon={sendOutline}></IonIcon>
            </IonButton>
            <IonInput
              required
              type="text"
              clearInput={true}
              value={chatInput}
              onIonChange={(e) => setChatInput(String(e.detail.value))}
              placeholder="write here"
            ></IonInput>
            <IonButtons>
            <IonButton
              onClick={async () => {
                await Camera.getPhoto({
                  resultType: CameraResultType.Base64,
                }).then((photo) => {
                  sendPhoto(photo);
                });
              }}
            >
              <IonIcon icon={imageOutline} />
            </IonButton>
            </IonButtons>
            {/* <IonButton fill="clear" id="attachTrigger">
              <IonIcon size="large" icon={attachOutline}></IonIcon>
            </IonButton> */}
          </IonItem>
        </form>
      </IonFooter>
      <IonPopover trigger={"attachTrigger"} side="top">
        <IonContent>
          <IonButtons>
            <IonButton
              onClick={async () => {
                await Camera.getPhoto({
                  resultType: CameraResultType.Base64,
                }).then((photo) => {
                  sendPhoto(photo);
                });
              }}
            >
              <IonIcon icon={imageOutline} />
            </IonButton>
            {/* <IonButton>
              <IonIcon icon={locationOutline} />
            </IonButton> */}
          </IonButtons>
        </IonContent>
      </IonPopover>
    </Page>
  );
}

interface ChatItemProps {
  messageData: MessageProps;
  owner: boolean;
}

function MessageBubble(props: ChatItemProps) {
  return (
    <IonItem
      className={` 
      ${props.owner ? " rtl bg-blue-400 justify-self-end" 
      : " ltr bg-blue-400 justify-self-end"}`}
    >
      <IonText style={{ padding: "10px", maxInlineSize: "75%" }}>
        {props.messageData.text}
      </IonText>
      {props.messageData.type === "picture" && (
        <img
          alt={"ddd"}
          className={"h-max-[100px] w-max-[100px]"}
          src={props.messageData.data}
        />
      )}
      <IonLabel slot="end" style={{ fontSize: "small", alignSelf: "flex-end" }}>
        {new Date(props.messageData.time.seconds * 1000).toLocaleTimeString()}
      </IonLabel>
    </IonItem>
  );
}
