import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar,IonButtons, IonBackButton } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { getAuth } from 'firebase/auth';
import "./Profile.css"
import { useHistory, useParams } from 'react-router';
import OrderList from '../components/OrderList';

const OrdersPage: React.FC = () => {
    const {user,profile} = useGlobals()
    const [loading,setLoading]=useState(true)
    const auth= getAuth()
    const id = useParams()
    const history =useHistory()
    
    useEffect(()=>{
      
  },[user]);
   
    return (
    <IonPage >
      
      <IonToolbar color="primary">
        <IonButtons slot="start">
          <IonBackButton defaultHref="/home" />
        </IonButtons>
        <IonTitle slot='end' >
          the orders
        </IonTitle>
    
      </IonToolbar>
      <IonContent>
        <OrderList></OrderList>
      </IonContent>
    </IonPage>
  );
};

export default OrdersPage;


