import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonButtons,
  IonInput,
  IonLabel,
  IonItem,
  IonButton,
  IonIcon,
  IonFooter,
  IonText,
  IonPopover,
} from "@ionic/react";
import {
  addDoc,
  collection,
  DocumentData,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router";
import {
  imageOutline,
  sendOutline,
} from "ionicons/icons";

import "./chat.css";
import Page from "../../components/Page";
import { db, mydb } from "../../providers/firebaseMain";
import { Camera, CameraResultType, Photo } from "@capacitor/camera";
import useMounted from "../../hooks/useMounted";
import { ChatProps, MessageProps } from "../../Stores/chatStore";
import useQuerySnapShot from "../../hooks/useQuerySnapShot";
import MessageBubble from "./MessageBubble";


export default function Chat({id,chaters}:ChatProps):JSX.Element {
  const [chatInput, setChatInput] = useState<string>("");
  const uid = getAuth().currentUser?.uid;

  const [Messages, setMessages] = useState<MessageProps[]>([]);
  const chatContainer: any = useRef();
  var que = query(collection(mydb.db,'chats/',id, "/messages"), orderBy("time", "asc"))

  const {data,loading} = useQuerySnapShot(que)
  
  useEffect(() => {
    if (data) {
      let messages: MessageProps[] = [];
      data.forEach((v) => {
        messages.push(v.data() as MessageProps);
      });
      setMessages(messages);
    }
    scrollToBottom();
  }, [data]);
  
  
      
    
  
  function scrollToBottom() {
    chatContainer.current.scrollToBottom(0);
  }
  function onSendMessage() {
    const text = chatInput;

    let data = {
      data: "",
      type: "text",
      text: text,
    };
    mydb.sendMessage(id,data)
    setChatInput("");
  }
  async function sendPhoto(photo: Photo) {
    const text = chatInput;
    const from = getAuth().currentUser?.uid;
    let photourl = await mydb.uploadPhoto(
      photo.base64String ?? "",
      `${from}/${new Date()}.png`
    );
    let data = {
      data: photourl,
      type: "picture",
      text: text,
    };
    mydb.sendMessage(id,data)
    setChatInput("");
  }
  return (
    <Page>
      <IonContent className={'flex flex-col gap-2 w-full ltr '} ref={chatContainer} >
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
