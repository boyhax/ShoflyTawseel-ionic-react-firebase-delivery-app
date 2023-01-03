import React, { useState } from 'react';
import { IonButton, IonButtons, IonCard, IonCardContent, IonCardTitle, IonCol, IonContent, IonGrid, IonIcon, IonItem, IonItemDivider, IonLabel, IonPage, IonPopover, IonRow, IonTitle } from '@ionic/react';
import './SignIn.css';
import { StyledFirebaseAuth } from 'react-firebaseui';
import AuthHeader from './AuthHeader';
import { GoogleAuthProvider, FacebookAuthProvider, getAuth, PhoneAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { Redirect, useHistory } from 'react-router';
import { useGlobals } from '../../providers/globalsProvider';
import PhoneAuth from './PhoneAuth';
import { logoGoogle, phonePortraitSharp, returnUpBackSharp } from 'ionicons/icons';
import EmailAuth from './EmailAuth';
import GoogleSignin from './GoogleSignin';
import './styles.css'
import { useGoogleAuth } from '../../hooks/useGoogleAuth';
import useOnline from '../../hooks/useOnline';

const SignIn: React.FC = () => {
  const {online} = useOnline()
  const googleAuth = useGoogleAuth()
  const [phoneSignin, setPhoneSignin] = useState(false)
  const [method, setMethod] = useState<"email" | "phone" | 'google' | "main">("email")

  const hundleAuth = (b: "email" | "phone" | 'google' | "main") => {
    if (b === "phone") {
      setPhoneSignin(true)
    }
    if (b === "google") {
      googleAuth.signin()
    }
  }


  return <IonPage style={{ display: 'block' }} >

    <IonContent hidden={!online} style={{ padding: 'auto 50px' }}>
      <IonCard className={'margin-center'}>
        <IonCardTitle className={'ion-padding'}>
          Welcome
        </IonCardTitle>
        <IonCardContent>

          {method === 'phone' &&
            <PhoneAuth></PhoneAuth>
          }

          {(method === 'email') &&
            <EmailAuth ></EmailAuth>
          }
          {(method === 'google') &&
            <GoogleSignin ></GoogleSignin>
          }
        </IonCardContent>
        <div className={'ion-flex flex-column ion-justify-content-center ion-align-items-center'}>
          <IonTitle>OR</IonTitle>

        </div>

        <div className={'ion-flex flex-row justify-center align-center'}>

          <IonButton id={'phoneSignin'} shape={'round'} onClick={() => hundleAuth('phone')}>
            <IonIcon icon={phonePortraitSharp}></IonIcon>
          </IonButton>

          <IonButton shape={'round'} color={'danger'} onClick={() => hundleAuth('google')}>
            <IonIcon icon={logoGoogle}></IonIcon>

          </IonButton>
        </div>


      </IonCard>

    </IonContent>
    <IonContent hidden={online}>
          <IonLabel>
            Intenet connection required
          </IonLabel>
    </IonContent>
    <IonPopover 
    isOpen={phoneSignin}
     onIonPopoverDidDismiss={() => setPhoneSignin(false)}>
      <PhoneAuth></PhoneAuth>
    </IonPopover>
  </IonPage>
    ;
};

export default SignIn