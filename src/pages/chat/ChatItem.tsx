import React, { useEffect, useState } from 'react';
import { IonTitle, IonItem, IonAvatar, IonImg, IonSkeletonText, IonCardSubtitle, IonGrid, IonText } from '@ionic/react';
import { collection, limit, orderBy, query } from 'firebase/firestore';
import { useHistory } from 'react-router';
import { mydb } from '../../providers/firebaseMain';
import { ChatProps, MessageProps } from '../../Stores/chatStore';
import useQuerySnapShot from '../../hooks/useQuerySnapShot';
import { prettyDate } from '../../components/utlis/prettyDate';

export default function ChatItem({id,chaters}:ChatProps) {
  const [chat, setChat] = useState<MessageProps>()

  const {data,loading} = useQuerySnapShot(query(collection(mydb.db,'chats/',id, "/messages"), orderBy("time", "desc"), limit(1)))
  const history = useHistory()
  
  useEffect(() => {
    if (data) {
      
      let messages: any[] = [];
      data.forEach((v) => {
        messages.push(v.data() as MessageProps)
      })

      setChat(messages[0])
    }
  }, [data])
  
  
  function onChatClicked(){
    history.push(`/chat/${id}`)
  }
  if(loading ){
    return <IonItem><IonSkeletonText animated={false}></IonSkeletonText></IonItem>
  }
  if(!chat){
    return<IonItem>?</IonItem>
  }
  return (<IonItem dir='ltr' onClick={() => { onChatClicked() }}>
    <IonAvatar><IonImg src={chat.iconURL} ></IonImg></IonAvatar>
    <div className={'flex flex-col w-full'} >
    <div className={'flex flex-row w-full justify-between'}>
    <IonCardSubtitle>@{chat.name}</IonCardSubtitle>
    <IonCardSubtitle slot='end'>{prettyDate(new Date(chat.time.seconds*1000))}</IonCardSubtitle>
    </div>
    <IonText>{chat.text}</IonText>
    </div>
    
  </IonItem>);
}

  


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

