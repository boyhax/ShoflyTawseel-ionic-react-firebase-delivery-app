import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonFooter, IonLabel, IonItem, useIonAlert, IonIcon } from '@ionic/react';
import { createUserWithEmailAndPassword, getAuth,signInWithEmailAndPassword } from 'firebase/auth';
import { lockClosedOutline, lockClosedSharp, mailOutline, personOutline } from 'ionicons/icons';

const EmailSignup: React.FC<{onSetPage:(s:string)=>void}> = ({onSetPage}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [name, setName] = useState('');

  const [PresentAlert] = useIonAlert()
  const signUpWithEmailAndPasswordHandler = (event: any, email: string, password: string) => {
    event.preventDefault();
    if(name.length <=5){
      setError('Please write name with more than 5 charecters')
      return
    }
    createUserWithEmailAndPassword(getAuth(),email, password).catch((error: any) => {
      setError('Error signing in with password and email! ');
      console.error(error);
      if(error.message.includes('email-already-in-use', 0)){

        PresentAlert({message:error.message})
      }
    });
  };

  return (
      <div >
        <form className={'formContainer'} onSubmit={(event: any) => {signUpWithEmailAndPasswordHandler(event, email, password)}}>
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
           
            <IonIcon slot={'start'} icon={lockClosedOutline}/>
            <IonInput
            required
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={(event: any) => setPassword(event.target.value)}
          ></IonInput>
          </IonItem>
          <IonItem fill={'outline'}>
           
            <IonIcon slot={'start'} icon={personOutline}/>
            <IonInput
            required
            type="text"
            placeholder="Name"
            value={name}
            onIonChange={(event: any) => setName(event.target.value)}
          ></IonInput>
          </IonItem>
          
          <IonButton type="submit" expand="block">Sign Up</IonButton>
          {error !== '' && <p>{error}</p>}
        </form>
        <IonItem>
            <IonLabel >
              Already a user?
              <span
              onClick={(e)=>onSetPage('signin')}
              style={{fontSize:'1.2rem',color:'var(--ion-color-primary)'}}
              color={'secondary'} 
              className={'ion-padding --ion-color-primary'}> 
              Sign In</span></IonLabel>
        </IonItem>
      </div>
  );
};




export default EmailSignup