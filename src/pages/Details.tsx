import React from 'react';
import { IonBackButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useParams } from 'react-router';
import OrderCard from '../components/OrderCard';

const Details: React.FC = () => {
  const parms = useParams()
  // console.log('parms :>> ', parms);
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tab2" />
          </IonButtons>
          <IonTitle>Detail</IonTitle>
          
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <p>Details</p>
        <OrderCard order={{
            name:"said alhajri",
            from:"bidiyah",
            to:"bidiyah",
            time:{seconds:51000},
            id:"",
            uid:"",
            comment:"ثثثثثثثثثثثثثثثثثثثثث السلام عليكم",
            flagged:false,
            number:"+968 95373990"
          }}
          whatsapp
remove
report
message
>

          </OrderCard>
      </IonContent>
    </IonPage>
  );
};

export default Details;
