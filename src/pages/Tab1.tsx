import React, { useRef, useState } from 'react';
import { IonAlert, IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonContent, IonFab, IonFabButton, IonFabList, IonHeader, IonIcon, IonLabel, IonPage, IonRouterLink, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab1.css';
import { ellipsisHorizontal, ellipsisVertical, logoFacebook, logoInstagram, logoTwitter, logoVimeo, personCircle, search, share } from 'ionicons/icons';

const Tab1: React.FC = () => {
  
    return (
    <IonPage>
      <IonHeader >
        <IonToolbar>
          <IonTitle slot='start'>Tab 1</IonTitle>
          <IonTitle slot='start'>Tab 2</IonTitle>
          <IonTitle slot='start'>Tab 3</IonTitle>
          
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonHeader collapse="condense">
          <IonToolbar slot="start">
            <IonTitle size="large">Tab 1</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton>
            <IonIcon icon={share} />
          </IonFabButton>
          <IonFabList side="top">
          <IonFabButton><IonIcon icon={logoTwitter} /></IonFabButton>
          <IonFabButton><IonIcon icon={logoInstagram} /></IonFabButton>
          </IonFabList>
        </IonFab>
        <IonButton href="/tab3">go tab 3</IonButton>
        <IonToolbar color="secondary">
    <IonButtons slot="secondary">
      <IonButton>
        <IonIcon slot="icon-only" icon={personCircle} />
      </IonButton>
      <IonButton>
        <IonIcon slot="icon-only" icon={search} />
      </IonButton>
    </IonButtons>
    <IonButtons slot="primary">
      <IonButton color="danger">
        <IonIcon slot="icon-only" ios={ellipsisHorizontal} md={ellipsisVertical} />
      </IonButton>
    </IonButtons>
    <IonTitle>Dark Toolbar</IonTitle>
  </IonToolbar>
          

      </IonContent>
    </IonPage>
  );
};

export default Tab1;



