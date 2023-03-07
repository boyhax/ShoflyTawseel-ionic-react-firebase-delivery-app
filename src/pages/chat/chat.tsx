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
  IonToolbar,
  IonThumbnail,
  IonImg,
  IonSkeletonText,
} from "@ionic/react";
import {
  addDoc,
  collection,
  DocumentData,
  limit,
  onSnapshot,
  orderBy,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router";
import { imageOutline, sendOutline } from "ionicons/icons";

import "./chat.css";
import Page from "../../components/Page";
import { db, mydb } from "../../providers/firebaseMain";
import { Camera, CameraResultType, Photo } from "@capacitor/camera";
import useMounted from "../../hooks/useMounted";
import { ChatProps, MessageProps } from "../../Stores/chatStore";
import useQuerySnapShot from "../../hooks/useQuerySnapShot";
import MessageBubble from "./MessageBubble";
import { TT } from "../../components/utlis/tt";

export default function Chat({ id, chaters }: ChatProps): JSX.Element {
  const [chatInput, setChatInput] = useState<string>("");
  const chatInputElement = useRef<HTMLInputElement|any>();
  const [sending, setSending] = useState(false);

  
  const uid = getAuth().currentUser?.uid;
  const [photo, setPhoto] = useState<string>();

  const [Messages, setMessages] = useState<MessageProps[]>([]);
  const chatContainer: any = useRef();
  var que = query(
    collection(mydb.db, "chats/", id, "/messages"),
    orderBy("time", "desc"),
    limit(20)
  );

  const { data, loading } = useQuerySnapShot(que);

  useEffect(() => {
    if (data) {
      let messages: MessageProps[] = [];
      data.forEach((v) => {
        messages.push(v.data() as MessageProps);
      });
      setMessages(messages.sort((a, b) => a.time - b.time));
    }
    scrollToBottom();
  }, [data]);

  function scrollToBottom() {
    chatContainer.current.scrollToBottom(0);
  }
  async function onSendMessage() {
    setSending(true);
    const text = chatInput;
    // var photoUrl = "";
    // if (photo) {
    //   // chatInputElement.current!.disabled = true;
    //   photoUrl = await sendPhoto(photo);
    //   // chatInputElement.current!.disabled = false;
    // }
    let data = {
      data: photo,
      text: text,
    };
    mydb.sendMessage(id, data);
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
    
    let data = {
      data: photourl,
      text: text,
    };
    mydb.sendMessage(id, data);
    setChatInput("");
    setPhoto(undefined);
    setSending(false);

  }
  return (
    <Page>
      <IonContent
        className={"flex flex-col gap-2 w-full ltr "}
        ref={chatContainer}
      >
        {Messages &&
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
          <div className="flex items-center justify-between w-full p-3 border-t border-gray-300">
            {/* <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button> */}
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

            {/* <button>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button> */}

            <input
              disabled={sending}
              onChange={(e) => setChatInput(String(e.currentTarget.value))}
              type="text"
              value={sending?TT('Sending ...'):chatInput}
              placeholder="Message"
              className="block mx-3 w-full py-2 pl-4 mx-3 bg-gray-100 rounded-full outline-none focus:text-gray-700"
              name="message"
              required
            />
            {/* <button>
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24"
    stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
  </svg>
</button> */}
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
          {/* <button
              className={"mx-2 "}
              // fill="clear"
              type={"submit"}
            >
              <IonIcon size="large" icon={sendOutline}></IonIcon>
            </button>
            <IonInput
            className={'w-full'}
              required
              type="text"
              clearInput={true}
              value={chatInput}
              onIonChange={(e) => setChatInput(String(e.detail.value))}
              placeholder="write here"
            ></IonInput> */}
          {/* <IonButton
              fill={"clear"}
              onClick={async () => {
                await Camera.getPhoto({
                  resultType: CameraResultType.Base64,
                }).then((photo) => {
                  // sendPhoto(photo);
                  setPhoto(photo);
                });
              }}
            >
              <IonIcon icon={imageOutline} />
            </IonButton> */}
          {/* <IonButton fill="clear" id="attachTrigger">
              <IonIcon size="large" icon={attachOutline}></IonIcon>
            </IonButton> */}
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
