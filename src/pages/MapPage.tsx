import React, { useEffect, useRef, useState } from 'react';
import { IonBackButton, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonLabel, IonPage, IonTabButton, IonTitle, IonToolbar } from '@ionic/react';
import { GoogleMap } from '@capacitor/google-maps';
import GMap from '../components/utlis/GMap';
import { location } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
import useBoundOrders from '../hooks/useBoundOrders';

interface _state{
  value:any,
  centerMarker:boolean
}
const MapPage: React.FC = () => {
  const [map, setMap] = useState<GoogleMap>()
  const [_state,_setState] = useState<_state>({
    value:1,
    centerMarker:false
  })
  const state = useRef(_state)
  useEffect(() => {
    map && setup()
    return () => unSetup()
  }, [map])
  function setState(obj:Partial<_state>){
    state.current = {...state.current, ...obj}
  }
  const {orders,loading,setBounds,update} = useBoundOrders()
  
  function setup() {
    if (!map) { return }
    map.setOnBoundsChangedListener((data) => {
      setState({value:state.current.value+1}) 
      console.log('value+1 :>> ', state.current.value);
    })
    map.setOnMarkerClickListener((d)=>{
      console.log("d ",d)
    })
  }
  function unSetup() {
    map && map.removeAllMapListeners()
  }
   function  moveCameraTo(pos:LatLng) {
    if (map) {
      map.setCamera({
        coordinate: { lat: pos.lat, lng: pos.lng },
        zoom: 10,
        animate: true,

      })

    }
  }
  async function  selfLocate() {
    const pos = await Geolocation.getCurrentPosition()
    if (map) {
      map.setCamera({
        coordinate: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        zoom: 10,
        animate: true,

      })

    }
  }
  return (

    <div className={'w-full h h-full'}>
      <GMap onMap={setMap} controls={<div className={' w-full h-full flex  '}>
        <div className={`pointer-events-auto 
            relative justify-center flex flex-col self-center  `}>
          <IonButton onClick={selfLocate} shape='round' color='light'>
            <IonIcon color={'primary'} icon={location} />
            {/* <IonLabel color={'primary'}>Locate</IonLabel> */}
          </IonButton>
        </div>


        {state.current.centerMarker && <div className={'absolute w-full h-full flex  '}>
          <IonIcon className={`pointer-events-noun m-auto
            text-5xl `}
            color={'primary'}
            icon={location} />
        </div>}


      </div>}>

      </GMap>
    </div>
  );
};

export default MapPage;
