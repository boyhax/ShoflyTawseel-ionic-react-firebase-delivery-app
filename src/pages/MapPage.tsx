import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './styles.css';
import MyMap from '../components/utlis/Map';

const MapPage: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Map</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <MyMap>

        </MyMap>
      </IonContent>
    </IonPage>
  );
};

export default MapPage;
