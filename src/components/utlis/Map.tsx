import React, { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker } from '@capacitor/google-maps';
import { useRef } from 'react';
import { IonButton, IonButtons, IonCol, IonContent, IonIcon, IonToolbar } from '@ionic/react';
import { Geolocation } from '@capacitor/geolocation';
import './map.css'
import { locateOutline } from 'ionicons/icons';
import { LatLng } from '@capacitor/google-maps/dist/typings/definitions';
interface Props {
  onLocationSet?: (latlng: LatLng) => void,

}
const MyMap: React.FC<Props> = ({ onLocationSet }) => {
  const mapRef = useRef<any>();
  const [centerMarker, setCenterMarker] = useState<Marker>()
  const [map, setMap] = useState<GoogleMap>()
  const [centerlocation, setCenterlocation] = useState<LatLng>()

  useEffect(() => {
    createMap()
    return () => {
      map && map.removeAllMapListeners()
      map && map.destroy()
      setMap(undefined)
    }
  }, [])

  useEffect(() => {
    if (map) {

      map.setOnBoundsChangedListener((data) => {
        setCenterlocation({
          lat: data.latitude,
          lng: data.longitude
        })
        if (centerMarker) {
          centerMarker.coordinate = { lat: data.latitude, lng: data.longitude }

        } else {
          const m = {
            coordinate: {
              lat: data.latitude,
              lng: data.longitude
            },
            title: `The Point of drop`
          }
          map.addMarker(m)
          setCenterMarker(m)

        }
      });
    }
  
  }, [map])

  const onSubmit = () => {
    onLocationSet && centerlocation && onLocationSet(centerlocation);
  }

  async function createMap() {
    // if (!mapRef.current) return;

    const newMap = await GoogleMap.create({
      id: 'my-cool-map',
      element: mapRef.current,
      apiKey: process.env.REACT_APP_map_api_key!,
      config: {

        androidLiteMode: true,
        disableDefaultUI: true,
        center: {
          lat: 33.6,
          lng: -117.9
        },
        zoom: 8,
      },

    })
    setMap(newMap)

  }
  async function markMyLocation() {
    const pos = await Geolocation.getCurrentPosition()


    if (map) {
      map.setCamera({
        coordinate: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        zoom: 10,
        animate: true,

      })
      // if(centerMarker){

      // }
    }


  }

  return <div className={'mapMainContainer '}>
    <div className={' ui '}>
      <div className={'item'}>
        <button onClick={() => markMyLocation()} >
          <IonIcon className={'w-3 h-3'} icon={locateOutline} />
        </button>


      </div>

    </div>
    <div className={'mapContainer'}>

      <capacitor-google-map options={{ streetViewControl: false }}
        ref={mapRef}
        className={'map'}
      >

      </capacitor-google-map>
    </div>

    <div className={'bottom-0 w-full h-fit'}>
      <IonToolbar>
        <IonButton>
          Submit
        </IonButton>
      </IonToolbar>
    </div>

  </div>

}

export default MyMap;