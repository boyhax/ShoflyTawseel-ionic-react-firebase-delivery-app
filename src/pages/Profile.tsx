import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonChip, IonSegment, IonSegmentButton, IonCard, IonCardContent, IonGrid, IonRow, IonAvatar, IonImg, IonCol, IonItemDivider } from '@ionic/react';
import { createOutline, logOutOutline, } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, DocumentSnapshot, getDocs, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import OrderCard from '../components/OrderCard';
import { Redirect } from 'react-router';
import { orderProps, updateTripCard, updateUserProfile } from '../providers/firebaseMain';
import { TT } from '../components/utlis/tt';
import { ApplicationCard } from './ApplicationsPage';

const Profile: React.FC = () => {
    const {user,profile} = useGlobals()
    const [content,setContent]=useState<"orders"|"deliver">("orders")
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
      
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        
        
      </IonToolbar>
      <IonItem>
          <IonGrid >
            <IonRow>
              <IonCol>
                <IonAvatar><IonImg src={!!profile.photoURL?profile.photoURL
                :"https://avataaars.io/?avatarStyle=Circle&topType=ShortHairFrizzle&accessoriesType=Blank&hairColor=Brown&facialHairType=Blank&clotheType=BlazerShirt&eyeType=Default&eyebrowType=FlatNatural&mouthType=Default&skinColor=Light"}></IonImg>
                </IonAvatar>
                <IonCol>
                  <IonLabel>Name : {profile.name}</IonLabel>
                  <IonLabel>                     </IonLabel>
                  <IonLabel>email : {profile.email}</IonLabel>
                </IonCol>
                
                
              </IonCol>
              <IonCol>
                <IonButton>{TT("edit")}
                </IonButton>
                <IonButton color={'danger'} onClick={()=>{getAuth().signOut()}}>
                  {TT("logOut")}
                  <IonIcon icon={logOutOutline}></IonIcon>
                </IonButton>
              </IonCol>
              

              </IonRow>
          </IonGrid>
        </IonItem>
      <IonSegment  value={content}>
        <IonSegmentButton value="orders" onClick={()=>setContent('orders')}>
          <IonLabel>orders</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="deliver" onClick={()=>setContent('deliver')}>
          <IonLabel>deliver</IonLabel>
        </IonSegmentButton>
      </IonSegment>

       
      
      {user && content ==="orders"&& 
            <IonContent>
              <ProfileOrdersList/>
            </IonContent>}
      
        {user && content ==="deliver"&& 
            <IonContent>
              <ProfileApplicationsList/>
            </IonContent>}
  
        
          
        
        
      
    </IonPage>
  );
};

export default Profile;



const ProfileEdit:React.FC=(props)=>{
  const auth= getAuth()
  const user = auth.currentUser
  const uid = user?.uid
  const[loading,setLoading] = useState(false)
  const {profile} = useGlobals()
  const [newName,setNewName] = useState(profile.name!)
  function updateProfile(){
      setLoading(true);
      updateUserProfile(uid,{name:newName})
      .finally(()=>setLoading(false))
  }
  if(loading){
    return<IonSpinner slot='primary'>
      <IonLabel>Saving...</IonLabel>
       </IonSpinner>
  }
  return<IonAccordionGroup>
  <IonAccordion value="colors">
    <IonItem slot="header" >
      <IonLabel>معلومات المستخدم</IonLabel>
    </IonItem>

    <IonList slot="content">
      <IonItem >
        <IonLabel>الاسم</IonLabel>
        <IonInput placeholder='name' onIonChange={(e)=>{
            setNewName(e.detail.value)
          
        }} 
        value={newName}></IonInput>
        <IonButton onClick={()=>updateProfile()}
        >
          <IonLabel>حفظ</IonLabel></IonButton>
      </IonItem>
      <IonItem>
        <IonLabel>الرقم</IonLabel>
        <IonLabel >{auth.currentUser?.phoneNumber}</IonLabel>
      </IonItem>
      
    </IonList>
  </IonAccordion></IonAccordionGroup>
}
const ProfileOrdersList:FC=(props)=>{
  const [list,setList]=useState<null|orderProps[]>(null)
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
    getDocs(finalQuery).then((snap)=>{

      var newList:any[]=[]
      snap.forEach((doc)=>{
         newList.push(doc.data())
        })
        if(isMounted){
         setList(newList)
         setRefreshing(false)    
        }
      })
    return onSnapshot(finalQuery,(snap)=>{

      var newList:any[]=[]
      snap.forEach((doc)=>{
         newList.push(doc.data())
        })
        if(isMounted){
         setList(newList)
         setRefreshing(false)    
        }
      })
  } 
  function onOrderRemoved(value:object){
    const newList:any = list?.filter((value_)=>{
      return value_===value?false:true
    })
    setList(newList)
  }
  return<IonList>
    {refreshing && <IonSpinner></IonSpinner>}
      {!!list && list.map((value, index, array) => {
        
        return <OrderCard order={value} key={index} remove onDeleted={()=>onOrderRemoved(value)}></OrderCard>
        })}
        {!list && !refreshing && <IonButton onClick={()=>getData()}>refresh</IonButton>}
  </IonList>
}
const ProfileApplicationsList:FC=(props)=>{
  const [list,setList]=useState<null|any>(null)
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
    const ref = collection(getFirestore(),"ordersApplications")
    var firstQuery = query(ref,orderBy("time","desc"))
    var finalQuery= query(firstQuery,where("byUser","==",getAuth().currentUser?.uid))
    
    return onSnapshot(finalQuery,(snap)=>{

      var newList:any[]=[]
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
      {!!list && list.map((value:any) => {
        return <ApplicationCard data={value}></ApplicationCard>
          })
        }
  </IonList>
}
