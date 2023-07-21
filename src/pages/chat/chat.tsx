import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonButtons,
  IonButton,
  IonIcon,
  IonFooter,
  IonPopover,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonRouter,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonNote,
  IonCol,
  IonText,
  IonInput,
  IonTextarea,
} from "@ionic/react";
import {
  collection,
  DocumentSnapshot,
  limit,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { chevronBackOutline, imageOutline, imageSharp, phonePortraitOutline, sendOutline, sendSharp } from "ionicons/icons";

import "./chat.css";
import Page from "../../components/Page";
import { mydb } from "../../api/firebaseMain";
import { Camera, CameraResultType, Photo } from "@capacitor/camera";
import { ChatProps, MessageProps } from "../../Stores/chatStore";
import useQuerySnapShot from "../../hooks/useQuerySnapShot";
import { TT } from "../../components/utlis/tt";
import { useChat, useMessages, useSingleChatItem } from "../../providers/chatProvider";
import { timeAgo } from "../../lib/timeAgo";
import { useParams } from "react-router";

export default function Chat(): JSX.Element {
  const [chatInput, setChatInput] = useState<string>("");
  const chatInputElement = useRef<HTMLInputElement | any>();
  const [sending, setSending] = useState(false);
  const router = useIonRouter();
  const params:any = useParams()
  const chatId = params.id
  
  const {chatItem,items,sendMessage,setMessageViewed} = useMessages(chatId)

  const uid = getAuth().currentUser?.uid;
  const [photo, setPhoto] = useState<string>();

  const chatContainer: any = useRef();
  

  
  useEffect(() => {
    scrollToBottom();
  }, [items]);

  function scrollToBottom() {
    chatContainer.current.scrollToBottom(0);
  }
  async function onSendMessage() {
    setSending(true);
    const text = chatInput;

    let data = {
      data: photo,
      text: text,
    };
    let message :MessageProps={
      data:'',
      from:uid!,
      text,
      time:new Date(),
      isRead:false,
    }
    sendMessage(message as any,null)
    setChatInput("");
    setPhoto(undefined);
    setSending(false);
  }
  async function sendPhoto(photo: Photo) {
    setSending(true);

    const from = getAuth().currentUser?.uid;
    let photourl = await mydb.uploadPhoto(
      photo.base64String ?? "",
      `${from}/${new Date()}.png`
    );
    const text = chatInput;

    
    let message :MessageProps={
      data:'',
      from:uid!,
      text,
      time:new Date(),
      isRead:false,
    }
    sendMessage(message as any,photo)
    setChatInput("");
    setPhoto(undefined);
    setSending(false);
  }
  return (
    <Page>
      <IonHeader translucent style={{ direction: "ltr" }} collapse={"fade"}>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => router.goBack()}>
              <IonIcon icon={chevronBackOutline} />
            </IonButton>
          </IonButtons>
          <IonTitle>{TT("Chat")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent
        ref={chatContainer}
      >
        <IonList style={{direction:'rtl'}}>
          {items.sort((a:any,b:any)=>a.data().time.seconds>b.data().time.seconds?1:-1).map((doc, index: number) => {
            let item = doc.data() as MessageProps;
            let sender = item.from ===uid
            return (
              <IonItem  style={{direction:sender?'rtl':'ltr'}}  key={index}>
                <IonAvatar>
                  <img alt="avatar" src={chatItem.item.icon} />
                </IonAvatar>
                <IonCol>
                  <IonText>{item.text}</IonText>
                  {sender &&<IonLabel>{item.isRead ? "✓✓" : "✓"}</IonLabel>}
                </IonCol>

                <IonNote style={{direction:'ltr'}} className={"text-sm"}>
                  {item.time?timeAgo(new Date(item.time.seconds * 1000)):''}
                </IonNote>
              </IonItem>
            );
          })}
        </IonList>
        
      </IonContent>

      <IonFooter>
        
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSendMessage();
          }}
        >
          {/* <IonItem dir={'ltr'} color={''}>
          <IonButtons>
            <IonButton color={'dark'}>
              <IonIcon icon={imageSharp}/>
            </IonButton>
          </IonButtons>
          <IonTextarea className={'bg-slate-400 h-16 border-amber-500 border-2 mx-2  rounded-lg '} color={'medium'}  ></IonTextarea>
          <IonButtons>
            <IonButton color={'dark'}>
              <IonIcon icon={sendSharp}/>
            </IonButton>
          </IonButtons>
        </IonItem> */}
          <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
            <button
              onClick={async () => {
                await Camera.getPhoto({
                  resultType: CameraResultType.Base64,
                }).then((photo) => {
                  sendPhoto(photo);
                  // setPhoto(photo);
                });
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-image"
                viewBox="0 0 16 16"
              >
                {" "}
                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z" />{" "}
                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z" />{" "}
              </svg>
            </button>
            <IonTextarea 
              disabled={sending}
              placeholder="Write ..."
              value={sending ? TT("Sending ...") : chatInput}
              required
              onIonChange={(e) => setChatInput(e.detail.value!)}
              onChange={(e) => setChatInput(String(e.currentTarget.value))}

            className={'bg-slate-400 h-16 border-slate-500 border mx-2 rounded-lg '} color={'medium'}  ></IonTextarea>

            {/* <input
              type="text"
              className="block mx-3 w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
            /> */}

            <button type="submit">
              <svg
                className="w-5 h-5 text-gray-500 origin-center transform rotate-90"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
            </button>
          </div>
        </form>
      </IonFooter>
      
    </Page>
  );
}
