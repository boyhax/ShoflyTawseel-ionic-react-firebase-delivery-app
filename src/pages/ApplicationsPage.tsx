import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonSlides, IonSlide, IonCard, IonCardTitle, IonSegment, IonSegmentButton } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { collection, doc, FieldValue, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import {  useHistory, useParams } from 'react-router';
import { TT } from '../components/utlis/tt';
import { getProfile } from '../providers/firebaseMain';

const ApplicationsPage: React.FC = () => {
    const {user,profile} = useGlobals()
    const [loading,setLoading]=useState(true)
    const [data,setData] = useState<any>(undefined)
    const [segment,setsegment] = useState<"byUser"|"forUser">("byUser")

    const auth= getAuth()
    const id:any = useParams()
    const history =useHistory()
    
    useEffect(()=>{
      if(!id.id){
        alert("uncorrect ref")
        return
      }
      var d:any = []
      const v = onSnapshot(query(collection(getFirestore(),"ordersApplications/"+id.id+"/col")),(docs)=>{
        docs.docs.forEach((value)=>{
          d.push(value.data())
        })
        setData(d)

      })
      return()=>v()
  },[]);
   
    
    return (
    <IonPage >
      
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle slot='primary' >
          {TT("application to order")}
        </IonTitle>
      </IonToolbar>
      <IonSegment>
        <IonSegmentButton></IonSegmentButton>
      </IonSegment>
      <IonContent>
                {/*ordersApplications/docs
                 byUser
          ""
          forOrder
          ""
          forUser
          ""
          isDone
          true
          timeAccepted
          September 6, 2022 at 12:00:00 AM UTC+4
          timeRejected
          September 21, 2022 at 12:00:00 AM UTC+4
          timeSend
          Septe */}
          
          
            {data && !!data.length && data.map((value:any) => {
            return<ApplicationCard data={value}>
              
            </ApplicationCard>
          })}
        
      </IonContent>
    </IonPage>
  );
};

export default ApplicationsPage;


export const ApplicationCard:React.FC<{data:any}> = ({data})=>{
  const [user,setUser]= useState<any>(undefined)
  useEffect(()=>{
    const user = getProfile(data.data().byUser,(p)=>{
      setUser(p.data())
    })
    
  },[])
  return<IonCard>
    <IonItem>
      <IonLabel>Name :</IonLabel>
      <IonLabel>{user?user.name:""}</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel>time :</IonLabel>
      <IonLabel>{new Date(data.data().time.seconds*1000).toLocaleString()}</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel>Name :</IonLabel>
      <IonLabel>{user?user.name:""}</IonLabel>
    </IonItem>
    <IonItem>
      <IonLabel>Name :</IonLabel>
      <IonLabel>{user?user.name:""}</IonLabel>
    </IonItem>
  </IonCard>
}