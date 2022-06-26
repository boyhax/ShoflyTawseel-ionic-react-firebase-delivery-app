import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonRouterLink, IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonAccordionGroup, IonAccordion, IonList, IonGrid, IonSpinner, IonBackButton, IonicSlides, IonSlides, IonSlide } from '@ionic/react';
import { arrowBack, } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { getAuth, updateProfile } from 'firebase/auth';
import "./Profile.css"
import OrderCard from '../components/OrderCard';
import { useHistory, useParams } from 'react-router';
import { getProfile, orderProps, profileExist, updateUserProfile } from '../providers/firebaseMain';

const Profile: React.FC = () => {
    const {user,profile} = useGlobals()
    const [loading,setLoading]=useState(true)
    const auth= getAuth()
    const id = useParams()
    const history =useHistory()
    
    
    async function  userProfileExist(){
      return await profileExist(auth.currentUser!.uid)
    }
    useEffect(()=>{
      
  },[user]);
   
    
    
    return (
    <IonPage >
      <IonToolbar color="secondary">
    <IonButtons slot="start">
    <IonBackButton defaultHref='/'></IonBackButton>
    </IonButtons>
    <IonTitle slot='primary' onClick={()=>history.push("/home")}  
    >ShoflyTawseel
    </IonTitle>
    
  </IonToolbar>
      <IonContent>
        {user && <IonContent>
          <IonButton onClick={()=>{history.push("/signin")}}>
            <IonTitle>تسجيل الخروج</IonTitle>
            </IonButton>
          <IonSlides>
            <IonSlide>
                <IonContent>orders</IonContent>
            </IonSlide>
            <IonSlide>
            <IonContent>offers</IonContent>
            </IonSlide>
          </IonSlides>
          <IonTitle>قائمة طلباتك</IonTitle>
                <ProfileOrdersList/>
      </IonContent>}
        {user ===false && <IonContent>
          <IonButton onClick={()=>history.push('/SignIn')}>قم بتسجيل الدخول</IonButton>
          </IonContent>}
          {user ===undefined &&
          <IonContent>
            <IonSpinner></IonSpinner>
            <IonLabel>please waite..</IonLabel>
            </IonContent>}
</IonContent>
              

      {user && auth.currentUser?.displayName==="" && <IonCard className='profileCard'><IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined} >يجب ان تضيف معلومات حسابك</IonItem>
        </IonCard>}
        {profile!==undefined && <ProfileEdit></ProfileEdit>}
      
    </IonPage>
  );
};

export default Profile;



const ProfileEdit:React.FC=(props)=>{
  const auth= getAuth()
  const user = auth.currentUser
  const uid = user?.uid
  const [data,setData]=useState({})
  const[loading,setLoading] = useState(false)
  const {profile} = useGlobals()
  const [newName,setNewName] = useState(profile.name!)
  function updateProfile(){
      setLoading(true);
      updateUserProfile(uid,{...data,name:newName})
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
  const {user} = useGlobals()
  useEffect(()=>{
      getData();
  },[user])
  useEffect(()=>{
    setIsMounted(true)
    return () => {
      setIsMounted(false)
    }
  })

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
  return<IonList>
    {refreshing && <IonSpinner></IonSpinner>}
      {!!list && list.map((value, index, array) => {
        return <OrderCard order={value} key={index} remove ></OrderCard>
        })}
        {!list && !refreshing && <IonButton onClick={()=>getData()}>refresh</IonButton>}
  </IonList>
}