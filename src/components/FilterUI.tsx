import { IonButton, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonImg, IonInput, IonItem, IonItemOption, IonItemOptions, IonLabel, IonList, IonModal, IonPage, IonPopover, IonRow, IonSelect, IonSelectOption, IonToolbar } from '@ionic/react';
import * as React from 'react';
import { OrderCatagories } from '../pages/AddOrderPage';
import { orderFilter } from '../providers/firebaseMain';
import Avatar from './Avatar';
import { citiesList } from './utlis/citiesUtlis';
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
    console.log('{...filter,...obj} :>> ', { ...filter, ...obj });
  }
  return <IonPage>
    <IonItem>
    <IonLabel>From</IonLabel>

      <IonSelect
      value={props.filter.from}
        placeholder={'from'}
        onIonChange={(v) => set({ from: v.detail.value })}
        interface={'popover'} >
        <IonSelectOption value={''} key={''}>لاشي</IonSelectOption>
        {citiesList.map((v, key) => {
          return <IonSelectOption value={v} key={key}>
            {v}
          </IonSelectOption>
        })}

      </IonSelect>
    </IonItem>
    <IonItem>
      <IonLabel>To</IonLabel>
      <IonSelect value={props.filter.to} placeholder={'to'}
      cancelText={"cancel"}
        onIonChange={(v) => set({ to: v.detail.value })}
        interface={'popover'} >
        <IonSelectOption value={''} key={''} onSelect={(v) => console.log(v)}>لاشي</IonSelectOption>
        {citiesList.map((v, key) => {
          return <IonSelectOption value={v} key={key}>
            {v}
          </IonSelectOption>
        })}

      </IonSelect>
    </IonItem>
    <IonItem>
    <IonLabel>Type</IonLabel>

      <IonSelect value={props.filter.type} placeholder={'type'}
        onIonChange={(v) => set({ type: v.detail.value })}
        interface={'popover'} >
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

