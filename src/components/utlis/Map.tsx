import React from 'react';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';
import { IonButton, IonContent } from '@ionic/react';

const MyMap: React.FC = () => {
  const mapRef = useRef<HTMLElement>();
  let newMap: GoogleMap;

  async function createMap() {
    if (!mapRef.current) return;

    newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: mapRef.current,
      apiKey: process.env.REACT_APP_map_api_key!,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8
      }
    })
  }

  return<IonContent className="component-wrapper">
          <capacitor-google-map ref={mapRef} style={{
            display: 'inline-block',
            width: 275,
            height: 400
          }}></capacitor-google-map>

          <IonButton onClick={()=>createMap()}>Create Map</IonButton>
        </IonContent>
  
}

export default MyMap;