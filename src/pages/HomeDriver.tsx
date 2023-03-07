import React, { useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder } from '../providers/firebaseMain';
import { Device } from '@capacitor/device';
import Page from '../components/Page';
import MapPage from './MapPage';
import { IonAccordion, IonAccordionGroup, IonButton, IonContent, IonHeader, IonIcon, IonItem, IonLabel, IonNote, IonToggle, IonToolbar } from '@ionic/react';
import { golfOutline } from 'ionicons/icons';
import { TT } from '../components/utlis/tt';
import { DriverStatus } from '../types';
import { useDriver } from '../hooks/useDriver';
import UserApplicationsList from '../components/UserApplicationsList';


export default function HomeDriver(){

  
 const {driver,toggleStatus} = useDriver()
  

  return (
    <Page menubutton>
      <IonHeader className={`flex justify-center`}>
          {/* <IonToggle /> */}
          {/* <IonIcon icon={golfOutline} /> */}
            {/* <IonLabel>{TT('status')}</IonLabel> */}
            {/* <IonNote >{TT(DriverStatus[driver.status])}</IonNote> */}

          {driver && <IonToggle
            disabled={["pending","banned"].includes(driver.status)?true:false}
            // slot={""}
              checked={driver.working}
              onIonChange={toggleStatus}
            ></IonToggle>
          }
      </IonHeader>
      <IonContent>
        <UserApplicationsList/>
      </IonContent>
      <div className={`bottom-0 absolute flex flex-col justify-center w-full`}>
       <IonButton>look up for in map</IonButton>
       <div className={` block b-0 h-52 w-full`}>
       <MapPage />

       </div>
      </div>
              

    </Page>
  );
};

