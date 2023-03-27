import React, {  } from 'react';
import { IonPage, IonTitle } from '@ionic/react';
import './SignIn.css';
import AuthHeader from './AuthHeader';


const SignedIn: React.FC = () => {

  const close = () => {

  }

  return (
    <IonPage style={{margin: 'auto'}} className={'backgroundDiagonal'} >
      
      <AuthHeader></AuthHeader>
      <div className={'container'}>
        <IonTitle style={{justifySelf: 'center'}}>
          You Are Signed In 
        </IonTitle>
      </div>
    </IonPage>

  );
};

export default SignedIn