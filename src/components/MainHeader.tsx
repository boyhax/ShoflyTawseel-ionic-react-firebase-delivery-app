import { IonAvatar, IonBackButton, IonButtons, IonHeader, IonImg, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import * as React from 'react';
import { useHistory } from 'react-router';
import './MainHeader.css'

const  MainHeader:React.FC = (props)=> {
    const history = useHistory()
    return <IonToolbar>

      {/* <IonButtons slot="start">
        <IonBackButton defaultHref='/'></IonBackButton>
      </IonButtons> */}
      {/* <IonTitle slot='primary' onClick={() => history.push("/home")}
      >ShoflyTawseel
      </IonTitle> */}
      <IonMenuButton slot={'start'}></IonMenuButton>

  </IonToolbar>
}

 
export default MainHeader;
