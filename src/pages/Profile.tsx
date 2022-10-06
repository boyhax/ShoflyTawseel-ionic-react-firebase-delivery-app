import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonChip, IonSegment, IonSegmentButton, IonCard, IonCardContent, IonGrid, IonRow, IonAvatar, IonImg, IonCol, IonItemDivider, IonHeader } from '@ionic/react';
import { createOutline, logOutOutline, } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, DocumentData, DocumentSnapshot, getDocs, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import OrderCard from '../components/OrderCard';
import { Redirect } from 'react-router';
import { orderProps, updateTripCard, updateUserProfile } from '../providers/firebaseMain';
import { TT } from '../components/utlis/tt';
import { ApplicationCard } from './ApplicationsPage';
import { db } from '../App';
import CreatProfile from './CreatProfile';

const Profile: React.FC = () => {
    const {user,profile} = useGlobals()
    const [content,setContent]=useState<"orders"|"deliver"|"editProfile">("orders")
    // const auth= getAuth()
    // const id = useParams()
    // const history =useHistory()
    
    useEffect(()=>{
      
  },[user]);
   
    if(!user || !profile){
      return<Redirect to={"/SignIn"}></Redirect>
    }
    
    return (
    <IonPage >
      
      <IonHeader>
      <IonItem>
          <IonGrid >
            <IonRow>
              <IonCol>
                <IonAvatar><IonImg src={!!profile.photoURL?profile.photoURL
                :"https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Light"}></IonImg>
                </IonAvatar>
                <IonCol>
                  <IonLabel>Name : {profile.name}</IonLabel>
                  {/* <IonLabel>email : {profile.email}</IonLabel> */}
                </IonCol>
                
                
              </IonCol>
              <IonCol>
                <IonButton onClick={()=>content !=="editProfile"?setContent("editProfile"):setContent("orders")}>{TT("edit")}
                </IonButton>
                <IonButton color={'danger'} onClick={()=>{getAuth().signOut()}}>
                  {TT("logOut")}
                  <IonIcon icon={logOutOutline}></IonIcon>
                </IonButton>
              </IonCol>
              

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
      {user && content ==="orders"&& 
            <IonContent>
              <ProfileOrdersList/>
            </IonContent>}
      
      {user && content ==="deliver"&& 
          <IonContent>
            <ProfileApplicationsList/>
        </IonContent>}
      {user && content ==="editProfile"&& 
      <IonContent>
        <CreatProfile onSave={()=>{setContent("deliver")}}/>
      </IonContent>}
    </IonPage>
  );
};

export default Profile;


const ProfileOrdersList:FC=(props)=>{
  const [list,setList]=useState<DocumentSnapshot<DocumentData>[]>([])
  const [refreshing,setRefreshing] = useState(true)
  const [isMounted, setIsMounted] = useState(true)
  const {user,profile} = useGlobals()
  useEffect(()=>{
    const unsub = getData();
    return()=>{unsub()}
  },[])
  

   function getData() {
    setRefreshing(true)
    const ref = collection(getFirestore(),"orders")
    var firstQuery = query(ref,orderBy("time","desc"))
    var finalQuery= query(firstQuery,where("uid","==",getAuth().currentUser?.uid))
    
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
        
        return <OrderCard orderDocSnap={value} key={index} remove ></OrderCard>
        })}
        {!list && !refreshing && <IonButton onClick={()=>getData()}>refresh</IonButton>}
  </IonList>
}



const ProfileApplicationsList:FC=(props)=>{
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
    // var firstQuery = query(ref,orderBy("timeSend","desc"))
    var finalQuery= query(ref,where("byUser","==",getAuth().currentUser?.uid))
    
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
      {!!list && list.map((value,index:any) => {
        return <ApplicationCard docsnap={value} key={index}></ApplicationCard>
          })
        }
  </IonList>
}
