import React, { useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardSubtitle, IonCheckbox, IonContent, IonFab, IonFabButton,
  IonFooter,
  IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonPage,
  IonSpinner,
  IonTextarea,
  IonTitle,
  useIonAlert
} from '@ionic/react';
import './Home.css';
import { arrowForwardOutline, caretForwardOutline, close, closeSharp, location as locationIcon } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder, orderProps } from '../providers/firebaseMain';
import { citiesList } from '../components/utlis/citiesUtlis';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../App';
import { getAuth } from 'firebase/auth';
import { LeafLetMap } from './GetLocationOnMap';
import { Address, getAddressOptions } from '../components/utlis/AddressApi';

const optionsPlaceholder: any = []
for (let v of Array(4)) {
  optionsPlaceholder.push({ value: 'oman', title: 'muscat', subTitle: "oman" })
}
type locationOption = { value: Geolocation | any, title: string, subTitle?: string }
type Geolocation = { latlng: LatLng, city: string, state?: string }
type LatLng = { lat: string, lng: string }
type OrderType = { name: string, icon: any, value: OrderCatagorie }
export type OrderCatagorie = "SmallObjects" | 'Food' | 'PeopleTrans' | 'AnimalTrans' | 'BigObjects';

export const OrderCatagories: OrderType[] = [
  { name: 'Small Objects', icon: require('../assets/smallObjectsIcon.png'), value: 'SmallObjects' }
  , { name: 'Food & Drinks', icon: require('../assets/take-away.png'), value: 'Food' }
  , { name: 'People Transport', icon: require('../assets/peopleTransIcon.png'), value: 'PeopleTrans' }
  , { name: 'Animal Transport', icon: require('../assets/animalsTrans.png'), value: 'AnimalTrans' }
  , { name: 'Big Objects', icon: require('../assets/interior-design.png'), value: 'BigObjects' }]



const AddOrderPage = () => {

  const { user, profile } = useGlobals()
  const history = useHistory()
  const [orderCatagory, setOrderCatagory] = useState<string>('')
  const [pickUpLocation, setPickUpLocation] = useState<Address>()
  const [dropLocation, setDropLocation] = useState<Address>()
  const [comment, setComment] = useState<string>()
  const [openMap, setOpenMap] = useState(false)
  const [map, setMap] = useState<L.Map>()

  const [pickUpSearchValue, setPickUpSearchValue] = useState<string>()
  const [dropSearchValue, setDropSearchValue] = useState<string>()

  const [focusedPicker, setFocusedPicker] = useState<"pickUp" | "drop">()
  const [isLocationsConfirmed, setLocationsConfirmed] = useState<boolean>(false)

  const [_profile, _setProfile] = useState<any>(profile ? profile : getUserInfoPlaceHolder())
  const [options, setOptions] = useState<Address[]>()
  const [isSubmitingOrder, setSubmitingOrder] = useState(false)
  const [isUrgent, setUrgent] = useState(false)
  const [OrderDate, setOrderDate] = useState<Date | any>(new Date().toDateString())


  useEffect(() => {
    if (!!profile) {
      _setProfile(profile)
    }
  }, [profile]);

  function onOptionPick(v: Address): void {
    focusedPicker === 'pickUp' ? setPickUpLocation(v) : setDropLocation(v)
    console.log('v.value || pesuedoLocation(v) :>> ', v.name);
    focusedPicker === 'pickUp' ?
      setPickUpSearchValue(v.name || pickUpSearchValue)
      : setDropSearchValue(v.name || dropSearchValue)
    setOptions(undefined)
  }

  function onPickerFocused(v: "drop" | "pickUp") {
    setFocusedPicker(v)
    console.log('onset focused :>> ', v);
  }
  function pesuedoLocation(v: locationOption): Geolocation {
    return { latlng: { lat: '15.55555', lng: '51,00000' }, city: v.value, state: v.value }
  }
  function updateOptions(text: string) {

    let op: Address[] = []
    const c = citiesList.sort((a, b) => { return b.indexOf(text) - a.indexOf(text) }).slice(0, 4)
    c.forEach((v) => 
    op.push({ address: v, name: v, location: {lat:'',lng:''},id:'',types:[""] }))
    getAddressOptions(text,(d)=>op = [...op,...d])
    setOptions(op)
    

  }
  const [presentAlert] = useIonAlert()


  function isLocationsSet() {
    return pickUpLocation && dropLocation
  }

  const onSubmitOrder = async () => {
    if (!user) {
      presentAlert({
        message: 'please Sign In First',
        animated: true,
        buttons: [{
          text: 'Ok', handler: (value) => {
            history.push("Signin")
          },
        }]
      })
    }

    setSubmitingOrder(true)
    const newO: orderProps = {
      urgent: isUrgent,
      from: pickUpLocation?.name!,
      to: dropLocation?.name!,
      uid: getAuth().currentUser?.uid!,
      time: serverTimestamp(),
      type: orderCatagory,
      comment: comment||'no comment',
      reports: [],
      applications: []
    }
    console.log(newO)
    try {
      await addDoc(collection(db, 'orders'), newO).finally(() => setSubmitingOrder(false))
      console.log('oreder submited')
    } catch (error) {
      console.log('error submitiing order :>> ', error);
    }
  }
  useEffect(() => {
    console.log('location :>> drop ', dropLocation," pick ",pickUpLocation);
  }, [dropLocation,pickUpLocation]);
  const onLocationPick = (e:any) => {
    const v: Address = {
      location: e,
      name:"city name",
      address:'state name',
      id:'',
      types:['locals']
    }
    focusedPicker==="drop"?setDropLocation(v):setPickUpLocation(v)
  }
  const Step2 = <IonPage >
    <IonFab style={{ left: '10px', top: '10px' }}>
      <IonFabButton color={'light'} onClick={() => setLocationsConfirmed(false)}>
        <IonIcon color={'primary'} icon={closeSharp} />
      </IonFabButton>
    </IonFab>
    <IonContent style={{ top: '60px' }}>
      <IonCard style={{ display: 'flex', justifyContent: 'center', justifyItems: 'space-between' }} >
        {/* pick up point */}
        <div>
          <IonLabel
            position={'floating'}>Pick up point</IonLabel>
          <IonTitle
            onClick={() => setLocationsConfirmed(false)}>
            {pickUpSearchValue}
          </IonTitle>
        </div>
        {/* drop point */}
        <IonIcon style={{ verticalAlign: 'middle', padding: '4px' }} size={'large'} icon={arrowForwardOutline}></IonIcon>
        <div>
          <IonLabel position={'floating'}>Drop point</IonLabel>
          <IonTitle
            onClick={() => setLocationsConfirmed(false)}>
            {dropSearchValue}
          </IonTitle>
        </div>
      </IonCard>
      <div style={{ display: 'flex', justifyItems: 'space-between', justifyContent: 'center', alignItems: 'space-evenly' }}>
        {OrderCatagories && OrderCatagories.map((value, index, array) => {
          return <div
            onClick={() => setOrderCatagory(value.value)}
            key={index}
            style={{
              margin: '5px', width: '60px',
              height: 'auto',
              borderRadius: '10px',
              border: '5px',
              backgroundColor: orderCatagory === value.value ?
                "var(--ion-color-primary)" : "var(--ion-color-light)"
            }}>

            <IonImg style={{ flex: 1, }} src={value.icon} />
            <IonLabel
              style={{ fontSize: '0.7em' }}
            >{value.name}</IonLabel>
          </div>
        })}
      </div>

      <div>
        <IonItem>
          <IonLabel >Is it Urgent? </IonLabel>
          <IonCheckbox placeholder={'Is Order Urgent?'} value={isUrgent} onIonChange={() => { setUrgent(!isUrgent) }}>
          </IonCheckbox>
        </IonItem>

        <IonCard>
          <IonTextarea
            onIonChange={v => setComment(v.detail.value!)}
            placeholder={"Please write any discreption.. "}>
          </IonTextarea>
        </IonCard>
      </div>

    </IonContent>


    <IonFooter style={{ display: "flex", justifyContent: 'center' }}>
      <IonButton shape={'round'}
        disabled={!orderCatagory || !isLocationsConfirmed || !OrderDate || isSubmitingOrder}
        onClick={() => {
          onSubmitOrder()
        }}   >
        {isSubmitingOrder && <IonSpinner ></IonSpinner>}
        Submit Order 👍
      </IonButton>
    </IonFooter>




    {/* {"dInfo: "+JSON.stringify( dInfo)}{"state: "+state} */}

  </IonPage>
  const MapLocationPicker = <IonPage>
    <IonFab horizontal={'start'} vertical='top'>
      <IonFabButton onClick={() => setOpenMap(false)}><IonIcon icon={close}></IonIcon></IonFabButton>
    </IonFab>
    <LeafLetMap onMap={(m) => { if (!map) { setMap(m) } }} onLocationChange={onLocationPick}></LeafLetMap>
  </IonPage>
  useEffect(() => {
    if (map) {
      // map setup
      map.on('click', (e) => [
        console.log(e)
      ])
    }
  }, [map]);
  if (openMap) {
    return MapLocationPicker
  }
  if (isLocationsConfirmed) {
    return Step2
  }

  return (
    <IonPage >
      <IonFab style={{ left: '10px', top: '10px' }}>
        <IonFabButton color={'light'} onClick={() => history.goBack()}>
          <IonIcon color={'primary'} icon={closeSharp} />
        </IonFabButton>
      </IonFab>
      <IonContent style={{ top: '60px' }}>
        <IonCard
        // style={{top:'60px'}}
        >
          <IonCardContent>
            {/* pick up point */}
            <IonItem>
              <IonLabel
                position={'floating'}>Pick up point</IonLabel>
              <IonInput
                // onIonBlur={()=>setOptions(undefined)}
                value={pickUpSearchValue||pickUpLocation?.name}
                onIonChange={(e) => { updateOptions(e.detail.value || ""); setPickUpSearchValue(e.detail.value || "") }}
                onClick={() => onPickerFocused("pickUp")}></IonInput>
            </IonItem>
            {/* drop point */}
            <IonItem>
              <IonLabel position={'floating'}>Drop point</IonLabel>
              <IonInput
                // onIonBlur={()=>setOptions(undefined)}
                value={dropSearchValue||dropLocation?.name}
                onIonChange={(e) => { updateOptions(e.detail.value || ""); setDropSearchValue(e.detail.value || "") }}
                onClick={() => onPickerFocused("drop")}></IonInput>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonList inset={true}  >
          {!!focusedPicker && <IonItem key={'head'}>
            <IonIcon color={'primary'} icon={locationIcon}></IonIcon>
            <IonButton fill={'clear'} onClick={() => setOpenMap(true)}>
              {'use map for location'}
            </IonButton>
            {/* <IonCardTitle >{'use map for location'}</IonCardTitle> */}
          </IonItem>}
          {options && options.map((v, i) => {
            return <IonItem key={i} onClick={() => { onOptionPick(v) }}>
              <IonIcon size={'small'} color={'secondary'} icon={caretForwardOutline}></IonIcon>

              <div>
                <IonLabel>{v.name}</IonLabel>
                <IonCardSubtitle  >{v.address || ''}</IonCardSubtitle>
              </div>

            </IonItem>
          })}

        </IonList>

      </IonContent>


      <IonFooter style={{ display: "flex", justifyContent: 'center' }}>
        <IonButton shape={'round'}
          disabled={!isLocationsSet()}
          onClick={() => setLocationsConfirmed(true)}   >
          Set Locations
        </IonButton>
      </IonFooter>




      {/* {"dInfo: "+JSON.stringify( dInfo)}{"state: "+state} */}

    </IonPage>
  );
};

export default AddOrderPage;


