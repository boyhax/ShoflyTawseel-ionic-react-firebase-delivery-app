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
        <div className="chat-bubble w-[65%]">
          <p className="text-sm">{messageData.text}</p>
          {messageData.type === "picture" && (
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
        <div className="chat-bubble">
          <p className="text-sm">{messageData.text}</p>
          {messageData.type === "picture" && (
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
  }

  return (
    <div
      className={`flex w-full mt-2 space-x-3 max-w-xs ${
        owner ? "float-left flex-row" : "float-right flex-row-reverse"
      }`}
    >
      <IonAvatar>
        <IonImg alt={"user avatar"} src={messageData.iconURL} />
      </IonAvatar>
      <div className={`w-[70%]`}>
        <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
          <p className="text-sm">{messageData.text}</p>
          {messageData.type === "picture" && (
            <img
              alt={"ddd"}
              className={"h-max-[100px] w-max-[100px]"}
              src={messageData.data}
            />
          )}
        </div>
        <span className="text-xs text-gray-500 leading-none">
          {prettyDate(new Date(messageData.time.seconds * 1000))}
        </span>
      </div>
    </div>
  );
  return (
    <IonItem
      dir={owner ? "rtl" : "ltr"}
      className={` 
        ${
          owner
            ? " rtl bg-blue-400 justify-self-end"
            : " ltr bg-blue-400 justify-self-end"
        }`}
    >
      <IonText style={{ padding: "10px", maxInlineSize: "75%" }}>
        {messageData.text}
      </IonText>
      {messageData.type === "picture" && (
        <img
          alt={"ddd"}
          className={"h-max-[100px] w-max-[100px]"}
          src={messageData.data}
        />
      )}
      <IonLabel slot="end" style={{ fontSize: "small", alignSelf: "flex-end" }}>
        {new Date(messageData.time.seconds * 1000).toLocaleTimeString()}
      </IonLabel>
    </IonItem>
  );
}
