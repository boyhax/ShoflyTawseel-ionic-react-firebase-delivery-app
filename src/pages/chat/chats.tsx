import React, {  } from "react";
import {
  IonContent,
  IonTitle,
  IonToolbar,
  IonAvatar,
  IonCardSubtitle,
  IonHeader,
  IonButton,
  IonButtons,
  IonIcon,
  useIonRouter,
  IonList,
  IonCardTitle,
  IonBadge,
} from "@ionic/react";
import Page from "../../components/Page";
import { TT } from "../../components/utlis/tt";
import { chevronBackOutline } from "ionicons/icons";
import { useChat } from "../../providers/chatProvider";
import { timeAgo } from "../../lib/timeAgo";

export default function Chats(props: any) {
  const router = useIonRouter();
  const { chatItems: items } = useChat();

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
      <IonContent fullscreen={true}>
        <IonList>
          {items.map((item) => (
            <div
              className={"flex justify-between items-center space-x-2 border-b-2 border-gray-300 p-2"}
              onClick={() => router.push(`chat/${item.id}`, "forward", "push")}
              key={item.id}
            >
              <IonAvatar>
                <img alt="avatar" src={item.icon} />
              </IonAvatar>
              <div className={'w-[50%]'}>
                <IonCardTitle>{item.name}</IonCardTitle>

                <p className={"truncate w-1/2 text-sm"}>{item.lastMessage}</p>
              </div>

              <IonCardSubtitle style={{ direction: "ltr" }}>
                {timeAgo(item.lastMessageTime)}
              </IonCardSubtitle>
              <IonBadge class={"m-auto"}>{item.unreadMessages}</IonBadge>
            </div>
          ))}
        </IonList>
      </IonContent>
    </Page>
  );
}

//  message data
// data
// ""
// (string)
// isRead
// true
// receiver
// "asdsd"
// sender
// "dsfdfs"
// text
// "hello first message"
// time
// September 26, 2022 at 9:52:36 AM UTC+4
// type
// "text"
