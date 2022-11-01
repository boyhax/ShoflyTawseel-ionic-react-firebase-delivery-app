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
import { citiesList } from '../components/utlis/citiesUtlis';

const optionsPlaceholder:any=[]
for(let v of Array(4)){
  optionsPlaceholder.push({value:'oman',title:'muscat',subTitle:"oman"})
}
type locationOption ={value:Geolocation|any,title:string,subTitle?:string}
type Geolocation={latlng:LatLng,city?:string,state?:string}
type LatLng = {lat:string,lng:string}
const AddOrderPage= () => {
  
  const {user,profile}= useGlobals()
  const history = useHistory()
  const [addOrder,setAddOrder] = useState(false)
  const [pickUpLocation,setPickUpLocation] = useState<Geolocation>()
  const [dropLocation,setDropLocation] = useState<Geolocation>()

  const [pickUpSearchValue,setPickUpSearchValue] = useState<string>()
  const [dropSearchValue,setDropSearchValue] = useState<string>()

  const [focusedPicker,setFocusedPicker] = useState<"pickUp"|"drop">()

  const [fcmToken,setFcmToken] = useState<any>(null)
  const [_profile,_setProfile] = useState<any>(profile?profile:getUserInfoPlaceHolder())
  const [options,setOptions] = useState<locationOption[]>()
  useEffect(() => {
    if(!!profile){
      _setProfile(profile)
    }
  }, [profile]);

  function onOptionPick(v: locationOption): void {
    console.log('on option pick')
    focusedPicker==='pickUp'? setPickUpLocation(v.value||pesuedoLocation(v)):setDropLocation(v.value||pesuedoLocation(v))
    console.log('focused  :>> ', focusedPicker );
    focusedPicker==='pickUp'? 
    setPickUpSearchValue(v.title||pickUpSearchValue)
    :setDropSearchValue(v.title ||dropSearchValue)
    console.log('v.value :>> ', v.title);
  }
  function onAddOrder(){
    // presentAlert({message:'hello',buttons:["submit"]})
  }
  function onPickerFocused(v:"drop"|"pickUp"){
    setFocusedPicker(v)
    console.log('onset focused :>> ', v);
  }
  function pesuedoLocation(v:locationOption|any):Geolocation {
    return {latlng:{lat:'15.55555',lng:'51,00000'}}
  }
  function updateOptions(text:string) {
 
    let op: locationOption[]=[]
    const c = citiesList.sort((a,b)=>{return b.indexOf(text)-a.indexOf(text)}).slice(0,4)
    c.forEach((v)=>op.push({value:v,title:v,subTitle:v}))
    setOptions(op)
    
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
                        <IonLabel
                        position={'floating'}>Pick up point</IonLabel>
                        <IonInput
                        onIonBlur={()=>setOptions(undefined)}
                        value={pickUpSearchValue}
                        onIonChange={(e)=>{updateOptions(e.detail.value||"");setPickUpSearchValue(e.detail.value||"")}}
                         onClick={()=>onPickerFocused("pickUp")}></IonInput>
                      </IonItem>
                      {/* drop point */}
                      <IonItem>
                        <IonLabel position={'floating'}>Drop point</IonLabel>
                        <IonInput
                        onIonBlur={()=>setOptions(undefined)}
                        value={dropSearchValue}
                        onIonChange={(e)=>{updateOptions(e.detail.value||"");setDropSearchValue(e.detail.value||"")}} 
                        onClick={()=>onPickerFocused("drop")}></IonInput>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>

                  <IonList inset={true}  >
                  <IonItem key={'head'}>
                          <IonIcon color={'primary'} icon={locationIcon}></IonIcon>
                          <IonCardTitle>{'use map for location'}</IonCardTitle>
                        </IonItem>
                    {options && options.map((v,i)=>{
                        return<IonItem key={i} onClick={()=>{onOptionPick(v);console.log('message')}}>
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


