import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar,IonButton,IonIcon,IonButtons, IonRouterLink, IonInput, IonLabel, IonItem, IonCard, IonCardContent, IonAccordionGroup, IonAccordion, IonList, IonGrid, IonSpinner } from '@ionic/react';
import { ellipsisVertical, personCircle, searchCircle } from 'ionicons/icons';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, getDoc, getDocs, getFirestore, orderBy, query, where } from 'firebase/firestore';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import "./Profile.css"
import { map } from '@firebase/util';
import OrderCard, { OrderProps } from '../components/OrderCard';
import { useParams } from 'react-router';

const Profile: React.FC = () => {
    const {user} = useGlobals()
    const[profile,setProfile] = useState<{}|undefined>(undefined)
    const [loading,setLoading]=useState(true)
    const auth= getAuth()
    const id = useParams()
    
    useEffect(()=>{
      if(user){
         getProfile(auth.currentUser!.uid,(p)=>{setProfile(p)})
      }
  },[user]);

    setTimeout(() => {
      setLoading(false)
    }, 2000);
    
    return (
    <IonPage >
      <IonHeader>
      <IonToolbar color="secondary">
    <IonButtons slot="primary">
    
      <IonButton color="danger">
        <IonIcon slot="icon-only" icon={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonRouterLink href='/home'><IonTitle color='light' >ShoflyTawseel</IonTitle></IonRouterLink>
    
  </IonToolbar>
      </IonHeader>
      <IonContent>
        {user && <IonContent>
          <IonButton onClick={()=>{auth.signOut();setProfile(undefined)}}>
            <IonTitle>تسجيل الخروج</IonTitle>
            </IonButton>

          <IonTitle>قائمة طلباتك</IonTitle>
          <ProfileOrdersList/>
      </IonContent>}
        {!user && loading === false && <IonContent>
          <IonButton href='/SignIn'>قم بتسجيل الدخول اولأ</IonButton>
          </IonContent>}
</IonContent>
              

      {user && auth.currentUser?.displayName==="" && <IonCard className='profileCard'><IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined} >يجب ان تضيف معلومات حسابك</IonItem>
        </IonCard>}
        {user && <ProfileEdit></ProfileEdit>}
      
    </IonPage>
  );
};

export default Profile;


async function getProfile(uid:String,onValue:(profile:any)=>any) {
   const p =await getDoc(doc(getFirestore(),"users/"+uid)).then((v)=>{
     onValue(v.data())
   })
}
const ProfileEdit:React.FC=(props)=>{
  const auth= getAuth()
  const user = auth.currentUser

  return<IonAccordionGroup>
  <IonAccordion value="colors">
    <IonItem slot="header" fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}>
      <IonLabel>معلومات المستخدم</IonLabel>
    </IonItem>

    <IonList slot="content">
      <IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}>
        <IonLabel>الاسم</IonLabel>
        <IonInput placeholder='name' onIonChange={(e)=>{
          if(user !==null){
            updateProfile(user,{displayName:e.detail.value})
          }
        }} value={auth.currentUser?.displayName}></IonInput>
        <IonButton><IonLabel>حفظ</IonLabel></IonButton>
      </IonItem>
      <IonItem fill={undefined} shape={undefined} counter={undefined} counterFormatter={undefined}>
        <IonLabel>الرقم</IonLabel>
        <IonLabel >{auth.currentUser?.phoneNumber}</IonLabel>
      </IonItem>
      
    </IonList>
  </IonAccordion></IonAccordionGroup>
}
const ProfileOrdersList:FC=(props)=>{
  const [list,setList]=useState<null|typeof OrderProps[]>(null)
  const [refreshing,setRefreshing] = useState(true)
  const {user} = useGlobals()
  useEffect(()=>{
      getData();
  },[user])

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
    setList(newList)
    setRefreshing(false)
  } 
  return<IonList>
    {refreshing && <IonSpinner></IonSpinner>}
      {!!list && list.map((value, index, array) => {
        return <OrderCard values={value} key={index}></OrderCard>
        })}
  </IonList>
}