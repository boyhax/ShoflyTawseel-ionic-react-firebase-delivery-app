import React, { useEffect, useRef, useState } from 'react';
import { IonAvatar, IonBadge, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCol, IonContent, IonFab, IonFabButton,
   IonFooter,
   IonGrid,
   IonHeader, IonIcon, IonicSwiper, IonImg, IonItem, IonModal, IonPage,
     IonRow,
     IonTitle,
     IonToolbar, 
     IonVirtualScroll} from '@ionic/react';
import './Home.css';
import { add, chatbox, menuOutline, personCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import AddOrder from '../components/AddOrder';
import MainMenu from '../components/MainMenu';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder } from '../providers/firebaseMain';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import OrderList from '../components/OrderList';

var dInfo:any =''
var state:any = process.env.NODE_ENV
Device.getInfo().then((info)=>{
  dInfo = info
})

const Tab1= () => {
  
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  const [fcmToken,setFcmToken] = useState<any>(null)
  const [_profile,_setProfile] = useState<any>(profile?profile:getUserInfoPlaceHolder())
  const [Map,setMap] = useState<L.Map>()
  useEffect(() => {
    if(!!profile){
      _setProfile(profile)
    }
  }, [profile]);

  const menuRef = useRef<any>()
  function onAddOrder(){
    setAddOrder(!addOrder)
  }
  function toggleMenu(){
    menuRef.current?.toggle()
  }
  async function getLocation(){
    
    Map?.locate()
    try {
      Geolocation.checkPermissions()
      const location = await Geolocation.getCurrentPosition()
      const latlng = {lat:location.coords.latitude,lng:location.coords.longitude}
    if(Map && location){
      Map?.flyTo(latlng)
      L.marker(latlng,{icon:greenIcon,draggable:true}).addEventListener('dragend',(e)=>{console.log('e :>> ', e);}).addTo(Map)
      return
    }
    } catch (error) {
      alert('please enable GPS!  '+error)
    }
    Map?.addEventListener('locationfound', (e)=>{console.log(e);
    Map.flyTo(e.latlng)
    L.marker(e.latlng,{icon:greenIcon,draggable:true}).addEventListener('dragend',(e)=>{console.log('e :>> ', e);}).addTo(Map)
    }, {})
  }
 
    return (
    <IonPage style={{width:"100vw",height: "100vh",bottom: '0px',backgroundColor: "#5e6bec"}}>
      <MainMenu menuRef={menuRef} ></MainMenu>
      <IonFab style={{left: '10px',top:'10px'}}>
              <IonFabButton color={'light'}  onClick={()=>toggleMenu()}>
                  <IonIcon color={'primary'} icon={menuOutline} />
              </IonFabButton>
              
              <IonFab>
              <IonFabButton color={'light'} onClick={()=>{history.push("chats/")}}>
                  <IonIcon color={'primary'} icon={chatbox} />
              </IonFabButton>
              <IonBadge style={{position: 'absolute',top:'-5px',left:'-5px'}}>5</IonBadge>

              </IonFab>
              
            </IonFab>
      
       {/* map */}
            {/* <LeafLetMap onMap={(map)=>setMap(map)}></LeafLetMap> */}
              
              {/* bottom panel */}
                {true && <IonContent style={{height: '100%'}}>
                  <OrderList></OrderList>
                  </IonContent>}

                  <IonButton 
                  style={{position: 'absolute',bottom:'5px',right:'30%'}}
                  onClick={()=>history.push('AddOrderPage')} shape={'round'} slot={'start'} >
                    Add order now
                  </IonButton>
              

              {/* {"dInfo: "+JSON.stringify( dInfo)}{"state: "+state} */}
           
    </IonPage>
  );
};

export default Tab1;


var greenIcon = L.icon({
  iconUrl: require('../assets/icons8-user-location-100.png'),
  // shadowUrl: 'leaf-shadow.png',

  iconSize:     [50, 50], // size of the icon
  shadowSize:   [50, 64], // size of the shadow
  iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
  shadowAnchor: [4, 62],  // the same for the shadow
  popupAnchor:  [0, 50] // point from which the popup should open relative to the iconAnchor
});
type props={
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

          // Similar to componentDidMount and componentDidUpdate:
          useEffect(() => {
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
              // var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
              //     maxZoom: 20,
              //     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              //   }).addTo(map);    
              const lg = L.layerGroup([]).addTo(map)
              
              // map.addEventListener('mousedown',(e)=>{
                
              //   console.log('markers :>> ', lg.getLayers());
              //   console.log('e.latlong :>> ', e.latlng);
                
              //   const nm = L.marker(e.latlng,
              //     {autoPan:true,title:'your place',icon:greenIcon})

              //   if(lg.getLayers().length){
              //     const m = lg.getLayers()[0] as L.Marker
              //     m.setLatLng(e.latlng)
              //     setMarker(m)
              //   }else{
              //     lg.addLayer(nm)
              //     setMarker(nm)
              //   }
              //   map.flyTo(e.latlng,15,{animate:true})
              // })
            },[]);
            useEffect(() => {
              if(map){
                map.invalidateSize(true)
              }
            });
            
          function getCurrentLocation(){
            if(!map){
              return
            }
              map.locate({
                // https://leafletjs.com/reference-1.7.1.html#locate-options-option
                setView: true,
                enableHighAccuracy: true,
              })
              // if location found show marker and circle
              .on("locationfound", (e:L.LocationEvent) => {
                console.log(e);
                // marker
                 L.marker([e.latlng.lat, e.latlng.lng]).addTo(map).bindPopup(
                  "Your are here :)"
                );
                // circle
                 L.circle([e.latlng.lat, e.latlng.lng], e.accuracy / 2, {
                  weight: 2,
                  color: "red",
                  fillColor: "red",
                  fillOpacity: 0.1,
                }).addTo(map);
                map.flyTo([e.latlng.lat, e.latlng.lng], 15);

              })
              // if error show alert
              .on("locationerror", (e) => {
                console.log(e);
                // alert("Location access denied.");
              });
}
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

