import * as React from 'react';

import  {  useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCheckbox, IonContent, IonFab, IonFabButton,
  IonFooter,
  IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonLoading, IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  useIonAlert
} from '@ionic/react';
import { useGlobals } from '../../providers/globalsProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder, uploadNewOrder } from '../../providers/firebaseMain';
import Step1 from './Step1';
import Step2 from './Step2';
import { useNewOrder } from '.';





const AddOrderPage:any=(props:any)=>{

  const { user, profile } = useGlobals()


  const [map, setMap] = useState<L.Map>()

  const [_profile, _setProfile] = useState<any>(profile ? profile
     : getUserInfoPlaceHolder())

  const order = useNewOrder()
  useEffect(() => {
    if (!!profile) {
      _setProfile(profile)
    }
  }, [profile]);

  
  const [presentAlert] = useIonAlert()


  

  // const MapLocationPicker = <IonPage>
  //   <IonFab horizontal={'start'} vertical='top'>
  //     <IonFabButton onClick={() => setOpenMap(false)}><IonIcon icon={close}></IonIcon></IonFabButton>
  //   </IonFab>
  //   <LeafLetMap onMap={(m) => { if (!map) { setMap(m) } }} onLocationChange={onLocationPick}></LeafLetMap>
  // </IonPage>

  
  
  return <IonPage>
    <h2>steps</h2>
    {order.step ===1 ?<Step1></Step1>:<Step2></Step2>}
  </IonPage>
};

export default AddOrderPage;


