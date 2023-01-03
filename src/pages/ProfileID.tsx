import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonButtons, IonLabel, IonItem, IonList, IonSpinner, IonBackButton, IonSegment, IonSegmentButton, IonGrid, IonRow, IonAvatar, IonImg, IonHeader } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, DocumentData, DocumentSnapshot, getDoc, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import OrderCard from '../components/OrderCard';
import { db } from '../App';
import { useHistory, useParams } from 'react-router';


 const ProfileID: React.FC = (props) => {
    const[userProfile,setUserProfile] = useState<any>(null)
    const [content,setContent]=useState<"orders"|"deliver"|"editProfile">("orders")
    const [pickAvatar,setPickAvatar] = useState(false)
    const parms:any = useParams()
    const id = parms.id
    const history =useHistory()
    const uid = id
    useEffect(()=>{
      getDoc(doc(db,"users",id)).then((snap)=>{
        snap.exists()?setUserProfile(snap.data()):setUserProfile(undefined)
      })
  },[]);
  
   
    
    return (
    <IonPage >
      
      <IonHeader>
      <IonItem>
          <IonGrid >
            <IonRow>
              <IonRow>
                <IonAvatar>
                    <IonImg src={
                      !!userProfile.photoURL?userProfile.photoURL
                        :require("../assets/avatarPlaceHolder.png")}>
                      
                  </IonImg>
                  </IonAvatar>
                  <IonTitle>{userProfile.name}</IonTitle>

              </IonRow>
              </IonRow>
          </IonGrid>
          <IonBackButton defaultHref='/'></IonBackButton>

        </IonItem>
        </IonHeader>
      {content !=="editProfile" &&<IonSegment  value={content}>
        <IonSegmentButton value="orders" onClick={()=>setContent('orders')}>
          <IonLabel>orders</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="deliver" onClick={()=>setContent('deliver')}>
          <IonLabel>deliver</IonLabel>
        </IonSegmentButton>
      </IonSegment>}

      

      {!!userProfile && content ==="orders"&& 
            <IonContent>
              <ProfileOrdersList uid={uid}/>
            </IonContent>}
      
      {!!userProfile && content ==="deliver"&& 
          <IonContent>
            <ProfileApplicationsList uid={uid}/>
        </IonContent>}
      
    </IonPage>
  );
};

export default ProfileID

const ProfileOrdersList:FC<props>=({uid}:props)=>{
  const [list,setList]=useState<DocumentSnapshot<DocumentData>[]>([])
  const [refreshing,setRefreshing] = useState(true)
  const [isMounted, setIsMounted] = useState(true)
  useEffect(()=>{
    const unsub = getData();
    return()=>{unsub()}
  },[])
  

   function getData() {
    setRefreshing(true)
    const ref = collection(getFirestore(),"orders")
    var firstQuery = query(ref,orderBy("time","desc"))
    var finalQuery= query(firstQuery,where("uid","==",uid))
    
    return onSnapshot(finalQuery,(snap)=>{

        let newDocs:DocumentSnapshot[]=[]

        snap.forEach((doc)=>{newDocs.push(doc)})

        if(isMounted){
         setList(newDocs)
         setRefreshing(false)    
        }
      })
  } 
  
  return<IonList>
    {refreshing && <IonSpinner></IonSpinner>}
      {!!list && list.map((value, index, array) => {
        
        return <OrderCard orderDocSnap={value} key={index} ></OrderCard>
        })}
        {!list && !refreshing && <IonButton onClick={()=>getData()}>refresh</IonButton>}
  </IonList>
}


type props={
  uid:string
}
const ProfileApplicationsList:FC<props>=({uid}:props)=>{
  const [list,setList]=useState<DocumentSnapshot<DocumentData>[]>([])
  const [refreshing,setRefreshing] = useState(true)
  const [isMounted, setIsMounted] = useState(true)
  const {user,profile} = useGlobals()
  useEffect(()=>{
      const unsub = getData();
      return()=>{unsub()}
  },[])
  useEffect(()=>{
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  },[])

   function getData() {
    setRefreshing(true)
    const ref = collection(db,"ordersApplications")
    var finalQuery= query(ref,where("byUser","==",uid))
    
    return onSnapshot(finalQuery,(snap)=>{
      if(snap.empty){return};

      let newList:DocumentSnapshot<DocumentData>[]=[]

      snap.forEach((doc)=>{
         newList.push(doc)
        })
        if(isMounted){
         setList(newList)
         setRefreshing(false)    
        }
    })
  } 
  
  return<IonList>
    {refreshing && <IonSpinner></IonSpinner>}
      {/* {!!list && list.map((value,index:any) => {
        return <ApplicationCard docsnap={value} key={index}></ApplicationCard>
          })
        } */}
  </IonList>
}
