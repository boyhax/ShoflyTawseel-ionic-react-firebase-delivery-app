import React, { useEffect, useRef, useState } from 'react';
import {
  IonBadge, IonButton, IonButtons, IonCard, IonContent, IonFab, IonFabButton,
  IonFabList,
  IonFooter,
  IonHeader,
  IonIcon, IonLabel, IonList, IonMenuButton, IonPage, IonSegment, IonSegmentButton, IonTitle, IonToolbar
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
import OrdersSegmentComponent from '../components/OrdersSegmentComponent';



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

  function onAddOrder() {
    setAddOrder(!addOrder)
  }
 
  

  return (
    <Page menubutton>
      <IonContent fullscreen scrollX>
        <OrdersSegmentComponent></OrdersSegmentComponent>
        
        
      </IonContent>



      <div className={'sticky bottom-2 w-full flex justify-center'}>
          <IonButton className={'mx-auto w-50'}

            onClick={() => navigate.push('addorder')}
            shape='round'>
            <IonIcon  icon={add}></IonIcon>
            {TT('Add New Order')}
          </IonButton>
        </div>
    </Page>
  );
};

export default Home;


//x scroll
{/* <div className={'flex flex-row w-100 overflow-x-scroll'}>
        {[1,2,1,1,1,1,1,].map((v)=>{
          return  <div className={'w-[100px] h-[100px]'}>
          sfsdfsdfsdfsdfsdfdsf
        </div>
        })} 
        </div> */}