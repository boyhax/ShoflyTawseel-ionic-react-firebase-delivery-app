import * as React from "react";
import { IonItem, IonText, IonLabel, IonAvatar, IonImg } from "@ionic/react";
import { MessageProps } from "../../Stores/chatStore";
import { prettyDate } from "../../components/utlis/prettyDate";

interface Props {
  messageData: MessageProps;
  owner: boolean;
}

export default function MessageBubble({ messageData, owner }: Props) {
  if (owner) {
    return (
      <div className="chat chat-start ">
        <div className="chat-image avatar">
          <IonAvatar>
            <IonImg alt={"user avatar"} src={messageData.iconURL} />
          </IonAvatar>
        </div>
        <div className="chat-header">
          {messageData.name}
          <time className="text-xs opacity-50">
            {prettyDate(new Date(messageData.time.seconds * 1000))}
          </time>
        </div>
        <div className="bg-green-600 p-3 rounded-xl rounded-tr-none ">
          <p className="text-sm text-white">{messageData.text}</p>
          {messageData.data && (
            <img
              alt={"ddd"}
              className={"max-h-[300px]  max-w-[300px]"}
              src={messageData.data}
            />
          )}
        </div>
        <div className="chat-footer opacity-50">
          {messageData.isRead ? "✓✓" : "✓"}
        </div>
      </div>
    );
  } else {
    return (
      <div className="chat chat-end ">
        <div className="chat-image avatar">
          <IonAvatar>
            <IonImg alt={"user avatar"} src={messageData.iconURL} />
          </IonAvatar>
        </div>
        <div className="chat-header">
          {messageData.name}
          <time className="text-xs opacity-50">
            {prettyDate(new Date(messageData.time.seconds * 1000))}
          </time>
        </div>
        <div className=" bg-gray-600 p-3 rounded-xl rounded-tl-none ">
          <p className="text-sm text-white">{messageData.text}</p>
          {messageData.data  && (
            <img
              alt={"ddd"}
              className={"h-max-[100px] w-max-[100px]"}
              src={messageData.data}
            />
          )}
        </div>
        <div className="chat-footer opacity-50">
          {messageData.isRead ? "✓✓" : "✓"}
        </div>
      </div>
    );
  }}