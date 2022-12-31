import { IonAvatar, IonBackButton, IonButtons, IonHeader, IonImg, IonMenuButton, IonTitle, IonToolbar } from '@ionic/react';
import * as React from 'react';
import { useHistory } from 'react-router';

const  MainHeader:React.FC = (props)=> {
    const history = useHistory()
    return <div style={{}}>

      {/* <IonButtons slot="start">
        <IonBackButton defaultHref='/'></IonBackButton>
      </IonButtons> */}
      {/* <IonTitle slot='primary' onClick={() => history.push("/home")}
      >ShoflyTawseel
      </IonTitle> */}
      <IonMenuButton slot={'start'}></IonMenuButton>

  </div>
}

 
export default MainHeader;
