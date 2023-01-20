import * as React from 'react';

import { useEffect, useState } from 'react';
import {
  IonFab, IonFabButton,
  IonIcon, IonLoading, IonPage,
  useIonToast
} from '@ionic/react';
import { useGlobals } from '../../providers/globalsProvider';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder, uploadNewOrder } from '../../providers/firebaseMain';
import Step1 from './Step1';
import Step2 from './Step2';
import { useHistory } from 'react-router';
import { returnUpBackOutline } from 'ionicons/icons';
import Page from '../../components/Page';
import { useNewOrder } from '.';





const AddOrderPage: any = (props: any) => {
  const [finish, setFinish] = useState(false)
  const { user, profile } = useGlobals()
  const {order} = useNewOrder()
  const [orderProps, setOrderProps] = useState<any>({
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


  const [present] = useIonToast()
 

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
    try {
      await uploadNewOrder(orderProps)
      // setFinish(true)
      setLoading(false)
      present({ message: 'Order submitted seccessfully ',duration:1000 })

      navigate.push('/')


    } catch (error) {
      setLoading(false)

      present({ message: 'Sorry some issue happen.. please try Again' })
    }
  }

  return <IonPage >
    {step === 2 && <IonFab>
      <IonFabButton onClick={() => setStep(1)}>
        <IonIcon icon={returnUpBackOutline}></IonIcon></IonFabButton></IonFab>}

    {step === 1 ? <Step1 onFinish={hundlelocation} /> 
    : <Step2 onFinish={hundleInfo}  />}
  
    


    <IonLoading
      isOpen={loading}
      message={'Submiting Order..'} ></IonLoading>
  </IonPage>
};

export default AddOrderPage;


