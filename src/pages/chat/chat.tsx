import React, { FC, useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButtons, IonInput, IonLabel, IonItem, IonAccordionGroup, IonAccordion, IonList, IonSpinner, IonBackButton, IonSlides, IonSlide, IonCard, IonCardTitle } from '@ionic/react';
import { useGlobals } from '../../providers/globalsProvider';
import { collection, doc, FieldValue, getFirestore, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import {  useHistory, useParams } from 'react-router';
import { getProfile } from '../../providers/firebaseMain';
import { TT } from '../../components/utlis/tt';

export default  function Chat(props:any) {
    const {user,profile} = useGlobals()
    const [loading,setLoading]=useState(true)
    const [data,setData] = useState<any>(undefined)
    const auth= getAuth()
    const id:any = useParams()
    const history =useHistory()
    
    
    return (
    <IonPage >
      
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle slot='primary' >
          {TT("Chat")}
        </IonTitle>
      </IonToolbar>

      <IonContent>
             
          
        
      </IonContent>
    </IonPage>
  );
};



