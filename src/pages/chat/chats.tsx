import React, { FC, FunctionComponent, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonSlides, IonSlide, IonCard, IonCardTitle, IonAvatar, IonImg, IonRouterOutlet } from '@ionic/react';
import { useGlobals } from '../../providers/globalsProvider';
import { collection, doc, DocumentData, FieldValue, getDocs, getFirestore, onSnapshot, orderBy, query, QueryDocumentSnapshot, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {  Redirect, Route, useHistory, useParams } from 'react-router';
import { TT } from '../../components/utlis/tt';
import { db } from '../../App';
import Chat from './chat';


export default  function Chats(props:any) {
    const {user,profile} = useGlobals()
    const [loading,setLoading]=useState(true)
    const [data,setData] = useState<any>(undefined)
    const [refreshing,setRefreshing] = useState(true)
    const [isMounted, setIsMounted] = useState(true)
    const [currentChat, setCurrentChat] = useState<any|QueryDocumentSnapshot<DocumentData>>("")
    
    const [list,setList]=useState<null|QueryDocumentSnapshot<DocumentData>[]>(null)
    const auth= getAuth()
    const params:any = useParams()
    const history =useHistory()
    
    useEffect(()=>{
      if(!user){
        return
      }
      const unsub = getData();
      return()=>{unsub()}
    },[user])
    useEffect(()=>{
      setIsMounted(true)
      return () => {
        setIsMounted(false)
      }
    },[])
  
     function getData() {
      setRefreshing(true)
      const ref = collection(getFirestore(),"chats")
      var firstQuery = ref
      var finalQuery= query(firstQuery,where("chaters",'array-contains-any',[getAuth().currentUser?.uid]))
      
      return onSnapshot(finalQuery,(snap)=>{
        console.log('snap :>> ', snap);
        var newList:any[]=[]
        snap.forEach((doc)=>{
           newList.push(doc)
          })
          if(isMounted){
           setList(newList)
           setRefreshing(false)    
          }
        })
      };
      if(!!params.id){
        
      }
      if(!!currentChat){
        return<Chat doc={currentChat}></Chat>
      }
    
    return (
    <IonPage >
      
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle slot='primary' >
          {TT("Chats")}
        </IonTitle>
      </IonToolbar>

      <IonContent>
             {!!list && list.map((value,key:any) => { 
              return<ChatItem onChatClicked={()=>setCurrentChat(value)} chatDocSnap={value} key={key}>
              
             </ChatItem>
             })
             }
      </IonContent>
    </IonPage>
  );
};




interface ChatItemProps {
  chatDocSnap:QueryDocumentSnapshot<DocumentData>,
  onChatClicked:()=>void
  
}
 
interface ChatItemState {
  chaterID:string,
  lastMessage:"",
  messagesDocs:QueryDocumentSnapshot<DocumentData>[],
  chaterPhotoURL:string,
  chaterName:string,
  lastMessageTimeStamp:"" | Date,
  unsubs:any[]

}
 
class ChatItem extends React.Component<ChatItemProps, ChatItemState> {
  constructor(props: ChatItemProps) {
    super(props);
    this.state = {chaterID:this.getOtherChater(),unsubs:[],
      lastMessage:"",messagesDocs:[],chaterPhotoURL:"" ,  chaterName:"",lastMessageTimeStamp:""    };
  };
  
  getOtherChater(){
    const uid = getAuth().currentUser?.uid
    var otherChaters:string[] = this.props.chatDocSnap.data().chaters
    .filter((v:any)=>{return v !== uid})
    return otherChaters[0]
  }
  componentDidMount() {
    var unsub = this.getChatMessages();
    var unsub2 = this.getChaterPhotoURL();
    this.setState({
      unsubs :[unsub,unsub2]
    })
  }
  componentWillUnmount(){
    for(let n of this.state.unsubs){
      n()
    }

  }
  componentDidUpdate(prevProps: ChatItemProps, prevState: ChatItemState) {
    console.log('state  :>> ', this.state );
  }
  getChaterPhotoURL(){
    return onSnapshot(doc(db,"users/"+this.state.chaterID),(snap)=>{
      console.log('chater :>> ', snap.data());
      this.setState({chaterPhotoURL:snap.data()!.photoURL,
                    chaterName:snap.data()!.name
                    })
    })
  }
 getChatMessages=()=> {
return onSnapshot(query(collection(this.props.chatDocSnap.ref,"messages"))
,(snap)=>{
  this.setState({messagesDocs:snap.docs,
                lastMessage:snap.docs[0].data().text,
                lastMessageTimeStamp:new Date(snap.docs[0].data().time.seconds*1000),
              })
})
}
  render() { 
    return (<IonItem dir='ltr' onClick={()=>{this.props.onChatClicked()}}>
      <IonAvatar><IonImg src={this.state.chaterPhotoURL} ></IonImg></IonAvatar>
      <IonLabel>{this.state.lastMessage}</IonLabel>
      <IonLabel slot='end'>{this.state.lastMessageTimeStamp !==""?
      this.state.lastMessageTimeStamp.toLocaleTimeString():""}</IonLabel>
    </IonItem> );
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

