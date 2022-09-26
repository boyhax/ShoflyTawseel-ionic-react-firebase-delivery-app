import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';
import {  IonButton, IonButtons, IonContent } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';


export default ({}:any) => {
  const mapRef = useRef<any>();
  const[markers,setMarkers]=useState<any>([])
  const[map,setMap] = useState<GoogleMap|null>(null)
  useEffect(()=>{

},[])

  
  return<IonContent className="component-wrapper">
          
            
          <IonButtons>
                <IonButton onClick={()=>{}} >my location</IonButton>
            </IonButtons>

        </IonContent>
  
}

