import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';
import {  IonContent } from '@ionic/react';

const gkey = process.env.REACT_APP_map_api_key!
const MyMap: React.FC = () => {
  const mapRef = useRef<HTMLElement>();
  const[markers,setMarkers]=useState<any>(false)
  let newMap: GoogleMap;

  useEffect(()=>{
    createMap()

},[])

  async function createMap() {
    if (!mapRef.current) return;

    newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: mapRef.current,
      apiKey: gkey,
      config: {
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8
      }
    })
    newMap.enableCurrentLocation(true)
    
    newMap.setOnMapClickListener(async(data)=>{
      console.log('data :>> ', data);
      const newm = {
        coordinate:{
        lat:data.latitude,
        lng:data.longitude
        },
        draggable:true,
        title:"target place"
      }
      if(markers){
        return
      }
      console.log('markers :>> ', markers);
      const id = await newMap.addMarker(newm);
      setMarkers(true)
    })

  }

  return<IonContent className="component-wrapper">
          <capacitor-google-map ref={mapRef} style={{
            display: 'inline-block',
            width: 275,
            height: 400
          }}></capacitor-google-map>

          {/* <IonButton onClick={()=>createMap()}>Create Map</IonButton> */}
        </IonContent>
  
}

export default MyMap;