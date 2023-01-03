import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonFooter, IonTitle, IonLabel, IonItem, IonIcon, IonNote } from '@ionic/react';
import { getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import { mailOutline, lockClosedOutline } from 'ionicons/icons';

const EmailSignin: React.FC<{onSetPage:(s:string)=>void}> = ({onSetPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const signInWithEmailAndPasswordHandler = (event: any, email: string, password: string) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(),email, password).catch((error: any) => {
      setError('Error signing in with password and email!  '+ error.message.replace(" Firebase: Error (auth/",""));
      console.error(error);
      
    });
  };

  return (
    <div >

        <form className={'formContainer'} onSubmit={(event: any) => {signInWithEmailAndPasswordHandler(event, email, password)}}>
        <IonItem fill={'outline'}>
          <IonIcon slot={'start'} icon={mailOutline}/>

            <IonInput
            required
            type="email"
            placeholder="Email"
            value={email}
            onIonChange={(event: any) => setEmail(event.target.value)}
          ></IonInput>
          </IonItem>

          <IonItem fill={'outline'}>
           
            <IonIcon  slot={'start'} icon={lockClosedOutline}/>
            <IonInput
            required
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={(event: any) => setPassword(event.target.value)}
          ></IonInput>
          </IonItem>
          <IonButton type="submit" expand="block">Sign In</IonButton>
          {error !== '' && <p>{error}</p>}
        </form>
        <IonItem 
        // fill={'outline'}
         >
            <IonLabel >
              New user?
              <span
              onClick={(e)=>onSetPage('signup')}
              style={{fontSize:'1.2rem',color:'var(--ion-color-primary)'}}
              color={'secondary'} 
              className={'ion-padding --ion-color-primary'}> 
              Sign up</span></IonLabel>
        </IonItem>
        </div>

  );
};




export default EmailSignin