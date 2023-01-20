import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonFooter, IonLabel, IonTitle, IonItem } from '@ionic/react';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import EmailSignin from './EmailSignIn';
import EmailSignup from './EmailSignup';


const EmailAuth: React.FC = () => {
  const [page, setPage] = useState<'signin'|'signup'|string>('signin');

  

  return (
      <div>
        {page === 'signin'&&<EmailSignin />}
        {page === 'signup'&& <EmailSignup />}
        {page == 'signin'?<IonItem>
            <IonLabel >
              New user?
              <span
              onClick={(e)=>setPage('signup')}
              style={{fontSize:'1.2rem',color:'var(--ion-color-primary)'}}
              color={'secondary'} 
              className={'ion-padding --ion-color-primary'}> 
              Sign up</span></IonLabel>
        </IonItem>:
        <IonItem>
            <IonLabel >
              Already a user?
              <span
              onClick={(e)=>setPage('signin')}
              style={{fontSize:'1.2rem',color:'var(--ion-color-primary)'}}
              color={'secondary'} 
              className={'ion-padding --ion-color-primary'}> 
              Sign In</span></IonLabel>
        </IonItem>}
        
      </div>
  );
};




export default EmailAuth