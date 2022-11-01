import React, { useEffect, useRef, useState } from 'react';
import { IonBadge, IonButton, IonButtons, IonContent, IonFab, IonFabButton,
   IonFabList,
   IonFooter,
   IonIcon, IonLabel, IonMenuButton, IonPage, IonToolbar} from '@ionic/react';
import './Home.css';
import { add, chatbox, menu, menuOutline, person } from 'ionicons/icons';
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
      <IonFab vertical={'top'} horizontal={'start'}>

              <IonFabButton color={'light'}  onClick={()=>toggleMenu()}>
                  <IonMenuButton color={'primary'}></IonMenuButton>
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


                  <IonFab horizontal={'start'} vertical={'bottom'} >
                    <IonFabButton color={'light'} onClick={()=>history.push('AddOrderPage')}>
                      <IonIcon color={'primary'} icon={add}></IonIcon>
                    </IonFabButton>
                  </IonFab>
                       
                  
                  
              

              {/* {"dInfo: "+JSON.stringify( dInfo)}{"state: "+state} */}
           
    </IonPage>
  );
};

export default Tab1;