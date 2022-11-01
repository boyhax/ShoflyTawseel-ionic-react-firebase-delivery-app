import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonLabel, IonItem, IonList, IonSpinner, IonBackButton, IonSegment, IonSegmentButton, IonGrid, IonRow, IonAvatar, IonImg, IonCol, IonHeader, IonCard, IonCardContent, IonFab, IonFabButton, IonInput } from '@ionic/react';
import { close, logOutOutline, } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, DocumentData, DocumentSnapshot, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import OrderCard from '../components/OrderCard';
import { updateUserProfile } from '../providers/firebaseMain';
import { TT } from '../components/utlis/tt';
import { ApplicationCard } from './ApplicationsPage';
import { db } from '../App';
import CreatProfile from './CreatProfile';
import AvatarPicker from '../components/AvatarPicker';
import { useHistory } from 'react-router';

const Profile: React.FC = () => {
    const {user,profile} = useGlobals()
    const [content,setContent]=useState<"orders"|"deliver"|"editProfile">("orders")
    const [pickAvatar,setPickAvatar] = useState(false)
    // const auth= getAuth()
    // const id = useParams()
    const history =useHistory()
    const uid = getAuth().currentUser?.uid
    useEffect(()=>{
      
  },[user]);
   
  const header = <IonHeader><IonToolbar color="secondary" ><IonLabel slot='end'>Profile</IonLabel><IonButtons slot='start'><IonBackButton defaultHref='/'></IonBackButton></IonButtons></IonToolbar></IonHeader>
    if(user ===false){
      return<IonPage>
        {header}
        <IonContent>
      <IonTitle>Sign In First</IonTitle>
      <IonButton onClick={()=>history.push("signIn")} fill="clear" color={"primary"}>Here</IonButton>
    </IonContent>
    </IonPage>
    }
    
    if(profile===null || user == undefined){
      return(<IonPage>
        {header}
        <IonContent>
          <IonSpinner slot='primary'>Plaese Wait</IonSpinner>
        </IonContent>
      </IonPage>)
    }
    
    
    return (
    <IonPage >
      <IonItem dir={'rtl'} style={{paddingLeft: '50px'}}>
          <IonGrid >
            <IonRow>
              <IonRow>
                <IonAvatar>
                    <IonImg src={
                      !!profile?.photoURL?profile.photoURL
                        :require("../assets/avatarPlaceHolder.png")}
                        onClick={()=>{setPickAvatar(!pickAvatar)}}>
                      
                  </IonImg>
                  </IonAvatar>
                  {/* <IonTitle>token : {token}</IonTitle> */}
              </IonRow>
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
        </IonItem>
        <IonFab horizontal={'start'} vertical={'top'} >
                <IonFabButton color={'light'}
                 onClick={()=>history.goBack()}
                >
                  <IonIcon color={'primary'} icon={close}></IonIcon>
                </IonFabButton>
          </IonFab>
        <IonList>
          <IonItem>
            <IonLabel>Name: </IonLabel>
            <IonInput value={profile?.name||"Name"} disabled={true}></IonInput>  
          </IonItem>
          <IonItem>
            <IonLabel>Email: </IonLabel>
            <IonInput value={profile?.email||"No Email"} disabled={true}></IonInput>  
          </IonItem>
          <IonItem>
            <IonLabel>Pnone: </IonLabel>
            <IonInput value={profile?.phoneNumber||"No Email"} disabled={true}></IonInput>  
          </IonItem>

        </IonList>
      {content !=="editProfile" &&<IonSegment  value={content}>
        <IonSegmentButton value="orders" onClick={()=>setContent('orders')}>
          <IonLabel>orders</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="deliver" onClick={()=>setContent('deliver')}>
          <IonLabel>deliver</IonLabel>
        </IonSegmentButton>
      </IonSegment>}

      <AvatarPicker isOpen={pickAvatar} onDidDismiss={()=>setPickAvatar(false)}
      onAvatarSubmit={(url)=>{updateUserProfile(uid,{photoURL:url})}} ></AvatarPicker>

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
        
        return <OrderCard orderDocSnap={value} key={index} ></OrderCard>
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
