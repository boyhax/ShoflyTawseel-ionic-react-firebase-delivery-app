import { Store } from 'pullstate';
import * as React from 'react';

interface Message{
    from:string,
    text:string,
    type:string,
    timestamp:string

}
interface Chat{
    Messages:Message[]
}
const ChatStore={
    unreadMessagesNumber:0,
    chats:[]

}
 const chatStore = new Store(ChatStore)

 chatStore.update((s)=>{return {unreadMessagesNumber:5}})
 export default chatStore