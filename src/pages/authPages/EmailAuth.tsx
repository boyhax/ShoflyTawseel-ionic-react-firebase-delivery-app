import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonFooter, IonLabel, IonTitle } from '@ionic/react';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import EmailSignin from './EmailSignIn';
import EmailSignup from './EmailSignup';


const EmailAuth: React.FC = () => {
  const [page, setPage] = useState<'signin'|'signup'|string>('signin');

  

  return (
      <div>
        {page === 'signin'&&<EmailSignin onSetPage={setPage}/>}
        {page === 'signup'&& <EmailSignup onSetPage={setPage}/>}

        
      </div>
  );
};




export default EmailAuth