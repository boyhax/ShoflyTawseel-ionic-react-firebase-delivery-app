import { IonAvatar, IonBackButton, IonButtons, IonHeader, IonImg, IonTitle, IonToolbar } from '@ionic/react';
import * as React from 'react';
import { useHistory } from 'react-router';

const  MainHeader:React.FC = (props)=> {
    const history = useHistory()
    return <IonHeader>
    <IonToolbar color="secondary">

      <IonButtons slot="start">
        <IonBackButton defaultHref='/'></IonBackButton>
      </IonButtons>
      <IonTitle slot='primary' onClick={() => history.push("/home")}
      >ShoflyTawseel
      </IonTitle>

    </IonToolbar>
  </IonHeader>
}

 
export default MainHeader;
