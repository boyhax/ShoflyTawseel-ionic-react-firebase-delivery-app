import * as React from 'react';

import { useEffect, useState } from 'react';
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
import { newOrderProps } from '../../types';
import { useHistory } from 'react-router';
import { returnUpBackOutline } from 'ionicons/icons';





const AddOrderPage: any = (props: any) => {

  const { user, profile } = useGlobals()
  const [orderProps, setOrderProps] = useState<newOrderProps>({
    from: { key: '', value: '' },
    to: { key: '', value: '' },
    comment: '',
    geoLocation: { city: '', latlng: { lat: '', lng: '' } },
    type: 'SmallObjects',
    urgent: false
  })
  const [loading, setLoading] = React.useState(false)

  const [step, setStep] = useState<1 | 2>(1)
  const navigate = useHistory()



  const [_profile, _setProfile] = useState<any>(profile ? profile
    : getUserInfoPlaceHolder())

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

  const hundlelocation = (v: any) => {
    setOrderProps({ ...orderProps, ...v })
    setStep(2)
  }
  const hundleInfo = (v: any) => {
    setOrderProps({ ...orderProps, ...v })
    onSubmit()

  }
  async function onSubmit() {
    setLoading(true)
    console.log('props :>> ', orderProps);
    try {
      await uploadNewOrder(orderProps)
      navigate.push('/')

    } catch (error) {
      presentAlert({ message: 'Sorry some issue happen.. please try Again' })
    }
    setLoading(false)
    setStep(1)
  }

  return <IonPage>
    {step === 2 && <IonFab>
      <IonFabButton onClick={()=>setStep(1)}>
        <IonIcon icon={returnUpBackOutline}></IonIcon></IonFabButton></IonFab>}
    
    {step === 1 ? <Step1 onFinish={hundlelocation} /> : <Step2 onFinish={hundleInfo} orderProps={orderProps} />}
    
    <IonLoading
      isOpen={loading}
      message={'Submiting Order..'} ></IonLoading>
  </IonPage>
};

export default AddOrderPage;


