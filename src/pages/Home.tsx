import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder } from '../providers/firebaseMain';
import { Device } from '@capacitor/device';
import Page from '../components/Page';
import MapPage from './MapPage';


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
    <Page>
              <MapPage />

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