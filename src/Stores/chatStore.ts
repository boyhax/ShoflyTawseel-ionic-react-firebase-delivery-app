import { Store } from 'pullstate';
import * as React from 'react';

export interface MessageProps {
    iconURL:string,
    name:string
    time: any;
    text: string;
    type: string;
    data: any;
    from: string;
    isRead?: boolean;
  }

export interface ChatItemProps{
    message:MessageProps,
}
export interface ChatProps{
    id:string,
    chaters:string[]
}
export interface ChatStoreProps{
    unreadMessagesNumber:number,
    chats:ChatProps[]
    chatiItems:ChatItemProps[]
    chatMessages:object
}
const ChatStore={
    unreadMessagesNumber:0,
    chats:[],
    chatiItems:[],
    chatMessages:{},
}
const chatStore = new Store<ChatStoreProps>(ChatStore)

export default chatStore;