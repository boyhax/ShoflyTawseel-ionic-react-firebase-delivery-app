import React from 'react';
import { IonBackButton, IonButtons, IonHeader, IonPage, IonToolbar, IonTitle, IonContent } from '@ionic/react';
import { useParams } from 'react-router';

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
      </IonContent>
    </IonPage>
  );
};

export default Details;
