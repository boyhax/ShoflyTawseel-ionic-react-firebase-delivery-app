import React, {  } from 'react';
import { IonFab, IonFabButton, IonHeader, IonIcon } from '@ionic/react';
import { closeSharp } from 'ionicons/icons';
import './SignIn.css';
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