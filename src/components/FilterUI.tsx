import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemOption, IonItemOptions, IonLabel, IonList, IonModal, IonPage, IonPopover, IonRow, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import * as React from 'react';
import { OrderCatagories } from '../pages/AddOrderPage';
import { orderFilter } from '../providers/firebaseMain';
import Avatar from './Avatar';
import { Cities, citiesList } from './utlis/citiesUtlis';
import { TT } from './utlis/tt';


interface props {
  onfilter: (v: orderFilter) => void
  filter: orderFilter
}
const FilterUI: React.FC<props> = (props) => {
  const filter: orderFilter = props.filter
  const [focused, setFocused] = React.useState<'from' | 'to' | ''>('')
  const set = (obj: object) => {
    props.onfilter({ ...filter, ...obj })
  }
  var citiesSelectOptions :Array<any>=[] 
  Cities().map((v, key) => {
    const option = <IonSelectOption value={v} key={v.key}>
    {v.value}
  </IonSelectOption>
    citiesSelectOptions.push( option)
  })

  console.log('citiesSelectOption :>> ', citiesSelectOptions);

  return <IonPage className={"ion-padding"}>
    <IonItem>
      <IonLabel>From</IonLabel>

      <IonSelect
        value={props.filter.from}
        placeholder={'from'}
        onIonChange={(v) => {set({ from: v.detail.value });console.log('onselect :>> ', v.detail.value);}}
        interface={'action-sheet'}  >
        <IonSelectOption value={''} key={''}>لاشي</IonSelectOption>
        {citiesSelectOptions}    
          </IonSelect>
    </IonItem>
    <IonItem>
      <IonLabel>To</IonLabel>
      <IonSelect
        interface={'action-sheet'}
        value={props.filter.to}
        placeholder={'select drop point'}
        cancelText={"cancel"}
        onIonChange={(v) => set({ to: v.detail.value })}
      >
        <IonSelectOption value={''} key={''} onSelect={(v) => console.log(v)}>لاشي</IonSelectOption>
        {citiesSelectOptions}

      </IonSelect>
    </IonItem>
    <IonItem>
      <IonLabel>Type</IonLabel>

      <IonSelect value={props.filter.type} placeholder={'type'}
        onIonChange={(v) => set({ type: v.detail.value })}
        interface={'action-sheet'}  >
        <IonSelectOption value={''} key={''} onSelect={(v) => console.log(v)}>لاشي</IonSelectOption>
        {OrderCatagories.map((v, key) => {
          return <IonSelectOption value={v.name} key={key}>
            {v.name}
            <IonImg src={v.icon}></IonImg>
          </IonSelectOption>
        })}

      </IonSelect>
    </IonItem>


  </IonPage>
}

export default FilterUI;

