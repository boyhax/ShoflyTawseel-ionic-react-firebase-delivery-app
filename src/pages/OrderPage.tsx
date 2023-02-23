import React, { useEffect, useState } from 'react';
import { IonContent, IonTitle, IonToolbar,IonButtons, IonLabel, IonItem, IonSpinner, IonBackButton } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { doc, getFirestore, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useHistory, useParams } from 'react-router';
import { orderProps } from '../types';

const OrderPage: React.FC = () => {
    const {user,profile} = useGlobals()
    const [loading,setLoading]=useState(true)
    const [data,setData] = useState<undefined|orderProps|any>(undefined)
    const [message,setMessage]= useState<null|string>(null)
    const auth= getAuth()
    const id:any = useParams()
    const history =useHistory()
    
    useEffect(()=>{
      getData()
      
  },[]);
   const getData =async () => {
     onSnapshot(doc(getFirestore(),"orders/"+id.id),(doc)=>{
      if(doc.exists()){
        setData(doc.data());
        setMessage(null)
      
      }else{
        setMessage("no order")
    }
     })
   }
    
    
    return (
    <div >
      
      <IonToolbar color="secondary">
        <IonButtons slot="start">
          <IonBackButton defaultHref='/home' />
        </IonButtons>
        <IonTitle slot='primary' >
          Order
        </IonTitle>
    
      </IonToolbar>
      <IonContent>
          {!!data && <IonContent>
            <IonItem>
              <IonLabel>
                name : 
              </IonLabel>
              <IonLabel>
                {data.name}
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                from : 
              </IonLabel>
              <IonLabel>
                {data.from}
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                to : 
              </IonLabel>
              <IonLabel>
                {data.to}
              </IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>
                date of post : 
              </IonLabel>
              <IonLabel>
                {new Date(data.time.seconds*1000).toLocaleString()}
              </IonLabel>
            </IonItem>
            </IonContent>}
          {!data && <IonSpinner></IonSpinner>}
        
          
      </IonContent>
              
        
        
        
      
    </div>
  );
};

export default OrderPage;




