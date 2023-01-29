import React, { useEffect, useState } from 'react';
import { IonContent, IonTitle, IonToolbar, IonLabel, IonItem, IonAvatar, IonImg, IonSkeletonText, IonCardSubtitle, IonGrid } from '@ionic/react';
import { useGlobals } from '../../providers/globalsProvider';
import { addDoc, collection, doc, DocumentData, getFirestore, onSnapshot, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useHistory, useParams } from 'react-router';
import Chat from './chat';
import Page from '../../components/Page';
import { db } from '../../providers/firebaseMain';

export default function Chats(props: any) {
  const { user, profile } = useGlobals()
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<any>(undefined)
  const [refreshing, setRefreshing] = useState(true)
  const [isMounted, setIsMounted] = useState(true)
  const [currentChat, setCurrentChat] = useState<any | QueryDocumentSnapshot<DocumentData>>("")
  const [makingChat, setMakingChat] = useState(false)
  const [list, setList] = useState<null | QueryDocumentSnapshot<DocumentData>[]>(null)
  const uid = getAuth().currentUser?.uid
  const params: any = useParams()
  const history = useHistory()

  useEffect(() => {
    if (!user) {
      return
    }
    const unsub = getData();
    return () => { unsub() }
  }, [user])
  useEffect(() => {
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  }, [])
  useEffect(() => {
    if (!!params.id && !!list) {
      console.log('list on effect :>> ', list);
      const chat = list.find((value, index, array) => {
        return value.data().chaters.includes(params.id, 0)
      })
      console.log('chat :>> ', chat);
      if (!!chat) {
        setCurrentChat(chat)
      } else {
        if (!makingChat) {
          setMakingChat(true)
          addDoc(collection(db, "chats"), { chaters: [uid, params.id] }).finally(() => {
            setMakingChat(false)
          })
        }
      }
    }
  }, [list])

  function getData() {
    setRefreshing(true)
    const ref = collection(getFirestore(), "chats")
    var firstQuery = ref
    var finalQuery = query(firstQuery, where("chaters", 'array-contains-any', [getAuth().currentUser?.uid]))

    const unsub = onSnapshot(finalQuery, (snap) => {
      var newList: any[] = []
      snap.forEach((doc) => {
        newList.push(doc)
      })
      if (isMounted) {

        setList(newList)
        setRefreshing(false)
      } else {
        unsub()
      }
    })
    return unsub
  };



  if (!!currentChat) {
    return <Chat doc={currentChat} onGoBack={() => { setCurrentChat("") }}></Chat>
  }

  return (
    <Page>


      <IonContent fullscreen={true}>
        <IonToolbar color={'primary'}>
          <IonTitle className={'ion-padding'}>Chats</IonTitle>
        </IonToolbar>
        {(!list || (list && !list.length)) && !refreshing &&<div className={'flex justify-center'}>
          <IonLabel>No Chats</IonLabel>
        </div>}
        {!!list && list.map((value, key: any) => {
          return <ChatItem onChatClicked={() => setCurrentChat(value)} chatDocSnap={value} key={key}>

          </ChatItem>
        })
        }
        {refreshing && <ChatsPlaceHolder />}
        {!refreshing && !list && EmptyChat}

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

interface ChatItemProps {
  chatDocSnap: QueryDocumentSnapshot<DocumentData>,
  onChatClicked: () => void

}

interface ChatItemState {
  chaterID: string,
  lastMessage: string,
  messagesDocs: QueryDocumentSnapshot<DocumentData>[],
  chaterPhotoURL: string,
  chaterName: string,
  lastMessageTimeStamp: "" | Date,
  unsubs: any[]

}

class ChatItem extends React.Component<ChatItemProps, ChatItemState> {
  constructor(props: ChatItemProps) {
    super(props);
    this.state = {
      chaterID: this.getOtherChater(), unsubs: [],
      lastMessage: 'chat here',
      messagesDocs: [],
      chaterPhotoURL: require("../../assets/avatarPlaceHolder.png"),
      chaterName: "", lastMessageTimeStamp: ""
    };
  };

  getOtherChater() {
    const uid = getAuth().currentUser?.uid
    var otherChaters: string[] = this.props.chatDocSnap.data().chaters
      .filter((v: any) => { return v !== uid })
    return otherChaters[0]
  }
  componentDidMount() {
    var unsub = this.getChatMessages();
    var unsub2 = this.getChaterPhotoURL();
    this.setState({
      unsubs: [unsub, unsub2]
    })
  }
  componentWillUnmount() {
    for (let n of this.state.unsubs) {
      n()
    }

  }

  componentDidUpdate(prevProps: ChatItemProps, prevState: ChatItemState) {
    // console.log('state  :>> ', this.state );
  }
  getChaterPhotoURL() {
    return onSnapshot(doc(db, "users/" + this.state.chaterID), (snap) => {
      console.log('chater :>> ', snap.data());
      this.setState({
        chaterPhotoURL: snap.data()!.photoURL,
        chaterName: snap.data()!.name
      })
    })
  }
  getChatMessages = () => {
    return onSnapshot(query(collection(this.props.chatDocSnap.ref, "messages"))
      , (snap) => {
        if (snap.empty) { return }
        this.setState({
          messagesDocs: snap.docs,
          lastMessage: snap.docs[0].data().text,
          lastMessageTimeStamp: new Date(snap.docs[0].data().time.seconds * 1000),
        })
      })
  }
  render() {
    return (<IonItem dir='ltr' onClick={() => { this.props.onChatClicked() }}>
      <IonAvatar><IonImg src={this.state.chaterPhotoURL} ></IonImg></IonAvatar>
      <IonLabel>{this.state.lastMessage}</IonLabel>
      <IonLabel slot='end'>{this.state.lastMessageTimeStamp !== "" ?
        this.state.lastMessageTimeStamp.toLocaleTimeString() : ""}</IonLabel>
    </IonItem>);
  }
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

