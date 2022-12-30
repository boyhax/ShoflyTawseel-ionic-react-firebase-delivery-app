import React, { useState } from 'react';
import { IonContent, IonPage } from '@ionic/react';
import MainHeader from '../components/MainHeader';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';

const Demo: React.FC = () => {
  const [value, setValue] = useState(null);
  console.log('value :>> ', value);

  return (

    <IonPage>
      <MainHeader></MainHeader>
      <IonContent>
        <GooglePlacesAutocomplete
          apiOptions={{ region: 'OM' }}

          selectProps={{
            value,
            onChange: setValue,
          }}
          apiKey={process.env.REACT_APP_map_api_key}></GooglePlacesAutocomplete>

      </IonContent>
    </IonPage>
  );
};

export default Demo;
