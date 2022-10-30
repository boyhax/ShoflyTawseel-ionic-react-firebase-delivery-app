import React, { useEffect, useState } from 'react';
import { IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton,
   IonFooter,
   IonIcon, IonInput, IonItem, IonLabel, IonList, IonMenu, IonModal, IonPage,
     IonSearchbar,
     IonSelect,
     IonSelectOption,
     IonTitle,
     useIonAlert} from '@ionic/react';
import './Home.css';
import { caretForwardOutline, closeSharp, duplicateOutline, location as locationIcon } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder } from '../providers/firebaseMain';
import { Device } from '@capacitor/device';

const optionsPlaceholder:any=[]
for(let v of Array(4)){
  optionsPlaceholder.push({value:'oman',title:'muscat',subTitle:"oman"})
}
type locationOption ={value:string,title:string,subTitle?:string}
type location={latlng:{lat:string,lng:string}}
const AddOrderPage= () => {
  
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  const [pickUpLocation,setPickUpLocation] = useState<location>()
  const [dropLocation,setDropLocation] = useState<location>()

  const [fcmToken,setFcmToken] = useState<any>(null)
  const [_profile,_setProfile] = useState<any>(profile?profile:getUserInfoPlaceHolder())
  const [options,setOptions] = useState<locationOption[]>(optionsPlaceholder)
  useEffect(() => {
    if(!!profile){
      _setProfile(profile)
    }
  }, [profile]);

  function onAddOrder(){
    // presentAlert({message:'hello',buttons:["submit"]})


  }
  const [presentAlert] = useIonAlert()

  
 function isLocationsSet(){
  return pickUpLocation && dropLocation
 }
    return (
    <IonPage >

      
      
      
      <IonFab style={{left: '10px',top:'10px'}}>
              <IonFabButton color={'light'}  onClick={()=>history.goBack()}>
                  <IonIcon color={'primary'} icon={closeSharp} />
              </IonFabButton>
            </IonFab>
                <IonContent style={{top: '60px'}}>
                  <IonCard 
                  // style={{top:'60px'}}
                  >
                    <IonCardContent>
                      {/* pick up point */}
                      <IonItem>
                        <IonLabel position={'floating'}>Pick up point</IonLabel>
                        <IonInput></IonInput>
                      </IonItem>
                      {/* drop point */}
                      <IonItem>
                        <IonLabel position={'floating'}>Drop point</IonLabel>
                        <IonInput></IonInput>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>

                  <IonList inset={true}  >
                  <IonItem key={'head'}>
                          <IonIcon color={'primary'} icon={locationIcon}></IonIcon>
                          <IonCardTitle>{'use map for location'}</IonCardTitle>
                        </IonItem>
                    {options && options.map((v,i)=>{
                        return<IonItem key={i}>
                          <IonIcon size={'small'} color={'secondary'} icon={caretForwardOutline}></IonIcon>
                          <IonCol>
                            <IonLabel>{v.title}</IonLabel>
                            <IonCardSubtitle >{v.subTitle ||''}</IonCardSubtitle>
                          </IonCol>
                          
                        </IonItem>
                    })}

                  </IonList>

                </IonContent>
               
               
               <IonFooter style={{display:"flex",justifyContent: 'center'}}>
               <IonButton shape={'round'}
                  disabled={!isLocationsSet()}
                  onClick={()=>onAddOrder()}   >
                    Set Locations
                  </IonButton>
                </IonFooter>   
              
              
              

              {/* {"dInfo: "+JSON.stringify( dInfo)}{"state: "+state} */}
           
    </IonPage>
  );
};

export default AddOrderPage;
