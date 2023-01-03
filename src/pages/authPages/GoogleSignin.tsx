import React, { useState } from 'react';
import { IonPage, IonContent, IonInput, IonButton, IonNote, IonItem } from '@ionic/react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const GoogleSignin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const signInWithEmailAndPasswordHandler = (event: any, email: string, password: string) => {
    event.preventDefault();
    signInWithEmailAndPassword(getAuth(), email, password).catch((error: any) => {
      setError('Error signing in with password and email!');
      console.error(error);
    });
  };

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <form onSubmit={(event: any) => { signInWithEmailAndPasswordHandler(event, email, password) }}>
          <IonItem fill={'solid'}>
          <IonInput
            required
            type="email"
            placeholder="Email"
            value={email}
            onIonChange={(event: any) => setEmail(event.target.value)}
          ></IonInput>
          <IonNote slot={'error'}>{error}</IonNote>
          </IonItem>
          

          <IonInput
            required
            type="password"
            placeholder="Password"
            value={password}
            onIonChange={(event: any) => setPassword(event.target.value)}
          ></IonInput>
          <IonButton type="submit" expand="block">Sign In</IonButton>
          {error !== '' && <p>{error}</p>}
        </form>
      </IonContent>
    </IonPage>
  );
};




export default GoogleSignin