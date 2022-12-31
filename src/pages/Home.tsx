import React, { useEffect, useRef, useState } from 'react';
import {
  IonBadge, IonButton, IonButtons, IonContent, IonFab, IonFabButton,
  IonFabList,
  IonFooter,
  IonHeader,
  IonIcon, IonLabel, IonList, IonMenuButton, IonPage, IonTitle, IonToolbar
} from '@ionic/react';
import { add, chatbox, menu, menuOutline, person, personCircle } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import MainMenu from '../components/MainMenu';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder } from '../providers/firebaseMain';
import { Geolocation } from '@capacitor/geolocation';
import { Device } from '@capacitor/device';
import OrderList from '../components/OrderList';
import { greenIcon } from '../components/utlis/LeafLetMap';
import { TT } from '../components/utlis/tt';
import Page from '../components/Page';

var dInfo: any = ''
var state: any = process.env.NODE_ENV
Device.getInfo().then((info) => {
  dInfo = info
})

const Home = () => {

  const { user, profile } = useGlobals()
  const navigate = useHistory()
  const [addOrder, setAddOrder] = useState(false)
  const [fcmToken, setFcmToken] = useState<any>(null)
  const [_profile, _setProfile] = useState<any>(profile ? profile : getUserInfoPlaceHolder())
  const [Map, setMap] = useState<L.Map>()
  useEffect(() => {
    if (!!profile) {
      _setProfile(profile)
    }
  }, [profile]);

  const menuRef = useRef<any>()
  function onAddOrder() {
    setAddOrder(!addOrder)
  }
  function toggleMenu() {
    menuRef.current?.toggle()
  }
  async function getLocation() {

    Map?.locate()
    try {
      Geolocation.checkPermissions()
      const location = await Geolocation.getCurrentPosition()
      const latlng = { lat: location.coords.latitude, lng: location.coords.longitude }
      if (Map && location) {
        Map?.flyTo(latlng)
        L.marker(latlng, { icon: greenIcon, draggable: true }).addEventListener('dragend', (e) => { console.log('e :>> ', e); }).addTo(Map)
        return
      }
    } catch (error) {
      alert('please enable GPS!  ' + error)
    }
    Map?.addEventListener('locationfound', (e) => {
      console.log(e);
      Map.flyTo(e.latlng)
      L.marker(e.latlng, { icon: greenIcon, draggable: true }).addEventListener('dragend', (e) => { console.log('e :>> ', e); }).addTo(Map)
    }, {})
  }

  return (
    <IonPage>

    <IonContent fullscreen={true} >
      

        <OrderList></OrderList>

      <IonButton style={{
        position: 'absolute',
        bottom: '5px',
        alignSelf: 'center'
      }}

        onClick={() => navigate.push('AddOrderPage')}
        shape='round'>
        {/* <IonIcon  icon={add}></IonIcon> */}
        {TT('Add New Order')}
      </IonButton>
    </IonContent>
    
    </IonPage>
  );
};

export default Home;