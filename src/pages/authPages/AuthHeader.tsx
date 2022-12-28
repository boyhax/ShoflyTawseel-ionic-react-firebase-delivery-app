import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonFab, IonFabButton, IonHeader, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonPage, IonSpinner, IonTab, IonTabs, IonTitle, IonToolbar } from '@ionic/react';
import { arrowBack, arrowForwardCircle, closeCircleSharp, closeSharp, home, returnUpBack } from 'ionicons/icons';
import { getAuth, PhoneAuthProvider, signInWithCredential, RecaptchaVerifier, signInWithPhoneNumber, initializeAuth, browserSessionPersistence, browserPopupRedirectResolver, EmailAuthProvider, onAuthStateChanged, GoogleAuthProvider, OAuthProvider } from 'firebase/auth';
import './SignIn.css';
import * as firebaseui from 'firebaseui';
import { useGlobals } from '../../providers/globalsProvider';
import { getProfile, profileExist } from '../../providers/firebaseMain';
import { StyledFirebaseAuth, FirebaseAuth } from 'react-firebaseui';
import { useHistory } from 'react-router';


const AuthHeader: React.FC = () => {
const history = useHistory()
  const close = () => {
    history.goBack()
  }

  return (

    <IonHeader>
      <IonFab style={{ left: '10px', top: '10px' }}>
      <IonFabButton color={'light'} onClick={close}>
        <IonIcon color={'primary'} icon={closeSharp} />
      </IonFabButton>
    </IonFab>

    </IonHeader>
  );
};

export default AuthHeader