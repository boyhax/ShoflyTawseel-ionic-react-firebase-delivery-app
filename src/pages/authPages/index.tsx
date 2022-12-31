import React, { useState } from 'react';
import { IonButton, IonButtons, IonContent, IonIcon, IonPage } from '@ionic/react';
import './SignIn.css';
import { StyledFirebaseAuth } from 'react-firebaseui';
import AuthHeader from './AuthHeader';
import { GoogleAuthProvider, FacebookAuthProvider, getAuth, PhoneAuthProvider, EmailAuthProvider } from 'firebase/auth';
import { Redirect, useHistory } from 'react-router';
import { useGlobals } from '../../providers/globalsProvider';
import PhoneAuth from './PhoneAuth';
import { returnUpBackSharp } from 'ionicons/icons';


const SignIn: React.FC = () => {
  const { user } = useGlobals()
  const history = useHistory()
  const [method, setMethod] = useState<"email" | "phone" | 'google' | "main">("main")

  const hundleAuth = (b: "email" | "phone" | 'google' | "main") => {
    setMethod(b)
  }
  // Configure FirebaseUI.
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/signedIn',

    // We will display Google and Facebook as auth providers.
    signInOptions: [
      GoogleAuthProvider.PROVIDER_ID,
      // FacebookAuthProvider.PROVIDER_ID,
      // PhoneAuthProvider.PROVIDER_ID
      EmailAuthProvider.PROVIDER_ID
    ],
  };
  
  return <IonPage>
    {user && <Redirect to={'signedin'} />}
    <AuthHeader></AuthHeader>
    <div style={{margin:'auto'}}>
    <IonButton onClick={()=>hundleAuth('main')} >
        Return
        <IonIcon icon={returnUpBackSharp}>
        </IonIcon></IonButton>

    </div>
    
    <div style={{display: 'flex',flexDirection: 'column',
    justifyContent:'center',
     marginLeft: 'auto',marginRight: 'auto',height: '100%' }}>
      
      {method === 'main' &&
        <div style={{display:'flex',flexDirection:'column',
        justifyContent:'center',alignItems:'center',alignContent:'space-between'}}>

          <IonButton onClick={() => hundleAuth('phone')}>
            Sign In By Phone
          </IonButton>
          <IonButton onClick={() => hundleAuth('email')}>
            Sign In By Email
          </IonButton>
          <IonButton onClick={() => hundleAuth('google')}>
            Sign In By Google
          </IonButton>
        </div>
      }
      
      {method === 'phone' &&
        <PhoneAuth></PhoneAuth>
      }
      {/* {(method === 'email' || method === 'google') &&
        <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={getAuth()}></StyledFirebaseAuth>

      } */}
      

    </div>
    
  </IonPage>
    ;
};

export default SignIn