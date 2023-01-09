import { Geolocation } from '@capacitor/geolocation';
import { eventMethod } from '@ionic/core/dist/types/utils/overlays';
import L from 'leaflet';
import * as React from 'react';
import { useState } from 'react';

export const greenIcon = L.icon({
  iconUrl: require('../../assets/icons8-user-location-100.png'),
  // shadowUrl: 'leaf-shadow.png',

  iconSize:     [50, 50], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [0, 50] // point from which the popup should open relative to the iconAnchor
});
type props =  {
  onMap:(map:L.Map)=>void
}

export const LeafLetMap:React.FC<props>=({onMap})=>{
  let current_lat = 23.5880;
  let current_long = 58.3829;
  let current_zoom = 16;
  let center_lat = current_lat;
  let center_long = current_long;
  let center_zoom = current_zoom;
  const [map,setMap]= useState<L.Map>()
  const [marker,setMarker]= useState<L.Marker|any>("")
  async function getLocation() {
    if (!map){
      return
    }
    map.locate()
    try {
      Geolocation.checkPermissions()
      const location = await Geolocation.getCurrentPosition()
      const latlng = { lat: location.coords.latitude, lng: location.coords.longitude }
      if (map && location) {
        map.flyTo(latlng)
        L.marker(latlng, { icon: greenIcon, draggable: true })
        .addEventListener('dragend',
         (e) => { console.log('e :>> ', e); }).addTo(map)
        return
      }
    } catch (error) {
      alert('please enable GPS!  ' + error)
    }
    map.addEventListener('locationfound', (e) => {
      console.log(e);
      map.flyTo(e.latlng)
      L.marker(e.latlng,
         { icon: greenIcon, draggable: true })
         .addEventListener('dragend',
          (e) => { console.log('e :>> ', e); }).addTo(map)
    }, {})
  }
      // Similar to componentDidMount and componentDidUpdate:
      React.useEffect(() => {
          const map = L.map('map', {
            center: [center_lat, center_long],
            zoom: center_zoom,
            zoomControl:false,

          })
          setMap(map)
          onMap(map)
          
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }).addTo(map);  
          map.setView(new L.LatLng(center_lat,center_long), center_zoom);
          
        },[]);
        React.useEffect(() => {
          if(map){
            map.invalidateSize(true)
          }
        });
        
    return (
            <div id="map" 
              style={{
              display:'inline-block',
              overflow: 'hidden',
              background: '#ddd',
              outlineOffset: '1px',
              width:'100%',
              height:'100%',
             
             }}>
            </div>);
}
