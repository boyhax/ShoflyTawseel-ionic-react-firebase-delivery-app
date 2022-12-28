import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonTab, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForwardCircle, closeCircleSharp, home, returnUpBack } from 'ionicons/icons';
import { getAuth, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier, signInWithPhoneNumber, initializeAuth, browserSessionPersistence, browserPopupRedirectResolver, EmailAuthProvider, onAuthStateChanged, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import './SignIn.css';
import * as firebaseui from 'firebaseui';
import { useGlobals } from '../../providers/globalsProvider';
import { getProfile, profileExist } from '../../providers/firebaseMain';
import { StyledFirebaseAuth, FirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router';
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