import React, { useEffect, useState } from 'react';
import {
  IonButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox, IonCol, IonContent, IonDatetime, IonDatetimeButton, IonFab, IonFabButton,
  IonFooter,
  IonGrid,
  IonIcon, IonImg, IonInput, IonItem, IonLabel, IonList, IonMenu, IonModal, IonPage,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonVirtualScroll,
  SelectChangeEventDetail,
  useIonAlert
} from '@ionic/react';
import './Home.css';
import { arrowDown, arrowForwardOutline, caretForwardOutline, closeSharp, duplicateOutline, fastFood, location as locationIcon } from 'ionicons/icons';
import { useHistory } from "react-router-dom";
import { useGlobals } from '../providers/globalsProvider';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getUserInfoPlaceHolder, orderProps } from '../providers/firebaseMain';
import { Device } from '@capacitor/device';
import { citiesList } from '../components/utlis/citiesUtlis';
import { Url } from 'url';
import { addDoc, collection, doc, FieldValue, serverTimestamp } from 'firebase/firestore';
import { db } from '../App';
import { getAuth } from 'firebase/auth';

const optionsPlaceholder: any = []
for (let v of Array(4)) {
  optionsPlaceholder.push({ value: 'oman', title: 'muscat', subTitle: "oman" })
}
type locationOption = { value: Geolocation | any, title: string, subTitle?: string }
type Geolocation = { latlng: LatLng, city: string, state?: string }
type LatLng = { lat: string, lng: string }
type OrderType = { name: string, icon: any, value: OrderCatagorie }
type OrderCatagorie = "SmallObjects"|'Food'|'PeopleTrans'|'AnimalTrans'|'BigObjects' ;

const catagories: OrderType[] = [
  { name: 'Small Objects', icon: require('../assets/smallObjectsIcon.png'), value: 'SmallObjects' }
  , { name: 'Food & Drinks', icon: require('../assets/take-away.png'), value: 'Food' }
  , { name: 'People Transport', icon: require('../assets/peopleTransIcon.png'), value: 'PeopleTrans' }
  , { name: 'Animal Transport', icon: require('../assets/animalsTrans.png'), value: 'AnimalTrans' }
  , { name: 'Big Objects', icon: require('../assets/interior-design.png'), value: 'BigObjects' }]



const AddOrderPage = () => {

  const { user, profile } = useGlobals()
  const history = useHistory()
  const [orderCatagory, setOrderCatagory] = useState<string>('')
  const [pickUpLocation, setPickUpLocation] = useState<Geolocation>()
  const [dropLocation, setDropLocation] = useState<Geolocation>()
  const [comment, setComment] = useState<string>()


  const [pickUpSearchValue, setPickUpSearchValue] = useState<string>()
  const [dropSearchValue, setDropSearchValue] = useState<string>()

  const [focusedPicker, setFocusedPicker] = useState<"pickUp" | "drop">()
  const [isLocationsConfirmed, setLocationsConfirmed] = useState<boolean>(false)

  const [_profile, _setProfile] = useState<any>(profile ? profile : getUserInfoPlaceHolder())
  const [options, setOptions] = useState<locationOption[]>()
  const [isSubmitingOrder, setSubmitingOrder] = useState(false)
  const [isUrgent, setUrgent] = useState(false)
  const [OrderDate, setOrderDate] = useState<Date | any>(new Date().toDateString())


  useEffect(() => {
    if (!!profile) {
      _setProfile(profile)
    }
  }, [profile]);

  function onOptionPick(v: locationOption): void {
    focusedPicker === 'pickUp' ? setPickUpLocation(v.value || pesuedoLocation(v)) : setDropLocation(v.value || pesuedoLocation(v))
    console.log('v.value || pesuedoLocation(v) :>> ', v.value || pesuedoLocation(v));
    focusedPicker === 'pickUp' ?
      setPickUpSearchValue(v.title || pickUpSearchValue)
      : setDropSearchValue(v.title || dropSearchValue)
    setOptions(undefined)
  }
 
  function onPickerFocused(v: "drop" | "pickUp") {
    setFocusedPicker(v)
    console.log('onset focused :>> ', v);
  }
  function pesuedoLocation(v: locationOption): Geolocation {
    return { latlng: { lat: '15.55555', lng: '51,00000' },city:v.value,state:v.value }
  }
  function updateOptions(text: string) {

    let op: locationOption[] = []
    const c = citiesList.sort((a, b) => { return b.indexOf(text) - a.indexOf(text) }).slice(0, 4)
    c.forEach((v) => op.push({ value: v, title: v, subTitle: v }))
    setOptions(op)

  }
  const [presentAlert] = useIonAlert()


  function isLocationsSet() {
    return pickUpLocation && dropLocation
  }
 
  const onSubmitOrder = async () => {
    if (!user) { presentAlert({ message: 'please Sign In First', animated: true, }) }
    setSubmitingOrder(true)
    const newO:orderProps = { 
      urgent:isUrgent,
      from: pickUpLocation?.city!, 
      to: dropLocation?.city!, 
      uid: getAuth().currentUser?.uid!, 
      time: serverTimestamp(), 
      type: orderCatagory,
      comment:comment,
      reports:[] ,
      applications:[]
    }
    try {
      await addDoc(collection(db, 'orders'), newO).finally(() => setSubmitingOrder(false))
      console.log('oreder submited')
    } catch (error) {
      console.log('error submitiing order :>> ', error);
    }
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
        {catagories && catagories.map((value, index, array) => {
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
        <IonItem>
          <IonLabel>Time prefered for delivery</IonLabel>
          <IonDatetimeButton  datetime="datetime"></IonDatetimeButton>

          <IonModal keepContentsMounted={true}>
            <IonDatetime onIonChange={(e) => { setOrderDate(e.detail.value); console.log(e.detail.value) }} id="datetime"></IonDatetime>
          </IonModal>
        </IonItem>
<IonItem>
  <textarea onChange={v=>console.log(v)} placeholder={"Please write any discreption.. "}>

  </textarea>
</IonItem>
      </div>

    </IonContent>


    <IonFooter style={{ display: "flex", justifyContent: 'center' }}>
      <IonButton shape={'round'}
        disabled={!orderCatagory || !isLocationsConfirmed||!OrderDate||isSubmitingOrder}
        onClick={() => {
          onSubmitOrder()
        }}   >
          {isSubmitingOrder &&<IonSpinner ></IonSpinner>}
        Submit Order 👍
      </IonButton>
    </IonFooter>




    {/* {"dInfo: "+JSON.stringify( dInfo)}{"state: "+state} */}

  </IonPage>

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
                value={pickUpSearchValue}
                onIonChange={(e) => { updateOptions(e.detail.value || ""); setPickUpSearchValue(e.detail.value || "") }}
                onClick={() => onPickerFocused("pickUp")}></IonInput>
            </IonItem>
            {/* drop point */}
            <IonItem>
              <IonLabel position={'floating'}>Drop point</IonLabel>
              <IonInput
                // onIonBlur={()=>setOptions(undefined)}
                value={dropSearchValue}
                onIonChange={(e) => { updateOptions(e.detail.value || ""); setDropSearchValue(e.detail.value || "") }}
                onClick={() => onPickerFocused("drop")}></IonInput>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonList inset={true}  >
          <IonItem key={'head'}>
            <IonIcon color={'primary'} icon={locationIcon}></IonIcon>
            <IonCardTitle>{'use map for location'}</IonCardTitle>
          </IonItem>
          {options && options.map((v, i) => {
            return <IonItem key={i} onClick={() => { onOptionPick(v) }}>
              <IonIcon size={'small'} color={'secondary'} icon={caretForwardOutline}></IonIcon>

              <div>
                <IonLabel>{v.title}</IonLabel>
                <IonCardSubtitle  >{v.subTitle || ''}</IonCardSubtitle>
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


