import React, { useEffect, useState } from 'react';
import { IonContent, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton, IonCard, IonSpinner, IonLabel, IonItem, IonHeader, IonFabButton, IonFab, IonIcon, IonList } from '@ionic/react';
import { useGlobals } from '../providers/globalsProvider';
import { getAuth } from 'firebase/auth';
import { useHistory, useParams } from 'react-router';
import OrderList from '../components/OrderList';
import OrderCard from '../components/OrderCard';
import { collection, doc, DocumentSnapshot, onSnapshot, query, where } from 'firebase/firestore';
import { closeOutline } from 'ionicons/icons';

const OrdersPage: React.FC = () => {
  const { user, profile, currentOrder, setCurrentOrder } = useGlobals()
  const [loading, setLoading] = useState(true)
  const [applications, setApplications] = useState<DocumentSnapshot[]>()

  const auth = getAuth()
  const { id, type }: any = useParams()
  const history = useHistory()
  useEffect(() => {
    const unsub = loadOrder()
    // return()=>unsub()
  }, []);
  useEffect(() => {
    
  }, [currentOrder]);

  const loadOrder = () => {
    // const unsub1 = subor(doc(db, 'orders', id), (doc) => setCurrentOrder(doc))
    // ApplicationProps ={
    //   byUser:string,
    //   forOrder:string,
    //   forUser:string,
    //   isAccepted:boolean,
    //   isDone:boolean,
    //   timeAccepted:any,
    //   timeDone:any,
    //   timeSend:any,
    // }
    // const unsub2 = onSnapshot(query(collection(db,'ordersApplications'),where("forOrder","==",id)),(snap)=>{
    //   setApplications(snap.docs);
    //   console.log(snap.docs)
    // })
    // return ()=>{unsub1();unsub2()}
  }
  if (id) {
    if (!currentOrder) {
      return <IonPage>
        <IonItem>
          <IonLabel>Loading...</IonLabel>
          <IonSpinner name={'dots'} ></IonSpinner>
        </IonItem>

      </IonPage>
    } else {
      return <IonPage >
        <IonFab>
          <IonFabButton onClick={() => history.goBack()}>
            <IonIcon icon={closeOutline}></IonIcon>
          </IonFabButton>
        </IonFab>
        <IonContent style={{ marginTop: '50px' }}>
          <OrderCard orderDocSnap={currentOrder}> </OrderCard>
          {applications &&
            <IonList>
              {applications.map((value, index, array) => { 
              return<IonCard>
                {JSON.stringify(value.data())}
              </IonCard>
          })}
            </IonList>
          }
        </IonContent>
      </IonPage>
    }

  }
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


