import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonChip } from '@ionic/react';
import { createOutline, logOutOutline, } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import OrderCard from '../components/OrderCard';
import { Redirect } from 'react-router';
import { orderProps, updateTripCard, updateUserProfile } from '../providers/firebaseMain';
import { TT } from '../components/utlis/tt';

const Profile: React.FC = () => {
    const {user,profile} = useGlobals()
    const [content,setContent]=useState<"orders"|"deliver">("orders")
    // const auth= getAuth()
    // const id = useParams()
    // const history =useHistory()
    
    useEffect(()=>{
      
  },[user]);
   
    if(!user){
      return<Redirect to={"/SignIn"}></Redirect>
    }
    
    return (
    <IonPage >
      
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        
        <IonTitle slot='end'>{profile?profile.name:"Profile"}</IonTitle>
        <IonButtons>
          {user &&<IonButton onClick={()=>{getAuth().signOut()}}>
            <IonIcon icon={logOutOutline}></IonIcon>
            {TT("logout")}
          </IonButton>}
          {user && profile && <IonButton>
            {TT("edit")} 
            <IonIcon icon={createOutline}></IonIcon>
          </IonButton>}
        </IonButtons>
        
    
      </IonToolbar>
        <IonItem>
          <IonButtons>
            <IonChip 
            color={content ==="orders"?"primary":"dark"}
            onClick={()=>setContent('orders')}>
              طلباتك
            </IonChip>
            <IonChip 
            color={content ==="deliver"?"primary":"dark"}
            onClick={()=>setContent('deliver')}>
            التوصيل
            </IonChip>
          </IonButtons>
        </IonItem>
      
      {user && content ==="orders"&& 
            <IonContent>
              <IonTitle>Orders</IonTitle>
              <ProfileOrdersList/>
            </IonContent>}
      
        {user && content ==="deliver"&& 
            <IonContent>
              <IonTitle>Orders</IonTitle>
              <ProfileOrdersList/>
            </IonContent>}
  {/* </IonContent>
      <IonContent>
      {user && 
            <IonContent>
              <ProfileOrdersList/>
            </IonContent>}
        
          {user ===undefined &&
          <IonContent>
            <IonSpinner></IonSpinner>
            <IonLabel>please waite..</IonLabel>
            </IonContent>}
</IonContent> */}
              

      
        {/* {user && 
        <IonButtons>
          <IonButton>تعديل الحساب</IonButton>
          <IonButton slot="start" color='danger' onClick={()=>{getAuth().signOut()}}>
          <IonTitle>تسجيل الخروج</IonTitle>
          <IonIcon icon={exitSharp}></IonIcon>
          </IonButton>
        </IonButtons> } */}
        
          
        
        
      
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
      getData();
  },[user])
  useEffect(()=>{
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  },[])

  async function getData() {
    setRefreshing(true)
    const ref = collection(getFirestore(),"orders")
    var firstQuery = query(ref,orderBy("time","desc"))
    var finalQuery= query(firstQuery,where("uid","==",getAuth().currentUser?.uid))
    const snapshot = await getDocs(finalQuery)
    var newList:any[]=[]
     snapshot.forEach((doc)=>{
        newList.push({id:doc.id,...doc.data()})
       })
       if(isMounted){
        setList(newList)
        setRefreshing(false)    
       }
    
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
        if(profile){
          checkName(value,profile)
        }
        
        return <OrderCard order={value} key={index} remove onDeleted={()=>onOrderRemoved(value)}></OrderCard>
        })}
        {!list && !refreshing && <IonButton onClick={()=>getData()}>refresh</IonButton>}
  </IonList>
}
function checkName(value:orderProps,profile:any){
  if (value.name !== profile.name){
    updateTripCard(value.id!,{name:profile.name})
  }

}