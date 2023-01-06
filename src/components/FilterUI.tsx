import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonIcon, IonImg, IonItem, IonLabel, IonModal, IonPage, IonPicker, IonSelect, IonSelectOption, IonTitle, IonToolbar, PickerColumn } from '@ionic/react';
import { filterOutline } from 'ionicons/icons';
import { Store } from 'pullstate';
import * as React from 'react';
import { useHistory } from 'react-router';
import { orderFilter, OrderCatagories } from '../types';
import CityPicker from './CityPicker';
import { Cities } from './utlis/citiesUtlis';


interface props {
  onfilter: (v: orderFilter) => void
  filter: orderFilter
}
export const UIStore = new Store({
  isDarkMode: true,

});const FilterUI: React.FC<props> = ({onfilter,filter}) => {


  const set = (obj: object) => {
    onfilter({ ...filter, ...obj })
  }

  const handleFilterValue = (e: object) => {
    set(e)
  }

  
  return <div className={"ion-padding"}>
    {/* {header} */}
    <IonHeader>
      <IonToolbar>
        <IonButtons slot={'primary'}>
        <IonIcon icon={filterOutline}/>

<IonTitle>Filter </IonTitle>
        </IonButtons>
        
      </IonToolbar>

    <IonButtons>
      {/* <IonButton onClick={close}>
        close
      </IonButton> */}
    </IonButtons>
  </IonHeader>

    <IonItem>
      <IonLabel id='fromClick'>select From</IonLabel>

      <CityPicker
      clear
        onValueSet={(e) => handleFilterValue({ from: (e && e.key)||'' })}
        placeHolder={'From'}
      ></CityPicker>


    </IonItem>
    <IonItem>
      <IonLabel id='fromClick'>select To</IonLabel>

      <CityPicker
      clear
        onValueSet={(e) => handleFilterValue({ to: (e && e.key)||'' })}
        placeHolder={'To'}
      ></CityPicker>


    </IonItem>

    

    <IonItem>
      <IonLabel>Type</IonLabel>

      <IonSelect value={filter.type} placeholder={'type'}
        onIonChange={(v) => set({ type: v.detail.value })}
        interface={'action-sheet'}  >
        {OrderCatagories.map((v, key) => {
          return <IonSelectOption value={v.name} key={key}>
            {v.name}
            <IonImg src={v.icon}></IonImg>
          </IonSelectOption>
        })}

      </IonSelect>
    </IonItem>


  </div>
}

export default FilterUI;

