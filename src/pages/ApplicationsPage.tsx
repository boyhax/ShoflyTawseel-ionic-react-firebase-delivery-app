import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonSlides, IonSlide, IonCard, IonCardTitle } from '@ionic/react';
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

      <IonContent>
              {/* 
              orderID
        "Bk1iNLv0MwqULsVPtBOt"
        (string)
        orderOwner
        "j0YWDXTDAThHiNsaHz6dkJazjyI3"
        time
        September 26, 2022 at 12:00:37 PM UTC+4
        user
        "j0YWDXTDAThHiNsaHz6dkJazjyI3" */}
          
          
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
    const user = getProfile(data.user,(p)=>{
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
      <IonLabel>{user?user.time:""}</IonLabel>
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