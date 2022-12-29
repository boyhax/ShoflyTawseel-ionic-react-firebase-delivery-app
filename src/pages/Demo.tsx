import React from 'react';
import { IonCard, IonContent, IonHeader, IonList, IonPage, IonRoute, IonRouterOutlet, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab3.css';
import OrderCard from '../components/OrderCard';
import { DocumentSnapshot } from 'firebase/firestore';
import { Route } from 'react-router-dom';
import MainHeader from '../components/MainHeader';

const Demo: React.FC = () => {
  const DemoCard = (props:any)=>{return<IonPage><IonCard>heloo</IonCard></IonPage>}
  const DemoCard2 = (props:any)=>{return<IonPage><IonCard>heloo2</IonCard></IonPage>}

  return (
    
      <IonPage>
        <MainHeader></MainHeader>
        
      </IonPage>
  );
};

export default Demo;
