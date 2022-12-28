import { IonPage, IonFab, IonFabButton, IonIcon, IonContent, IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonList, IonButton, IonCardSubtitle, IonFooter } from '@ionic/react';
import { closeSharp, options, caretForwardOutline, locateOutline, locationOutline } from 'ionicons/icons';
import * as React from 'react';
import { useHistory } from 'react-router';
import { useNewOrder, useOrderContext } from '.';
import { Cities } from '../../components/utlis/citiesUtlis';
import { Address, getAddressOptions } from '../../externalApis/api\'s';
import { Geolocation, locationOption } from '../../types';

const Step1:React.FC=(props)=>{
    const history = useHistory()
    
  const [pickUpSearchValue, setPickUpSearchValue] = React.useState<string>()
  const [dropSearchValue, setDropSearchValue] = React.useState<string>()

  const [focusedPicker, setFocusedPicker] = React.useState<"pickUp" | "drop">()
  const [isLocationsConfirmed, setLocationsConfirmed] = React.useState<boolean>(false)
  const [options, setOptions] = React.useState<Address[]>()
  const [pickUpLocation, setPickUpLocation] = React.useState<Address>()
  const [dropLocation, setDropLocation] = React.useState<Address>()
  const order = useNewOrder()

  const onLocationPick = (e: any) => {
    const v: Address = {
      location: e,
      name: "city name",
      address: 'state name',
      id: '',
      types: ['locals']
    }
    focusedPicker === "drop" ? setDropLocation(v) : setPickUpLocation(v)
  }
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

  function updateOptions(text: string) {

    let op: Address[] = []
    const c = Cities().sort((a, b) => { return b.value.indexOf(text) - a.value.indexOf(text) }).slice(0, 4)
    c.forEach((v) =>
      op.push({ address: v.value, name: v.value, location: { lat: '', lng: '' }, id: v.key, types: [""] }))
    getAddressOptions(text, (d) => op = [...op, ...d])
    setOptions(op)


  }
  function isLocationsSet() {
    return order.order.from && order.order.to
  }

    return<IonContent>
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
              value={pickUpSearchValue || pickUpLocation?.name}
              onIonChange={(e) => { updateOptions(e.detail.value || ""); setPickUpSearchValue(e.detail.value || "") }}
              onClick={() => onPickerFocused("pickUp")}></IonInput>
          </IonItem>
          {/* drop point */}
          <IonItem>
            <IonLabel position={'floating'}>Drop point</IonLabel>
            <IonInput
              // onIonBlur={()=>setOptions(undefined)}
              value={dropSearchValue || dropLocation?.name}
              onIonChange={(e) => { 
                updateOptions(e.detail.value || ""); 
                setDropSearchValue(e.detail.value || "") }}
              onClick={() => onPickerFocused("drop")}></IonInput>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonList inset={true}  >
        {!!focusedPicker && <IonItem key={'head'}>
          <IonIcon color={'primary'} icon={locationOutline}></IonIcon>
          <IonButton fill={'clear'} onClick={() => {}
            // setOpenMap(true)
        }
            >
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
        onClick={() => order.stepNext()}  >
        Next
      </IonButton>
    </IonFooter>

    </IonContent>
}
export default Step1