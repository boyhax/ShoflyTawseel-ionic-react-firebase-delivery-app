import React, { useEffect, useState } from 'react';
import { IonContent, IonTitle, IonToolbar, IonLabel, IonItem, IonAvatar, IonSkeletonText, IonCardSubtitle, IonGrid, useIonViewDidEnter, IonBackButton, IonHeader } from '@ionic/react';
import { useParams } from 'react-router';
import Chat from './chat';
import Page from '../../components/Page';
import chatStore, { ChatProps } from '../../Stores/chatStore';
import ChatItem from './ChatItem';
import mydb from '../../api/firebaseMain';


export default function Chats(props: any) {
  
  const [currentChat, setCurrentChat] = useState<ChatProps>()
  
  const {chats} = chatStore.useState()
  const {id}:any = useParams()
  
useEffect(() => {
  if(id){
    let chat = chats.find((v)=>v.chaters.includes(id)||v.id===id)
    chat && setCurrentChat(chat)
    !chat && mydb.makeChatIfUserExist(id)
  }else{
    setCurrentChat(undefined)
  }
}, [chats,id])

      
  

  if (currentChat) {
    return <Chat chaters={currentChat.chaters} id={currentChat.id} ></Chat>
  }

  return (
    <Page backbutton>
      <IonContent fullscreen={true}>
        <IonHeader >
        <IonToolbar className={'h-16'} >
          {/* <IonBackButton  defaultHref={'/'}/> */}
          <IonTitle slot={'secondary'}>Chats</IonTitle>
        </IonToolbar>
        </IonHeader>
        
        {!chats.length &&<div className={'flex justify-center'}>
          <IonLabel>No Chats</IonLabel>
        </div>}
        { chats.map((chat:ChatProps, key: any) => {
          return <ChatItem {...chat}  key={key}/>
        })
        }
        {/* {lo && <ChatsPlaceHolder />} */}
        {/* {!refreshing && !list && EmptyChat} */}

      </IonContent>
    </Page>
  );
};

const ChatsPlaceHolder: React.FC = (props) => {
  return (<IonGrid>
    {[1, 2, 3, 4, 5, 6].map((v,i) => { return CardSkeleton(i) })}
  </IonGrid>
  )
}
const EmptyChat = <div className={'flex justify-center align-middle'}>
  <IonTitle>No Chats now <IonCardSubtitle>Try to reach people </IonCardSubtitle></IonTitle>
</div>
const CardSkeleton =(i:any)=><IonItem key={i}>
  <IonAvatar>
    <IonSkeletonText animated />
  </IonAvatar>
  <IonTitle>
    <IonSkeletonText animated />
  </IonTitle>
  <IonCardSubtitle>
    <IonSkeletonText animated />

  </IonCardSubtitle>
</IonItem>










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

