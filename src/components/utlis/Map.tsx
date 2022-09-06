import React, { useEffect, useState } from 'react';
import { GoogleMap } from '@capacitor/google-maps';
import { useRef } from 'react';
import {  IonButton, IonButtons, IonContent } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';

const gkey = process.env.REACT_APP_map_api_key!
const MyMap: React.FC = () => {
  const mapRef = useRef<any>();
  const[markers,setMarkers]=useState<any>([])
  const[map,setMap] = useState<GoogleMap|null>(null)
  useEffect(()=>{
    createMap()

},[])

  async function createMap() {
    if (!mapRef.current) return;

    const newMap = await GoogleMap.create({
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
    setMap(newMap)
  }
 async function markMyLocation(){
    const pos = await Geolocation.getCurrentPosition()
    if(!!map){
      
      // map.removeMarker("1")
     const id = await map.addMarker({
        coordinate:{
          lat:pos.coords.latitude,
          lng:pos.coords.longitude
        },
         
       })
       setMarkers([...markers,id])
       map.setCamera({
        coordinate: {
          lat:pos.coords.latitude,
        lng:pos.coords.longitude
        },
      })  
      if(markers.length>0){
        console.log('markers :>> ', markers);
        map.removeMarkers(markers)
        setMarkers([])
      }
    }
    
    console.log('pos :>> ', pos);
  }

  return<IonContent className="component-wrapper">
          <capacitor-google-map ref={mapRef} style={{
            display: 'inline-block',
            width: 275,
            height: 400
          }}>
            
          </capacitor-google-map>
          <IonButtons>
                <IonButton onClick={()=>markMyLocation()} >my location</IonButton>
            </IonButtons>

          {/* <IonButton onClick={()=>createMap()}>Create Map</IonButton> */}
        </IonContent>
  
}

export default MyMap;