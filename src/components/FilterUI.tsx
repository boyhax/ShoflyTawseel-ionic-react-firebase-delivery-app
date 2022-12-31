import { IonAccordion, IonAccordionGroup, IonButton, IonButtons, IonContent, IonHeader, IonImg, IonItem, IonLabel, IonModal, IonPage, IonPicker, IonSelect, IonSelectOption, PickerColumn } from '@ionic/react';
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
});const FilterUI: React.FC<props> = (props) => {
  const isDarkMode = UIStore.useState(s => s.isDarkMode);
  console.log('isDarkMode :>> ', isDarkMode);
  const filter: orderFilter = props.filter
  const [focused, setFocused] = React.useState<'from' | 'to' | ''>('')
  const history = useHistory()

  const modal: any = React.useRef()

  const ModalElement: any = () => document.getElementById('filterModal')
  const close: any = () => ModalElement.dismiss()

  const header = <IonHeader>
    <IonButtons>
      {/* <IonButton onClick={close}>
        close
      </IonButton> */}
    </IonButtons>
  </IonHeader>
  const set = (obj: object) => {
    props.onfilter({ ...filter, ...obj })
  }
  var citiesSelectOptions: Array<any> = []

  const handleFilterValue = (e: object) => {
    console.log('e :>> ', e);
    set(e)
  }

  Cities("en").map((v, key) => {
    const option = <IonSelectOption value={v} key={v.key}>
      {v.value}
    </IonSelectOption>
    citiesSelectOptions.push(option)

  })
  Cities("ar").map((v, key) => {
    const option = <IonSelectOption value={v} key={v.key}>
      {v.value}
    </IonSelectOption>
    citiesSelectOptions.push(option)

  })
  const d:PickerColumn={name:'sdsd',options:[{text:'sdasdsss',value:'sadsd'}
,{text:'sdasdsss',value:'sadsd'},{text:'sdasdsss',value:'sadsd'},{text:'sdasdsss',value:'sadsd'}]} 

  return <div className={"ion-padding"}>
    {/* {header} */}
    

    <IonItem>
      <IonLabel id='fromClick'>select From</IonLabel>

      {/* <CityPicker
        onValueSet={(e) => handleFilterValue({ from: e })}
        placeHolder={'From'}
      ></CityPicker> */}


    </IonItem>

    {/* <IonItem>
      <IonLabel>From</IonLabel>

      <IonSelect
        value={props.filter.from}
        placeholder={'from'}
        onIonChange={(v) => { set({ from: v.detail.value }); console.log('onselect :>> ', v.detail.value); }}
        interface={'action-sheet'}  >
          <IonItem>
            hhhh
          </IonItem>
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
    </IonItem> */}

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


  </div>
}

export default FilterUI;

