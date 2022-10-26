import React, { useEffect, useRef, useState } from 'react';
import { IonAvatar, IonButton, IonButtons, IonCard, IonCardContent, IonCardHeader, IonContent, IonFab, IonFabButton,
   IonGrid,
   IonHeader, IonIcon, IonImg, IonPage,
     IonRow,
     IonTitle,
     IonToolbar } from '@ionic/react';
import './Home.css';
import { add, chatbox, menuOutline, personCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import AddOrder from '../components/AddOrder';
import MainMenu from '../components/MainMenu';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder } from '../providers/firebaseMain';


const Tab1= () => {
  
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  const [fcmToken,setFcmToken] = useState<any>(null)
  const [_profile,_setProfile] = useState<any>(profile?profile:getUserInfoPlaceHolder())

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
 
    return (
    <IonPage>
      <MainMenu menuRef={menuRef}></MainMenu>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle slot='primary' onClick={()=>history.push("/home")}>ShoflyTawseel</IonTitle>
          <IonButtons slot="start">            
            <IonButton onClick={()=>toggleMenu()}>
                <IonIcon slot="icon-only" icon={menuOutline} />
            </IonButton>
            <IonButton onClick={()=>history.push("/Profile")}>
              {user && profile ?profile.photoURL!==null?
              <IonAvatar>
                <img alt='user profile' src={profile.photoURL}></img>
              </IonAvatar>:
              <IonIcon slot="icon-only" icon={personCircle} />
              :<IonIcon slot="icon-only" icon={personCircle} />}
    
              </IonButton>

            
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent style={{width:"100%",bottom: 0}}>
        {/* <OrderList></OrderList> */}
        <AddOrder isOpen={addOrder} setOpen={(v)=>setAddOrder(v)}/>
        <IonGrid style={{width:"100%",bottom: 0}}>
        <IonRow >
          {profile && <IonCard onClick={()=>history.push('/profile')} style={{maxWidth: "50%"}}>
            <IonCardHeader>
              {profile.name}
            </IonCardHeader>
            <IonAvatar><IonImg src={profile?.photoURL}></IonImg></IonAvatar>
            <IonCardContent>
                <IonRow>
                  <IonButtons>
                    <IonButton>My Orders</IonButton>
                  </IonButtons>
                </IonRow>
            </IonCardContent>


          </IonCard>}
          {!profile && <IonCard>
            <IonCardHeader>Profile</IonCardHeader> 
              <IonCardContent>
                <IonButton fill={'clear'} onClick={()=>{history.push('/signin')}}>
                Sign in Required
                </IonButton>
                
              </IonCardContent>
            </IonCard>}
          <IonCard >
            <IonCardHeader>The Orders</IonCardHeader>
            <IonCardContent> <IonButton fill='clear' onClick={()=>history.push('/OrdersPage')}>see the latest orders</IonButton> </IonCardContent>
          </IonCard>

        </IonRow>
        <IonRow>
          
        </IonRow>
        <IonCard >
        <IonCardHeader>Map</IonCardHeader>
        <IonCardContent style={{height: '300px'}}>
          <LeafLetMap></LeafLetMap>
        </IonCardContent>
      </IonCard>
        </IonGrid>
      </IonContent>

      

      <IonFab vertical="bottom" horizontal="start" slot="float">
      <IonFabButton onClick={()=>{onAddOrder()}}>
        <IonIcon icon={add} />
      </IonFabButton>
      <IonFabButton onClick={()=>{history.push("chats/")}}>
        <IonIcon icon={chatbox} />
      </IonFabButton>
    </IonFab>
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
export const LeafLetMap:React.FC=()=>{
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
                zoom: center_zoom
              })
              setMap(map)
              L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
              }).addTo(map);  
              map.setView(new L.LatLng(center_lat,center_long), center_zoom);
              // var Stadia_Outdoors = L.tileLayer('https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png', {
              //     maxZoom: 20,
              //     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
              //   }).addTo(map);    
              const lg = L.layerGroup([]).addTo(map)
              map.addEventListener('click',(e)=>{
                console.log('markers :>> ', lg.getLayers());
                console.log('e.latlong :>> ', e.latlng);
                
                const nm = L.marker(e.latlng,
                  {autoPan:true,title:'your place',icon:greenIcon})

                if(lg.getLayers().length){
                  const m = lg.getLayers()[0] as L.Marker
                  m.setLatLng(e.latlng)
                  setMarker(m)
                }else{
                  lg.addLayer(nm)
                  setMarker(nm)
                }
                map.flyTo(e.latlng,15,{animate:true})
              })
              L.gridLayer({})
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
                  display:'block',
                  overflow: 'hidden',
                  background: '#ddd',
                  outlineOffset: '1px',
                  width:'100%',
                  height:'100%',
                 
                 }}>
                  
                </div>);
}

